import React, { useRef } from 'react'
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Stack } from '@mui/material';
import { graycolor, orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponent';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessage } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';

const user = {
  _id : "sfnxjk",
  name : "Siddhesh"
}


const Chat = () => {
  const containerRef = useRef(null);
  return (
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
      <form style={{height:"10%"}}>
        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
          <IconButton  sx={{
            position : "absolute",
            left : "1rem",
          }}>
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder='Type Message Here...' />
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