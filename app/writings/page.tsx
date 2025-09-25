import { Grid } from "app/components/grid"
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

  const items = [{label: "All", value: "all", href: "/writings", length: writings.length, shouldBeUppercase: false},...categories.sort((c1, c2) => writings.filter((w) => w.metadata.tags.includes(c2.value)).length - writings.filter((w) => w.metadata.tags.includes(c1.value)).length).map((c) => ({...c, href: `/writings?category=${c.value}`, length: writings.filter((w) => w.metadata.tags.includes(c.value)).length}))]

  return (
    <section className="grid grid-cols-12 gap-8 pt-[48px]">
      <Sidebar items={items} targetValue={category ? category.value : "all"} classname="hidden md:block bg-gray-800 text-white p-8 md:col-span-3 sticky md:top-[48px] h-screen" />
      <div className="col-span-12 px-4 py-8 md:col-span-9 md:pl-0 md:pr-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Writings{category && (category.shouldBeUppercase ? ` - ${category.value.toUpperCase()}` : ` - ${capitalize(category.value)}`)}</h1>
          <p className="text-lg text-gray-600 mb-4">Design, tech, innovation and more.</p>
          <Sidebar items={items} targetValue={category ? category.value : undefined} classname="block md:hidden" />
        </div>
        <Grid writings={writings} category={category} />
      </div>
    </section>
  )
}
