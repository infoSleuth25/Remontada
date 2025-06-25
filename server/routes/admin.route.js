import express from 'express';
import { getAllUsers, getAllChats, getAllMessages } from '../controllers/admin.controller.js';
const router = express.Router();

router.get('/users',getAllUsers);
router.get('/chats',getAllChats);
router.get('/messages',getAllMessages);

export default router;