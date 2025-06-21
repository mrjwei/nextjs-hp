import Link from "next/link"

export const MoreButton = ({ link, label, children }) => {
  return (
    <div className="flex justify-end mt-6">
      <Link
        href={link}
        className="more-btn px-4 py-1 inline-flex justify-center transition-colors duration-300 ease-in-out"
      >
        <span className="font-medium mr-2">{label}</span>
        {children}
      </Link>
    </div>
  )
}
