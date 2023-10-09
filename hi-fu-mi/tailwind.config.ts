import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/api/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                customFadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
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
                scalePulse: {
                    "0%, 10%, 100%": { transform: "scale(1)" },
                    "5%": { transform: "scale(1.2)" },
                },
                slideInFromLeft: {
                    "0%, 100%": { transform: "translateX(-100%)" },
                    "5%, 95%": { transform: "translateX(0%)" },
                },
                slideInFromRight: {
                    "0%, 100%": { transform: "translateX(100%)" },
                    "5%, 95%": { transform: "translateX(0%)" },
                },
                scoreDisplay: {
                    "0%, 100%": { transform: "scale(0)" },
                    "15%, 85%": { transform: "scale(1)" },
                },
                finalScore: {
                    "0%": { transform: "scale(0)" },
                    "100%": { transform: "scale(1)" },
                },
            },
            animation: {
                customFadeIn: "customFadeIn 500ms 500ms forwards",
                customBorder: "customBorder 500ms forwards",
                "scalePulse-0": "scalePulse 3s infinite",
                "scalePulse-500": "scalePulse 3s 0.3s infinite",
                "scalePulse-1000": "scalePulse 3s 0.6s infinite",
                slideInFromLeft: "slideInFromLeft 5s ease-in-out forwards",
                slideInFromRight: "slideInFromRight 5s ease-in-out forwards",
                scoreDisplay: "scoreDisplay 5s ease-in-out forwards",
                finalScore: "finalScore 2s ease-in-out forwards",
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
