"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { WritingCard } from "app/components/article-card"
import { Filter } from "app/components/filter"

export const FilterWritings = ({ writings }) => {
  const [filter, setFilter] = React.useState("all")
  const filteredWritings = useMemo(() => {
    if (filter === "design") {
      return writings.filter((w) => w.metadata.tags.includes("design"))
    } else if (filter === "development") {
      return writings.filter((w) => w.metadata.tags.includes("dev"))
    }
    return writings
  }, [filter])
  return (
    <div>
      <div className="flex gap-4 mb-8">
        <Filter
          label="All"
          name="all"
          isActive={filter === "all"}
          handleClick={(e) => setFilter((e.target as HTMLButtonElement).name)}
        />
        <Filter
          label="Design"
          name="design"
          isActive={filter === "design"}
          handleClick={(e) => setFilter((e.target as HTMLButtonElement).name)}
        />
        <Filter
          label="Development"
          name="development"
          isActive={filter === "development"}
          handleClick={(e) => setFilter((e.target as HTMLButtonElement).name)}
        />
      </div>
      <div>
        <div className="grid grid-cols-12 gap-8">
          {filteredWritings.map((article) => (
            <Link
              key={article.slug}
              className="col-span-12 lg:col-span-6"
              href={`/writings/${article.slug}`}
            >
              <WritingCard article={article} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
