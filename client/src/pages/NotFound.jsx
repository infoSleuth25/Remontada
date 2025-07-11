import React from 'react'
import { Container, Stack, Typography, Button, Box } from '@mui/material'
import { ErrorOutline as ErrorIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Container
      maxWidth="100%"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #ffffff,rgb(94, 92, 91))',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: 4,
          p: 5,
          backgroundColor: "rgb(248, 245, 245)",
        }}
      >
        <ErrorIcon sx={{ fontSize: '6rem', color: '#d32f2f' }} />
        <Typography variant="h2" sx={{color:"black",fontWeight:"bold"}} gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          It might have been removed, renamed, or did not exist in the first place.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{backgroundColor:"rgb(125, 122, 120)", ":hover":{backgroundColor:"rgb(94, 92, 91)"}}}
          size="large"
        >
          Go back to Home
        </Button>
      </Box>
    </Container>
  )
}

export default NotFound
