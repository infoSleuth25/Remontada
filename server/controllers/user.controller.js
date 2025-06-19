import User from "../models/user.model.js";
import {UserRegisterValidationSchema, UserLoginValidationSchema} from '../validators/user.validator.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import BlackListToken from '../models/blackListToken.model.js'
import Chat from "../models/chat.model.js";

async function registerUser(req,res){
    try{
        const name = req.body?.name;
        const username = req.body?.username;
        const password = req.body?.password;
        const avatar = req.body?.avatar;
        const bio = req.body?.bio;
        if(!name || !username || !password || !avatar.public_id || !avatar.url || !bio){
            return res.status(400).json({
                msg : "All fields are required"
            })
        }  
        const result = UserRegisterValidationSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                msg : "Please enter valid input data",
                error : result.error.errors
            })
        }
        const isUserAlreadyExists = await User.findOne({username});
        if(isUserAlreadyExists){
            return res.status(400).json({
                msg : "Username which you have provided is already in use"
            })
        }
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 8;
        const hashPassword = await bcrypt.hash(password,saltRounds);
        const user = await User.create({
            name : name,
            username : username,
            bio : bio,
            password : hashPassword,
            avatar : avatar
        })
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn : '24h'});
        res.cookie('token',token);
        return res.status(201).json({
            user : user,
            token : token
        })
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function loginUser(req,res){
    try{
        const username = req.body?.username;
        const password = req.body?.password;
        if(!username || !password){
            return res.status(400).json({
                msg : "All fields are required"
            })
        }
        const result = UserLoginValidationSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                msg : "Invalid username or password"
            })
        }
        const user =await User.findOne({username}).select('+password');
        if(!user){
            return res.status(400).json({
                msg : "User is not registered"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                msg : "Invalid password"
            })
        }
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn : '24h'});
        res.cookie('token',token);
        return res.status(200).json({
            user : user,
            token : token
        })
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function getUserProfile(req,res){
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function logoutUser(req,res){
    try{
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await BlackListToken.create({token});
        res.clearCookie('token');
        res.status(200).json({
            msg : "Logged out"
        })
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function searchUser(req,res){
    const {name=""} = req.query;
    const chats = await Chat.find({groupChat:false, members:req.user._id});
    const allFriends = chats.flatMap((chat)=> chat.members);
    const otherUsers = await User.find({
        _id: { $nin: allFriends },
        $or: [
            { name: { $regex: name, $options: "i" } },
            { username: { $regex: name, $options: "i" } }
        ]
    });
    const users = otherUsers.map(({_id,name,avatar})=>({
        _id,
        name,
        avatar : avatar.url
    }));
    return res.status(200).json({
        msg : "Searching a user",
        users : users
    })
}

export {registerUser, loginUser, getUserProfile, logoutUser, searchUser};