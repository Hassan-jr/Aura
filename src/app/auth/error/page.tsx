'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  TextureCardContent,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardStyled,
  TextureCardTitle,
} from '@/components/ui/texture-card'
import { TextureButton } from '@/components/ui/texture-button'

export default function AuthError() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errortype = searchParams.get('error')
    setError(getErrorMessage(errortype))
  }, [searchParams])

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.'
      case 'Verification':
        return 'The verification token is invalid or has expired.'
      case 'CredentialsSignin':
        return 'Invalid credentials. Please check your email and password.'
      default:
        return 'An unexpected error occurred. Please try again later.'
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <TextureCardStyled className="w-full max-w-md">
        <TextureCardHeader>
          <TextureCardTitle>Authentication Error</TextureCardTitle>
        </TextureCardHeader>
        <TextureCardContent>
          <p className="text-center mb-4" role="alert">
            {getErrorMessage(error)}
          </p>
        </TextureCardContent>
        <TextureCardFooter>
          <Link href="/auth/sign-in" passHref>
            <TextureButton variant="accent" className="w-full">
              Back to Sign In
            </TextureButton>
          </Link>
        </TextureCardFooter>
      </TextureCardStyled>
    </div>
  )
}