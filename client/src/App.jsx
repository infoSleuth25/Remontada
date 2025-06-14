import React,{lazy, Suspense} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ProtectRoute from './components/auth/protectRoute';
import { LayoutLoader } from './components/layout/Loaders';

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

let user = true;

const App = () => {
  return (
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
    </BrowserRouter>
  )
}

export default App