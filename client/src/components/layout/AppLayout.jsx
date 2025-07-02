import React, { useEffect } from 'react';
import Header from './Header';
import Title from '../shared/Title';
import { Grid, Skeleton } from '@mui/material';
import { Padding } from '@mui/icons-material';
import ChatList from '../dialogs/ChatList'
import { sampleChats } from '../../constants/sampleData';
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import {useMyChatsQuery} from '../../redux/api/api';
import { useSelector } from 'react-redux';
import { useErrors } from '../../hooks/hook';
import { getSocket } from '../../socket';

const AppLayout = ()=> (WrappedComponent) => {
  return (props)=>{
        const params = useParams();
        const chatId = params.chatId;

        const socket = getSocket();
        console.log(socket.id);
        const {isLoading,data,isError,error,refetch} = useMyChatsQuery("");
        const {user} = useSelector((state)=>state.auth); 

        useErrors([{isError,error}])

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
                    {
                        isLoading ? (<Skeleton />) : (
                            <ChatList 
                                chats={data?.chats} 
                                chatId={chatId} 
                                handleDeleteChat={handleDeleteChat}
                            />
                        )
                    }
                </Grid>
                <Grid  size={6} height={"100%"} ><WrappedComponent {...props} chatId={chatId} /></Grid>
                <Grid  size={3} height={"100%"} sx={{padding:"2rem",bgcolor:"rgba(0,0,0,0.85)"}}><Profile user={user} /></Grid>
            </Grid>
            </>
        )
    }
}

export default AppLayout;