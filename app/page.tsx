import { ArrowRightIcon } from "@heroicons/react/24/outline"
import {OutlinedButton} from 'app/components/outlined-button'
import { techno } from "app/data/fonts"
import { Grid } from "app/components/grid"
import { Works } from "app/components/works"
import { ScrollAndSnap } from "app/components/scroll-and-snap"
import {getAllSortedWritings} from 'app/utils'

export default function Page() {
  const writings = getAllSortedWritings()
  return (
    <section className="pb-16">
      <ScrollAndSnap>
        <div className="should-snap bg-[url(/bg.jpg)] bg-cover text-gray-200 flex flex-col items-center h-screen px-16 pt-28 md:pt-32 xl:pt-48 -z-20">
          <h1
            className={`mb-8 md:mb-12 text-6xl lg:text-7xl xl:text-[100px] font-black text-center text-white ${techno.className}`}
          >
            <span className="block relative z-10">Designing With Intent.</span>
            <span className="block relative z-10 mb-4 xl:mb-8">
              Building With Clarity.
            </span>
            <span className="block relative z-10 text-lg leading-tight md:text-2xl">
              Exploring the space where form and function co-exist.
            </span>
          </h1>
          <button
            type="button"
            id="scroll-down"
            className="cursor-pointer hover:animate-vibrate text-white opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out"
          >
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
        <div className="should-snap lg:h-screen px-8 md:px-16 w-full max-w-[1024px] mx-auto pt-24">
          <h2 className="heading text-2xl md:text-3xl font-bold mb-8 z-50">
            Latest Writings
          </h2>
          <Grid writings={writings} numWritings={4} className="content" />
          <div className="flex justify-end">
            <OutlinedButton
              link='/writings'
              className="more-btn relative z-0 mt-6"
            >
              <span className="block z-30">See More</span>
              <ArrowRightIcon className="w-5 ml-2 arrow" />
            </OutlinedButton>
          </div>
        </div>
        <div className="should-snap lg:min-h-screen px-8 md:px-16 w-full max-w-[1024px] mx-auto pt-24">
          <h2 className="heading text-2xl md:text-3xl font-bold mb-8 z-50">
            New Artworks
          </h2>
          <Works numWorks={4} className="content" />
          <div className="flex justify-end">
            <OutlinedButton
              link='/artworks'
              className="more-btn relative z-0 mt-6"
            >
              <span className="block z-30">See More</span>
              <ArrowRightIcon className="w-5 ml-2 arrow" />
            </OutlinedButton>
          </div>
        </div>
      </ScrollAndSnap>
    </section>
  )
}
