import React, { useState } from 'react'

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { UserApi } from '@/api'
import { CognitoUser } from 'amazon-cognito-identity-js'

const SignUpPage: React.FC = () => {
  const [givenName, setGivenName] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>()
  const [confirmationCode, setConfirmationCode] = useState('')

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)

  const handleSubmit = async () => {
    try {
      if (!givenName || !familyName || !email || !password) {
        alert('Please fill in all fields.')
        return
      }
      const user = await UserApi.signUp(givenName, password, email, familyName)
      setCognitoUser(user)
      setOpen(true)
      alert(
        'Sign-up successful! Please check your email for the confirmation code.',
      )
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  const confirmSignUp = async () => {
    try {
      if (!confirmationCode) {
        alert('Please enter the confirmation code.')
        return
      }
      if (!cognitoUser) {
        alert('')
        return
      }
      await UserApi.confirmRegistration(cognitoUser, confirmationCode)
      setOpen(false)
      navigate('/login', { replace: true })
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  return (
    <>
      <Dialog open={open}>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Enter confirmation code"
            name="email"
            autoComplete="email"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => confirmSignUp()}
            sx={{ mt: 3, mb: 2, textTransform: 'none' }}
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>

      <Container
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4">
            Sign Up
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="givenName"
              label="Given Name"
              name="givenName"
              autoFocus
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="familyName"
              label="Family Name"
              name="familyName"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={() => handleSubmit()}
              sx={{ mt: 3, mb: 2, textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default SignUpPage
