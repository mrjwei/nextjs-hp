import Link from "next/link"
import { TWriting } from "app/components/grid"
import clsx from "clsx"
import { TCategory } from "app/components/sidebar"
import { categories } from "app/data/categories"

export function Sidebar({
  writings,
  activeCategory,
  classname,
}: {
  writings: TWriting[]
  activeCategory?: TCategory
  classname?: string
}) {
  return (
    <aside className={classname}>
      <ul className="flex flex-wrap gap-2 md:block md:gap-0">
        <li>
          <Link
            className={clsx("w-full flex justify-between items-center border-2 border-gray-800 text-gray-800 px-1 py-0.5 hover:bg-gray-800 hover:text-white md:px-4 md:py-2 md:text-white md:hover:bg-gray-600 rounded-lg ease-in-out duration-300",
                {
                  "bg-white md:bg-transparent": activeCategory,
                  "bg-gray-800 text-white md:bg-gray-600": !activeCategory
                }
              )}
            href='/writings'>
            <span className="block font-semibold">All</span>
            <span className="block md:bg-white md:text-gray-800 text-sm font-medium min-w-6 rounded-md text-center">{writings.length}</span>
          </Link>
        </li>
        {categories.sort((c1, c2) => writings.filter((w) => w.metadata.tags.includes(c2.value)).length - writings.filter((w) => w.metadata.tags.includes(c1.value)).length).map((c) => (
          <li>
            <Link
              className={clsx("w-full flex justify-between items-center border-2 border-gray-800 text-gray-800 px-1 py-0.5 hover:bg-gray-800 hover:text-white md:px-4 md:py-2 md:text-white md:hover:bg-gray-600 rounded-lg ease-in-out duration-300",
                {
                  "bg-white md:bg-transparent": activeCategory?.value !== c.value,
                  "bg-gray-800 text-white md:bg-gray-600": activeCategory?.value === c.value
                }
              )}
              href={`/writings?category=${c.value}`}
            >
              <span className="block font-semibold">{c.label}</span>
              <span className="block md:bg-white md:text-gray-800 text-sm font-medium min-w-6 rounded-md text-center">{writings.filter((w) => w.metadata.tags.includes(c.value)).length}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
