/*!
 * catalan2ipa v1.0.0 (July 19th 2019)
 * Converts Catalan words to IPA (international phonetic alphabet) notation, with variants for Cental Catalan (Català oriental central), Valencian (Valencià) and Balearic (Balear).
 * 
 * https://github.com/Connum/catalan2ipa#readme
 * 
 * @author  Connum <connum@gmail.com>
 * @license LGPL-3.0+
 * 
 * ©2015-2019 by the following contributors:
 * Vicenç Riullop (en.wiktionary.org user Vriullop)
 * en.wiktionary.org user Erutuon
 * en.wiktionary.org user JohnC5
 * en.wiktionary.org user IvanScrooge98
 * en.wiktionary.org user Rua
 * en.wiktionary.org user Connum
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.catalan2ipa = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = require("./helpers");

/**
 * This file is part of catalan2ipa, ©2015-2019 by the following contributors:
 * Vicenç Riullop (en.wiktionary.org user Vriullop)
 * en.wiktionary.org user Erutuon
 * en.wiktionary.org user JohnC5
 * en.wiktionary.org user IvanScrooge98
 * en.wiktionary.org user Rua
 * en.wiktionary.org user Connum
 *
 * catalan2ipa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * catalan2ipa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with catalan2ipa.  If not, see <https://www.gnu.org/licenses/>.
 */
var accents = {};

accents.ca = function (syllablesIn) {
  var syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress; // Reduction of unstressed vowels a,e

  syllables = (0, _helpers.reductionAE)(syllables); // Final consonant losses

  var _final = syllables[syllables.length - 1].coda;
  _final = _final.replace(/^ɾ(s?)$/g, '$1'); // no loss with hint -rr

  _final = _final.replace(/m[pb]$/g, 'm');
  _final = _final.replace(/([ln])[td]$/g, '$1');
  _final = _final.replace(/[nŋ][kɡ]$/g, 'ŋ');
  syllables[syllables.length - 1].coda = _final;

  for (var i = 0; i < syllables.length; i++) {
    var current = syllables[i];
    var previous = syllables[i - 1]; // Reduction of unstressed o

    if (current.vowel === 'o' && !(current.stressed || current.coda === 'w')) {
      current.vowel = current.vowel.replace(/o/g, 'u');
    } // v > b


    current.onset = current.onset.replace(/v/g, 'b');
    current.coda = current.coda.replace(/nb/g, 'mb');

    if (i > 0 && /^b/.test(current.onset)) {
      previous.coda = previous.coda.replace(/n$/, 'm');
    } // allophones of r


    current.coda = current.coda.replace(/ɾ/g, 'r'); // Remove j before palatal obstruents

    current.coda = current.coda.replace(/j([ʃʒ])/g, '$1');
    current.coda = current.coda.replace(/j(t͡ʃ)/g, '$1');
    current.coda = current.coda.replace(/j(d͡ʒ)/g, '$1');

    if (i > 0) {
      if (/^[ʃʒ]/.test(current.onset) || /^t͡ʃ/.test(current.onset) || /^d͡ʒ/.test(current.onset)) {
        previous.coda = previous.coda.replace(/j$/g, '');
      }
    }
  }

  return syllables;
};

accents['ca-valencia'] = function (syllablesIn, options) {
  var syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress;

  for (var i = 0; i < syllables.length; i++) {
    var current = syllables[i];
    var previous = syllables[i - 1]; // Variable mid vowel

    if (i === syllables.stress - 1 && (options.midVowelHint === 'ê' || options.midVowelHint === 'ô')) {
      current.vowel = current.vowel.replace(/ɛ/g, 'e');
      current.vowel = current.vowel.replace(/ɔ/g, 'o');
    } // Fortition of palatal fricatives


    current.onset = current.onset.replace(/ʒ/g, 'd͡ʒ');
    current.onset = current.onset.replace(/d͡d/g, 'd');
    current.coda = current.coda.replace(/ʒ/g, 'd͡ʒ');
    current.coda = current.coda.replace(/d͡d/g, 'd');

    if (i > 0 && previous.vowel === 'i' && previous.coda === '' && current.onset === 'd͡z') {
      current.onset = 'z';
    } else if (i === 0 && current.onset === 'ʃ' || i > 0 && current.onset === 'ʃ' && previous.coda !== '' && previous.coda !== 'j') {
      current.onset = 't͡ʃ';
    } // No palatal gemination ʎʎ > ll or ʎ, in Valencian and Balearic


    if (i > 0 && current.onset === 'ʎ' && previous.coda === 'ʎ') {
      var prevSyll = previous.onset + previous.vowel + previous.coda;

      if (/[bpw]aʎ$/.test(prevSyll) || /[mv]eʎ$/.test(prevSyll) || /tiʎ$/.test(prevSyll) || /m[oɔ]ʎ$/.test(prevSyll) || /uʎ$/.test(prevSyll) && current.vowel === 'a') {
        previous.coda = 'l';
        current.onset = 'l';
      } else {
        previous.coda = '';
      }
    } // Hint -rr only for Central


    if (i === syllables.length - 1) {
      current.coda = current.coda.replace(/r(s?)$/g, 'ɾ$1');
    }
  }

  return syllables;
};

accents['ca-XB'] = function (syllablesIn, options) {
  var syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress; // Reduction of unstressed vowels a,e

  syllables = (0, _helpers.reductionAE)(syllables);

  for (var i = 0; i < syllables.length; i++) {
    var current = syllables[i];
    var previous = syllables[i - 1]; // Reduction of unstressed o per vowel harmony

    if (i > 0 && current.stressed && /[iu]/.test(current.vowel) && !previous.stressed) {
      previous.vowel = previous.vowel.replace(/o/g, 'u');
    } // Stressed schwa


    if (i === syllables.stress - 1 && options.midVowelHint === 'ê') {
      current.vowel = current.vowel.replace(/ɛ/g, 'ə');
    } // Remove j before palatal obstruents


    current.coda = current.coda.replace(/j([ʃʒ])/g, '$1');
    current.coda = current.coda.replace(/j(t͡ʃ)/g, '$1');
    current.coda = current.coda.replace(/j(d͡ʒ)/g, '$1');

    if (i > 0) {
      if (/^[ʃʒ]/.test(current.onset) || /^t͡ʃ/.test(current.onset) || /^d͡ʒ/.test(current.onset)) {
        previous.coda = previous.coda.replace(/j$/g, '');
      }
    } // No palatal gemination ʎʎ > ll or ʎ, in Valencian and Balearic


    if (i > 0 && current.onset === 'ʎ' && previous.coda === 'ʎ') {
      var prevSyll = previous.onset + previous.vowel + previous.coda;

      if (/[bpw]aʎ$/.test(prevSyll) || /[mv]eʎ$/.test(prevSyll) || /tiʎ$/.test(prevSyll) || /m[oɔ]ʎ$/.test(prevSyll) || /uʎ$/.test(prevSyll) && current.vowel === 'a') {
        previous.coda = 'l';
        current.onset = 'l';
      } else {
        previous.coda = '';
      }
    } // Final consonant losses


    if (syllables.length === 1) {
      current.coda = current.coda.replace(/ɾ(s?)$/g, '$1'); // no loss with hint -rr in monosyllables
    } else if (i === syllables.length - 1) {
      current.coda = current.coda.replace(/[rɾ](s?)$/g, '$1'); // including hint -rr
    }
  }

  return syllables;
};

var _default = accents;
exports["default"] = _default;
module.exports = exports.default;
},{"./helpers":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixPrefixes = fixPrefixes;
exports.groupSortAndFormat = groupSortAndFormat;
exports.midVowelE = midVowelE;
exports.midVowelO = midVowelO;
exports.reductionAE = reductionAE;
exports.splitSyllables = splitSyllables;
exports.toIPA = toIPA;
exports["default"] = exports.wordFixes = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * This file is part of catalan2ipa, ©2015-2019 by the following contributors:
 * Vicenç Riullop (en.wiktionary.org user Vriullop)
 * en.wiktionary.org user Erutuon
 * en.wiktionary.org user JohnC5
 * en.wiktionary.org user IvanScrooge98
 * en.wiktionary.org user Rua
 * en.wiktionary.org user Connum
 *
 * catalan2ipa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * catalan2ipa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with catalan2ipa.  If not, see <https://www.gnu.org/licenses/>.
 */
var IPAVowels = {
  a: 'a',
  à: 'a',
  e: 'e',
  è: 'ɛ',
  ê: 'ɛ',
  é: 'e',
  i: 'i',
  í: 'i',
  ï: 'i',
  o: 'o',
  ò: 'ɔ',
  ô: 'ɔ',
  ó: 'o',
  u: 'u',
  ú: 'u',
  ü: 'u'
};
var validOnsets = {
  b: true,
  bl: true,
  br: true,
  c: true,
  cl: true,
  cr: true,
  ç: true,
  d: true,
  dj: true,
  dr: true,
  f: true,
  fl: true,
  fr: true,
  g: true,
  gl: true,
  gr: true,
  gu: true,
  gü: true,
  h: true,
  i: true,
  j: true,
  k: true,
  kl: true,
  kr: true,
  l: true,
  ll: true,
  m: true,
  n: true,
  ny: true,
  ñ: true,
  p: true,
  pl: true,
  pr: true,
  qu: true,
  qü: true,
  r: true,
  rr: true,
  s: true,
  ss: true,
  t: true,
  tg: true,
  tj: true,
  tr: true,
  tx: true,
  tz: true,
  u: true,
  v: true,
  vl: true,
  w: true,
  x: true,
  z: true
};

function fixPrefixes(wordIn) {
  var word = wordIn; // Orthographic fixes for unassimilated prefixes

  var prefix = ['a[eè]ro', 'ànte', '[aà]nti', '[aà]rxi', '[aà]uto', // a- is ambiguous as prefix
  'bi', 'b[ií]li', 'bio', 'c[oò]ntra', // ambiguous co-
  'dia', 'dodeca', '[eé]ntre', 'equi', 'estereo', // ambiguous e-(radic)
  'f[oó]to', 'g[aà]stro', 'gr[eé]co', 'hendeca', 'hepta', 'hexa', 'h[oò]mo', '[ií]nfra', '[ií]ntra', 'm[aà]cro', 'm[ií]cro', 'mono', 'morfo', 'm[uú]lti', 'n[eé]o', 'octo', 'orto', 'penta', 'p[oòô]li', 'pol[ií]tico', 'pr[oòô]to', 'ps[eèê]udo', 'psico', // ambiguous pre-(s), pro-
  'qu[aà]si', 'qu[ií]mio', 'r[aà]dio', // ambiguous re-
  's[eèê]mi', 's[oó]bre', 's[uú]pra', 'termo', 'tetra', 'tri', // ambiguous tele-(r)
  '[uú]ltra', '[uu]n[ií]', 'v[ií]ce'];
  var prefixR = ['[eèéê]xtra', 'pr[eé]'];
  var prefixS = ['antropo', 'centro', 'deca', 'd[ií]no', 'eco', '[eèéê]xtra', 'hetero', 'p[aà]ra', 'post', 'pré', 's[oó]ta', 'tele'];
  var prefixI = ['pr[eé]', 'pr[ií]mo', 'pro', 'tele'];
  var noPrefix = ['autoic', 'autori', 'biret', 'biri', 'bisa', 'bisell', 'bisó', 'biur', 'contrari', 'contrau', 'diari', 'equise', 'heterosi', 'monoi', 'parasa', 'parasit', 'preix', 'psicosi', 'sobrera', 'sobreri']; // False prefixes

  var unprefixed = false;
  noPrefix.forEach(function (pr) {
    if (new RegExp("^".concat(pr)).test(word)) {
      unprefixed = true;
    }
  });

  if (unprefixed) {
    return word;
  } // Double r in prefix + r + vowel


  prefixR.forEach(function (pr) {
    word = word.replace(new RegExp("^(".concat(pr, ")r([a\xE0e\xE8\xE9i\xED\xEFo\xF2\xF3u\xFA\xFC])"), 'g'), '$1rr$2');
  });
  word = word.replace(new RegExp('^eradic', 'g'), 'erradic'); // Double s in prefix + s + vowel

  prefixS.forEach(function (pr) {
    word = word.replace(new RegExp("^(".concat(pr, ")s([a\xE0e\xE8\xE9i\xED\xEFo\xF2\xF3u\xFA\xFC])"), 'g'), '$1ss$2');
  }); // Hiatus in prefix + i

  prefixI.forEach(function (pr) {
    word = word.replace(new RegExp("^(".concat(pr, ")i(.)"), 'g'), '$1ï$2');
  }); // Both prefix + r/s or i/u

  prefix.forEach(function (pr) {
    word = word.replace(new RegExp("^(".concat(pr, ")([rs])([a\xE0e\xE8\xE9i\xED\xEFo\xF2\xF3u\xFA\xFC])"), 'g'), '$1$2$2$3');
    word = word.replace(new RegExp("^(".concat(pr, ")i(.)"), 'g'), '$1ï$2');
    word = word.replace(new RegExp("^(".concat(pr, ")u(.)"), 'g'), '$1ü$2');
  }); // Voiced s in prefix roots -fons-, -dins-, -trans-

  word = word.replace(new RegExp('^enfons([aàeèéiíoòóuú])', 'g'), 'enfonz$1');
  word = word.replace(new RegExp('^endins([aàeèéiíoòóuú])', 'g'), 'endinz$1');
  word = word.replace(new RegExp('tr([aà])ns([aàeèéiíoòóuúbdghlmv])', 'g'), 'tr$1nz$2'); // in + ex > ineks/inegz

  word = word.replace(new RegExp('^inex', 'g'), 'inhex');
  return word;
}

function fixY(wordIn) {
  var word = wordIn; // y > vowel i else consonant /j/, except ny

  word = word.replace(/ny/g, 'ñ');
  word = word.replace(/y([^aeiouàèéêíòóôúïü])/g, 'i$1'); // vowel if not next to another vowel

  word = word.replace(/([^aeiouàèéêíòóôúïü·\-.])y/g, '$1i'); // excluding also syllables separators

  return word;
}

function joinSyllables(syllablesIn, options) {
  var syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress;
  syllables.forEach(function (syllIn, i) {
    var syll = syllIn;
    syll = syll.onset + syll.vowel + syll.coda;

    if (i === syllables.stress - 1) {
      // primary stress
      syll = "\u02C8".concat(syll);
    } else if (syllables[i].stressed) {
      // secondary stress
      syll = "\u02CC".concat(syll);
    }

    syllables[i] = syll;
  });
  var syllableMarker = options.syllableMarker ? options.syllableMarker : '';
  var ipaString = syllables.join(syllableMarker);

  if (syllableMarker) {
    ipaString = ipaString.replace(new RegExp("".concat(syllableMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "([\u02C8\u02CC])"), 'g'), '$1');
  }

  return "/".concat(ipaString, "/").replace(/^\/(\?)\/$/, '$1');
}

function postprocessGeneral(syllablesIn) {
  var syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress;
  var voiced = {
    b: true,
    d: true,
    ɡ: true,
    m: true,
    n: true,
    ɲ: true,
    l: true,
    ʎ: true,
    r: true,
    ɾ: true,
    v: true,
    z: true,
    ʒ: true
  };
  var voiceless = {
    p: true,
    t: true,
    k: true,
    f: true,
    s: true,
    ʃ: true,
    '': true
  };
  var voicing = {
    k: 'ɡ',
    f: 'v',
    p: 'b',
    t: 'd',
    s: 'z'
  };
  var devoicing = {
    b: 'p',
    d: 't',
    ɡ: 'k'
  };

  for (var i = 0; i < syllables.length; i++) {
    var current = syllables[i];
    var previous = syllables[i - 1]; // Coda consonant losses

    if (i < syllables.length - 1 || i === syllables.length - 1 && /s$/.test(current.coda)) {
      current.coda = current.coda.replace(/m[pb]/g, 'm');
      current.coda = current.coda.replace(/([ln])[td]/g, '$1');
      current.coda = current.coda.replace(/n[kɡ]/g, 'ŋ');
    } // Consonant assimilations


    if (i > 0) {
      // t + lateral/nasal assimilation
      var cons = current.onset.match(/^[lʎmn]/);

      if (cons) {
        previous.coda = previous.coda.replace(/t$/g, cons);
      } // n + labial > labialized assimilation


      if (/^[mbp]/.test(current.onset)) {
        previous.coda = previous.coda.replace(/n$/, 'm');
      } else if (/^[fv]/.test(current.onset)) {
        previous.coda = previous.coda.replace(/n$/, 'm'); // strictly ɱ // TODO: enable as alternative, but check if it influences other replacements
        // n + velar > velarized assimilation
      } else if (/^[ɡk]/.test(current.onset)) {
        previous.coda = previous.coda.replace(/n$/, 'ŋ'); // l/n + palatal > palatalized assimilation
      } else if (/^[ʒʎʃɲ]/.test(current.onset) || /^t͡ʃ/.test(current.onset) || /^d͡ʒ/.test(current.onset)) {
        previous.coda = previous.coda.replace(/l$/, 'ʎ');
        previous.coda = previous.coda.replace(/n$/, 'ɲ');
      } // ɡʒ > d͡ʒ


      if (previous.coda === 'ɡ' && current.onset === 'ʒ') {
        previous.coda = '';
        current.onset = 'd͡ʒ';
      }
    }

    current.coda = current.coda.replace(/n[kɡ]/g, 'ŋk');
    current.coda = current.coda.replace(/n([ʃʒ])/g, 'ɲ$1');
    current.coda = current.coda.replace(/n(t͡ʃ)/g, 'ɲ$1');
    current.coda = current.coda.replace(/n(d͡ʒ)/g, 'ɲ$1');
    current.coda = current.coda.replace(/l([ʃʒ])/g, 'ʎ$1');
    current.coda = current.coda.replace(/l(t͡ʃ)/g, 'ʎ$1');
    current.coda = current.coda.replace(/l(d͡ʒ)/g, 'ʎ$1');
    current.coda = current.coda.replace(/ɲs/g, 'ɲʃ'); // Voicing or devoicing

    if (i > 0) {
      var codaLetter = previous.coda.substr(-1);
      var onsetLetter = current.onset.charAt(0);

      if (voiced[onsetLetter] && voicing[codaLetter]) {
        previous.coda = previous.coda.replace(new RegExp("".concat(codaLetter, "$")), voicing[codaLetter]);
      } else if (voiceless[onsetLetter] && devoicing[codaLetter]) {
        previous.coda = previous.coda.replace(new RegExp("".concat(codaLetter, "$")), devoicing[codaLetter]);
      } else {
        previous.coda = previous.coda.replace(/bs/g, 'ps');
        previous.coda = previous.coda.replace(/ds/g, 'ts');
      }
    } // Allophones of r


    if (i === 0) {
      current.onset = current.onset.replace(/^ɾ/, 'r');
    }

    if (i > 0) {
      if (/[lns]$/.test(previous.coda)) {
        current.onset = current.onset.replace(/^ɾ/, 'r');
      }
    } // Double sound of letter x > ks/gz (on cultisms, ambiguous in onsets)


    current.coda = current.coda.replace(/^ʃs?/, 'ks');

    if (i > 0 && previous.coda === 'kz') {
      previous.coda = 'ɡz'; // voicing the group
    }

    if (i > 0 && current.onset === 's') {
      previous.coda = previous.coda.replace(/s$/, ''); // reduction exs, exc(e/i) and sc(e/i)
    }

    if (i > 0 && previous.onset === '' && (previous.vowel === 'e' || previous.vowel === 'ɛ') && (previous.coda === '' && current.onset === 'ʃ' || previous.coda === 'ks' && current.onset === '')) {
      // ex + (h) vowel > egz
      previous.coda = 'ɡ';
      current.onset = 'z';
    }
  } // Final devoicing


  var _final = syllables[syllables.length - 1].coda;
  _final = _final.replace(/d͡ʒ/g, 't͡ʃ');
  _final = _final.replace(/d͡z/g, 't͡s');
  _final = _final.replace(/b/g, 'p');
  _final = _final.replace(/d/g, 't');
  _final = _final.replace(/ɡ/g, 'k');
  _final = _final.replace(/ʒ/g, 'ʃ');
  _final = _final.replace(/v/g, 'f');
  _final = _final.replace(/z/g, 's'); // Final loses

  _final = _final.replace(/j(t͡ʃ)/g, '$1');
  _final = _final.replace(/([ʃs])s/g, '$1'); // homophone plurals -xs, -igs, -çs

  syllables[syllables.length - 1].coda = _final;
  return syllables;
}

function replaceContextFree(consIn) {
  var cons = consIn;
  cons = cons.replace(/ŀ/g, 'l');
  cons = cons.replace(/r/g, 'ɾ');
  cons = cons.replace(/ɾɾ/g, 'r');
  cons = cons.replace(/ss/g, 's');
  cons = cons.replace(/ll/g, 'ʎ');
  cons = cons.replace(/ñ/g, 'ɲ'); // hint ny > ñ

  cons = cons.replace(/[dt]j/g, 'd͡ʒ');
  cons = cons.replace(/tx/g, 't͡ʃ');
  cons = cons.replace(/[dt]z/g, 'd͡z');
  cons = cons.replace(/ç/g, 's');
  cons = cons.replace(/[cq]/g, 'k');
  cons = cons.replace(/h/g, '');
  cons = cons.replace(/g/g, 'ɡ');
  cons = cons.replace(/j/g, 'ʒ');
  cons = cons.replace(/x/g, 'ʃ');
  cons = cons.replace(/i/g, 'j'); // must be after j > ʒ

  cons = cons.replace(/y/g, 'j'); // must be after j > ʒ and fix_y

  cons = cons.replace(/[uü]/g, 'w');
  return cons;
}

function restoreDiaereses(wordIn) {
  var word = wordIn; // Some structural forms do not have diaeresis per diacritic savings,
  // let's restore it to identify hiatus

  word = word.replace(/([iu])um(s?)$/, '$1üm$2'); // Latinisms (-ius is ambiguous but rare)

  word = word.replace(/([aeiou])isme(s?)$/, '$1ísme$2'); // suffix -isme

  word = word.replace(/([aeiou])ist([ae]s?)$/, '$1íst$2'); // suffix -ista

  word = word.replace(/([aeou])ir$/, '$1ír'); // verbs -ir

  word = word.replace(/([aeou])int$/, '$1ínt'); // present participle

  word = word.replace(/([aeo])ir([éà])$/, '$1ïr$2'); // future

  word = word.replace(/([^gq]u)ir([éà])$/, '$1ïr$2');
  word = word.replace(/([aeo])iràs$/, '$1ïràs');
  word = word.replace(/([^gq]u)iràs$/, '$1ïràs');
  word = word.replace(/([aeo])ir(e[mu])$/, '$1ïr$2');
  word = word.replace(/([^gq]u)ir(e[mu])$/, '$1ïr$2');
  word = word.replace(/([aeo])iran$/, '$1ïran');
  word = word.replace(/([^gq]u)iran$/, '$1ïran');
  word = word.replace(/([aeo])iria$/, '$1ïria'); // conditional

  word = word.replace(/([^gq]u)iria$/, '$1ïria');
  word = word.replace(/([aeo])ir(ie[sn])$/, '$1ïr$2');
  word = word.replace(/([^gq]u)ir(ie[sn])$/, '$1ïr$2');
  return word;
}

function splitVowels(vowelsIn) {
  var vowels = vowelsIn;
  var syllables = [{
    onset: '',
    vowel: vowels.charAt(0),
    coda: ''
  }];
  vowels = vowels.substr(1);

  while (vowels !== '') {
    var syll = {
      onset: '',
      vowel: '',
      coda: ''
    };

    var _ref = vowels.match(/^([iu]?)(.)(.*?)$/) || ['', '', '', ''];

    var _ref2 = _slicedToArray(_ref, 4);

    syll.onset = _ref2[1];
    syll.vowel = _ref2[2];
    vowels = _ref2[3];
    syllables.push(syll);
  }

  var count = syllables.length;

  if (count >= 2 && (syllables[count - 1].vowel === 'i' || syllables[count - 1].vowel === 'u')) {
    syllables[count - 2].coda = syllables[count - 1].vowel;
    delete syllables[count - 1];
  }

  return syllables;
}

function groupSortAndFormat(accents, syllables, options) {
  // Despite keeping the name, the grouping part from Wiktionary has
  // actually been omitted, so all variants are always included in the output.
  // This might get added back as an option.
  var out = {};
  Object.keys(accents).forEach(function (accent) {
    var ipa = joinSyllables(accents[accent](syllables, options), options);
    out[accent] = ipa;
  });
  return out;
}

function midVowelE(syllables) {
  // most common cases, other ones are supposed ambiguous
  var postConsonants = syllables[syllables.stress - 1].coda;
  var postVowel = '';
  var postLetters = postConsonants;

  if (syllables.stress === syllables.length - 1) {
    postConsonants += syllables[syllables.length - 1].onset;
    postVowel = syllables[syllables.length - 1].vowel;
    postLetters = postConsonants + postVowel + syllables[syllables.length - 1].coda;
  }

  if (syllables[syllables.stress - 1].vowel === 'e') {
    if (postVowel === 'i' || postVowel === 'u') {
      return 'è';
    }

    if (/^ct[ae]?s?$/.test(postLetters)) {
      return 'è';
    }

    if (postLetters === 'dre' || postLetters === 'dres') {
      return 'é';
    }

    if (/^l/.test(postConsonants) && syllables.stress === syllables.length) {
      return 'è';
    }

    if (postConsonants === 'l' || postConsonants === 'ls' || postConsonants === 'l·l') {
      return 'è';
    }

    if ((postLetters === 'ma' || postLetters === 'mes') && syllables.length > 2) {
      return 'ê';
    }

    if (postLetters === 'ns' || postLetters === 'na' || postLetters === 'nes') {
      // inflection of -è
      return 'ê';
    }

    if (postLetters === 'nse' || postLetters === 'nses') {
      return 'ê';
    }

    if (postLetters === 'nt' || postLetters === 'nts') {
      return 'é';
    }

    if (/^r[ae]?s?$/.test(postLetters)) {
      return 'é';
    }

    if (/^r[dfjlnrstxyz]/.test(postConsonants)) {
      // except bilabial and velar
      return 'è';
    }

    if (postLetters === 'sos' || postLetters === 'sa' || postLetters === 'ses') {
      // inflection of -ès
      return 'ê';
    }

    if (/^t[ae]?s?$/.test(postLetters)) {
      return 'ê';
    }
  } else if (syllables[syllables.stress - 1].vowel === 'è') {
    if (postLetters === 's' || postLetters === '') {
      // -ès, -è
      return 'ê';
    }
  }

  return null;
}

function midVowelO(syllables) {
  // most common cases, other ones are supposed ambiguous
  var postConsonants = syllables[syllables.stress - 1].coda;
  var postVowel = '';
  var postLetters = postConsonants;

  if (syllables.stress === syllables.length - 1) {
    postConsonants += syllables[syllables.length - 1].onset;
    postVowel = syllables[syllables.length - 1].vowel;
    postLetters = postConsonants + postVowel + syllables[syllables.length - 1].coda;
  }

  if (postVowel === 'i' || postVowel === 'u') {
    return 'ò';
  }

  if (postLetters.charAt(0) === 'i' && postLetters.substr(0, 2) !== 'ix') {
    // diphthong oi
    return 'ò';
  }

  if (/^u[^s]/.test(postLetters)) {
    // diphthong ou, ambiguous if final
    return 'ò';
  }

  if (syllables.length === 1 && (postLetters === '' || postLetters === 's' || postLetters === 'ns')) {
    // monosyllable
    return 'ò';
  }

  if (postLetters === 'fa' || postLetters === 'fes') {
    return 'ò';
  }

  if (postConsonants === 'fr') {
    return 'ó';
  }

  if (postLetters === 'ldre') {
    return 'ò';
  }

  if (postLetters === 'ma' || postLetters === 'mes') {
    return 'ó';
  }

  if (postLetters === 'ndre') {
    return 'ò';
  }

  if (/^r[ae]?s?$/.test(postLetters)) {
    return 'ó';
  }

  if (/^r[ft]s?$/.test(postLetters)) {
    return 'ò';
  }

  if (postLetters === 'rme' || postLetters === 'rmes') {
    return 'ó';
  }

  return null;
} // Reduction of unstressed a,e in Central and Balearic (Eastern Catalan)


function reductionAE(syllables) {
  for (var i = 0; i < syllables.length; i++) {
    var current = syllables[i];
    var previous = syllables[i - 1] || {
      onset: '',
      vowel: '',
      coda: ''
    };
    var posterior = syllables[i + 1] || {
      onset: '',
      vowel: '',
      coda: ''
    };
    var preVowelPair = previous.vowel + previous.coda + current.onset + current.vowel;
    var postVowelPair = current.vowel + current.coda + posterior.onset + posterior.vowel;
    var reduction = true;

    if (current.stressed) {
      reduction = false;
    } else if (preVowelPair === 'əe') {
      reduction = false;
    } else if (postVowelPair === 'ea' || postVowelPair === 'eɔ') {
      reduction = false;
    } else if (i < syllables.stress - 1 && postVowelPair === 'ee') {
      posterior.vowel = 'ə';
    } else if (i > syllables.stress && postVowelPair === 'ee') {
      reduction = false;
    } else if (preVowelPair === 'oe' || preVowelPair === 'ɔe') {
      reduction = false;
    }

    if (reduction) {
      current.vowel = current.vowel.replace(/[ae]/g, 'ə');
    }
  }

  return syllables;
}

function splitSyllables(word) {
  var syllables = [];
  var remainder = word;

  while (remainder !== '') {
    var consonants = void 0;
    var vowels = void 0;

    var _remainder$match = remainder.match(/^([^aeiouàèéêíòóôúïü]*)(.*?)$/);

    var _remainder$match2 = _slicedToArray(_remainder$match, 3);

    consonants = _remainder$match2[1];
    remainder = _remainder$match2[2];

    var _remainder$match3 = remainder.match(/^([aeiouàèéêíòóôúïü]*)(.*?)$/);

    var _remainder$match4 = _slicedToArray(_remainder$match3, 3);

    vowels = _remainder$match4[1];
    remainder = _remainder$match4[2];

    if (vowels === '') {
      syllables[syllables.length - 1].coda += consonants;
    } else {
      var onset = consonants;
      var firstVowel = vowels.charAt(0);

      if (/[gq]$/.test(onset) && (firstVowel === 'ü' || firstVowel === 'u' && vowels !== 'u') || (onset === '' || onset === 'h') && syllables.length === 0 && firstVowel === 'i' && vowels !== 'i') {
        onset += vowels.charAt(0);
        vowels = vowels.substr(1);
      }

      var vsyllables = splitVowels(vowels);
      vsyllables[0].onset = onset + vsyllables[0].onset;
      vsyllables.forEach(function (s) {
        syllables.push(s);
      });
    }
  } // Shift over consonants from the onset to the preceding coda,
  // until the syllable onset is valid


  for (var i = 1; i < syllables.length; i++) {
    var current = syllables[i];
    var previous = syllables[i - 1];

    while (!(!current.onset || validOnsets[current.onset])) {
      var letter = current.onset.charAt(0);
      current.onset = current.onset.substr(1);

      if (!/[·\-.]/.test(letter)) {
        // syllables separators
        previous.coda += letter;
      } else {
        break;
      }
    }
  } // Detect stress


  syllables.forEach(function (syllIn, i) {
    var syll = syllIn;

    if (/^[àèéêíòóôú]$/.test(syll.vowel)) {
      syllables.stress = i + 1; // primary stress: the last one stressed

      syll.stressed = true;
    }
  });

  if (!syllables.stress) {
    var count = syllables.length;

    if (count === 1) {
      syllables.stress = 1;
    } else {
      var _final2 = syllables[count - 1];

      if (_final2.coda === '' || _final2.coda === 's' || _final2.coda === 'n' && (_final2.vowel === 'e' || _final2.vowel === 'i')) {
        syllables.stress = count - 1;
      } else {
        syllables.stress = count;
      }
    }

    syllables[syllables.stress - 1].stressed = true;
  }

  return syllables;
}

function toIPA(syllablesIn, options) {
  var syllables = syllablesIn; // Stressed vowel is ambiguous

  if (/[eéèoòó]/.test(syllables[syllables.stress - 1].vowel)) {
    if (options.midVowelHint) {
      syllables[syllables.stress - 1].vowel = options.midVowelHint;
    } else if (syllables[syllables.stress - 1].vowel === 'e' || syllables[syllables.stress - 1].vowel === 'o') {
      var errMsg = "The stressed vowel \"".concat(syllables[syllables.stress - 1].vowel, "\" is ambiguous. Please mark it with an acute, grave, or circumflex accent: ").concat([0x0301, 0x0300, 0x0302].map(function (accent) {
        return syllables[syllables.stress - 1].vowel + String.fromCharCode(accent);
      }).join(', ').replace(/^(.+), /, '$1, or '), ".");

      if (options.throwError) {
        throw new Error(errMsg);
      } else {
        var returnVal = [{
          onset: '',
          vowel: '?',
          coda: ''
        }]; // eslint-disable-next-line no-underscore-dangle

        returnVal._error = errMsg;
        return returnVal;
      }
    }
  }

  var syllablesIPA = [];
  syllablesIPA.stress = syllables.stress;
  syllables.forEach(function (val, key) {
    syllablesIPA[key] = {
      onset: val.onset,
      vowel: val.vowel,
      coda: val.coda,
      stressed: val.stressed || false
    };
  }); // Replace letters with IPA equivalents

  syllablesIPA.forEach(function (syllIn, i) {
    var syll = syllIn; // Voicing of s

    if (syll.onset === 's' && i > 0 && (syllables[i - 1].coda === '' || syllables[i - 1].coda === 'i' || syllables[i - 1].coda === 'u')) {
      syll.onset = 'z';
    }

    if (/^[eèéêií]$/.test(syll.vowel)) {
      syll.onset = syll.onset.replace(/tg$/, 'd͡ʒ');
      syll.onset = syll.onset.replace(/c$/, 's');
      syll.onset = syll.onset.replace(/g$/, 'ʒ');
      syll.onset = syll.onset.replace(/qu$/, 'k');
      syll.onset = syll.onset.replace(/gu$/, 'ɡ');
    }

    syll.coda = syll.coda.replace(/igs?$/, 'id͡ʒ');
    syll.onset = replaceContextFree(syll.onset);
    syll.coda = replaceContextFree(syll.coda);
    syll.vowel = syll.vowel.replace(new RegExp("[".concat(Object.keys(IPAVowels).join(''), "]"), 'g'), function (m) {
      return IPAVowels[m];
    });
  });
  syllablesIPA = postprocessGeneral(syllablesIPA);
  return syllablesIPA;
}

var wordFixes = function wordFixes(wordIn) {
  var word = wordIn;
  word = word.replace(/-([rs]?)/g, '-$1$1');
  word = word.replace(/rç$/g, 'rrs'); // silent r only in plurals -rs

  word = fixPrefixes(word); // internal pause after a prefix

  word = restoreDiaereses(word); // no diaeresis saving

  word = fixY(word); // ny > ñ else y > i vowel or consonant

  return word;
};

exports.wordFixes = wordFixes;
var _default = {};
exports["default"] = _default;
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _accents = _interopRequireDefault(require("./accents"));

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * This file is part of catalan2ipa, ©2015-2019 by the following contributors:
 * Vicenç Riullop (en.wiktionary.org user Vriullop)
 * en.wiktionary.org user Erutuon
 * en.wiktionary.org user JohnC5
 * en.wiktionary.org user IvanScrooge98
 * en.wiktionary.org user Rua
 * en.wiktionary.org user Connum
 *
 * catalan2ipa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * catalan2ipa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with catalan2ipa.  If not, see <https://www.gnu.org/licenses/>.
 */
var defaultOptions = {
  midVowelHint: null,
  syllableMarker: true,
  throwError: true
};

function translit(wordIn) {
  var optionsArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;
  var word = (0, _helpers.wordFixes)(wordIn.toLowerCase());
  var options = optionsArg;

  if (options !== defaultOptions) {
    options = _extends({}, defaultOptions, options);
  } else {
    options = _extends({}, defaultOptions);
  }

  var syllables = (0, _helpers.splitSyllables)(word);

  if (options.syllableMarker === true) {
    options.syllableMarker = '.';
  }

  if (options.midVowelHint === null) {
    if (/[éêòóô]/.test(syllables[syllables.stress - 1].vowel)) {
      var _syllables$vowel$matc = syllables[syllables.stress - 1].vowel.match(/[éêòóô]/, '');

      var _syllables$vowel$matc2 = _slicedToArray(_syllables$vowel$matc, 1);

      options.midVowelHint = _syllables$vowel$matc2[0];
    } else if (/[eè]/.test(syllables[syllables.stress - 1].vowel)) {
      options.midVowelHint = (0, _helpers.midVowelE)(syllables);
    } else if (syllables[syllables.stress - 1].vowel === 'o') {
      options.midVowelHint = (0, _helpers.midVowelO)(syllables);
    }
  }

  syllables = (0, _helpers.toIPA)(syllables, options);
  var returnValue = (0, _helpers.groupSortAndFormat)(_accents["default"], syllables, options);
  /* eslint-disable no-underscore-dangle */

  if (syllables._error) {
    returnValue._error = syllables._error;
  }
  /* eslint-enable no-underscore-dangle */


  return returnValue;
}

var _default = translit;
exports["default"] = _default;
module.exports = exports.default;
},{"./accents":1,"./helpers":2}]},{},[3])(3)
});
