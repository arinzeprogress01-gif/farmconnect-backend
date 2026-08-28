import js from "@eslint/js";

export default [
    {
        ignores: [
            "node_modules/",
            "uploads/",
            "public/",
            "src/Images/",
            "CI-CD/"
        ],
    },

    js.configs.recommended,

    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                fetch: "readonly",
                URLSearchParams: "readonly",
            },
        },

        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
        },
    },
];