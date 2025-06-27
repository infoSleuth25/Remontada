import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup : false,
    isAddMember : false,
    isNotification : false,
    isSearch : false,
    isFileMenu : false,
    isDeleteMenu : false,
    uploadingLoader : false,
    selectedDeleteChat : {
        chatId : "",
        groupChat : false
    }
}

const miscSlice = createSlice({
    name : "misc",
    initialState : initialState,
    reducers : {
        setIsNewGroup : (state,action) =>{
            state.isNewGroup = action.payload;
        },
        setIsAddMember : (state,action) =>{
            state.isAddMember = action.payload;
        },
        setIsAddNotification : (state,action) =>{
            state.isNotification = action.payload;
        },
        setIsSearch : (state,action) =>{
            state.isSearch = action.payload;
        },
        setIsFileMenu : (state,action) =>{
            state.isFileMenu = action.payload;
        },
        setIsDeleteMenu : (state,action) =>{
            state.isDeleteMenu = action.payload;
        },
        setUploadingLoader :(state,action) =>{
            state.uploadingLoader = action.payload;
        }, 
        setSelectedDeleteChat :(state,action) =>{
            state.selectedDeleteChat = action.payload;
        }, 
    }
});

export default miscSlice;
export const {
    setIsAddMember,
    setIsNewGroup,
    setIsAddNotification,
    setIsSearch,
    setIsFileMenu,
    setIsDeleteMenu,
    setUploadingLoader,
    setSelectedDeleteChat
} = miscSlice.actions;