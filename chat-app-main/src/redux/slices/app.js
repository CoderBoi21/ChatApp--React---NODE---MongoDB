import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
    user: {},
    all_users: [],
    users: [], // all users of app who are not friends and not requested yet
    friends: [], // all friends
    friendRequests: [], // all friend requests
    chat_type: null,//Group or individual
    room_id: null,//For each conv
    call_logs: [],
    isLoggedIn: true,
    tab: 0,//[0, 1, 2, 3]
    sidebar: {
        open: false,
        type: 'CONTACT',//can be contact,starred,shared
        //snackbar
        open2: null,
        message: null,
        severity: null,
    },

}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        //toggle sidebar
        //Curr state and action
        toggleSidebar(state, action) {
            state.sidebar.open = !state.sidebar.open;
        },
        updateSidebarType(state, action) {
            state.sidebar.type = action.payload.type;
        },
        openSnackbar(state, action) {
            console.log(action.payload);
            state.sidebar.open2 = true;
            state.sidebar.severity = action.payload.severity;
            state.sidebar.message = action.payload.message;
        },
        closeSnackbar(state) {
            console.log("This is getting executed");
            state.sidebar.open2 = false;
            state.sidebar.message = null;
            state.sidebar.severity = null;
        },
        updateUsers(state, action) {
            state.users = action.payload.users;
        },
        updateFriends(state, action) {
            state.friends = action.payload.friends;
        },
        updateFriendRequests(state, action) {
            state.friendRequests = action.payload.request;
        },
        selectConversation(state, action) {
            state.chat_type = "individual";
            state.room_id = action.payload.room_id;
        },
    }
})

//Reducer
export default slice.reducer;


export const closeSnackBar = () => async (dispatch, getState) => {
    dispatch(slice.actions.closeSnackbar());
};

export function showSnackbar({ severity, message }) {
    return async (dispatch, getState) => {
        dispatch(
            slice.actions.openSnackbar({
                message,
                severity,
            })
        );

        setTimeout(() => {
            dispatch(slice.actions.closeSnackbar());
        }, 4000);
    };
}


//Async OP
//Toggle Side bar
export function ToggleSidebar() {
    return async (dispatch, getState) => {
        dispatch(slice.actions.toggleSidebar())
    }
}

//Update Side bar with payload
export function UpdateSidebarType(type, open) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateSidebarType({
            type,
        }))
    }
}

export const FetchUsers = () => {
    return async (dispatch, getState) => {
        await axios.get("/user/get-users", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getState().auth.token}`,
            },
        }).then((response) => {
            console.log(response);
            dispatch(slice.actions.updateUsers({ users: response.data.data }));
        }).catch((err) => {
            console.log(err);
        });
    };
}
export const FetchFriends = () => {
    return async (dispatch, getState) => {
        await axios.get("/user/get-friends", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getState().auth.token}`,
            },
        }).then((response) => {
            console.log(response);
            dispatch(slice.actions.updateFriends({ friends: response.data.data }));
        }).catch((err) => {
            console.log(err);
        });
    };
}
export const FetchFriendRequests = () => {
    return async (dispatch, getState) => {
        await axios.get("/user/get-requests", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getState().auth.token}`,
            },
        }).then((response) => {
            console.log(response);
            dispatch(slice.actions.updateFriendRequests({ request: response.data.data }));
        }).catch((err) => {
            console.log(err);
        });
    };
}
export const SelectConversation = ({ room_id }) => {
    return async (dispatch, getState) => {
      dispatch(slice.actions.selectConversation({ room_id }));
    };
  };

