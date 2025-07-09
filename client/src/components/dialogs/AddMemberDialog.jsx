import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useErrors } from '../../hooks/hook';
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { setIsAddMember } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';

const AddMemberDialog = ({chatId}) => {
  const dispatch = useDispatch();

  const {isAddMember} = useSelector((state)=>state.misc)
  const [addMembers, { isLoading: addingMembers }] = useAddGroupMembersMutation();
  const {isLoading,data,isError,error} = useAvailableFriendsQuery(chatId);

  

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) =>{
    setSelectedMembers((prev) =>
      prev.includes(id)
      ? prev.filter((current) => current !== id)
      : [...prev,id] 
    )
  }

  const addMemberSubmitHandler = async () => {
    try {
      await addMembers({ chatId, members: selectedMembers }).unwrap();
      toast.success("Members added successfully");
      closeHandler();
    } catch (err) {
      toast.error(err?.data?.msg || "Failed to add members");
    }
  };

  const closeHandler = () =>{
    dispatch(setIsAddMember(false));
  }

  useErrors([{isError,error}])

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            <Stack spacing={"1rem"}>
                { isLoading ? <Skeleton /> :
                   data?.availableFriends?.length > 0 ? 
                   data?.availableFriends?.map((i)=>(<UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />)) :
                   <Typography textAlign={"center"}>No Friends</Typography>
                }
            </Stack>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                <Button color='error' onClick={closeHandler}>Cancel</Button>
                <Button onClick={addMemberSubmitHandler} variant='contained' disabled={addingMembers}>Submit Changes</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog