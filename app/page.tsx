import { techno } from "app/data/fonts"
import { Writings } from "app/components/writings"
import { Works } from "app/components/works"
import { ScrollAndSnap } from "app/components/scroll-and-snap"
import { MoreButton } from "app/components/more-button"

export default function Page() {
  return (
    <section className="pb-16">
      <ScrollAndSnap>
        <div className="should-snap bg-gray-800 text-gray-200 flex flex-col items-center h-screen px-16 pt-28 lg:pt-24 -z-20">
          <h1
            className={`mb-12 text-6xl lg:text-[112px] font-black text-center text-white ${techno.className}`}
          >
            <span className="outlined opacity-50 block text-4xl lg:text-6xl ">
              Bridging
            </span>
            <span className="inline-block relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-6 after:bg-purple-600 after:-z-10">
              Creativity <small>&&nbsp;</small>
            </span>
            <span className="inline-block relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-6 after:bg-purple-600 after:-z-10">
              Technology
            </span>
            <span className="outlined block whitespace-nowrap text-4xl lg:text-6xl opacity-50 translate-y-3">
              to Craft
            </span>
            <span className="inline-block relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-6 after:bg-purple-600 after:-z-10">
              Seamless&nbsp;
            </span>
            <span className="inline-block relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-6 after:bg-purple-600 after:-z-10">
              Products
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
        <div className="should-snap h-screen px-16 w-full max-w-[1024px] mx-auto pt-24">
          <div className="w-full flex justify-between items-baseline">
            <h2 className="heading text-3xl font-bold mb-8">Latest Writings</h2>
            <MoreButton link="/writings" label="See More">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </MoreButton>
          </div>
          <Writings numWritings={4} className="content" />
        </div>
        <div className="should-snap h-screen px-16 w-full max-w-[1024px] mx-auto pt-24">
          <div className="w-full flex justify-between items-baseline">
            <h2 className="heading text-3xl font-bold mb-8">New Artworks</h2>
            <MoreButton link="/artworks" label="See More">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </MoreButton>
          </div>
          <Works numWorks={2} className="content" />
        </div>
      </ScrollAndSnap>
    </section>
  )
}
