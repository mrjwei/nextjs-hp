import React from "react"
import { techno } from "app/data/fonts"
import { Writings } from "app/components/writings"
import { Works } from "app/components/works"

export default function Page() {
  return (
    <section className="pb-16">
      <div className="bg-gray-800 text-gray-200 flex flex-col items-center h-screen px-16 pt-28 lg:pt-24 -z-20">
        <h1
          className={`mb-12 text-6xl lg:text-[112px] font-black text-center text-white ${techno.className}`}
        >
          <span className="outlined opacity-50 block text-4xl lg:text-6xl ">
            Bridging
          </span>
          <span className="inline-block relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-6 after:bg-purple-400 after:opacity-80 after:-z-10">
            Creativity <small>&&nbsp;</small>
          </span>
          <span className="inline-block relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-6 after:bg-purple-400 after:opacity-80 after:-z-10">
            Technology
          </span>
          <span className="outlined block whitespace-nowrap text-4xl lg:text-6xl opacity-50 translate-y-3">
            to Craft
          </span>
          <span className="inline-block relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-6 after:bg-purple-400 after:opacity-80 after:-z-10">
            Seamless&nbsp;
          </span>
          <span className="inline-block relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-6 after:bg-purple-400 after:opacity-80 after:-z-10">
            Products
          </span>
        </h1>
        <button type="button" id="scroll-down">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-16 lg:size-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <div className="py-16 px-16 w-full max-w-[1024px] mx-auto">
        <h2 className="text-3xl font-bold mb-8">Latest Writings</h2>
        <Writings numWritings={4} />
      </div>
      <div className="py-16 px-16 w-full max-w-[1024px] mx-auto">
        <h2 className="text-3xl font-bold mb-8">New Artworks</h2>
        <Works numWorks={2} />
      </div>
    </section>
  )
}
