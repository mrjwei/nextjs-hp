import { FilterWritings } from "app/components/filter-writings"
import { getAllSortedWritings } from "app/utils"
import { Sidebar, TCategory } from "app/components/sidebar"
import {capitalize} from 'app/utils'
import {categories} from 'app/data/categories'

export const metadata = {
  title: "Writings | Jesse Wei",
  description: "My blog posts, tutorials and more.",
}

export default async function Page({searchParams}) {
  const writings = getAllSortedWritings()
  const categoryValue = searchParams?.category
  const category: TCategory | undefined = categoryValue ? categories.find(c => c.value === categoryValue) : undefined

  return (
    <section className="grid grid-cols-12 gap-8 pt-[56px]">
      <Sidebar writings={writings} activeCategory={category} classname="hidden md:block bg-gray-800 text-white px-4 py-8 md:col-span-3 sticky md:top-[56px] h-screen" />
      <div className="col-span-12 px-4 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Writings{category && (category.shouldBeUppercase ? ` - ${category.value.toUpperCase()}` : ` - ${capitalize(category.value)}`)}</h1>
          <p className="text-gray-600 mb-4">My blog posts, tutorials, and more.</p>
          <Sidebar writings={writings} activeCategory={category} classname="block md:hidden" />
        </div>
        <FilterWritings writings={writings} category={category?.value} />
      </div>
    </section>
  )
}
