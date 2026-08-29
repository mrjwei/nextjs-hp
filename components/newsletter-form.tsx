"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Lang } from "app/i18n/config"

type SubscribeResponse =
  | { ok: true; message: string }
  | { ok: false; message: string }

const copy: Record<
  Lang,
  { emailLabel: string; submit: string; submitting: string; genericError: string }
> = {
  en: {
    emailLabel: "Email",
    submit: "Subscribe",
    submitting: "Subscribing…",
    genericError: "Something went wrong. Please try again.",
  },
  ja: {
    emailLabel: "メールアドレス",
    submit: "登録する",
    submitting: "登録中…",
    genericError: "問題が発生しました。もう一度お試しください。",
  },
}

export function NewsletterForm({
  className,
  lang = "en",
}: {
  className?: string
  lang?: Lang
}) {
  const t = copy[lang]
  const [email, setEmail] = React.useState("")
  const [botField, setBotField] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [message, setMessage] = React.useState<string>("")

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (status === "loading") return

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, botField, lang }),
      })

      const data = (await response.json()) as SubscribeResponse

      if (!data.ok) {
        setStatus("error")
        setMessage(data.message || t.genericError)
        return
      }

      setStatus("success")
      setMessage(data.message || t.submit)
      setEmail("")
      setBotField("")
    } catch {
      setStatus("error")
      setMessage(t.genericError)
    }
  }

  const isDisabled = status === "loading"

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <label className="sr-only" htmlFor="newsletter-email">
        {t.emailLabel}
      </label>
      <div className="flex flex-col items-start gap-2">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-start">
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 w-full sm:w-72 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isDisabled}
          />

          {/* Honeypot field */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            className="hidden"
            aria-hidden="true"
          />

          <Button
            type="submit"
            disabled={isDisabled}
          >
            {status === "loading" ? t.submitting : t.submit}
          </Button>
        </div>

        {status !== "idle" && message ? (
          <p
            className={
              status === "success" ? "text-sm text-green-700" : "text-sm text-red-700"
            }
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  )
}
