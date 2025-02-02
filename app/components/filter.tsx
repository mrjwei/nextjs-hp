import clsx from "clsx"

export const Filter = ({ label, name, isActive, handleClick }) => {
  return (
    <button
      className={clsx(
        "py-1 px-4 min-w-[64px] rounded-full text-gray-600 border-2 border-gray-600",
        {
          "border-gray-800 bg-gray-800 text-white": isActive,
        }
      )}
      type="button"
      name={name}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}
