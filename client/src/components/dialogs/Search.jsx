import { useInputValidation } from '6pp';
import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';
import toast from 'react-hot-toast';


const Search = () => {
  const dispatch = useDispatch();
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest] = useSendFriendRequestMutation();
  const search = useInputValidation("");
  const {isSearch} = useSelector((state)=>state.misc)
  const searchCloseHandler = () => dispatch(setIsSearch(false));


  const addFriendHandler = async(id) =>{
    try{
      const res = await sendFriendRequest({userId : id});
      if(res.data){
        toast.success(res.data.msg);
        console.log(res.data);
      }
      else{
        toast.error(res?.error?.data?.msg || "Something went wrong");
      }
    }
    catch(err){
      toast.error("Something went wrong")
    }
  }
  
  let isLoadingSendFriendRequest = false;
  const [users, setUsers] = useState([]); 

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      searchUser(search.value)
      .then(({data})=> setUsers(data.users))
      .catch((err)=> console.log(err));
    },1000);
    return ()=>{
      clearTimeout(timeOutId);
    }
  },[search.value])
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment :(
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            )
          }} 
        />
        <List>
          {
            users.map((i)=>(
              <UserItem user={i} key={i._id} handler={addFriendHandler} handleIsLoading={isLoadingSendFriendRequest} />
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search