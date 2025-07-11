import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material'
import { Box, Container, Paper, Skeleton, Stack, Typography } from '@mui/material'
import moment from 'moment'
import AdminLayout from '../../components/layout/AdminLayout'
import { DoughnutChart, LineChart } from '../../components/specific/Chart'
import { CurveButton, SearchField } from '../../components/styles/StyledComponent'
import { useDashboardStatsQuery } from '../../redux/api/api'

const Dashboard = () => {
  const {data,isLoading,} = useDashboardStatsQuery();
  const {stats} = data || {};
  const singleChatCount = stats ? stats.totalChatsCount - stats.groupsCount : 0;
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
      <Widget title={"Users"} value={stats?.usersCount || 0} Icon={<PersonIcon />} />
      <Widget title={"Chats"} value={stats?.totalChatsCount || 0} Icon={<GroupIcon />} />
      <Widget title={"Messages"} value={stats?.messagesCount || 0} Icon={<MessageIcon />} />
    </Stack>
  )

  return ( 
    <AdminLayout>
      {
        isLoading ? <Skeleton /> :  
        <Container component={"main"}>
          {Appbar}
          <Stack direction={"row"} spacing={'2rem'} flexWrap={"wrap"} justifyContent={"center"}>
            <Paper
              elevation={3}
              sx={{
                padding : "2rem 3.5rem",
                borderRadius : "1rem",
                flex: 1,
                minWidth: "30rem", 
                width : "100%",
                maxWidth : "45rem",
              }}
            >
              <Typography margin={"2rem 0"} variant='h4'>Last Messages</Typography>
              <LineChart value={stats?.messagesChart || []} />
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
              }}
            >
              <DoughnutChart labels={["Single Chats","Group Chats"]} value={[singleChatCount,stats?.groupsCount || 0]} />
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
      }
       
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