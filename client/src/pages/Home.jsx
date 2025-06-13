import React from 'react'
import AppLayout from '../components/layout/AppLayout';
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box bgcolor={"#D3D3D3"} height={"100%"}>
      <Typography p={"2rem"} textAlign={"center"} variant='h5'>Select a friend to chat.</Typography>
    </Box>
  )
}

export default AppLayout()(Home);