import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
const port = process.env.PORT || 4000;

import userRoutes from './routes/user.route.js';


app.use('/user', userRoutes);


app.listen(port,()=>{
    console.log(`App is listening on the port ${port}`);
})