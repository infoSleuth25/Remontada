import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import {sampleUsers} from '../../constants/sampleData';
import UserItem from '../shared/UserItem';

const AddMemberDialog = ({addMember,isLoadingAddMember, chatId}) => {
    const [members,setMembers] = useState(sampleUsers);
      const [selectedMembers, setSelectedMembers] = useState([]);
      const selectMemberHandler = (id) =>{
        setSelectedMembers((prev) =>
          prev.includes(id)
          ? prev.filter((current) => current !== id)
          : [...prev,id] 
        )
      }
    const addMemberSubmitHandler = () =>{
        closeHandler();
    }
    const closeHandler = () =>{
        setSelectedMembers([])
        setMembers([])
    }
  return (
    <Dialog open onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            <Stack spacing={"1rem"}>
                {
                   members.length > 0 ? 
                   members.map((i)=>(<UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />)) :
                   <Typography textAlign={"center"}>No Friends</Typography>
                }
            </Stack>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                <Button color='error' onClick={closeHandler}>Cancel</Button>
                <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMember}>Submit Changes</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog