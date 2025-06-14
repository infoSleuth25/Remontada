import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Container, Paper, Stack, Typography, Box } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material'
import moment from 'moment'
import { CurveButton, SearchField } from '../../components/styles/StyledComponent'


const Dashboard = () => {
  const Appbar = (
    <Paper elevation={3} sx={{padding:"2rem", margin:"2rem 0", borderRadius:"1rem"}}>
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettingsIcon sx={{fontSize:"2rem"}} />
        <SearchField placeholder='Search...' />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1} />
        <Typography
          color ={ "rgba(0,0,0,0.7)"}
          textAlign={"center"}
        >
          {
            moment().format("MMMM Do YYYY")
          }
        </Typography>
        <NotificationsIcon />
      </Stack>
    </Paper>
  )

  const Widgets = (
    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} margin={"2rem 0"}>
      <Widget title={"Users"} value={"34"} Icon={<PersonIcon />} />
      <Widget title={"Chats"} value={"3"} Icon={<GroupIcon />} />
      <Widget title={"Messages"} value={"453"} Icon={<MessageIcon />} />
    </Stack>
  )
  return (
    <AdminLayout>
        <Container component={"main"}>
          {Appbar}
          <Stack direction={"row"} spacing={'2rem'} flexWrap={"wrap"}>
            <Paper
              elevation={3}
              sx={{
                padding : "2rem 3.5rem",
                borderRadius : "1rem",
                width : "100%",
                maxWidth : "45rem",
                height:"25rem"
              }}
            >
              <Typography margin={"2rem 0"} variant='h4'>Last Messages</Typography>
              {"chat"}
            </Paper>
            <Paper
              elevation={3}
              sx={{
                padding : "1rem",
                borderRadius : "1rem",
                display : "flex",
                justifyContent : "center",
                alignItems : "center",
                width:"100%",
                position : "relative",
                maxWidth : "25rem",
                height : "25rem"
              }}
            >
              {"Dougnut Chart"}
              <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
              >
                <GroupIcon />
                <Typography>VS</Typography>
                <PersonIcon />
              </Stack>
            </Paper>
          </Stack>
          {
            Widgets
          }
        </Container>
    </AdminLayout>
  )
}

const Widget = ({title,value,Icon}) =>{
  return (
    <Paper elevation={3} sx={{padding:"2rem", margin:"2rem 0",borderRadius:"1.5rem", width:"20rem"}}>
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color:"rgba(0,0,0,0.7)",
            borderRadius : "50%",
            border : "4px solid rgba(0,0,0,0.9)",
            width : "5rem",
            height : "5rem",
            display : "flex",
            justifyContent :"center",
            alignItems : "center"
          }}
        >{value}</Typography>
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          {Icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default Dashboard