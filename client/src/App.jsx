import React,{lazy, Suspense, useEffect} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ProtectRoute from './components/auth/protectRoute';
import { LayoutLoader } from './components/layout/Loaders';
import axios from 'axios';
import { server } from './constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from './redux/reducers/auth';
import {Toaster} from 'react-hot-toast'

const Home = lazy(()=> import('./pages/Home'));
const Login = lazy(()=> import('./pages/Login'));
const Chat = lazy(()=> import('./pages/Chat'));
const Groups = lazy(()=> import('./pages/Groups'));
const NotFound = lazy(()=>import('./pages/NotFound'));
const AdminLogin = lazy(()=>import('./pages/admin/AdminLogin'));
const Dashboard = lazy(()=>import('./pages/admin/Dashboard'));
const ChatManagement = lazy(()=>import('./pages/admin/ChatManagement'));
const MessageManagement = lazy(()=>import('./pages/admin/MessageManagement'));
const UserManagement = lazy(()=>import('./pages/admin/UserManagement'));


const App = () => {
  const {user, loader} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  useEffect(()=>{
    axios.get(`${server}/api/v1/user/profile`,{withCredentials:true})
    .then(({data})=>dispatch(userExists(data.user)))
    .catch((err)=> dispatch(userNotExists()));
  },[dispatch]);
  return loader ? <LayoutLoader /> : (
    <BrowserRouter>
    <Suspense fallback={<LayoutLoader/>}>
      <Routes>
        <Route path='/' element={ <ProtectRoute user={user}> <Home/> </ProtectRoute> } />
        <Route path='/login' element={<ProtectRoute user={!user} redirect='/'> <Login/> </ProtectRoute>} />
        <Route path='/chat/:chatId' element={<ProtectRoute user={user}> <Chat/> </ProtectRoute>} />
        <Route path='/groups' element={<ProtectRoute user={user}> <Groups/> </ProtectRoute>} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/user-management' element={<UserManagement />} />
        <Route path='/admin/chats-management' element={<ChatManagement />} />
        <Route path='/admin/messages-management' element={<MessageManagement />} />
        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </Suspense>
    <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App