import express from 'express';
const router = express.Router();
import { authUser } from '../middlewares/auth.middleware.js';
import { newGroupChat } from '../controllers/chat.controller.js';

router.post('/newChat',authUser,newGroupChat);

export default router;