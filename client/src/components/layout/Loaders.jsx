import { Grid , Skeleton, Stack} from '@mui/material'
import React from 'react'

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