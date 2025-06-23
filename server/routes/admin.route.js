import express from 'express';
import { getAllUsers, getAllChats } from '../controllers/admin.controller.js';
const router = express.Router();

router.get('/users',getAllUsers);
router.get('/chats',getAllChats);
// router.get('/messages');

export default router;