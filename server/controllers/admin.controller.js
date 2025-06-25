import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';

async function getAllUsers(req,res){
    try{
        const users = await User.find({});
        const transformedUsers = await Promise.all(
            users.map(async({name,username,avatar,_id})=>{
                const [groups,friends] = await Promise.all([
                    Chat.countDocuments({groupChat:true,members:_id}),
                    Chat.countDocuments({groupChat:false,members:_id})
                ])
                return {
                    name,
                    username,
                    avatar : avatar.url,
                    _id,
                    groups,
                    friends
                }
            })
        )
        return res.status(200).json({
            msg : "Users Received successfully",
            users : transformedUsers
        })
    }
    catch(err){
        return res.status(500).json({
            msg : "Internal server error",
            err : err.message
        })      
    }
}

async function getAllChats(req,res){
    try{
        const chats = await Chat.find({})
            .populate("members","name avatar")
            .populate("creator","name avatar");

        const transformedChats = await Promise.all(
            chats.map(async({members,_id,groupChat,groupName,creator})=>{
                const totalMessages = await Message.countDocuments({chat:_id});
                return {
                    _id,
                    groupChat,
                    groupName,
                    avatar : members.slice(0,3).map((member)=>member.avatar.url),
                    members : members.map(({_id,name,avatar})=>({
                        _id,
                        name,
                        avatar : avatar.url
                    })),
                    creator : {
                        name : creator?.name || "None",
                        avatar : creator?.avatar.url || ""
                    },
                    totalMembers : members.length,
                    totalMessages : totalMessages
                }
            })
        )

        return res.status(200).json({
            msg : "Chats received successfully",
            chats : transformedChats
        })
    }
    catch(err){
        return res.status(500).json({
            msg : "Internal server error",
            err : err.message
        })      
    }
}

async function getAllMessages(req,res){
    try{
        const messages = await Message.find({})
            .populate("sender","name avatar")
            .populate("chat","groupChat");

        const transformedMessages = messages.map(({_id,content,attachments,sender,chat,createdAt})=>({
            _id,
            attachments,
            content,
            createdAt,
            chat: chat._id,
            groupChat : chat.groupChat,
            sender : {
                _id : sender._id,
                name : sender.name,
                avatar : sender.avatar.url
            }

        }))

        return res.status(200).json({
            msg : "Messages received successfully",
            messages : transformedMessages
        })
    }
    catch(err){
        return res.status(500).json({
            msg : "Internal server error",
            err : err.message
        })      
    }
}

export {getAllUsers, getAllChats, getAllMessages};