/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./sidebar.html","./sidebar-src/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@githubocto/tailwind-vscode")],
};

