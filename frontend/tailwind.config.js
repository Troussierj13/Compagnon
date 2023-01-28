/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
        fontFamily: {
            serif: ['serif'],
            sansserif: ['sans-serif'],
            UncialAntiqua: ['Uncial Antiqua', 'serif'],
        },
        colors: {
            red: '#B0211E',
            gray: '#414040',
            yellow: '#FEFAEF',
            blue: '#000F55',
        },
        backgroundImage: {
            sheet: "url('./background.jpg')",
            redBorder: "url('./border-red.png')",
            redBorderSimple: "url('./simple-border-red.png')",
            redBorderSimpleSm: "url('./simple-border-red-sm.png')",
            doubleLine: "url('./double-line.png')",
            line: "url('./line.png')",
            check: "url('./check.png')"
        },
    },
    plugins: [],
};
