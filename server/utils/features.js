import { userSocketIDs } from "../app.js";

export const emitEvent = (req,event,users,data) =>{
    console.log("Emiting event", event);
}

export const deleteFilesFromCloudinary = async(public_ids) =>{
    
}

export const getSockets = (users=[]) =>{
    const sockets = users.map(user=>userSocketIDs.get(user._id.toString()));
    return sockets;
} 