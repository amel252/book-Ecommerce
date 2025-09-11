// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// /** @type {import('tailwindcss').Config} */
// export default {
//     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//     theme: {
//         extend: {
//             colors: {
//                 primary: "#1d4ed8",
//                 secondary: "#9333ea",
//             },
//         },
//     },
//     plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", // assure-toi que tes composants sont inclus
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1d4ed8",
                secondary: "#9333ea",
            },
        },
    },
    plugins: [],
};
