"use client"

import React from "react"
import { NewsletterForm } from "./newsletter-form"

const POPUP_STORAGE_KEY = "newsletter-popup-last-shown"
const POPUP_EXPIRY_HOURS = 24

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    // Check if popup should be shown
    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY)

    if (!lastShown) {
      // Never shown before, show it
      setIsOpen(true)
      localStorage.setItem(POPUP_STORAGE_KEY, new Date().toISOString())
      return
    }

    // Check if 24 hours have passed
    const lastShownDate = new Date(lastShown)
    const now = new Date()
    const hoursSinceLastShown = (now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60)

    if (hoursSinceLastShown >= POPUP_EXPIRY_HOURS) {
      setIsOpen(true)
      localStorage.setItem(POPUP_STORAGE_KEY, new Date().toISOString())
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close popup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Stay in the Loop! 🚀
          </h2>
          <p className="text-neutral-600">
            Join the community and get the latest posts delivered straight to your inbox.
            No spam, just quality content!
          </p>
        </div>

        <NewsletterForm />

        <p className="mt-4 text-xs text-neutral-500 text-center">
          You can unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}
