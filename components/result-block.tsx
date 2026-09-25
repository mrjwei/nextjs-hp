import type { ReactNode } from "react"
import type { TMetadata } from "app/utils"
import type { Lang } from "app/i18n/config"

const copy: Record<
  Lang,
  {
    role: string
    client: string
    industry: string
    duration: string
    stack: string
    confidential: string
  }
> = {
  en: {
    role: "Role",
    client: "Client",
    industry: "Industry",
    duration: "Duration",
    stack: "Stack",
    confidential: "Details anonymised at the client's request.",
  },
  ja: {
    role: "役割",
    client: "クライアント",
    industry: "業界",
    duration: "期間",
    stack: "スタック",
    confidential: "クライアントの意向により詳細は匿名化しています。",
  },
}

export function ResultBlock({
  metadata,
  lang = "en",
}: {
  metadata: TMetadata
  lang?: Lang
}) {
  const t = copy[lang]
  const { result, role, client, industry, duration, stack, confidential } =
    metadata

  if (!result) return null

  const fields: Array<{ label: string; value: ReactNode }> = []
  if (role) fields.push({ label: t.role, value: role })
  if (client) fields.push({ label: t.client, value: client })
  if (industry) fields.push({ label: t.industry, value: industry })
  if (duration) fields.push({ label: t.duration, value: duration })
  if (stack?.length) {
    fields.push({
      label: t.stack,
      value: (
        <span className="flex flex-wrap gap-1.5">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2 py-0.5 text-xs font-medium text-[var(--text-body)]"
            >
              {item}
            </span>
          ))}
        </span>
      ),
    })
  }

  return (
    <div className="mb-10 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-sunken)] p-6 md:p-8">
      <p className="display text-2xl leading-snug text-[var(--text-strong)] md:text-[1.5rem]">
        {result}
      </p>
      {confidential && (
        <p className="mt-3 text-sm italic text-[var(--text-subtle)]">
          {t.confidential}
        </p>
      )}
      {fields.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--border-subtle)] pt-6 sm:grid-cols-3">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="eyebrow mb-1">{field.label}</dt>
              <dd className="text-sm font-medium text-[var(--text-strong)]">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
