import { GroupCreateSchema } from "../validators/chat.validator.js";
import Chat from "../models/chat.model.js";
import { emitEvent } from "../utils/features.js";
import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import User from "../models/user.model.js";

async function newGroupChat(req,res){
    try{
        const groupName = req.body?.groupName;
        const groupMembers = req.body?.groupMembers;
        if(!groupName || !groupMembers){
            return res.status(400).json({
                msg : "All fields are required"
            })
        }
        const result = GroupCreateSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                msg : "Please enter valid input data",
                error : result.error.errors
            })
        }
        const allGroupMembers = [...groupMembers, req.user._id]; 
        const chat = await Chat.create({
            groupName : groupName,
            groupChat : true,
            creator : req.user._id,
            members : allGroupMembers
        })
        emitEvent(req,ALERT,allGroupMembers,`Welcome to ${groupName} group`);
        emitEvent(req,REFETCH_CHATS,groupMembers);
        return res.status(201).json({
            msg : "Group is successfully created",
            group : chat
        })
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function getChats(req,res){
    try{
        const chats = await Chat.find({members : req.user._id}).populate(
            "members",
            "name avatar"
        )
        const transformChats = chats.map(({_id,groupName,groupChat,members})=>{
            const otherMember = members.find((member)=>member._id.toString() !== req.user._id.toString());
            return {
                _id,
                groupChat,
                avatar : groupChat ? members.slice(0,3).map(({avatar})=> avatar.url): [otherMember.avatar.url],
                name : groupChat ? groupName : otherMember.name,
                members : members.reduce((prev,curr)=>{
                    if(curr._id.toString() != req.user._id.toString()){
                        prev.push(curr._id);
                    }
                    return prev;
                },[])
            }
        })
        return res.status(200).json({
            msg : "Chats received successfully",
            chats : transformChats
        })
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function getGroups(req,res){
    try{
        const groups = await Chat.find({
            members: req.user._id,
            groupChat : true,
            creator : req.user._id
        }).populate("members","name avatar")

        const transformGroups = groups.map(({_id,members,groupChat,groupName})=>{
            return {
                _id,
                groupName,
                groupChat,
                avatar : members.slice(0,3).map(({avatar})=> avatar.url),
                members : members.reduce((prev,curr)=>{
                    if(curr._id.toString() != req.user._id.toString()){
                        prev.push(curr._id);
                    }
                    return prev;
                },[])
            }
        })

        return res.status(200).json({
            msg : "Group Details received successfully",
            groups : transformGroups
        })

    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function addMembers(req,res){
    try{
        const chatId = req.body?.chatId;
        const members = req.body?.members;
        if(!chatId || !members){
            return res.status(400).json({
                msg : "ChatId and members are required"
            })
        }
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({
                msg : "Group is not created"
            })
        }
        if(!chat.groupChat){
            return res.status(400).json({
                msg : "This is not a group chat"
            })
        }
        if(chat.creator.toString() != req.user._id.toString()){
            return res.status(403).json({
                msg : "You are not allowed to add group members"
            })
        }
        
        const existingMemberIds = new Set(chat.members.map(id => id.toString()));
        const newMemberIds = members.filter(id => !existingMemberIds.has(id.toString()));

        if (newMemberIds.length === 0) {
            return res.status(400).json({
                msg: "All provided users are already group members"
            })
        }

        const allNewMembersPromise = newMemberIds.map(id => User.findById(id, "name"));
        const allNewMembers = await Promise.all(allNewMembersPromise);

        chat.members.push(...allNewMembers.map((i)=> i._id));
        if(chat.members.length > 100){
            return res.status(400).json({
                msg : "Group members limit reached (100)"
            })
        }
        await chat.save();

        const allUsersName = allNewMembers.map((i)=>i.name).join(", ");
        emitEvent(req,ALERT,chat.members,`${allUsersName} have been added to the group`);
        emitEvent(req,REFETCH_CHATS,chat.members);

        return res.status(200).json({
            msg : "All members are added to the group successfully",
            groupDetails : chat 
        })
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function removeMember(req,res){
    try{
        const chatId = req.body?.chatId;
        const userId = req.body?.userId;
        if(!chatId || !userId){
            return res.status(400).json({
                msg : "Please provide both chatId and userId"
            })
        }

        const user = await User.findById(userId,"name");
        if(!user){
            return res.status(400).json({
                msg : "User has not registered"
            })
        }

        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({
                msg : "Group is not created"
            })
        }
        if(!chat.groupChat){
            return res.status(400).json({
                msg : "This is not a group chat"
            })
        }
        if(chat.creator.toString() != req.user._id.toString()){
            return res.status(403).json({
                msg : "You are not allowed to remove group members"
            })
        }
        if(chat.members.length <=3){
            return res.status(400).json({
                msg : "Group must have at least 3 members"
            })
        }
        if (!chat.members.some(id => id.toString() === userId.toString())) {
            return res.status(400).json({
                msg: "User is not a member of the group"
            })
        }
        chat.members = chat.members.filter(id => id.toString() !== userId.toString());
        chat.save();

        emitEvent(req,ALERT,chat.members,`${user.name} has been removed from the group`);
        emitEvent(req,REFETCH_CHATS,chat.members);
        return res.status(200).json({
            msg: "User has been removed from the group successfully",
            groupDetails: chat
        })
    }   
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

async function leaveGroup(req,res){
    try{
        const chatId = req.params.chatId;
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({
                msg : "Group is not created"
            })
        }
        if(!chat.groupChat){
            return res.status(400).json({
                msg : "This is not a group chat"
            })
        }
        if (!chat.members.some(id => id.toString() === req.user._id.toString())) {
            return res.status(400).json({
                msg: "User is not a member of the group"
            })
        }
        const remainingMembers = chat.members.filter(id => id.toString() !== req.user._id.toString());
        if (remainingMembers.length < 3) {
            await Chat.findByIdAndDelete(chat._id);
            emitEvent(req,ALERT,chat.members,`${req.user.name} has left the group & Group had less than 3 members after removal. Group has been deleted.`);
            emitEvent(req,REFETCH_CHATS,chat.members);
            return res.status(200).json({
                msg: "Group had less than 3 members after removal. Group has been deleted.",
                deletedGroupId: chat._id
            });
        }
        if(chat.creator.toString() == req.user._id.toString()){
            const randomElement = Math.floor(Math.random()* remainingMembers.length);
            const newCreator = remainingMembers[randomElement];
            chat.creator = newCreator;
        }
        chat.members = remainingMembers;
        await chat.save();
        emitEvent(req,ALERT,chat.members,`${req.user.name} has left the group`);
        return res.status(200).json({
            msg : "User has successfully left the group",
            groupDetails : chat
        })        
    }
    catch(err){
        return res.status(500).json({
            err : err,
            msg : "Internal server error"
        })
    }
}

export {newGroupChat, getChats, getGroups, addMembers , removeMember, leaveGroup};