import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import {OutlinedButton} from 'app/components/outlined-button';

export const PrevNext = ({ items, itemIndex, path }) => {
  let oldIndex = itemIndex + 1
  let newIndex = itemIndex - 1

  const oldItem = items[oldIndex]
  const newItem = items[newIndex]

  return (
    <div className="flex justify-between mt-8">
      {/**
       * New writings come before old ones,
       * so swapping old & next links to reflect this ordering
       */}
      <OutlinedButton
        link={itemIndex === items.length - 1 ? '' : `/${path}/${oldItem.slug}`}
        className={{
          "!border-gray-400 text-gray-400 disable-transform": itemIndex === items.length - 1
        }}
      >
        <ArrowLeftIcon className="w-5 mr-2 z-50" />
        <span className="block z-50">Prev</span>
      </OutlinedButton>
      <OutlinedButton
        link={itemIndex === 0 ? '' : `/${path}/${newItem.slug}`}
        className={{
          "!border-gray-400 text-gray-400 disable-transform": itemIndex === 0
        }}
      >
        <span className="block z-50">Next</span>
        <ArrowRightIcon className="w-5 ml-2 z-50" />
      </OutlinedButton>
    </div>
  )
}
