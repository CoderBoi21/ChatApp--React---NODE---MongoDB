import React from 'react'
import { Box, Stack } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import { useTheme } from '@mui/material/styles';



const Conversation = () => {
    const theme = useTheme();

    return (
        <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
            {/* Chat Header */}
            <Header />
            {/* MSG */}
            <Box width={'100%'} sx={{flexGrow:1, height:"100%", overflow:"scroll",backgroundColor:  theme.palette.mode === "light" ? "#F0f4fa":theme.palette.background.paper}}>
                <Message menu={true} />
            </Box>
            {/* Chat Footer */}
            <Footer />

        </Stack>
    )
}

export default Conversation;
