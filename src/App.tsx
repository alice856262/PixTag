import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { css } from '@emotion/react'

function App() {
  return (
    <div
      css={css`
        width: 100%;
        height: 100vh;
      `}
    >
      <RouterProvider router={router} />
    </div>
  )
}

export default App
