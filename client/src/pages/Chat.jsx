import React, { useRef } from 'react'
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { graycolor, orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponent';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessage } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { useState } from 'react';
import {NEW_MESSAGE} from '../constants/events';
import { useChatDetailsQuery } from '../redux/api/api';

const user = {
  _id : "sfnxjk",
  name : "Siddhesh"
}


const Chat = ({chatId}) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const chatDetails = useChatDetailsQuery({chatId,skip:!chatId})
  const members = chatDetails?.data?.chatDetails?.members;
  const [message,setMessage] = useState('');
  const submitHandler = (e)=>{
    e.preventDefault();
    if(!message.trim()){
      return ;
    }
    // Emitting this message to server
    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage('');
  }
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
          sampleMessage.map(i=>(
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        }
      </Stack>
      <form onSubmit={submitHandler} style={{height:"10%"}}>
        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
          <IconButton  sx={{
            position : "absolute",
            left : "1rem",
          }}>
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
      <FileMenu />
    </>
  )
}

export default AppLayout()(Chat);