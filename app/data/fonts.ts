import { League_Spartan, Open_Sans, Roboto_Slab } from "next/font/google"

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

export const spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
})

export const techno = Roboto_Slab({
  subsets: ["latin"],
  weight: ["900"],
  style: ["normal"],
  display: "swap",
})
