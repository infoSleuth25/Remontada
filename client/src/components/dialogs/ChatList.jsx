import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../shared/ChatItem'

const ChatList = ({w="100%",chats=[],chatId,onlineUsers=[],newMessagesAlert=[{chatId:"",count:0}],handleDeleteChat}) => {
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"}>
        {
            chats?.map((data,index)=>{
              const {avatar,name,_id,groupChat,members} = data;
              const newMessageAlert = newMessagesAlert.find(
                ({chatId}) => chatId == _id
              )
              const isOnline = members?.some((member)=>onlineUsers.includes(_id));
              return (
                <ChatItem 
                  newMessageAlert={newMessageAlert} 
                  isOnline = {isOnline}
                  avatar = {avatar}
                  name = {name}
                  _id = {_id}
                  groupChat = {groupChat}   
                  sameSender = {chatId === _id}
                  handleDeleteChat = {handleDeleteChat}
                  index = {index}
                  key = {_id}
                />
              )
            })
        }
    </Stack>
  )
}

export default ChatList