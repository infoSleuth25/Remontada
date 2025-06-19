import express from 'express';
const router = express.Router();
import { authUser } from '../middlewares/auth.middleware.js';
import { newGroupChat, getChats, getGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup } from '../controllers/chat.controller.js';
import { attachmentsMulter } from '../middlewares/multer.js';

router.post('/newChat',authUser,newGroupChat);
router.get('/getChats',authUser,getChats);
router.get('/getGroups',authUser,getGroups);
router.put('/addMembers',authUser,addMembers);
router.put('/removeMember',authUser,removeMember);
router.delete('/leave/:chatId',authUser,leaveGroup);

router.post('/message',authUser,attachmentsMulter,sendAttachments);

router.route('/:id').get(authUser,getChatDetails)
                    .put(authUser,renameGroup)
                    .delete(authUser);

export default router;