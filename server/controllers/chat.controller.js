// import { GroupCreateSchema } from "../validators/chat.validator.js";
// import Chat from "../models/chat.model.js";
// import { emitEvent } from "../utils/features.js";
// import { ALERT, REFETCH_CHATS } from "../constants/events.js";

// async function newGroupChat(req,res){
//     try{
//         const groupName = req.body?.groupName;
//         const groupMembers = req.body?.groupMembers;
//         if(!groupName || !groupMembers){
//             return res.status(400).json({
//                 msg : "All fields are required"
//             })
//         }
//         const result = GroupCreateSchema.safeParse(req.body);
//         if(!result.success){
//             return res.status(400).json({
//                 msg : "Please enter valid input data",
//                 error : result.error.errors
//             })
//         }
//         const allGroupMembers = [...groupMembers, req.user._id]; 
//         const chat = await Chat.create({
//             groupName : groupName,
//             groupChat : true,
//             creator : req.user._id,
//             members : allGroupMembers
//         })
//         emitEvent(req,ALERT,allGroupMembers,`Welcome to ${groupName} group`);
//         emitEvent(req,REFETCH_CHATS,groupMembers);
//         return res.status(201).json({
//             msg : "Group is successfully created",
//             group : chat
//         })
//     }
//     catch(err){
//         return res.status(500).json({
//             err : err,
//             msg : "Internal server error"
//         })
//     }
// }

// export {newGroupChat};