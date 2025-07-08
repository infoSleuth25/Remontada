import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon} from '@mui/icons-material';
import { Backdrop, Button, Grid, Icon, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import { matBlack } from '../constants/color';
import {useNavigate, useSearchParams} from 'react-router-dom'
import { StyledLink } from '../components/styles/StyledComponent';
import AvatarCard from '../components/shared/AvatarCard';
import {sampleChats, sampleUsers} from '../constants/sampleData';
import UserItem from '../components/shared/UserItem';
import { useMyGroupsQuery } from '../redux/api/api';
const ConfirmDeleteDialog = lazy(()=>import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog = lazy(()=>import('../components/dialogs/AddMemberDialog'));
import {useErrors} from '../hooks/hook';
import {LayoutLoader} from '../components/layout/Loaders'

const isAddMember = false;

const Groups = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [groupName,setGroupName] = useState('');
  const [confiremDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupNameUpdatedValue,setGroupNameUpdatedValue] = useState('')
  const chatId = useSearchParams()[0].get('group');
  const navigate = useNavigate();

  const myGroups = useMyGroupsQuery("");
  console.log(myGroups.data);

  const errors = [{
    isError : myGroups.isError,
    error : myGroups.error
  }]
  useErrors(errors);

  const navigateBack = () =>{
    navigate('/');
  };

  const removeMemberHandler = (id)=>{
    console.log("Remove member", id);
  }
  
  const updateGroupName = () =>{
    setIsEdit(false);
    console.log(groupNameUpdatedValue);
  }

  const deleteHandler = () =>{
    console.log('deleteHandler');
    closeConfirmDeleteHandler();
  }

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  }

  const closeConfirmDeleteHandler = () =>{
    setConfirmDeleteDialog(false);
  }

  const OpenAddMemberHandler = () =>{
    console.log("Add Member");
  }

  useEffect(()=>{
    if(chatId){
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return ()=>{
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    }
  },[chatId])


  const IconBtns = <>
    <Tooltip title="back" >
      <IconButton sx={{
        position : "absolute",
        top : "2rem",
        left : "2rem",
        bgcolor : matBlack,
        color : "white",
        ":hover":{
          bgcolor : "rgba(0,0,0,0.6)",
        }
      }}
      onClick={navigateBack}
      >
        <KeyboardBackspaceIcon/>
      </IconButton>
    </Tooltip>
  </>;

  const GroupName = (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
      {
        isEdit ? 
        <>
          <TextField value={groupNameUpdatedValue} onChange={e=>setGroupNameUpdatedValue(e.target.value)}  />
          <IconButton onClick={updateGroupName}>
            <DoneIcon />
          </IconButton>
        </> : 
        <>
          <Typography variant='h4'>{groupName}</Typography>
          <IconButton onClick={()=>setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      }
    </Stack>
  );

  const ButtonGroup = (
    <Stack direction={"row"} spacing={"1rem"} p={"1rem 4rem"}>
      <Button size='large' variant='text' color='error' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>Delete Group</Button>
      <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={OpenAddMemberHandler}>Add Member</Button>
    </Stack>
  )
  return myGroups.isLoading? <LayoutLoader /> : (
    <Grid container height={"100vh"}>
      <Grid  sx={{display:"block"}} size={4} bgcolor={"bisque"}>
        <GroupsList myGroups={sampleChats} chatId={chatId} />
      </Grid>
      <Grid  
        size={8} 
        sx={{
          display : "flex",
          flexDirection : "column",
          alignItems : "center",
          position : "relative",
          padding : "1rem 3rem"
        }}
      > 
        {IconBtns}
        {
          groupName && 
          <>
            {GroupName}
            <Typography margin={"2rem"} alignSelf={"flex-start"} variant='body1'>Members</Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={"1rem 4rem"}
              spacing={"2rem"}
              // bgcolor={"bisque"}
              height={"50vh"}
              overflow={"auto"}
            >
              {
                sampleUsers.map((i)=>(
                  <UserItem 
                    user={i} 
                    isAdded 
                    styling={{
                      boxShadow : "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding : "1rem 2rem",
                      borderRadius : "1rem",
                    }}
                    handler={removeMemberHandler}
                    key={i._id}
                  />
                ))
              }
            </Stack>
            {ButtonGroup}
          </>
        }
      </Grid>
      {
        isAddMember &&
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog />
        </Suspense>
      }
      {
        confiremDeleteDialog && 
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog open={confiremDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} />
        </Suspense>
      }
    </Grid>
  )
}

const GroupsList = ({myGroups = [],chatId}) =>(
   <Stack width={"100%"} sx={{height:"100vh", overflow:"auto"}}>
    {
      myGroups.length > 0 ? (myGroups.map((group)=> <GroupListItem group={group} chatId={chatId} key={group._id} />))
      : 
      (<Typography textAlign={"center"} padding="1rem">No Groups</Typography>)
    }
   </Stack>
)

const GroupListItem = memo(({group , chatId}) =>{
  const {name,avatar,_id} = group;
  return (
    <StyledLink 
      to={`?group=${_id}`} 
      onClick={e=>{
        if(chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </StyledLink>
  )
})

export default Groups