"use client"
import clsx from "clsx"
import React from "react"

export const BackToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false)

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <button
      type="button"
      id="back-to-top"
      className={clsx(
        "text-gray-300 fixed bottom-8 right-0 xl:right-8 cursor-pointer transition-colors duration-200 ease-in-out hover:text-gray-400",
        {
          block: isVisible,
          hidden: !isVisible,
        }
      )}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-16 lg:size-20"
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}
