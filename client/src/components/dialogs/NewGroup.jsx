import { useInputValidation } from '6pp'
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from '../shared/UserItem'



const NewGroup = () => {
  const groupName = useInputValidation("");
  const [members,setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectMemberHandler = (id) =>{
    setSelectedMembers((prev) =>
      prev.includes(id)
      ? prev.filter((current) => current !== id)
      : [...prev,id] 
    )
  } 
  console.log(selectedMembers);
  const submitHandler = () =>{}
  const closeHandler = () =>{}
  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={"3rem"} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
        <TextField value={groupName.value} onChange={groupName.changeHandler} label="Group Name"></TextField>
        <Typography variant='body1'>Members</Typography>
        <Stack>
          {
            members .map((i)=>(
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
          <Button variant='text' color='error' size='large'>Cancel</Button>
          <Button sx={{backgroundColor:"green","&:hover" :{bgcolor : "#084808"}}} variant='contained' size='large' onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup