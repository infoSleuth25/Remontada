import { useEffect } from "react";
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

export {useErrors};