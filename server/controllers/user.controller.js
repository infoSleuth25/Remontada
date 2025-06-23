import User from "../models/user.model.js";
import {UserRegisterValidationSchema, UserLoginValidationSchema} from '../validators/user.validator.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import BlackListToken from '../models/blackListToken.model.js'
import Chat from "../models/chat.model.js";
import Request from "../models/request.model.js";
import {emitEvent} from '../utils/features.js'
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { request } from "express";

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
    try{
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
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function sendRequest(req,res){
    try{
        const userId = req.body?.userId;
        if(!userId){
            return res.status(400).json({
                msg : "Please provide userId to send friend request"
            })
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                msg : "Please enter valid userId to send friend request"
            })
        }
        const isRequestExists = await Request.findOne({
            $or :[
                {sender: req.user._id, receiver : userId},
                {sender: userId, receiver : req.user._id}
            ]
        });
        if(isRequestExists){
            return res.status(400).json({
                msg : "Request is already sent or User had already sent you a request"
            })
        }
        const request = await Request.create({
            sender : req.user._id,
            receiver : userId
        })
        emitEvent(req,NEW_REQUEST,[userId]);
        return res.status(200).json({
            msg : "Request sent successfully",
            request : request
        })
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function acceptRequest(req, res) {
    try {
        const requestId = req.body?.requestId;
        const accept = req.body?.accept;

        if (!requestId || typeof accept !== "boolean") {
            return res.status(400).json({
                msg: "Please provide all the details to accept friend request"
            });
        }

        const request = await Request.findById(requestId)
            .populate("sender", "name")
            .populate("receiver", "name");

        if (!request) {
            return res.status(400).json({
                msg: "Request is not valid"
            });
        }

        if (request.receiver._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                msg: "You are not authorized to accept the request"
            });
        }

        if (!accept) {
            await request.deleteOne();
            return res.status(200).json({
                msg: "Friend request rejected",
                request
            });
        }

        const members = [request.sender._id, request.receiver._id];

        const chat = await Chat.create({
            members,
            groupName: `${request.sender.name}-${request.receiver.name}`,
            groupChat: false
        });

        await request.deleteOne();

        emitEvent(req, REFETCH_CHATS, members);

        return res.status(200).json({
            msg: "Friend request accepted successfully",
            chat
        });
    } 
    catch (err) {
        return res.status(500).json({
            msg: "Internal server error",
            err: err.message
        });
    }
}


async function getAllNotifications(req,res){
    try{
        const requests = await Request.find({receiver : req.user._id}).populate("sender","name avatar");
        const allRequests = requests.map(({_id,sender})=>({
            _id,
            sender :{
                _id : sender._id,
                name : sender.name,
                avatar : sender.avatar.url
            }
        }))
        return res.status(200).json({
            msg : "Notifications received successfully",
            allRequests : allRequests
        })
    }
    catch (err) {
        return res.status(500).json({
            msg: "Internal server error",
            err: err.message
        });
    }
}



export {registerUser, loginUser, getUserProfile, logoutUser, searchUser,sendRequest, acceptRequest,getAllNotifications};