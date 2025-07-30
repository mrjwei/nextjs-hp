"use client"

import React from "react"

export const ScrollAndSnap = ({ children }) => {
  React.useEffect(() => {
    const sections = document.querySelectorAll(".should-snap")
    const firstSection = sections[1]
    const scrollDownBtn = document.getElementById("scroll-down")

    const handleClick = () => {
      firstSection.scrollIntoView({ behavior: "smooth", block: "start" })
      firstSection.querySelector(".heading")?.classList.add("visible")
      firstSection.querySelector(".content")?.classList.add("visible")
    }

    scrollDownBtn?.addEventListener("click", handleClick)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if ((entry.target as HTMLElement).scrollHeight > window.innerHeight) {
            ;(entry.target as HTMLElement).style.scrollSnapAlign = "none"
          } else {
            ;(entry.target as HTMLElement).style.scrollSnapAlign = "start"
          }
          if (entry.isIntersecting) {
            entry.target.scrollIntoView({ behavior: "smooth", block: "start" })
            entry.target.querySelector(".heading")?.classList.add("visible")
            entry.target.querySelector(".content")?.classList.add("visible")
            entry.target.querySelector(".more-btn")?.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )
    sections.forEach((section) => observer.observe(section))

    return () => {
      scrollDownBtn?.removeEventListener("click", handleClick)
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])
  return <>{children}</>
}
