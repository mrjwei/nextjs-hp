export const runtime = "nodejs"

function isValidEmail(email: string) {
  // Pragmatic validation: let Buttondown do the heavy lifting.
  if (email.length < 3 || email.length > 320) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: unknown; botField?: unknown }

    const email = typeof body.email === "string" ? body.email.trim() : ""
    const botField = typeof body.botField === "string" ? body.botField.trim() : ""

    // Basic bot mitigation (honeypot). Pretend success.
    if (botField) {
      return Response.json({ ok: true, message: "Subscribed!" }, { status: 200 })
    }

    if (!email || !isValidEmail(email)) {
      return Response.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const username = process.env.BUTTONDOWN_USERNAME

    if (!username) {
      return Response.json(
        {
          ok: false,
          message:
            "Newsletter is not configured on this deployment (missing BUTTONDOWN_USERNAME).",
        },
        { status: 500 }
      )
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
      return Response.json(
        {
          ok: false,
          message:
            "Could not subscribe right now. Please try again in a moment.",
        },
        { status: 502 }
      )
    }

    return Response.json(
      { ok: true, message: "Subscribed! Check your inbox to confirm." },
      { status: 200 }
    )
  } catch {
    return Response.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    )
  }
}
