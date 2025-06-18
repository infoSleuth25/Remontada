import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
const port = process.env.PORT || 4000;
import cookieParser from 'cookie-parser';



import connectToDB from "./utils/conn.js";
connectToDB(process.env.DB_CONNECT)


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());


import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';


app.use('/user', userRoutes);
app.use('/chat', chatRoutes);


app.listen(port,()=>{
    console.log(`App is listening on the port ${port}`);
})