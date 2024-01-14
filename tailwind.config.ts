/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
    './public/assets/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        siteblack: '#131519',
        siteDimBlack: '#191d23',
        siteViolet: '#7f46f0',
        siteWhite: '#9eacc7',
      },
      backgroundImage: {
        astral: "url('/assets/background/astral.jpg')",
        saiman: "url('/assets/background/saiman.jpg')",
        eoaalien: "url('/assets/background/eoaalien.jpg')",
        panight: "url('/assets/background/panight.jpg')",
        heroImg: "url('/assets/background/hero-img.jpg')",
        landing: "url('/assets/background/landing.jpg')",
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
    },
    plugins: [],
  },
};
