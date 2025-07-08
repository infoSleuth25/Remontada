import { Grid , Skeleton, Stack} from '@mui/material'
import React from 'react'
import { BouncingSkeleton } from '../styles/StyledComponent'

export const LayoutLoader = () =>{
    return(
        <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
            <Grid  size={3} height={"100%"}><Skeleton variant='rectangular' height={"100vh"} /></Grid>
            <Grid  size={6} height={"100%"} >
                <Stack spacing={"1rem"}>
                {
                    Array.from({length:10}).map((_,index)=>(
                        <Skeleton key={index} variant='rounded' height={"5rem"}/>
                    ))
                }
                </Stack>
            </Grid>    
            <Grid  size={3} height={"100%"}><Skeleton variant='rectangular' height={"100vh"} /></Grid>
        </Grid>
    )
}

export const TypingLoader = () =>{
    return (
        <Stack
            spacing={"0.5rem"}
            direction={"row"}
            padding={"0.5rem"}
            justifyContent={"center"}
        >
            <BouncingSkeleton 
                variant='circular' 
                width={15} 
                height={15} 
                style={{
                    animationDelay : "0.1s"
                }} 
            />
            <BouncingSkeleton 
                variant='circular' 
                width={15} 
                height={15} 
                style={{
                    animationDelay : "0.2s"
                }} 
            />
            <BouncingSkeleton 
                variant='circular' 
                width={15} 
                height={15} 
                style={{
                    animationDelay : "0.4s"
                }} 
            />
            <BouncingSkeleton 
                variant='circular' 
                width={15} 
                height={15} 
                style={{
                    animationDelay : "0.6s"
                }} 
            />
        </Stack>
    )
}