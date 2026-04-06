# HP for Jesse Wei

## Newsletter (Buttondown)

This site includes a newsletter signup form in the footer that subscribes users via Buttondown.

### Setup

- Create a `.env.local` file and set `BUTTONDOWN_USERNAME` (see `.env.example`).
- Run `npm run dev`.

### How it works

- UI: `app/components/newsletter-form.tsx`
- API proxy: `app/api/newsletter/subscribe/route.ts` (posts to Buttondown's embed subscribe endpoint)
