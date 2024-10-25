/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                red: "#B0211E",
                lightRed: "#e58a89",
                gray: "#414040",
                yellow: "#FEFAEF",
                blue: "#000F55",
                lightGray: "#FFFFFF",
                mediumGray: "",
            },
            fontSize: {
                '2xs': ['10px', '14px'],
                xs: ['12px', '16px'],
                sm: ['14px', '20px'],
                base: ['16px', '24px'],
                lg: ['20px', '28px'],
                xl: ['24px', '32px'],
            },
            aspectRatio: {
                '25/35': '25/35',
                '108/64': '108/64',
            },
            backgroundImage: {
                sheet: "url('./background.jpg')",
                cardLayoutFront: "url(./card_layout_front.png)",
                cardLayoutBack: "url(./card_layout_back.png)",
                topSheet: "url('./top_sheet.png')",
                bottomSheet: "url('./bottom_sheet.png')",
                redBorder: "url('./border-red.png')",
                redBorderSimple: "url('./simple-border-red.png')",
                redBorderSimpleBg: "url('./simple-border-red.png')",
                redBorderSimpleSm: "url('./simple-border-red-sm.png')",
                doubleLine: "url('./double-line.png')",
                line: "url('./line.png')",
                check: "url('./check.png')",
                oneRing: "url('./TheOneRing_Tower_small.jpg')"
            },
        },
        fontFamily: {
            serif: ["serif"],
            sansserif: ["sans-serif"],
            UncialAntiqua: ["Uncial Antiqua", "serif"],
        },
        borderWidth: {
            DEFAULT: "1px",
            0: "0",
            2: "2px",
            3: "3px",
            4: "4px",
            6: "6px",
            8: "8px",
            18: "18px",
            56: "56px",
            80: "80px",
        },
    },
    plugins: [],
};
