import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Message as MessageIcon } from "@mui/icons-material";
import { Grid, Stack, styled, Typography } from '@mui/material';
import { Link as LinkComponent, Navigate, useLocation } from 'react-router-dom';
import { graycolor, matBlack } from '../../constants/color';
import { useSelector } from "react-redux";

const Link = styled(LinkComponent)`
    text-decoration : none;
    border-radius : 2rem;
    padding : 1rem 2rem;
    color : black;
    &:hover{
    color : rgba(0,0,0,0.54)
    }
`


const adminTabs = [
    {
        name : "Dashboard",
        path : '/admin/dashboard',
        icon : <DashboardIcon />
    },
    {
        name : "Users",
        path : '/admin/user-management',
        icon : <ManageAccountsIcon />
    },
    {
        name : "Chats",
        path : '/admin/chats-management',
        icon : <GroupsIcon />
    },
    {
        name : "Messages",
        path : '/admin/messages-management',
        icon : <MessageIcon />
    },
] 


const AdminLayout = ({children}) => {
    const {isAdmin} = useSelector((state)=>state.auth);
    const logoutHandler = () =>{
        console.log("Log out");
    }
    if(!isAdmin){
        return <Navigate to='/admin' />
    }
  return (
    <Grid container minHeight={"100vh"}>
        <Grid size={3}>
            <Siderbar />
        </Grid>
        <Grid size={9} sx={{bgcolor:graycolor}}>
            {children}
        </Grid>
    </Grid>
  )
}

const Siderbar =() =>{
    const location = useLocation();
    return (
        <Stack width={"100%"} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant='h5' textTransform={"uppercase"}>Remontada</Typography>
            <Stack spacing={"1rem"}>
                {
                    adminTabs.map((tab)=>(
                        <Link 
                            key={tab.path} 
                            to={tab.path}
                            sx={
                                location.pathname === tab.path && {
                                    bgcolor : matBlack,
                                    color : "white",
                                    ":hover":{color : "white"}
                                }
                            }
                        >
                            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}> 
                                {tab.icon} 
                                <Typography>{tab.name}</Typography>
                            </Stack>
                        </Link>
                    ))
                }
                <Link>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}> 
                        <ExitToAppIcon /> 
                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    )
}

export default AdminLayout