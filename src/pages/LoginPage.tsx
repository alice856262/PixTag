import React, { useState } from 'react'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { UserApi } from '@/api'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async () => {
    try {
      if (!email || !password) {
        alert('Please fill in all fields.')
        return
      }
      await UserApi.login(email, password)
      navigate('/', { replace: true })
    } catch (error) {
      alert(`${error}`)
    }
  }

  return (
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
          Login
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            Login
          </Button>
          <Typography variant="body2" align="center">
            No Account?{' '}
            <Link
              variant="body2"
              onClick={() => {
                navigate('/signup')
              }}
            >
              Sign up first
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage
