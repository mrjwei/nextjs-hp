import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import {OutlinedButton} from 'app/components/outlined-button';

export const PrevNext = ({ oldLink, newLink, shouldDisableOld, shouldDisableNew }) => {
  return (
    <div className="flex justify-between mt-8">
      {/**
       * New writings come before old ones,
       * so swapping old & next links to reflect this ordering
       */}
      <OutlinedButton
        link={oldLink}
        className={{
          "!border-gray-400 text-gray-400 disable-transform": shouldDisableOld
        }}
      >
        <ArrowLeftIcon className="w-5 mr-2 z-50" />
        <span className="block z-50">Prev</span>
      </OutlinedButton>
      <OutlinedButton
        link={newLink}
        className={{
          "!border-gray-400 text-gray-400 disable-transform": shouldDisableNew
        }}
      >
        <span className="block z-50">Next</span>
        <ArrowRightIcon className="w-5 ml-2 z-50" />
      </OutlinedButton>
    </div>
  )
}
