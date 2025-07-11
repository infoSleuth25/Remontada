import { createAsyncThunk } from "@reduxjs/toolkit";
import {server} from '../../constants/config';
import axios from 'axios';

const adminLogin = createAsyncThunk("admin/login",async (secretKey)=>{
    try{
        const config = {
            withCredentials : true,
            headers : {
                "Content-Type" : "application/json" 
            }
        };
        const {data} = await axios.post(`${server}/api/v1/admin/verify`,{secretKey},config);
        return data.msg;
    }
    catch(error){
        throw error.response.data.msg;
    }
});

export {adminLogin};


