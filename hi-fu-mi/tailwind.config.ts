import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                customFadeOut: {
                    "0%": { opacity: "1" },
                    "99%": { opacity: "0" },
                    "100%": { opacity: "0", display: "none" },
                },
                customFlex: {
                    "0%": { flex: "col" },
                    "99%": { flex: "col" },
                    "100%": { flex: "row" },
                },
                customBorder: {
                    "0%": {
                        height: "100%",
                        minHeight: "100vh",
                        borderBottomColor: "#fff",
                        padding: "2.5rem",
                    },
                    "50%": {
                        height: "100%",
                        minHeight: "100vh",
                        borderBottomColor: "#000",
                        padding: "2.5rem",
                    },
                    "51%": {
                        height: "100%",
                        minHeight: "100vh",
                        borderBottomColor: "#000",
                        padding: "2.5rem",
                    },
                    "100%": {
                        height: "50px",
                        minHeight: "0vh",
                        borderBottomColor: "#000",
                        padding: "0.25rem",
                    },
                },
            },
            animation: {
                customFadeOut: "customFadeOut 700ms forwards",
                customFlex: "customFadeOut 700ms forwards",
                customBorder: "customBorder 1400ms forwards",
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                ".w-inherit": {
                    width: "inherit",
                },
            };
            addUtilities(newUtilities, ["responsive", "hover"]);
        },
    ],
};
export default config;
