import clsx from "clsx"

export const Filter = ({ label, name, isActive, handleClick }) => {
  return (
    <button
      className={clsx(
        "py-1 px-2 rounded-lg text-sm font-medium text-gray-600 border-2 border-gray-600",
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
