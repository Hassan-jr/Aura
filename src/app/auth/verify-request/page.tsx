import {
    TextureCardContent,
    TextureCardHeader,
    TextureCardStyled,
    TextureCardTitle,
  } from '@/components/ui/texture-card'
  
  export default function VerifyRequest() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <TextureCardStyled className="w-full max-w-md">
          <TextureCardHeader>
            <TextureCardTitle>Check Your Email</TextureCardTitle>
          </TextureCardHeader>
          <TextureCardContent>
            <p className="text-center">
              A verification link has been sent to your email address. Please check your inbox and click on the link to verify your account.
            </p>
          </TextureCardContent>
        </TextureCardStyled>
      </div>
    )
  }