"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu } from "lucide-react"
import { icons } from "app/data/icons"
import { SearchPalette } from "./SearchPalette"
import { getLangFromPathname, toggleLangPath } from "app/i18n/config"
import { profile } from "app/content/profile"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navItemsByLang = {
  en: {
    "/posts": { name: "Posts" },
    "/projects": { name: "Projects" },
    "/about": { name: "About" },
  },
  ja: {
    "/ja/posts": { name: "記事" },
    "/ja/projects": { name: "プロジェクト" },
    "/ja/about": { name: "プロフィール" },
  },
}

function isActivePath(path: string, pathName: string) {
  return pathName === path || pathName.startsWith(`${path}/`)
}

const socialLabels: Record<string, string> = {
  linkedin: "LinkedIn profile",
  github: "GitHub profile",
  instagram: "Instagram profile",
  email: "Email",
}

export function Header() {
  const pathName = usePathname()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const lang = getLangFromPathname(pathName)
  const p = profile[lang]
  const navItems = navItemsByLang[lang]
  const headerSocial = p.social.filter((s) => s.inHeader)

  React.useEffect(() => {
    setIsMenuOpen(false)
  }, [pathName])

  return (
    <header className="w-full fixed top-0 left-0 z-50 flex flex-col items-center bg-[var(--surface-header)] backdrop-blur-md border-b border-[var(--border-subtle)]">
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
            <SheetContent side="left">
              <SheetTitle className="font-serif text-lg">Jesse Wei</SheetTitle>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {Object.entries(navItems).map(([path, { name }]) => {
                  return isActivePath(path, pathName) ? (
                    <Link
                      key={path}
                      href={path}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-md px-3 py-2.5 text-base font-medium text-[var(--text-body)] bg-[var(--surface-active)] transition-colors"
                    >
                      {name}
                    </Link>
                  ) : (
                    <Link
                      key={path}
                      href={path}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-md px-3 py-2.5 text-base font-medium text-[var(--text-body)] transition-colors"
                    >
                      {name}
                    </Link>
                  )
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 px-3 text-sm font-medium">
                <Link
                  href={toggleLangPath(pathName, "en")}
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    lang === "en" ? "text-[var(--text-strong)]" : "text-[var(--text-subtle)]"
                  }
                >
                  EN
                </Link>
                <span className="text-[var(--text-subtle)]">/</span>
                <Link
                  href={toggleLangPath(pathName, "ja")}
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    lang === "ja" ? "text-[var(--text-strong)]" : "text-[var(--text-subtle)]"
                  }
                >
                  日本語
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href={lang === "ja" ? "/ja" : "/"}
            aria-label="Jesse Wei — home"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="Jesse Wei"
              width={28}
              height={28}
              sizes="28px"
              priority
            />
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1" id="nav">
            {Object.entries(navItems).map(([path, { name }]) => {
              return isActivePath(path, pathName) ? (
                <Link
                  key={path}
                  href={path}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--text-strong)] bg-[var(--surface-active)] transition-colors duration-150 ease-[var(--ease-out)]"
                >
                  {name}
                </Link>
              ) : (
                <Link
                  key={path}
                  href={path}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)] transition-colors duration-150 ease-[var(--ease-out)]"
                >
                  {name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <div
            className="flex items-center gap-0.5 pr-1 mr-1 border-r border-[var(--border-subtle)] text-xs font-medium"
            aria-label="Language"
          >
            <Link
              href={toggleLangPath(pathName, "en")}
              aria-current={lang === "en" ? "true" : undefined}
              className={
                lang === "en"
                  ? "px-1.5 py-1 rounded text-[var(--text-strong)]"
                  : "px-1.5 py-1 rounded text-[var(--text-subtle)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)] transition-colors duration-150"
              }
            >
              EN
            </Link>
            <Link
              href={toggleLangPath(pathName, "ja")}
              aria-current={lang === "ja" ? "true" : undefined}
              className={
                lang === "ja"
                  ? "px-1.5 py-1 rounded text-[var(--text-strong)]"
                  : "px-1.5 py-1 rounded text-[var(--text-subtle)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)] transition-colors duration-150"
              }
            >
              日本語
            </Link>
          </div>
          <SearchPalette isLight />
          {headerSocial.map((s) => (
            <Link
              key={s.id}
              target="_blank"
              href={s.href}
              className="px-2 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-active)] transition-colors duration-150 ease-[var(--ease-out)]"
              aria-label={socialLabels[s.id]}
            >
              {icons[s.id]}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
