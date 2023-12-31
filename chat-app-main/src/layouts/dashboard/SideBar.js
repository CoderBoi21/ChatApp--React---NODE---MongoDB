import React, { useState } from "react";

import { Box, Stack, IconButton, Divider, Avatar, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Gear } from "phosphor-react";

import { faker } from "@faker-js/faker";
import { Nav_Buttons, Profile_Menu } from "../../data";
import useSettings from "../../hooks/useSettings";
import AntSwitch from "../../components/AntSwitch";
import Logo from "../../assets/Images/logo.ico";
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";

const getPath = (index) => {
    switch (index) {
        case 0:
            return '/app'
        case 1:
            return '/group'

        case 2:
            return '/call'
        case 3:
            return '/settings'
        default:
            break;
    }
}

const SideBar = () => {

    const theme = useTheme();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [selected, setSelected] = useState(0);
    const { onToggleMode } = useSettings();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getMenuPath = (index) => {
        switch (index) {
            case 0:
                return "/profile"
            case 1:
                return "/settings"
            case 2:
                // Todo: Update token and set isAuth to false
                return "/auth/login"
            default:
                break;
        }
    }

    return (
        <Box
            p={2}
            sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0px 0px 3px rgba(0,0,0,0.28)",
                height: "100vh",
                width: "101px",
            }}
        >
            <Stack
                direction="column"
                alignItems={"center"}
                justifyContent={"space-between"}
                sx={{ height: "100%" }}
                spacing={3}
            >
                <Stack alignItems={"center"} spacing={4}>
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            height: 65,
                            width: 65,
                            borderRadius: 1.5,
                        }}
                    >
                        <img src={Logo} alt="Chat app Logo" width={"50px"} />
                    </Box>
                    <Stack
                        sx={{ width: "max-content" }}
                        direction={"column"}
                        alignItems={"center"}
                        spacing={3}
                    >
                        {Nav_Buttons.map((el) =>
                            el.index === selected ? (
                                <Box
                                    p={1}
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: 1.5,
                                    }}
                                >
                                    <IconButton
                                        sx={{ color: "#fff", width: "max-content" }}
                                        key={el.index}
                                    >
                                        {el.icon}
                                    </IconButton>
                                </Box>
                            ) : (
                                <IconButton
                                    onClick={() => {
                                        setSelected(el.index);
                                        navigate(getPath(el.index));
                                    }}
                                    sx={{
                                        color:
                                            theme.palette.mode === "light"
                                                ? "#000"
                                                : theme.palette.text.primary,
                                        width: "max-content",
                                    }}
                                    key={el.index}
                                >
                                    {el.icon}
                                </IconButton>
                            )
                        )}
                        <Divider sx={{ width: "48px" }} />
                        {selected === 3 ? (
                            <Box
                                p={1}
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: 1.5,
                                }}
                            >
                                <IconButton sx={{ color: "#fff", width: "max-content" }}>
                                    <Gear />
                                </IconButton>
                            </Box>
                        ) : (
                            <IconButton
                                onClick={() => {
                                    setSelected(3);
                                    navigate(getPath(3));
                                }}
                                sx={{
                                    color:
                                        theme.palette.mode === "light"
                                            ? "#000"
                                            : theme.palette.text.primary,
                                    width: "max-content",
                                }}
                            >
                                <Gear />
                            </IconButton>
                        )}
                    </Stack>
                </Stack>
                <Stack alignItems={"center"} spacing={4}>
                    <AntSwitch
                        onChange={() => {
                            onToggleMode();
                        }}
                        defaultChecked
                    />
                    <Avatar id='basic-button' aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick} src={faker.image.avatar()} />
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: "left",
                        }}
                    >
                        <Stack spacing={1} px={1}>
                            {Profile_Menu.map((el, idx) => (
                                <MenuItem onClick={() => {
                                    handleClick();
                                }}>
                                    <Stack onClick={() => {
                                        //when idx 2 then logout
                                        if (idx === 2) {
                                            dispatch(LogoutUser());
                                        } else {
                                            navigate(getMenuPath(idx));
                                        }
                                    }}
                                        sx={{ width: 100 }} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                        <span>
                                            {el.title}
                                        </span>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Stack>
                    </Menu>
                </Stack>
            </Stack>
        </Box>
    );
};

export default SideBar;
