/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'primary': '#0a47c2',
                'accent-orange': '#f58220',
                'background-light': '#f5f6f8',
                'background-dark': '#101622',
                // University of Greenwich Brand Colors
                'greenwich': {
                    'navy': '#003B5C',
                    'blue': '#00A3E0',
                    'gold': '#FFB81C',
                    'green': '#00A651',
                    'gray': '#F5F5F5',
                },
            },
            fontFamily: {
                'display': ['Inter', 'Lexend', 'sans-serif'],
                'greenwich': ['Montserrat', 'Open Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
