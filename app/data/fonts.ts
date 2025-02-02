import { Kanit, League_Spartan, Open_Sans, Roboto_Slab } from "next/font/google"

export const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
})

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

export const spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
})

export const techno = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
})
