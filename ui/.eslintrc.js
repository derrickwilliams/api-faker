module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    "d3": true,
    "$": true,
    "__HOST__": true,
    "__DEV__": true,
  },
  parser: "babel-eslint",
  rules: {
    quotes: [2, "double", {"allowTemplateLiterals": true}],
    strict: [2, "never"],
    indent: [2, 2, {"SwitchCase": 1}],
    "comma-dangle": [2, "always-multiline"],
    "react/jsx-boolean-value": [2, "always"],
    "react/jsx-closing-bracket-location": 2,
    "react/jsx-curly-spacing": [2, "always"],
    "react/jsx-equals-spacing": 2,
    "react/jsx-indent": [2, 2],
    "react/jsx-indent-props": [2, 2],
    "react/jsx-key": 2,
    "react/jsx-no-duplicate-props": 2,
    "react/jsx-pascal-case": 2,
    "react/jsx-space-before-closing": 2,
    "react/prefer-stateless-function": 2,
    "react/self-closing-comp": [2, {
      html: true,
      component: true,
    }],
    "react/sort-comp": [0, {
      order: [
        "static-methods",
        "lifecycle",
        "everything-else",
        "rendering",
      ],
      groups: {
        rendering: [
          "/^render.+$/",
          "render",
        ],
      },
    }],
    "react/wrap-multilines": 2,
  },
  plugins: [
    "react",
  ],
  extends: ["eslint:recommended", "plugin:react/recommended"],
}
