import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { Add } from '@mui/icons-material'
import { css } from '@emotion/react'

export const ImageQueryFragment: React.FC = () => {
  const urls = [
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2',
  ]

  const [open, setOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('')

  const [addTag, setAddTag] = useState('')

  const [fileName, setFileName] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (event.target.files.length > 0) {
        setFileName(event.target.files[0].name)
      }
    }
  }

  const handleClickOpen = (url: string) => {
    setCurrentImage(url)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Stack sx={{ height: 'calc(100vh - 112px)', overflow: 'hidden' }}>
        <Stack sx={{ zIndex: 1 }}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ mt: 2, mb: 2 }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                position: 'relative',
              }}
            >
              <Button
                component="label"
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 98,
                  height: 98,
                  display: 'flex',
                  border: '2px dashed #3265dc',
                  justifyContent: 'center',
                  alignItems: 'center',
                  justifyItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Add sx={{ color: '#3265dc', width: 36, height: 36 }} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: '#3265dc', textTransform: 'none' }}
                >
                  Select Pic
                </Typography>
              </Button>

              <img
                src={
                  'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=248&fit=crop&auto=format&dpr=2'
                }
                alt={fileName}
                css={css`
                  width: 100px;
                  height: 100px;
                  object-fit: cover;
                  left: 0;
                  top: 0;
                  position: absolute;
                `}
              />
            </Box>

            <TextField
              placeholder={'input tag,eg:person'}
              value={addTag}
              onChange={(e) => setAddTag(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Add Pic Tag
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Delete Pic
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Grid container spacing={1.5} sx={{ padding: 2, overflow: 'auto' }}>
          {urls.map((url, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Card
                sx={{
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  aspectRatio: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
                onClick={() => handleClickOpen(url)}
              >
                <Checkbox />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={currentImage}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
