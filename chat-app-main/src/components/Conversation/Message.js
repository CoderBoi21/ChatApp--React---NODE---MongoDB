import React from 'react'
import { Box, Stack } from '@mui/material'
import { Chat_History } from '../../data'
import ReplyMsg, { DocMsg, LinkMsg, MediaMsg, TextMsg, TimeLine } from './MsgTypes'

const Message = ({menu}) => {
    return (
        <Box p={3}>
            <Stack spacing={3}>
                {Chat_History.map((el) => {
                    switch (el.type) {
                        case 'divider':
                            return <TimeLine el={el} />
                        case 'msg':
                            switch (el.subtype) {
                                case 'img':
                                    return <MediaMsg menu={menu} el={el} />
                                case 'doc':
                                    return <DocMsg menu={menu} el={el} />
                                case 'link':
                                    return <LinkMsg menu={menu} el={el} />
                                case 'reply':
                                    return <ReplyMsg menu={menu} el={el} />
                                default:
                                    return <TextMsg menu={menu} el={el} />
                            }
                        default:
                            return <></>;
                    }
                })}
            </Stack>
        </Box>
    )
}

export default Message
