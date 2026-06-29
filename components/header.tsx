"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu } from "lucide-react"
import { icons } from "app/data/icons"
import { SearchPalette } from "./SearchPalette"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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

export function Header() {
  const pathName = usePathname()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setIsMenuOpen(false)
  }, [pathName])

  return (
    <header className="w-full fixed top-0 left-0 z-50 flex flex-col items-center bg-[rgba(255,255,255,0.82)] backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="w-full h-[var(--header-height)] px-6 md:px-10 flex justify-between items-center max-w-[1280px]">
        <div className="flex items-center gap-6">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="block md:hidden rounded-md p-1.5 text-[var(--text-body)] hover:bg-[var(--surface-active)] transition-colors duration-150"
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="font-serif text-lg">Jesse Wei</SheetTitle>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {Object.entries(navItems).map(([path, { name }]) => (
                  <Link
                    key={path}
                    href={path}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base font-medium text-[var(--text-body)] hover:bg-[var(--surface-active)] transition-colors"
                  >
                    {name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            aria-label="Jesse Wei — home"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.svg" alt="Jesse Wei" width={28} height={28} sizes="28px" priority />
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1" id="nav">
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)] transition-colors duration-150 ease-[var(--ease-out)]"
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <SearchPalette isLight />
          <Link
            target="_blank"
            href="https://www.linkedin.com/in/jesse-wei-profile/"
            className="px-2 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)] transition-colors duration-150 ease-[var(--ease-out)]"
            aria-label="LinkedIn profile"
          >
            {icons.linkedin}
          </Link>
          <Link
            target="_blank"
            href="https://github.com/mrjwei"
            className="px-2 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)] transition-colors duration-150 ease-[var(--ease-out)]"
            aria-label="GitHub profile"
          >
            {icons.github}
          </Link>
          <Link
            target="_blank"
            href="https://www.instagram.com/mrjwei/"
            className="px-2 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)] transition-colors duration-150 ease-[var(--ease-out)]"
            aria-label="Instagram profile"
          >
            {icons.instagram}
          </Link>
        </div>
      </div>
    </header>
  )
}
