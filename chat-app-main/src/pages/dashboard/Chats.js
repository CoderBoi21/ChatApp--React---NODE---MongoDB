/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import { ArchiveBox, CircleDashed, MagnifyingGlass, Users } from 'phosphor-react'
// import { ChatList } from '../../data';
import { SimpleBarStyle } from '../../components/Scrollbar';
import { useTheme } from '@emotion/react';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import ChatElement from '../../components/ChatElement';
import Friends from '../../sections/main/Friends';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socket';
import { FetchDirectConversations } from '../../redux/slices/conversation';

const user_id = window.localStorage.getItem("user_id");

const Chats = () => {
    const dispatch = useDispatch();

    const {conversations} = useSelector((state) => state.conversation.direct_chat);

    useEffect(() => {
        socket.emit("get_direct_conversations", { user_id }, (data) => {
          console.log(data); // this data is the list of conversations
          // dispatch action
    
          dispatch(FetchDirectConversations({ conversations: data }));
        });
      }, []);

    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    return (
        <>
            <Box sx={{ position: "relative", width: 320, backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background, boxShadow: '0px 0px 2px rgba(0,0,0,0.25)' }}>
                <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
                    <Stack direction='row' alignItems='center' justifyContent={'space-between'} >
                        <Typography variant='h5'>
                            Chats
                        </Typography>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <IconButton onClick={() => {
                                handleOpenDialog();
                            }}>
                                <Users />
                            </IconButton>
                            <IconButton>
                                <CircleDashed />
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Stack sx={{ width: "100%" }}>
                        <Search>
                            <SearchIconWrapper>
                                <MagnifyingGlass color='#709CE6' />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder='Search..' />
                        </Search>
                    </Stack>
                    <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <ArchiveBox size={24} />
                            <Button>Archive</Button>
                        </Stack>
                        <Divider />
                    </Stack>
                    <Stack sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}>
                        <SimpleBarStyle timeout={500} clickOnTrack={false}>
                            <Stack spacing={2.4}>
                                {/* <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                                    Pinned
                                </Typography> */}
                                {/* Chat List */}
                                {/* {ChatList.filter((el) => el.pinned).map((el, idx) => {
                                    return <ChatElement {...el} />;
                                })} */}
                                <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                                    All Chats
                                </Typography>
                                {/* Chat List */}
                                {conversations.filter((el) => !el.pinned).map((el, idx) => {
                                    return <ChatElement {...el} />;
                                })}
                            </Stack>
                        </SimpleBarStyle>
                    </Stack>
                </Stack>
            </Box>
            {openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}
        </>
    )
}

export default Chats
