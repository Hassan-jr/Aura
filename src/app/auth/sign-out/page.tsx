'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  TextureCardContent,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardStyled,
  TextureCardTitle,
} from '@/components/ui/texture-card'
import { TextureButton } from '@/components/ui/texture-button'

export default function SignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ redirect: false })
    router.push('/auth/sign-in')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <TextureCardStyled className="w-full max-w-md">
        <TextureCardHeader>
          <TextureCardTitle>Sign Out</TextureCardTitle>
        </TextureCardHeader>
        <TextureCardContent>
          <p className="text-center mb-4">Are you sure you want to sign out?</p>
        </TextureCardContent>
        <TextureCardFooter className="flex justify-between">
          <TextureButton
            variant="primary"
            onClick={() => router.back()}
            disabled={isSigningOut}
          >
            Cancel
          </TextureButton>
          <TextureButton
            variant="accent"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </TextureButton>
        </TextureCardFooter>
      </TextureCardStyled>
    </div>
  )
}