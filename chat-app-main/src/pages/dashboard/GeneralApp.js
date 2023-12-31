import React from "react";
import Chats from "../../pages/dashboard/Chats.js"
import { Box, Stack, Typography } from "@mui/material";
import Conversation from "../../components/Conversation/index.js";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact.js";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages.js";
import StarredMessages from "../../components/StarredMessages.js";
import NoChat from "../../assets/Illustration/NoChat.js";
import { Link } from "react-router-dom";

const GeneralApp = () => {

  const theme = useTheme();
  const { sidebar,chat_type,room_id } = useSelector((store) => store.app);

  return (
    <Stack direction={"row"} sx={{ width: '100%' }}>
      {/* Chats */}
      <Chats />
      <Box sx={{ height: "100%", width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)", backgroundColor: theme.palette.mode === "light" ? "#f0f4fa" : theme.palette.background.default }}>
        {/* Conversations */}
        {room_id !== null && chat_type === "individual" ? <Conversation /> : (
            <Stack
              spacing={2}
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent={"center"}
            >
              <NoChat />
              <Typography variant="subtitle2">
                Select a conversation or start a{" "}
                <Link
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                  }}
                  to="/"
                >
                  new one
                </Link>
              </Typography>
            </Stack>
          )}
        
      </Box>
      {/* Type of sidebar */}
      {sidebar.open && (() => {
        switch (sidebar.type) {
          case "CONTACT":
            return <Contact />
          case "STARRED":
            return <StarredMessages />
          case "SHARED":
            return <SharedMessages />
          default:
            break;
        }
      })()}
    </Stack>
  );
};

export default GeneralApp;
