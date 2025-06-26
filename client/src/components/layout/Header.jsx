import React, { lazy, useState } from 'react'
import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import {Menu as MenuIcon, Search as SearchIcon, Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationIcon} from '@mui/icons-material'
import { orange } from '../../constants/color'
import {useNavigate} from 'react-router-dom'
import { Suspense } from 'react'
import axios from 'axios'
import { server } from '../../constants/config';


const SearchDialog = lazy(()=>import('../dialogs/Search'));
const NotificationDialog = lazy(()=>import('../dialogs/Notifications'));
const NewGroupDialog = lazy(()=>import('../dialogs/NewGroup')); 
 
const Header = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const navigate = useNavigate();

  const openSearch = () =>{
    setIsSearch(prev=> !prev);
  }

  const openNewGroup = () =>{
    setIsNewGroup(prev=> !prev);
  }

  const openNotification = () =>{
    setIsNotification(prev=> !prev);
  }

  const logoutHandler = () =>{
    axios.get(`${server}/api/v1/user/logout`)
  }

  const navigateTogroup = () =>{
    navigate('/groups')
  }

  return (
    <>
    <Box sx={{flexGrow:1}} height={"4rem"}>
      <AppBar position='static' sx={{bgcolor:orange}}>
        <Toolbar>
          <Typography variant='h6'>Remontada</Typography>
          <Box sx={{flexGrow:1}} />
          <Box>
            <IconBtn title={"Search"} icon={<SearchIcon />} onClick={openSearch} />
            <IconBtn title={"New Group"} icon={<AddIcon />} onClick={openNewGroup} />
            <IconBtn title={"Manage Groups"} icon={<GroupIcon />} onClick={navigateTogroup} />
            <IconBtn title={"Notifications"} icon={<NotificationIcon />} onClick={openNotification} />
            <IconBtn title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    {isSearch && (
      <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
      </Suspense>
    )}
    {isNotification && (
      <Suspense fallback={<Backdrop open />}>
          <NotificationDialog />
      </Suspense>
    )}
    {isNewGroup && (
      <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
      </Suspense>
    )}
    </>
  )
}

const IconBtn = ({title,icon,onClick}) =>{
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size='large' onClick={onClick}>
         {icon}
      </IconButton> 
    </Tooltip>
  )
}

export default Header