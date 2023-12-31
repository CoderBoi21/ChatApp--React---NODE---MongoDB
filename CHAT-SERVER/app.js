const express = require("express");
const morgan = require('morgan');// HTTP req logger middleware for node
const routes = require("./routes");

const rateLimit = require('express-rate-limit');

const helmet = require('helmet'); //Set hhtp headers
const mongosanitize = require("express-mongo-sanitize"); //prevent injection attack
const bodyParser = require('body-parser');

const xss = require('xss'); //prevent site scripting

const cors = require('cors');//allow cross origin request




const app = express();

//to call anymiddlewhare we use method 'use'

app.use(express.urlencoded({
    extended:true,
}))

app.use(mongosanitize());

// app.use(xss());

app.use(cors({
    origin:"*",
    methods:['GET',"PATCH","POST","DELETE","PUT"],
    credentials:true,
}));

app.use(express.json({
    limit:'10kb'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(helmet());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"));
}

const limiter = rateLimit({
    max:3000,
    windowMs:60 * 60 * 1000,
    message:"Too many request from this ip please try again after an hour!",
})

app.use("/tawk",limiter);

//
app.use(routes);

module.exports = app;