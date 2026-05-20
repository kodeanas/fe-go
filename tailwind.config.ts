import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(main)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(main)/(masterdata)/**/*.{js,ts,jsx,tsx,mdx}",
  ],
}

export default config
