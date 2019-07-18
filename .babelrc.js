let config = {
  "env": {
    "development": {
      "presets": ["@babel/preset-env"],
      "comments": true,
      "shouldPrintComment": (val) => {
        return true;
      },
      "plugins": [
        "add-module-exports",
        "@babel/plugin-transform-object-assign"
      ]
    },
    "dist": {
      "presets": ["@babel/preset-env"],
      "comments": true,
      "shouldPrintComment": (val) => {
        return !/This file is part of catalan2ipa\./.test(val);
      },
      "plugins": [
        "add-module-exports",
        "@babel/plugin-transform-object-assign"
      ]
    },
    "production": {
      "presets": ["@babel/preset-env", ["minify", {
        "builtIns": false,
        "mangle": { "topLevel": true },
        "regexpConstructors": false,
        "evaluate": false
      }]],
      "comments": false,
      "plugins": [
        "add-module-exports",
        "@babel/plugin-transform-object-assign"
      ]
    }
  }
};

module.exports = config;
