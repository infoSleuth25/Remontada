import express from 'express';
const router = express.Router();
import {temp} from '../controllers/user.controller.js';

router.get('/login',temp);

export default router;