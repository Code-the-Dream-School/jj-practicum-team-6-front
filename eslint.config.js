import eslintPluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        React: "writable",
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: ["@babel/preset-react"] },
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: eslintPluginReact,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
];
