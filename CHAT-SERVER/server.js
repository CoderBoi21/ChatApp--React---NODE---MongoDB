const app = require('./app');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require("mongoose");
const User = require("./models/user");
const FriendRequest = require("./models/friendRequest");
const OneToOneMessage = require("./models/OneToOneMessage");
const http = require('http');
const { Server } = require("socket.io");

dotenv.config({ path: './config.env' });


process.on("uncaughtException", (err) => {
    console.log(err);
    proccess.exit(1);
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', "POST"]
    }
});

const DB = process.env.DBURI.replace("<PASSWORD>", process.env.DBPASSWORD);

mongoose.connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedToplogy: true,
}).then((con) => {
    console.log("DB Connection Successful");
}).catch((err) => {
    console.log(err);
});

// Either defined port or 8000
const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`App running on port ${port}`);
});

// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
    // console.log(JSON.stringify(socket.handshake.query));
    const user_id = socket.handshake.query["user_id"];

    console.log(`User connected ${socket.id}`);

    if (user_id != null && Boolean(user_id)) {
        try {
            User.findByIdAndUpdate(user_id, {
                socket_id: socket.id,
                status: "Online",
            });
        } catch (e) {
            console.log(e);
        }
    }    //Socket Event Listeners

    socket.on("friend_request", async (data) => {
        const to = await User.findById(data.to).select("socket_id");
        const from = await User.findById(data.from).select("socket_id");

        // create a friend request
        await FriendRequest.create({
            sender: data.from,
            recipient: data.to,
        });
        // emit event request received to recipient
        io.to(to?.socket_id).emit("new_friend_request", {
            message: "New friend request received",
        });
        io.to(from?.socket_id).emit("request_sent", {
            message: "Request Sent successfully!",
        });
    });

    socket.on("accept_request", async (data) => {
        // accept friend request => add ref of each other in friends array
        const request_doc = await FriendRequest.findById(data.request_id);


        const sender = await User.findById(request_doc.sender);
        const receiver = await User.findById(request_doc.recipient);

        sender.friends.push(request_doc.recipient);
        receiver.friends.push(request_doc.sender);

        await receiver.save({ new: true, validateModifiedOnly: true });
        await sender.save({ new: true, validateModifiedOnly: true });

        await FriendRequest.findByIdAndDelete(data.request_id);

        // delete this request doc
        // emit event to both of them

        // emit event request accepted to both
        io.to(sender?.socket_id).emit("request_accepted", {
            message: "Friend Request Accepted",
        });
        io.to(receiver?.socket_id).emit("request_accepted", {
            message: "Friend Request Accepted",
        });
    });


    socket.on("get_direct_conversations", async ({ user_id }, callback) => {
        const existing_conversations = await OneToOneMessage.find({
            participants: { $all: [user_id] },
        }).populate("participants", "firstName lastName avatar _id email status");

        console.log(existing_conversations);

        callback(existing_conversations);
    });

    socket.on("start_conversation", async (data) => {
        // data: {to: from:}

        const { to, from } = data;

        // check if there is any existing conversation

        const existing_conversations = await OneToOneMessage.find({
            participants: { $size: 2, $all: [to, from] },
        }).populate("participants", "firstName lastName _id email status");

        console.log(existing_conversations[0], "Existing Conversation");

        // if no => create a new OneToOneMessage doc & emit event "start_chat" & send conversation details as payload
        if (existing_conversations.length === 0) {
            let new_chat = await OneToOneMessage.create({
                participants: [to, from],
            });
            //TODO
            new_chat = await OneToOneMessage.findById(new_chat).populate(
                "participants",
                "firstName lastName _id email status"
            );

            console.log(new_chat);

            socket.emit("start_chat", new_chat);
        }
        // if yes => just emit event "start_chat" & send conversation details as payload
        else {
            //OPEN CHAT
            socket.emit("start_chat", existing_conversations[0]);
        }
    });

    socket.on("get_messages", async (data, callback) => {
        try {
            const { messages } = await OneToOneMessage.findById(
                data.conversation_id
            ).select("messages");
            callback(messages);
        } catch (error) {
            console.log(error);
        }
    });

    //handle incoming text/link msg
    socket.on("text_message", async (data) => {
        console.log("Received message:", data);

        // data: {to, from, ...etc}

        const { message, conversation_id, from, to, type } = data;

        const to_user = await User.findById(to);
        const from_user = await User.findById(from);

        // message => {to, from, type, created_at, text, file}

        const new_message = {
            to: to,
            from: from,
            type: type,
            created_at: Date.now(),
            text: message,
        };

        // fetch OneToOneMessage Doc & push a new message to existing conversation
        const chat = await OneToOneMessage.findById(conversation_id);
        chat.messages.push(new_message);
        // save to db`
        await chat.save({ new: true, validateModifiedOnly: true });

        // emit incoming_message -> to user

        io.to(to_user?.socket_id).emit("new_message", {
            conversation_id,
            message: new_message,
        });

        // emit outgoing_message -> from user
        io.to(from_user?.socket_id).emit("new_message", {
            conversation_id,
            message: new_message,
        });
    });

    //handle incoming file msg
    socket.on("file_message", async (data) => {
        console.log("Received message:", data);

        // data: {to, from, text, file}
        const { message, conversation_id, from, to, type,file } = data;
        const to_user = await User.findById(to);
        const from_user = await User.findById(from);
        // Get the file extension
        const fileExtension = path.extname(data.file.name);
        
        // Generate a unique filename
        const filename = `${Date.now()}_${Math.floor(
            Math.random() * 10000
            )}${fileExtension}`;
            
            // upload file to AWS s3
            
            // const new_message = {
            //     to: to,
            //     from: from,
            //     type: type,
            //     created_at: Date.now(),
            //     text: message,
            //     file:file,
            // };
        // create a new conversation if its dosent exists yet or add a new message to existing conversation

        // save to db

        // emit incoming_message -> to user
        io.to(to_user?.socket_id).emit("new_message", {
            conversation_id,
            message: new_message,
        });

        // emit outgoing_message -> from user
        io.to(from_user?.socket_id).emit("new_message", {
            conversation_id,
            message: new_message,
        });
    });




    socket.on("end", async (data) => {
        //Find user by _id and set status to offline
        if (data.user_id) {
            await User.findByIdAndUpdate(data.user_id, { status: "offline" });
        }

        //TODO Broadcast user dissconnected

        console.log("~Closing Connection~");
        socket.disconnect(0);
    })
});

process.on("unhandledRejection", (err) => {
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});