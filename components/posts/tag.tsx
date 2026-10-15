import Link from "next/link"

export function Tag({
  label,
  color,
  href,
  onClose,
  closeHref,
}: {
  label: string
  color: string
  href?: string
  onClose?: () => void
  closeHref?: string
}) {
  const className =
    "text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
  const style = { border: `2px solid ${color}`, color }

  const CloseControl =
    closeHref ? (
      <Link
        href={closeHref}
        aria-label={`Remove ${label}`}
        className="ml-0.5 leading-none"
      >
        ×
      </Link>
    ) : onClose ? (
      <button
        type="button"
        aria-label={`Remove ${label}`}
        className="ml-0.5 leading-none"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
      >
        ×
      </button>
    ) : null

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        <span>{label}</span>
        {CloseControl}
      </Link>
    )
  }

  return (
    <div className={className} style={style}>
      <span>{label}</span>
      {CloseControl}
    </div>
  )
}
