"use client"

import { useState } from "react"
import BlurFade from "@/components/magicui/blur-fade"
import Image from "next/image"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function BlurFadeDemo({ images }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [open, setOpen] = useState(false)

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setOpen(true)
  }

  return (
    <section className="container pt-3 p-0.5 bg-card/100 rounded-lg">
      <h1 className="text-2xl font-semibold mb-2">Posts</h1>
      <div className="columns-3 gap-0.5 mx-1 md:gap-1 sm:columns-3 md:columns-4 [&>div]:mb-1">
        {images.map((imageUrl, idx) => {
          return (
            // <BlurFade key={idx} delay={0.25 + idx * 0.05} inView>
              <div className="h-auto cursor-pointer" onClick={() => handleImageClick(imageUrl)}>
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  width={500}
                  height={100}
                  loading="lazy"
                  decoding="async"
                  blurDataURL={typeof imageUrl === "string" ? imageUrl : undefined}
                  alt={`visual ${idx + 1}`}
                  className="w-full h-auto rounded-md cover"
                />
              </div>
            // </BlurFade>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-screen max-h-screen p-0 border-none bg-black/0 sm:rounded-none">
          <div className="relative w-screen h-screen flex items-center justify-center">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              aria-label="Close dialog"
            >
              <X className="h-6 w-6" />
            </button>

            {selectedImage && (
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  fill
                  alt="Full screen image"
                  className="object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
