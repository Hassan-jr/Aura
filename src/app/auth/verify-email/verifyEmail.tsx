'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TextureButton } from '@/components/ui/texture-button'
import {
  TextureCardContent,
  TextureCardHeader,
  TextureCardStyled,
  TextureCardTitle,
} from '@/components/ui/texture-card'

export default function VerifyEmail() {
  const [status, setStatus] = useState('Verifying...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('Invalid verification link')
    }
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('Email verified successfully')
      } else {
        setStatus(data.error || 'Email verification failed')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setStatus('An error occurred during email verification')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <TextureCardStyled className="w-full max-w-md">
        <TextureCardHeader>
          <TextureCardTitle>Email Verification</TextureCardTitle>
        </TextureCardHeader>
        <TextureCardContent>
          <p className="text-center mb-4">{status}</p>
          {status === 'Email verified successfully' && (
            <TextureButton
              variant="accent"
              className="w-full"
              onClick={() => router.push('/home')}
            >
              Proceed to Inprime AI
            </TextureButton>
          )}
        </TextureCardContent>
      </TextureCardStyled>
    </div>
  )
}