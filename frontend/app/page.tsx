'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { LuminaHeader } from '@/components/lumina/header'
import { VanishInput } from '@/components/lumina/vanish-input'
import { UploadDropzone } from '@/components/lumina/upload-dropzone'
import { ProcessingState } from '@/components/lumina/processing-state'
import { FeatureCards } from '@/components/lumina/feature-cards'
import { AnimatedGrid } from '@/components/lumina/animated-grid'
import { SavedCourses } from '@/components/lumina/saved-courses'

export default function LandingPage() {
  const router = useRouter()

  const [isProcessing, setIsProcessing] = useState(false)
  const [videoTitle, setVideoTitle] = useState<string | undefined>()
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [inputType, setInputType] = useState<'youtube' | 'pdf' | 'image'>('youtube')
  const [testTopic, setTestTopic] = useState('')
  const [testDate, setTestDate] = useState('')
  // 🔥 UNIVERSAL SUBMIT FUNCTION
  const handleSubmit = useCallback(async () => {
    setError(null)

    if (inputType === 'youtube' && !youtubeUrl) {
      setError('Please enter a YouTube URL')
      return
    }

    if (inputType !== 'youtube' && !file) {
      setError('Please upload a file')
      return
    }

    setIsProcessing(true)
    setVideoTitle(inputType === 'youtube' ? youtubeUrl : file?.name)

    try {
      const formData = new FormData()
      formData.append('input_type', inputType)

      if (inputType === 'youtube') {
        formData.append('youtube_url', youtubeUrl)
      } else if (file) {
        formData.append('file', file)
      }

      const res = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setJobId(data.jobId)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsProcessing(false)
    }
  }, [inputType, youtubeUrl, file])

  const handleProcessingComplete = useCallback(
    (completedJobId: string) => {
      router.push(`/course/${completedJobId}`)
    },
    [router]
  )

  const handleAddTest = () => {
  if (!testTopic || !testDate) return

  const existingTests = JSON.parse(
    localStorage.getItem('lumina-tests') || '[]'
  )

  const updatedTests = [
    ...existingTests,
    {
      topic: testTopic,
      date: testDate,
    },
  ]

  localStorage.setItem(
    'lumina-tests',
    JSON.stringify(updatedTests)
  )

  setTestTopic('')
  setTestDate('')
}

  return (
    <div className="relative flex min-h-screen flex-col items-center">
      <AnimatedGrid />
      <LuminaHeader />

      <main className="relative z-10 flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24">
        <AnimatePresence mode="wait">
          {!isProcessing ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex w-full flex-col items-center gap-8"
            >
              {/* Hero */}
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse-glow" />
                <Sparkles className="h-8 w-8 text-primary" />
              </div>

              {/* Title */}
              <div className="text-center">
                <h1 className="text-4xl font-bold sm:text-5xl">
                  Learn Smarter, Not Harder
                </h1>
                <p className="mt-4 text-muted-foreground">
                  Upload videos, PDFs, or notes — AI turns them into study modules.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="w-full rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* 🔥 INPUT TYPE SELECT */}
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value as any)}
                className="w-full rounded-lg p-2 bg-background border"
              >
                <option value="youtube">YouTube</option>
                <option value="pdf">PDF</option>
                <option value="image">Handwritten Notes</option>
              </select>

              {/* 🔥 INPUT SECTION */}
              {inputType === 'youtube' ? (
                <VanishInput
  placeholders={[
    'Paste YouTube lecture...',
    'https://youtube.com/...',
  ]}
  onSubmit={(value) => setYoutubeUrl(value)}
  onChange={(value) => setYoutubeUrl(value)}
/>
              ) : (
                <UploadDropzone
                  onFileSelect={(f) => {
                    if (f) setFile(f)
                  }}
                />
              )}

              {/* GENERATE BUTTON */}
              <button
                onClick={handleSubmit}
                className="h-12 w-full rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500"
              >
                Generate Course
              </button>
 
              <div className="w-full">
                <FeatureCards />

                {/* 📅 Upcoming Test Widget */}
<div className="mt-10 w-full rounded-2xl border border-border/50 bg-secondary/30 p-5 backdrop-blur-sm">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-lg font-semibold text-foreground">
        📅 Got an upcoming test?
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Add your topic and test date — Lumina will prioritize related courses automatically.
      </p>
    </div>
  </div>

  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
    <input
      value={testTopic}
      onChange={(e) => setTestTopic(e.target.value)}
      placeholder="Enter topic (e.g. DBMS, OS, CN)"
      className="flex-1 rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
    />

    <input
      type="date"
      value={testDate}
      onChange={(e) => setTestDate(e.target.value)}
      className="rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
    />

    <button
      onClick={handleAddTest}
      className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
    >
      Add Test
    </button>
  </div>
</div>
                <SavedCourses />
              </div>
            </motion.div>
          ) : (
            <motion.div key="processing" className="w-full">
              <ProcessingState
                videoTitle={videoTitle}
                jobId={jobId}
                onComplete={handleProcessingComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}