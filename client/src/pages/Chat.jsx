import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponent';
import { graycolor, orange } from '../constants/color';
import { NEW_MESSAGE } from '../constants/events';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import { useDispatch, useSelector } from 'react-redux';
import {useInfiniteScrollTop} from '6pp'
import { setIsFileMenu } from '../redux/reducers/misc';




const Chat = ({chatId}) => {
  const user = useSelector((state) => state.auth.user);
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();

  const [message,setMessage] = useState('');
  const [messages,setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const chatDetails = useChatDetailsQuery({chatId,skip:!chatId});
  const oldMessageChunk = useGetMessagesQuery({chatId,page:page});
  const {data:oldMessages,setData:setOldMessages} = useInfiniteScrollTop(containerRef,oldMessageChunk.data?.totalPages,page,setPage,oldMessageChunk.data?.messages);

  const members = chatDetails?.data?.chatDetails?.members;

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
  const newMessagesHandler = useCallback((data) =>{
    setMessages((prev)=>[...prev,data.message]);
  },[]);
  const eventHandlers = {[NEW_MESSAGE]:newMessagesHandler};
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
          <InputBox placeholder='Type Message Here...' value={message} onChange={(e)=>setMessage(e.target.value)} />
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