module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
    parser: "vue-eslint-parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        parser: "@typescript-eslint/parser",
        vueFeatures: {
            filter: true,
            interpolationAsNonHTML: false,
        },
    },
    plugins: ["vue", "@typescript-eslint", "prettier"],
    rules: {
        "no-shadow": "error",
        "no-unused-vars": [
            "warn",
            {args: "after-used", ignoreRestSiblings: true},
        ],
        "prettier/prettier": "off",
        semi: [2, "always"],
        "vue/html-closing-bracket-spacing": [
            2,
            {
                selfClosingTag: "always",
            },
        ],
        "vue/html-indent": ["error", 4, {}],
        "vue/max-attributes-per-line": [
            2,
            {
                singleline: {
                    max: 2,
                },
                multiline: {
                    max: 1,
                },
            },
        ],
        "vue/multi-word-component-names": "off",
        "vue/object-curly-spacing": [2, "always"],
        "vue/script-indent": ["error", 4, {}],
    },
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                indent: "off",
            },
        },
    ],
};
