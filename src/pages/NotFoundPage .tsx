import React from 'react'
import { Container, Typography } from '@mui/material'

export const NotFoundPage: React.FC = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Typography variant="h2" gutterBottom>
        Not Found
      </Typography>
    </Container>
  )
}
