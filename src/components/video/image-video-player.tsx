"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Download, Volume2, Maximize, SkipBack, SkipForward } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface ImageVideoPlayerProps {
  images: string[]
  fps?: number
  width?: number
  height?: number
}

export default function ImageVideoPlayer({ images, fps = 24, width = 800, height = 450 }: ImageVideoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [volume, setVolume] = useState(50)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ensure URLs are absolute
  const ensureAbsoluteUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's a relative URL starting with /, make it absolute from the root
    if (url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }
    // Otherwise, it's a relative URL from the current path
    return `${window.location.origin}/${url}`;
  };

  // Load all images
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true)
      setError(null)
      console.log("Loading images:", images)
      
      const imagePromises = images.map((src, index) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous" // Try with crossOrigin for external images
          
          img.onload = () => {
            console.log(`Image ${index} loaded:`, src)
            resolve(img)
          }
          
          img.onerror = (e) => {
            console.error(`Failed to load image ${index}:`, src, e)
            reject(e)
          }
          
          // Make sure the URL is absolute
          img.src = ensureAbsoluteUrl(src)
        })
      })

      try {
        const imgs = await Promise.all(imagePromises)
        console.log("All images loaded successfully:", imgs.length)
        setLoadedImages(imgs)
        setDuration(imgs.length / fps)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load images:", error)
        setError("Failed to load one or more images. Please check the console for details.")
        setIsLoading(false)
      }
    }

    if (images.length > 0) {
      loadImages()
    }
  }, [images, fps])

  // Draw frame
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current
      if (!canvas) {
        console.error("Canvas ref is null")
        return
      }

      if (!loadedImages[frameIndex]) {
        console.error("No image available for frame:", frameIndex)
        return
      }

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        console.error("Could not get 2D context from canvas")
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Draw image to fit canvas
      const img = loadedImages[frameIndex]
      ctx.drawImage(img, 0, 0, width, height)
    },
    [loadedImages, width, height],
  )

  // Animation loop
  useEffect(() => {
    if (!isPlaying || loadedImages.length === 0) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const nextFrame = prev + 1
        if (nextFrame >= loadedImages.length) {
          setIsPlaying(false)
          return 0
        }

        const newTime = nextFrame / fps
        setCurrentTime(newTime)
        setProgress((nextFrame / loadedImages.length) * 100)

        return nextFrame
      })
    }, 1000 / fps)

    return () => clearInterval(interval)
  }, [isPlaying, loadedImages.length, fps])

  // Draw frame when currentFrame changes
  useEffect(() => {
    if (loadedImages.length > 0) {
      drawFrame(currentFrame)
    }
  }, [currentFrame, drawFrame, loadedImages.length])

  // Initialize canvas
  useEffect(() => {
    if (loadedImages.length > 0) {
      drawFrame(0)
    }
  }, [loadedImages, drawFrame])

  const handlePlayPause = () => {
    if (currentFrame >= loadedImages.length - 1) {
      setCurrentFrame(0)
      setCurrentTime(0)
      setProgress(0)
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0]
    const newFrame = Math.floor((newProgress / 100) * loadedImages.length)
    setCurrentFrame(newFrame)
    setProgress(newProgress)
    setCurrentTime(newFrame / fps)
  }

  const handleSkipBack = () => {
    const newFrame = Math.max(0, currentFrame - fps) // Skip back 1 second
    setCurrentFrame(newFrame)
    setCurrentTime(newFrame / fps)
    setProgress((newFrame / loadedImages.length) * 100)
  }

  const handleSkipForward = () => {
    const newFrame = Math.min(loadedImages.length - 1, currentFrame + fps) // Skip forward 1 second
    setCurrentFrame(newFrame)
    setCurrentTime(newFrame / fps)
    setProgress((newFrame / loadedImages.length) * 100)
  }

  const startRecording = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    recordedChunksRef.current = []
    const stream = canvas.captureStream(fps)

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
    })

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "generated-video.webm"
      a.click()
      URL.revokeObjectURL(url)
      setIsRecording(false)
    }

    setIsRecording(true)
    mediaRecorderRef.current.start()

    // Auto-play the sequence for recording
    setCurrentFrame(0)
    setIsPlaying(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsPlaying(false)
    }
  }

  const downloadVideo = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
        <div className="text-gray-500">Loading images...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 bg-red-50 rounded-lg border border-red-200 p-4">
        <div className="text-red-500 font-medium mb-2">Error loading images</div>
        <div className="text-red-700 text-sm">{error}</div>
        <div className="mt-4 text-sm text-gray-600">
          Please check that your image URLs are correct and accessible.
        </div>
      </div>
    )
  }

  if (loadedImages.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-yellow-700">No images were loaded successfully.</div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Video Canvas */}
      <div className="relative">
        <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto bg-black" />

        {/* Play button overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button
              size="lg"
              variant="ghost"
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <Play className="w-8 h-8 fill-white" />
            </Button>
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            REC
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 text-white p-4">
        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={0.1}
            className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-red-500 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-red-500"
          />
        </div>

        {/* Control buttons and time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleSkipBack} className="text-white hover:bg-white/20">
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button size="sm" variant="ghost" onClick={handlePlayPause} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </Button>

            <Button size="sm" variant="ghost" onClick={handleSkipForward} className="text-white hover:bg-white/20">
              <SkipForward className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 ml-4">
              <Volume2 className="w-4 h-4" />
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                className="w-20 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white"
              />
            </div>

            <div className="text-sm ml-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={downloadVideo}
              disabled={loadedImages.length === 0}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              {isRecording ? "Stop & Download" : "Download Video"}
            </Button>

            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
