
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",],
	theme: {
		extend: {
			colors: {
				'texto':'#D7DADC',
		'd':'#131515',
		'dd':'#1b2021',
		'ddd':'#2a2f30',
		'lighto':'#9EACBA',
		'darko':'#455570',
        'main':'#f2f1f1',
		'dmain':'#F9DCC4',
        'primary':'#ff755b',
		'fully':'#A594F9',
		'half':'#CDC1FF',
		"color-primary": "#ff4a28",
        "color-danger": "#ff7782",
        "color-moz": "#ffdd09",
        "color-success": "#41f1b6",
        "color-warning": "#ffbb55",
        "color-white": "#fff",
        "color-info-dark": "#7d8da1",
        "color-info-light": "#dce1eb",
        "color-dark": "#363949",
        "color-light": "rgba(132, 139, 200, 0.18)",
        "color-primary-variant": "#111e88",
        "color-dark-variant": "#677483",
        "color-background": "#f6f6f9",
		"backy":"#FBFBFB"
			},
		},
	},
	darkMode: "class",
	plugins: [require('@tailwindcss/forms')],
	plugins: require("flowbite/plugin"),
	plugins: [require("daisyui")],
};