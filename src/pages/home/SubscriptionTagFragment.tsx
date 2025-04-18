import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { UserApi } from '@/api'

const SubscriptionTagFragment = () => {
  // record input tag
  const [tag, setTag] = useState('')

  // subscription tag
  const subscriptionTag = async () => {
    if (!tag) {
      alert('please enter a tag')
      return
    }
    await UserApi.subscriptionTag(tag)
    alert('Subscription Tag Success')
  }
  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ height: 'calc(100vh - 112px)', overflow: 'hidden' }}
      spacing={2}
    >
      <TextField
        required
        label="Input Tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <Button
        variant={'contained'}
        sx={{ textTransform: 'none' }}
        onClick={() => subscriptionTag()}
      >
        Subscription
      </Button>
    </Stack>
  )
}

export default SubscriptionTagFragment
