export const runtime = "nodejs"

type Lang = "en" | "ja"

const messages: Record<Lang, Record<
  "subscribed" | "invalidEmail" | "notConfigured" | "subscribeFailed" | "confirmed" | "invalidRequest",
  string
>> = {
  en: {
    subscribed: "Subscribed!",
    invalidEmail: "Please enter a valid email address.",
    notConfigured:
      "Newsletter is not configured on this deployment (missing BUTTONDOWN_USERNAME).",
    subscribeFailed: "Could not subscribe right now. Please try again in a moment.",
    confirmed: "Subscribed! Check your inbox to confirm.",
    invalidRequest: "Invalid request.",
  },
  ja: {
    subscribed: "登録が完了しました！",
    invalidEmail: "有効なメールアドレスを入力してください。",
    notConfigured: "このデプロイではニュースレターが設定されていません。",
    subscribeFailed: "現在登録できませんでした。しばらくしてからもう一度お試しください。",
    confirmed: "登録が完了しました！受信箱で確認メールをご確認ください。",
    invalidRequest: "リクエストが無効です。",
  },
}

function isValidEmail(email: string) {
  // Pragmatic validation: let Buttondown do the heavy lifting.
  if (email.length < 3 || email.length > 320) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  let lang: Lang = "en"

  try {
    const body = (await req.json()) as { email?: unknown; botField?: unknown; lang?: unknown }

    if (body.lang === "ja") lang = "ja"
    const t = messages[lang]

    const email = typeof body.email === "string" ? body.email.trim() : ""
    const botField = typeof body.botField === "string" ? body.botField.trim() : ""

    // Basic bot mitigation (honeypot). Pretend success.
    if (botField) {
      return Response.json({ ok: true, message: t.subscribed }, { status: 200 })
    }

    if (!email || !isValidEmail(email)) {
      return Response.json({ ok: false, message: t.invalidEmail }, { status: 400 })
    }

    const username = process.env.BUTTONDOWN_USERNAME

    if (!username) {
      return Response.json({ ok: false, message: t.notConfigured }, { status: 500 })
    }

    // Public embed endpoint (no API key required).
    const endpoint = `https://buttondown.email/api/emails/embed-subscribe/${encodeURIComponent(
      username
    )}`

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email }).toString(),
      redirect: "follow",
      cache: "no-store",
    })

    if (res.status >= 400) {
      // Buttondown often returns HTML for embed flows; keep error generic.
      return Response.json({ ok: false, message: t.subscribeFailed }, { status: 502 })
    }

    return Response.json({ ok: true, message: t.confirmed }, { status: 200 })
  } catch {
    return Response.json({ ok: false, message: messages[lang].invalidRequest }, { status: 400 })
  }
}
