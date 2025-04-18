import React from 'react'
import { Box, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material'

import { StorageUtils } from '@/utils'
import { Outlet, useNavigate } from 'react-router-dom'
import { blue } from '@mui/material/colors'
import { AccountCircle, ExitToApp } from '@mui/icons-material'

export const HomePage: React.FC = () => {
  const email = StorageUtils.getEmail()
  const navigate = useNavigate()

  const [currentRoute, setCurrentRoute] = React.useState('/home/upload')

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentRoute(newValue)
    navigate(newValue, { replace: true })
  }

  return (
    <Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          backgroundColor: blue[500],
          height: 56,
          alignItems: 'center',
          pl: 0.5,
          pr: 0.5,
        }}
      >
        <Stack direction="row">
          <IconButton>
            <AccountCircle sx={{ width: 44, height: 44, color: 'white' }} />
          </IconButton>
          <IconButton
            onClick={() => {
              StorageUtils.saveEmail('')
              navigate('/login', { replace: true })
            }}
          >
            <ExitToApp sx={{ width: 44, height: 44, color: 'white' }} />
          </IconButton>
        </Stack>
        <Typography component="div" variant="body1" sx={{ color: 'white' }}>
          {email}
        </Typography>
      </Stack>

      <Box
        sx={{
          width: '100%',
          height: 56,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Tabs value={currentRoute} onChange={handleChange}>
          <Tab
            value="/home/upload"
            label="Home"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            value="/home/tagQueryImg"
            label="ImageQuery"
            sx={{ textTransform: 'none' }}
          />
          {/*<Tab*/}
          {/*  value="/home/imgQuery"*/}
          {/*  label="ImageQuery"*/}
          {/*  sx={{ textTransform: 'none' }}*/}
          {/*/>*/}
          <Tab
            value="/home/subscriptionTag"
            label="SubscriptionTag"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Box>
      <Outlet />
    </Stack>
  )
}
