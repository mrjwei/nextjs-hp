export function Tag({label, color}) {
  return (
    <div className="text-xs font-medium px-2 py-0.5 rounded-full flex justify-center" style={{border: `2px solid ${color}`, color}}>
      {label}
    </div>
  )
}
