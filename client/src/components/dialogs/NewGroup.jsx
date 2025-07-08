import { useInputValidation } from '6pp'
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useErrors } from '../../hooks/hook'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { setIsNewGroup } from '../../redux/reducers/misc'
import UserItem from '../shared/UserItem'



const NewGroup = () => {
  const {isNewGroup} = useSelector((state)=>state.misc);
  const dispatch = useDispatch();
  const {isError,error,isLoading,data} = useAvailableFriendsQuery();
  const [createGroup, { isLoading: creatingGroup }] = useNewGroupMutation();


  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [{
    isError,
    error
  }]

  useErrors(errors);
  const selectMemberHandler = (id) =>{
    setSelectedMembers((prev) =>
      prev.includes(id)
      ? prev.filter((current) => current !== id)
      : [...prev,id] 
    )
  } 
  const submitHandler = async() =>{
    if(!groupName.value){
      return toast.error("Group name is required");
    }
    if(selectedMembers.length <2){
      return toast.error("Please select at least 2 members");
    }
    try {
      const res = await createGroup({
        groupName: groupName.value,
        groupMembers: selectedMembers
      }).unwrap();

      toast.success("Group created successfully!");
      closeHandler();
    } 
    catch (err) {
      toast.error(err?.data?.msg || "Failed to create group");
    }
    closeHandler();
  }
  const closeHandler = () =>{
    dispatch(setIsNewGroup(false));
  }
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={"3rem"} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
        <TextField value={groupName.value} onChange={groupName.changeHandler} label="Group Name"></TextField>
        <Typography variant='body1'>Members</Typography>
        <Stack>
          {isLoading ? <Skeleton /> :
            data?.friends?.map((i)=>(
              <UserItem 
                user={i} 
                key={i._id} 
                handler={selectMemberHandler} 
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          }
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button onClick={closeHandler} variant='text' color='error' size='large'>Cancel</Button>
          <Button sx={{backgroundColor:"green","&:hover" :{bgcolor : "#084808"}}} variant='contained' size='large' onClick={submitHandler} disabled={creatingGroup}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup