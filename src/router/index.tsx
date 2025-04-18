import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage.tsx'
import SignUpPage from '@/pages/SignUpPage.tsx'
import { HomePage } from '@/pages/home/HomePage.tsx'
import { UploadPicFragment } from '@/pages/home/UploadPicFragment.tsx'
import { ImageQueryFragment } from '@/pages/home/ImageQueryFragment.tsx'
import { NotFoundPage } from '@/pages/NotFoundPage .tsx'
import TagQueryImageFragment from '@/pages/home/TagQueryImageFragment.tsx'
import SubscriptionTagFragment from '@/pages/home/SubscriptionTagFragment.tsx'
import { StorageUtils } from '@/utils'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const email = StorageUtils.getEmail()
  return email && email.length > 0 ? children : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Navigate to="/home" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'upload',
        element: (
          <ProtectedRoute>
            <UploadPicFragment />
          </ProtectedRoute>
        ),
      },
      {
        path: 'imgQuery',
        element: (
          <ProtectedRoute>
            <ImageQueryFragment />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tagQueryImg',
        element: (
          <ProtectedRoute>
            <TagQueryImageFragment />
          </ProtectedRoute>
        ),
      },
      {
        path: 'subscriptionTag',
        element: (
          <ProtectedRoute>
            <SubscriptionTagFragment />
          </ProtectedRoute>
        ),
      },
      {
        index: true,
        element: <Navigate to="upload" />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
