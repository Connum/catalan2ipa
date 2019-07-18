# catalan2ipa

[![dependencies Status](https://david-dm.org/Connum/catalan2ipa/status.svg)](https://david-dm.org/Connum/catalan2ipa) [![devDependencies Status](https://david-dm.org/Connum/catalan2ipa/dev-status.svg)](https://david-dm.org/Connum/catalan2ipa?type=dev) [![License: MIT](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://opensource.org/licenses/LGPL-3.0)  [![npm total downloads](https://img.shields.io/npm/dt/catalan2ipa.svg)](https://www.npmjs.com/package/catalan2ipa)

Converts single-worded input strings of Catalan words to IPA (International Phonetic Alphabet) notation. The result is an object holding three dialectal varieties in its keys: `ca` - Cental Catalan (Català oriental central); `ca-valencia` - Valencian (Valencià); `ca-XB` - Balearic (Balear);

This is basically a port of the **Wiktionary module** [{{ca-IPA}}](https://en.wiktionary.org/wiki/Module:ca-IPA) from Lua to JavaScript. Wiki-related stuff has been scrapped and some options have been added. Further fixes and extensions shall be incorporated into this package and vice versa from this package to the Wiktionary module.

## Installation
`npm install catalan2ipa`

or use the files in `/dist` or from the [releases](https://github.com/Connum/catalan2ipa/releases) for direct in-browser usage.

## Usage and examples
```js
const catalan2ipa = require('catalan2ipa')
// or
import catalan2ipa from 'catalan2ipa'
// or (for usage in a browser environment)
<script src="dist/catalan2ipa.min.js"></script>

// and then it's as simple as
catalan2ipa("Valencià");
// result:
// {
//   "ca": "/bə.lən.siˈa/",
//   "ca-valencia": "/va.len.siˈa/",
//   "ca-XB": "/və.lən.siˈa/"
// }

// supplying options, e.g. replacing the syllable separator "." with "|"
catalan2ipa("Valencià", { syllableMarker: '|' });
// result:
// {
//   "ca": "/bə|lən|siˈa/",
//   "ca-valencia": "/va|len|siˈa/",
//   "ca-XB": "/və|lən|siˈa/"
// }
```

By default, `catalan2ipa` will throw an error when the stressed vowel is ambiguous.
In order to receive the error as an `_error` key in the result object, you can use the option `throwError: false`.
The keys for the different accents will each contain a question mark in this case.
```js
// getting error as "_error" object key instead of throwing an error (see section "Options" below)
catalan2ipa("sec", { throwError: false });
// result:
// {
//   _error: 'The stressed vowel "e" is ambiguous. Please mark it with an acute, grave, or circumflex accent: é, è, or ê.',
//   ca: '?',
//   'ca-valencia': '?',
//   'ca-XB': '?'
// }
```

For more examples, see the tests in `test/index.js`.

### Options
Options can be passed via an object as the second argument of `catalan2ipa()` (see code example above).

| Option Name  | Default | Description |
| ------------- | ------------- | ------------- |
| `syllableMarker`  | `"."`  | The marker to insert between syllables. Use `false` or an empty string to have no marker (except stress markers) between syllables.
| `midVowelHint`  | `null`  | If the pronunciation of the stressed vowel of a word is ambiguous, catalan2ipa will throw an error (or return an `_error` key, depending on the `throwError` option). In that case, you'll need to provide a hint by specifying the vowel with an acute, grave, or circumflex via this option. Possible values: `"e"`, `"é"`, `"è"`, `"o"`, `"ò"`, `"ó"`.
| `throwError` | `true` | Whether to throw an error when the pronunciation of the stressed vowel is ambiguous (see `midVowelHint`). If `false`, the returned object will instead hold an `_error` key with a descriptive message, and the keys for the different accents will each hold a question mark.

## Development Commands
- `npm run clean` - Remove `lib/` and `build/temp` directories
- `npm test` - Run tests in `test/index.js` with linting
- `npm test:only` - Run tests in `test/index.js` without linting
- `npm test:prod` - Run tests with minified code
- `npm test:dist-only` - Run tests in `test/dist.js` (testing the files in lib/ and dist/)
- `npm test:all` - Lint and run `test:only` and `test:dist-only`
- `npm test:watch` - Re-run tests on file changes
- `npm run lint` - Run ESlint with airbnb-config
- `npm run lint-fix` - Run `lint` with the `--fix` argument
- `npm run build` - Babel will transpile ES6 to ES5 and minify the code, Browserify will create a bundle in `dist/` for in-browser usage and run uglifyify for even smaller file size
- `npm run dist` - Bundle dist files only
- `npm run prepublishOnly` - Hook for npm. Do all the checks before publishing the module.

## Future Outlook

> **Pull Requests are welcome!**

The goal is to merge fixes and features back to the Wiktionary module and vice versa, as time and consent of future contributors to the module (as well as this package's main author's barely-there knowledge of Lua) allows. These are some ideas for future development:

* Internal dictionary of words with ambiguous stressed vowels using the respective `midVowelHint` option automatically, instead of failing with an error or exception
* Support for whole sentences instead of single words only (incorporating how adjacent words influence each other)
* More tweaking via options to allow for variants in the IPA transcription, e.g. syllable ending in "ɱ" instead of "m" if the next syllable begins with f or v.

## Acknowledgements

The package structure is partially based on
[flexdinesh/npm-module-boilerplate](https://github.com/flexdinesh/npm-module-boilerplate), MIT © Dinesh Pandiyan
but has been expanded, rewritten and updated to the latest dependency versions. But a big thanks goes out to the author for publishing his boilerplate package, from which I learnt to write my first npm packages.

As stated above, the basis of this module is mainly a port of the **Wiktionary module** [{{ca-IPA}}](https://en.wiktionary.org/wiki/Module:ca-IPA), originally licensed as CC BY-SA 3.0. [Permission has been given](https://en.wiktionary.org/wiki/Module_talk:ca-IPA#Porting_and_re-licensing_module_code) by the authors who contributed to the module by 4 July 2019 to publish this package under the current license.

©2015-2018 by the following contributors:
* [Vicenç Riullop (en.wiktionary.org user Vriullop)](https://en.wiktionary.org/wiki/User:Vriullop)
* [en.wiktionary.org user Erutuon](https://en.wiktionary.org/wiki/User:Erutuon)
* [en.wiktionary.org user JohnC5](https://en.wiktionary.org/wiki/User:JohnC5)
* [en.wiktionary.org user IvanScrooge98](https://en.wiktionary.org/wiki/User:IvanScrooge98)
* [en.wiktionary.org user Rua](https://en.wiktionary.org/wiki/User:Rua)

## License

GNU LGPL 3.0 or later as specified in COPYING and COPYING.LESSER.
