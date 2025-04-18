import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { IPics, ImgQueryApi, ImgDeleteApi, ImgAddTagApi } from '@/api'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import { css } from '@emotion/react'

const TagQueryImageFragment = () => {
  const [open, setOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('')

  const [queryTag, setQueryTag] = useState('')
  const [addTag, setAddTag] = useState('')

  const [picList, setPicList] = useState<IPics>({
    full_image_url: [],
    thumbnail_url: [],
  })

  // select pic list
  const [selectedPicList, setSelectedPicList] = useState<string[]>([])

  const [picFile, setPicFile] = useState<File | undefined>()
  const [picFileUrl, setPicFileUrl] = useState('')

  // query 0 tag 1 pic
  const [currentSearchMode, setCurrentSearchMode] = useState(0)

  // handle select pic
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (event.target.files.length > 0) {
        setPicFile(event.target.files[0])
        const imageURL = URL.createObjectURL(event.target.files[0])
        setPicFileUrl(imageURL)
      }
    }
  }

  // get pic list when component mounted
  useEffect(() => {
    ImgQueryApi.query().then((data) => {
      setPicList(data)
    })
  }, [])

  const selectPic = (url: string) => {
    setSelectedPicList((prevList) => {
      const index = prevList.indexOf(url)
      if (index === -1) {
        return [...prevList, url]
      } else {
        return prevList.filter((item) => item !== url)
      }
    })
  }

  // full image preview
  const handleClickOpen = (url: string) => {
    setCurrentImage(url)
    setOpen(true)
  }

  //close preview
  const handleClose = () => {
    setOpen(false)
  }

  // query pic by tag
  const queryPic = async () => {
    if (!queryTag.length) {
      alert('Please input tag')
      return
    }
    const res = await ImgQueryApi.query(queryTag)
    setPicList(res)
  }
  // query pic by pic
  const queryPicByPic = async () => {
    if (!picFile) {
      alert('Please select pic')
      return
    }
    const res = await ImgQueryApi.queryByPic(picFile)
    setPicList(res)
  }

  // delete pic
  const deletePic = async () => {
    if (selectedPicList.length === 0) {
      alert('Please select pic')
      return
    }
    await ImgDeleteApi.deleteImg(selectedPicList)
    await refreshPicList()
    alert('delete success')
  }
  const refreshPicList = async () => {
    setSelectedPicList([])
    const data = await ImgQueryApi.query(queryTag)
    setPicList(data)
  }

  // delete selected pic tag
  const picDeleteTag = async () => {
    if (selectedPicList.length === 0) {
      alert('Please select pic')
      return
    }
    if (!addTag) {
      alert('Please input tag')
      return
    }
    await ImgAddTagApi.deleteTag(selectedPicList, addTag)
    await refreshPicList()
    alert('delete pic tag success')
  }
  // add tag on selected pic
  const picAddTag = async () => {
    if (selectedPicList.length === 0) {
      alert('Please select pic')
      return
    }
    if (!addTag) {
      alert('Please input tag')
      return
    }

    await ImgAddTagApi.addTag(selectedPicList, addTag)
    await refreshPicList()
    alert('add pic tag success')
  }
  const clearSelectPic = () => {
    setPicFile(undefined)
    setPicFileUrl('')
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
            <Stack spacing={2}>
              <Stack direction={'row'} spacing={2} alignItems={'center'}>
          
                <TextField
                  placeholder={'input tag,eg:person'}
                  value={queryTag}
                  onChange={(e) => setQueryTag(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  onClick={() => queryPic()}
                >
                  Query Pic By Tag
                </Button>
              </Stack>

              <Stack direction={'row'} spacing={2} alignItems={'center'}>

                <Button
                  component="label"
                  variant={'outlined'}
                  sx={{ textTransform: 'none' }}
                >
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

                {picFileUrl && (
                  <>
                    <img
                      src={picFileUrl}
                      alt={picFile?.name}
                      css={css`
                        width: 80px;
                        height: 80px;
                        object-fit: cover;
                      `}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ textTransform: 'none' }}
                      onClick={() => clearSelectPic()}
                    >
                      Delete Pic
                    </Button>
                  </>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  onClick={() => queryPicByPic()}
                >
                  Query Pic By Pic
                </Button>
              </Stack>
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack spacing={2}>
              <TextField
                placeholder={'input tag,eg:person'}
                value={addTag}
                onChange={(e) => setAddTag(e.target.value)}
              />

              <Stack direction={'row'} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  onClick={() => picAddTag()}
                >
                  Add Pic Tag
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  onClick={() => picDeleteTag()}
                >
                  Delete Pic Tag
                </Button>
              </Stack>
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
              onClick={() => deletePic()}
            >
              Delete Pic
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Grid container spacing={1.5} sx={{ padding: 2, overflow: 'auto' }}>
          {picList.thumbnail_url.map((url, index) => (
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
                onClick={() => {
                  if (
                    picList.full_image_url &&
                    picList.full_image_url.length > 0
                  ) {
                    handleClickOpen(picList.full_image_url[index])
                  }
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    selectPic(url)
                  }}
                >
                  {selectedPicList.indexOf(url) !== -1 ? (
                    <CheckBox sx={{ color: blue[500] }} />
                  ) : (
                    <CheckBoxOutlineBlank sx={{ color: blue[500] }} />
                  )}
                </IconButton>
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

export default TagQueryImageFragment
