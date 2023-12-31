import { Stack, Box, IconButton, Typography, Tabs, Tab, Grid } from '@mui/material'
import React, { useState } from 'react'
import { CaretLeft } from 'phosphor-react'
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux';
import { UpdateSidebarType } from '../redux/slices/app';
import { faker } from '@faker-js/faker';
import { Shared_docs, Shared_links } from '../data';
import { DocMsg, LinkMsg } from './Conversation/MsgTypes';

const SharedMessages = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
            <Typography variant='subtitle2'>Media,links and docs</Typography>
          </Stack>
        </Box>

        <Tabs sx={{ px: 2, pt: 2 }} value={value} onChange={handleChange} centered>
          <Tab label="Media" />
          <Tab label="Links" />
          <Tab label="Docs" />
        </Tabs>
        {/* Body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          spacing={3}
          padding={value === 1 ? 1 : 3}
        >
          {(() => {
            switch (value) {
              case 0:
                return (
                  <Grid container spacing={2}>
                    {[0, 1, 2, 3, 4, 5, 6].map((el) => (
                      <Grid item xs={4}>
                        <img
                          src={faker.image.city()}
                          alt={faker.internet.userName()}
                        />
                      </Grid>
                    ))}
                  </Grid>
                );
              case 1:
                return Shared_links.map((el) => <LinkMsg el={el} />);

              case 2:
                return Shared_docs.map((el) => <DocMsg el={el} />);
              default:
                break;
            }
          })()}
        </Stack>
      </Stack>
    </Box>
  )
}

export default SharedMessages
