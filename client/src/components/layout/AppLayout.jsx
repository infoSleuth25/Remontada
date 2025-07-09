import { Grid, Skeleton } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { useMyChatsQuery } from '../../redux/api/api';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat';
import { getSocket } from '../../socket';
import ChatList from '../dialogs/ChatList';
import Title from '../shared/Title';
import Profile from '../specific/Profile';
import Header from './Header';
import { getOrSaveFromStorage } from '../../lib/features';

const AppLayout = ()=> (WrappedComponent) => {
  return (props)=>{
        const params = useParams();
        const chatId = params.chatId;
        const dispatch = useDispatch();

        const socket = getSocket();
        console.log(socket.id);
        const {isLoading,data,isError,error,refetch} = useMyChatsQuery("");
        const {user} = useSelector((state)=>state.auth); 
        const {newMessagesAlert} = useSelector((state)=>state.chat)

        useErrors([{isError,error}])

        useEffect(()=>{
            getOrSaveFromStorage({key:NEW_MESSAGE_ALERT, value:newMessagesAlert});
        },[newMessagesAlert])

        const handleDeleteChat = (e,_id,groupChat) =>{
            e.preventDefault();
            console.log("Delete Chat",_id,groupChat);
        }

        const newMessageAlertHandler = useCallback((data)=>{
            if(data.chatId == chatId){
                return ;
            }
            dispatch(setNewMessagesAlert(data));
        },[chatId])

        const newRequestHandler = useCallback(()=>{
            dispatch(incrementNotification());
        },[dispatch]);

        const refetchHandler = useCallback(()=>{
            refetch();
        },[refetch]);

        const eventHandlers = {
            [NEW_MESSAGE_ALERT]:newMessageAlertHandler,
            [NEW_REQUEST]:newRequestHandler,
            [REFETCH_CHATS]:refetchHandler,
        };
        useSocketEvents(socket,eventHandlers);
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
                                newMessagesAlert = {newMessagesAlert}
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