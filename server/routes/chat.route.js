import express from 'express';
const router = express.Router();
import { authUser } from '../middlewares/auth.middleware.js';
import { newGroupChat, getChats, getGroups, addMembers, removeMember, leaveGroup } from '../controllers/chat.controller.js';

router.post('/newChat',authUser,newGroupChat);
router.get('/getChats',authUser,getChats);
router.get('/getGroups',authUser,getGroups);
router.put('/addMembers',authUser,addMembers);
router.put('/removeMember',authUser,removeMember);
router.delete('/leave/:chatId',authUser,leaveGroup);

export default router;