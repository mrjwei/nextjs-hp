import Link from "next/link"

export const MoreButton = ({ link, label, children }) => {
  return (
    <Link
      href={link}
      className="more-btn border-2 rounded-full px-4 py-1 border-gray-800 flex items-center hover:bg-gray-800 hover:text-white transition-colors duration-300 ease-in-out"
    >
      <span className="font-medium mr-2">{label}</span>
      {children}
    </Link>
  )
}
