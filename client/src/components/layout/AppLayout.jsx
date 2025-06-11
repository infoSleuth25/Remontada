import React from 'react';
import Header from './Header';
import Title from '../shared/Title';
import { Grid } from '@mui/material';
import { Padding } from '@mui/icons-material';

const AppLayout = ()=> (WrappedComponent) => {
  return (props)=>{
        return (
            <>
            <Title />
            <Header />
            <Grid container height={"calc(100vh - 4rem)"}>
                <Grid item size={3} height={"100%"}>First</Grid>
                <Grid item size={6} height={"100%"} ><WrappedComponent {...props} /></Grid>
                <Grid item size={3} height={"100%"} sx={{padding:"2rem",bgcolor:"rgba(0,0,0,0.85)"}}>Third</Grid>
            </Grid>
            </>
        )
    }
}

export default AppLayout;