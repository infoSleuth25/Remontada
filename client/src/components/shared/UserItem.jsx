import { Avatar, IconButton, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import React, { memo } from 'react'
import {Add as AddIcon, Remove as RemoveIcon} from '@mui/icons-material'

const UserItem = ({user, handler,handleIsLoading, isAdded=false}) => {
    const {name,_id,avatar} = user;
  return (
    <ListItem>
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
            <Avatar />
            <Typography 
                variant='body1' 
                sx={{
                    flexGrow:1,
                    display:"-webkit-box",
                    WebkitLineClamp:1,
                    WebkitBoxOrient:"vertical",
                    overflow : "hidden",
                    textOverflow : "ellipsis",
                    width : "100%"
                }}>{name}</Typography>
            <IconButton 
                size='small' 
                sx={{
                    bgcolor: isAdded? "error.main" :"green",
                    color:"white",
                    "&:hover" :{
                        bgcolor : isAdded? "error.dark" : "#084808"
                    }
                }} 
                onClick={()=>handler(_id)} 
                disabled={handleIsLoading}
            >
                {
                    isAdded ? <RemoveIcon /> : <AddIcon />
                }
                
            </IconButton>
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem)