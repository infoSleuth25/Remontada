import express from 'express';
const router = express.Router();
import {registerUser, loginUser} from '../controllers/user.controller.js';
import { singleAvatar } from '../middlewares/multer.js';

router.post('/register',singleAvatar,registerUser);
router.post('/login',loginUser);

export default router;