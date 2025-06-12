import React from 'react';
import Header from './Header';
import Title from '../shared/Title';
import { Grid } from '@mui/material';
import { Padding } from '@mui/icons-material';
import ChatList from '../dialogs/ChatList'
import { sampleChats } from '../../constants/sampleData';
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile';

const AppLayout = ()=> (WrappedComponent) => {
  return (props)=>{
        const params = useParams();
        const chatId = params.chatId;
        const handleDeleteChat = (e,_id,groupChat) =>{
            e.preventDefault();
            console.log("Delete Chat",_id,groupChat);
        }
        return (
            <>
            <Title />
            <Header />
            <Grid container height={"calc(100vh - 4rem)"}>
                <Grid  size={3} height={"100%"}>
                    <ChatList 
                        chats={sampleChats} 
                        chatId={chatId} 
                        onlineUsers={["1","2"]}
                        handleDeleteChat={handleDeleteChat}
                    />
                </Grid>
                <Grid  size={6} height={"100%"} ><WrappedComponent {...props} /></Grid>
                <Grid  size={3} height={"100%"} sx={{padding:"2rem",bgcolor:"rgba(0,0,0,0.85)"}}><Profile /></Grid>
            </Grid>
            </>
        )
    }
}

export default AppLayout;