import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors=[]) =>{
    useEffect(()=>{
        errors.forEach(({isError,error,fallback})=>{
            if(isError){
                if(fallback){
                    fallback();
                }
                else{
                    toast.error(error?.data?.msg || "Something Went Wrong");  
                }  
            }
        })
    },[errors]);
}

const useSocketEvents = (socket,handlers)=>{
    useEffect(()=>{
        Object.entries(handlers).forEach(([event,handler])=>{
            socket.on(event,handler)
        })
        
        return ()=>{
            Object.entries(handlers).forEach(([event,handler])=>{
                socket.off(event,handler)
            })
        }
    },[socket,handlers])
}

export {useErrors,useSocketEvents};