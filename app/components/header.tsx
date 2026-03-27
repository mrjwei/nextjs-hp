"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Image from "next/image"
import { Bars3Icon } from "@heroicons/react/24/outline"
import { openSans } from "app/data/fonts"
import { icons } from "app/data/icons"

const navItems = {
  "/": {
    name: "Home",
  },
  "/writings": {
    name: "Writings",
  },
  "/portfolio": {
    name: "Portfolio",
  },
  "/about": {
    name: "About",
  },
}

export function Header({ className }: { className?: string }) {
  const pathName = usePathname()
  const [isLight, setIsLight] = React.useState(true)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const mobileMenuRef = React.useRef<HTMLElement | null>(null)
  const restoreFocusToRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (pathName !== "/") {
      setIsLight(true)
      return
    }

    const sentinel = document.getElementById("home-hero-sentinel")
    if (!sentinel) {
      setIsLight(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsLight(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [pathName])

  React.useEffect(() => {
    setIsMenuOpen(false)
  }, [pathName])

  React.useEffect(() => {
    if (!isMenuOpen) {
      restoreFocusToRef.current?.focus()
      restoreFocusToRef.current = null
      return
    }

    restoreFocusToRef.current =
      (document.activeElement as HTMLElement | null) ?? menuButtonRef.current

    const focusables = Array.from(
      mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []
    ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1)

    focusables[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (!mobileMenuRef.current) return

      if (event.key === "Escape") {
        event.preventDefault()
        setIsMenuOpen(false)
        return
      }

      if (event.key !== "Tab" || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (!active || active === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isMenuOpen])

  const handleMenuButtonClick = () => {
    setIsMenuOpen((open) => !open)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <aside
      className={clsx(
        "w-full fixed top-0 left-0 flex flex-col items-center transition-shadow duration-200 ease-in-out z-50",
        {
          "bg-white shadow-md": isLight,
        },
        className
      )}
    >
      <div className="w-full h-[var(--header-height)] px-8 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            ref={menuButtonRef}
            type="button"
            className={clsx("transition-all block md:hidden hover:scale-110", {
              "text-neutral-700 hover:text-neutral-900": isLight,
              "text-white": !isLight,
            })}
            onClick={handleMenuButtonClick}
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <Bars3Icon className="w-7" />
          </button>
          {isMenuOpen && (
            <nav
              ref={mobileMenuRef}
              className="bg-neutral-900 shadow-lg absolute w-full top-full left-0 h-screen"
              id="mobile-nav"
              aria-label="Mobile"
              role="dialog"
              aria-modal="true"
            >
              {Object.entries(navItems).map(([path, { name }]) => {
                return (
                  <Link
                    key={path}
                    href={path}
                    className={clsx(
                      `transition-all text-white hover:bg-neutral-800 flex align-middle relative text-lg p-5 border-b border-neutral-800`
                    )}
                    onClick={closeMenu}
                  >
                    {name}
                  </Link>
                )
              })}
            </nav>
          )}
          <Link href="/" aria-label="home" className="hover:opacity-80 transition-opacity">
            <Image
              src={isLight ? "/logo.svg" : "/logo-light.svg"}
              alt="Jesse Wei's Logo"
              width={32}
              height={32}
              sizes="32px"
              priority
            />
          </Link>
          <nav
            className="hidden md:flex md:flex-row md:items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
            id="nav"
          >
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className={clsx(
                    `transition-all duration-300 ease-in-out font-medium text-neutral-300 hover:text-white flex align-middle relative py-1 px-3 m-1 rounded-md hover:bg-white/10 ${openSans.className}`,
                    {
                      "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100": isLight,
                    }
                  )}
                >
                  {name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <Link
            target="_blank"
            href="https://www.linkedin.com/in/jesse-wei-profile/"
            className={clsx(
              "px-2 py-1 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200 ease-in-out",
              {
                "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100": isLight,
              }
            )}
            aria-label="LinkedIn profile"
          >
            {icons.linkedin}
          </Link>
          {/*
          <Link
            target="_blank"
            href="https://bsky.app/profile/mrjwei.bsky.social"
            className={clsx(
              "px-2 m-1 text-gray-300 hover:text-gray-400 transition-colors duration-200 ease-in-out",
              {
                "text-gray-400 hover:text-gray-600": isLight,
              }
            )}
          >
            {icons.bluesky}
          </Link>
          */}

          <Link
            target="_blank"
            href="https://github.com/mrjwei"
            className={clsx(
              "px-2 py-1 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200 ease-in-out",
              {
                "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100": isLight,
              }
            )}
            aria-label="GitHub profile"
          >
            {icons.github}
          </Link>
          <Link
            target="_blank"
            href="https://www.instagram.com/mrjwei/"
            className={clsx(
              "px-2 py-1 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200 ease-in-out",
              {
                "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100": isLight,
              }
            )}
            aria-label="Instagram profile"
          >
            {icons.instagram}
          </Link>
        </div>
      </div>
    </aside>
  )
}
