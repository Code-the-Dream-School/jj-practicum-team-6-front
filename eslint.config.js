// import eslintPluginReact from 'eslint-plugin-react';

// export default [
//   {
//     files: ['**/*.{js,jsx,ts,tsx}'],
//     languageOptions: {
//       ecmaVersion: 2021,
//       sourceType: 'module',
//       globals: {
//         React: 'writable',
//       },
//     },
//     plugins: {
//       react: eslintPluginReact,
//     },
//     rules: {
//       'react/react-in-jsx-scope': 'off',
//       'react/prop-types': 'off',
//     },
//   },
// ];

// ---------------------------------------

import eslintPluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        React: "writable",
      },
      parserOptions: {
        requireConfigFile: false, // allows babel parser without a full babel config
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
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
