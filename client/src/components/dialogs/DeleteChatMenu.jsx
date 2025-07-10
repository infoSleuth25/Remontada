import { Menu, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { setIsDeleteMenu } from '../../redux/reducers/misc';
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api';
import toast from 'react-hot-toast';

const DeleteChatMenu = ({dispatch,deleteMenuAnchor}) => {
    const navigate= useNavigate();
    const {isDeleteMenu, selectedDeleteChat} = useSelector((state)=>state.misc);
    const isGroup = selectedDeleteChat.groupChat;
    const [deleteChat] = useDeleteChatMutation();
    const [leaveGroup] = useLeaveGroupMutation();
    const closeHandler = () =>{
        dispatch(setIsDeleteMenu(false));
        deleteMenuAnchor.current = null;
    }
    const leaveGroupHandler = async() =>{
        try {
            await leaveGroup(selectedDeleteChat.chatId).unwrap();
            toast.success("Leaved Group successfully");
            closeHandler();
            navigate('/');
        } 
        catch (err) {
            toast.error(err?.data?.msg || "Failed to delete group");
            closeHandler();
        }
    }
    const deleteChatHandler = async() =>{
        try {
            await deleteChat(selectedDeleteChat.chatId).unwrap();
            toast.success("Chat deleted successfully");
            closeHandler();
            navigate('/');
        } 
        catch (err) {
            toast.error(err?.data?.msg || "Failed to delete group");
            closeHandler();
        }
    }
    
  return (
    <Menu 
        open={isDeleteMenu} 
        onClose={closeHandler} 
        anchorEl={deleteMenuAnchor.current}
        anchorOrigin={{
            vertical : "bottom",
            horizontal : "right"
        }}
        transformOrigin={{
            vertical : "center",
            horizontal : "center"
        }}
    >
        <Stack 
            sx={{
                width : "10rem",
                padding : "0.5rem",
                cursor : "pointer"
            }}
            direction={"row"}
            alignItems={"center"}
            spacing={"0.5rem"}
            onClick = {isGroup ? leaveGroupHandler : deleteChatHandler}
        >
            {
                isGroup? 
                    <>
                        <ExitToAppIcon />
                        <Typography>Leave Group</Typography>
                    </> 
                    : 
                    <>
                        <DeleteIcon />
                        <Typography>Delete Chat</Typography>
                    </>
            }
        </Stack>
    </Menu>
  )
}

export default DeleteChatMenu