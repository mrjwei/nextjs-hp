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
  "/artworks": {
    name: "Artworks",
  },
  "/about": {
    name: "About",
  },
}

export function Header({ className }: { className?: string }) {
  const pathName = usePathname()
  const [isLight, setIsLight] = React.useState(true)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const headerRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    if (pathName !== "/") {
      setIsLight(true)
      return
    }
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > screen.height - headerRef.current.clientHeight) {
          setIsLight(true)
        } else {
          setIsLight(false)
        }
      }
    }
    if (
      headerRef.current &&
      window.scrollY > screen.height - headerRef.current.clientHeight
    ) {
      setIsLight(true)
    } else {
      setIsLight(false)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pathName])

  const handleMenuButtonClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <aside
      ref={headerRef}
      className={clsx(
        "w-full fixed top-0 left-0 flex flex-col items-center bg-gray-800 transition-shadow duration-200 ease-in-out z-50",
        {
          "bg-white shadow-md": isLight,
        },
        className
      )}
    >
      <div className="w-full h-[56px] lg:max-w-[1024px] px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <button
            type="button"
            className={clsx("mr-4 transition-all block md:hidden", {
              "text-gray-600 hover:text-gray-800": isLight,
              "text-white": !isLight,
            })}
            onClick={handleMenuButtonClick}
          >
            <Bars3Icon className="w-8" />
          </button>
          {isMenuOpen && (
            <nav
              className="bg-gray-800 shadow-md absolute w-full top-full left-0 h-screen"
              id="nav"
              onClick={handleMenuButtonClick}
            >
              {Object.entries(navItems).map(([path, { name }]) => {
                return (
                  <Link
                    key={path}
                    href={path}
                    className={clsx(
                      `transition-all text-white flex align-middle relative text-lg p-5`
                    )}
                  >
                    {name}
                  </Link>
                )
              })}
            </nav>
          )}
          <Link href="/" aria-label="home" className="mr-4">
            <Image
              src={isLight ? "/logo.svg" : "/logo-light.svg"}
              alt="Jesse Wei's Logo"
              width={32}
              height={32}
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
                    `transition-all text-gray-300 flex align-middle relative py-1 px-2 m-1 ${openSans.className}`,
                    {
                      "text-gray-600 hover:text-gray-800": isLight,
                    }
                  )}
                >
                  {name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center">
          <Link
            target="_blank"
            href="https://www.linkedin.com/in/jesse-wei-profile/"
            className={clsx(
              "px-2 m-1 text-gray-300 hover:text-gray-400 transition-colors duration-200 ease-in-out",
              {
                "text-gray-400 hover:text-gray-600": isLight,
              }
            )}
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
              "px-2 m-1 text-gray-300 hover:text-gray-400 transition-colors duration-200 ease-in-out",
              {
                "text-gray-400 hover:text-gray-600": isLight,
              }
            )}
          >
            {icons.github}
          </Link>
          <Link
            target="_blank"
            href="https://www.instagram.com/mrjwei/"
            className={clsx(
              "px-2 m-1 text-gray-300 hover:text-gray-400 transition-colors duration-200 ease-in-out",
              {
                "text-gray-400 hover:text-gray-600": isLight,
              }
            )}
          >
            {icons.instagram}
          </Link>
        </div>
      </div>
    </aside>
  )
}
