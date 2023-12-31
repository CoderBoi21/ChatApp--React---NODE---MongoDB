import { Stack, Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import { CaretLeft } from 'phosphor-react'
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux';
import { UpdateSidebarType } from '../redux/slices/app';
import Message from './Conversation/Message';

const StarredMessages = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Box sx={{ width: 320, height: '100vh' }}>
      <Stack sx={{ height: "100%" }}>
        {/* Header */}
        <Box sx={{
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          width: "100%",
          backgroundColor: theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background,
        }}>
          <Stack direction={"row"} sx={{ height: "100%", p: 2 }} alignItems={"center"} spacing={3}>
            <IconButton onClick={() => {
              dispatch(UpdateSidebarType("CONTACT"))
            }}>
              <CaretLeft />
            </IconButton>
            <Typography variant='subtitle2'>Starred Messages</Typography>
          </Stack>
        </Box>

        {/* Body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          spacing={3}
          padding={3}
        >
          {/* <Conversation starred={true} /> */}
          <Message />
        </Stack>
      </Stack>
    </Box>
  )
}

export default StarredMessages
