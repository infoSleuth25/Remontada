import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useErrors } from '../../hooks/hook'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { setIsNotification } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'


const Notifications = () => {
  const dispatch = useDispatch();
  const {isNotification} = useSelector((state)=>state.misc);
  const {isLoading,data,error,isError} = useGetNotificationsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async({_id,accept}) =>{
    dispatch(setIsNotification(false));
    try{
      const res = await acceptRequest({requestId:_id,accept});
      if(res.data?.chat){
        toast.success(res.data?.msg);
      }
      else{
        toast.error(res.data?.msg || "Something Went wrong");
      }
    }
    catch(err){
      toast.error("Something went wrong");
      console.log(err);
    }
  }
  useErrors([{isError,error}]);
  const CloseHandler = () => dispatch(setIsNotification(false));
  return (
    <Dialog open={isNotification} onClose={CloseHandler}>
      <Stack p={"2rem"} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading ? <Skeleton /> :
          <>
            {
              data?.allRequests.length > 0 ? 
              (
                data.allRequests.map((i)=> <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id} />)
              ) : 
              (<Typography textAlign={"center"}>0 Notifications</Typography>)
            }
          </>
        }
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({sender, _id, handler}) =>{
  const {name,avatar} = sender;
  return (
    <ListItem>
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
            <Avatar src={avatar} />
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
                }}>{`${name} sent you a friend request.`}
            </Typography>
            <Stack direction={"row"} >
              <Button sx={{color:"green"}} onClick={()=>handler({_id,accept:true})}>Accept</Button>
              <Button color="error" onClick={()=>handler({_id,accept:false})}>Reject</Button>
            </Stack>
            
        </Stack>
    </ListItem>
  )
}) 

export default Notifications