import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponent';
import { graycolor, orange } from '../constants/color';
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import { useDispatch, useSelector } from 'react-redux';
import {useInfiniteScrollTop} from '6pp'
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';




const Chat = ({chatId}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();

  const [message,setMessage] = useState('');
  const [messages,setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IAmTyping, setIAmTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({chatId,skip:!chatId});
  const oldMessageChunk = useGetMessagesQuery({chatId,page:page});
  const {data:oldMessages,setData:setOldMessages} = useInfiniteScrollTop(containerRef,oldMessageChunk.data?.totalPages,page,setPage,oldMessageChunk.data?.messages);

  const members = chatDetails?.data?.chatDetails?.members;

  const messageChangeHandler = (e) =>{
    setMessage(e.target.value);
    if(!IAmTyping){
      socket.emit(START_TYPING,{members,chatId});
      setIAmTyping(true);
    }
    if(typingTimeout.current){
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(()=>{
      socket.emit(STOP_TYPING,{members,chatId});
      setIAmTyping(false);
    },[2000]);
  }

  const errors = [
    {isError : chatDetails.isError, error:chatDetails.error},
    {isError : oldMessageChunk.isError, error:oldMessageChunk.error},
  ];

  console.log(socket.id);

  const handleFileOpen = (e) =>{
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }

  const submitHandler = (e)=>{
    e.preventDefault();
    if(!message.trim()){
      return ;
    }
    // Emitting this message to server
    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage('');
  }

  useEffect(()=>{
    dispatch(removeNewMessagesAlert(chatId)); 
    return ()=>{
      setMessage('');
      setMessages([]);
      setOldMessages([]);
      setPage(1);
    }
  },[chatId])

  useEffect(()=>{
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({
        behavior : "smooth"
      })
    }
  },[messages])


  const newMessagesHandler = useCallback((data) =>{
    if(data.chatId !== chatId) return ; 
    setMessages((prev)=>[...prev,data.message]);
  },[chatId]);

  const startTypingListener = useCallback((data) =>{
    if(data.chatId !== chatId) return ; 
    setUserTyping(true);
  },[chatId]);

  const stopTypingListener = useCallback((data) =>{
    if(data.chatId !== chatId) return ; 
    setUserTyping(false);
  },[chatId]);

  const alertListener = useCallback((content) =>{
    const messageForAlert ={
      content : content,
      sender : {
        _id : "nrfeidlkm",
        name : "Admin"
      },
      chat : chatId,
      createdAt : new Date().toISOString()
    };
    setMessages((prev)=>[...prev,messageForAlert]);
  },[chatId]);


  const eventHandlers = {
    [ALERT] : alertListener,
    [NEW_MESSAGE]:newMessagesHandler,
    [START_TYPING] : startTypingListener,
    [STOP_TYPING] : stopTypingListener
  }; 
  useSocketEvents(socket,eventHandlers);
  useErrors(errors);

  const allMessages = [...oldMessages,...messages];


  return chatDetails.isLoading? (<Skeleton />) : (
    <>
      <Stack 
        ref={containerRef} 
        boxSizing={"border-box"} 
        padding={"1rem"} 
        spacing={"1rem"} 
        bgcolor={graycolor} 
        height={"90%"}
        sx={{
          overflowX : "hidden",
          overflowY : "auto"
        }}
        >
        {
          allMessages.map(i=>(
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        }
        {
          userTyping && <TypingLoader />
        }
        <div ref={bottomRef} />
      </Stack>
      <form onSubmit={submitHandler} style={{height:"10%"}}>
        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
          <IconButton  
            sx={{
              position : "absolute",
              left : "1rem",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox 
            placeholder='Type Message Here...' 
            value={message} 
            onChange={messageChangeHandler} 
          />
          <IconButton 
            type='submit' 
            sx={{
              rotate : "-90deg",
              backgroundColor : orange,
              color : "white",
              marginLeft : "1rem",
              padding : "0.5rem",
              "&:hover":{
                bgcolor : "error.dark"
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </>
  )
}

export default AppLayout()(Chat);