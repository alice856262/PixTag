import React, { useState } from 'react'
import { Button, Box, Typography, Container, Stack } from '@mui/material'
import { css } from '@emotion/react'
import { Add } from '@mui/icons-material'
import { ImgUploadApi } from '@/api'

export const UploadPicFragment: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>()
  const [selectedFileUrl, setSelectedFileUrl] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0]
        setSelectedFile(file)
        const imageURL = URL.createObjectURL(file)
        setSelectedFileUrl(imageURL)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select pic')
      return
    }
    await ImgUploadApi.uploadPic(selectedFile)
    alert('upload pic success')
  }

  const handleClick = () => {
    document.getElementById('file-input')?.click()
  }

  return (
    <Stack
      sx={{
        height: 'calc(100vh - 112px)',
        overflow: 'hidden',
        backgroundColor: 'whitesmoke',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Container maxWidth={'sm'}>
        <Box
          sx={{
            backgroundColor: 'white',
            width: '100%',
            aspectRatio: 16 / 9,
            borderRadius: 3,
            position: 'relative',
          }}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            css={css`
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              top: 0;
              opacity: 0;
              pointer-events: none;
            `}
            onChange={handleFileChange}
          />
          <Stack
            spacing={3}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
            }}
          >
            <Box
              sx={{
                borderRadius: 1,
                border: '1px dashed blue',
                width: 150,
                height: 150,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                cursor: 'pointer',
              }}
              onClick={() => handleClick()}
            >
              {selectedFileUrl ? (
                <img
                  src={selectedFileUrl}
                  alt={selectedFile?.name}
                  css={css`
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                  `}
                />
              ) : (
                <Add sx={{ color: 'blue' }} />
              )}
            </Box>

            <Typography>
              {selectedFile
                ? selectedFile.name
                : 'You can select image with png, jpeg*'}
            </Typography>

            <Button
              variant={'contained'}
              sx={{ textTransform: 'none' }}
              onClick={() => handleUpload()}
            >
              Upload Pic
            </Button>
          </Stack>
        </Box>
      </Container>
    </Stack>
  )
}
