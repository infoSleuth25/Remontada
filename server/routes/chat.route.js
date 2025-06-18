import express from 'express';
const router = express.Router();
import { authUser } from '../middlewares/auth.middleware.js';
import { newGroupChat, getChats, getGroups, addMembers } from '../controllers/chat.controller.js';

router.post('/newChat',authUser,newGroupChat);
router.get('/getChats',authUser,getChats);
router.get('/getGroups',authUser,getGroups);
router.put('/addMembers',authUser,addMembers);

export default router;