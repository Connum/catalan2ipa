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

const IPAVowels = {
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
  ü: 'u',
};

const validOnsets = {
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
  z: true,
};

export function fixPrefixes(wordIn) {
  let word = wordIn;

  // Orthographic fixes for unassimilated prefixes
  const prefix = [
    'a[eè]ro', 'ànte', '[aà]nti', '[aà]rxi', '[aà]uto', // a- is ambiguous as prefix
    'bi', 'b[ií]li', 'bio',
    'c[oò]ntra', // ambiguous co-
    'dia', 'dodeca',
    '[eé]ntre', 'equi', 'estereo', // ambiguous e-(radic)
    'f[oó]to',
    'g[aà]stro', 'gr[eé]co',
    'hendeca', 'hepta', 'hexa', 'h[oò]mo',
    '[ií]nfra', '[ií]ntra',
    'm[aà]cro', 'm[ií]cro', 'mono', 'morfo', 'm[uú]lti',
    'n[eé]o',
    'octo', 'orto',
    'penta', 'p[oòô]li', 'pol[ií]tico', 'pr[oòô]to', 'ps[eèê]udo', 'psico', // ambiguous pre-(s), pro-
    'qu[aà]si', 'qu[ií]mio',
    'r[aà]dio', // ambiguous re-
    's[eèê]mi', 's[oó]bre', 's[uú]pra',
    'termo', 'tetra', 'tri', // ambiguous tele-(r)
    '[uú]ltra', '[uu]n[ií]',
    'v[ií]ce'
  ];

  const prefixR = ['[eèéê]xtra', 'pr[eé]'];
  const prefixS = ['antropo', 'centro', 'deca', 'd[ií]no', 'eco', '[eèéê]xtra',
    'hetero', 'p[aà]ra', 'post', 'pré', 's[oó]ta', 'tele'];
  const prefixI = ['pr[eé]', 'pr[ií]mo', 'pro', 'tele'];
  const noPrefix = ['autoic', 'autori', 'biret', 'biri', 'bisa', 'bisell', 'bisó', 'biur', 'contrari', 'contrau',
    'diari', 'equise', 'heterosi', 'monoi', 'parasa', 'parasit', 'preix', 'psicosi', 'sobrera', 'sobreri'];

  // False prefixes
  let unprefixed = false;
  noPrefix.forEach((pr) => {
    if (new RegExp(`^${pr}`).test(word)) {
      unprefixed = true;
    }
  });

  if (unprefixed) {
    return word;
  }

  // Double r in prefix + r + vowel
  prefixR.forEach((pr) => {
    word = word.replace(new RegExp(`^(${pr})r([aàeèéiíïoòóuúü])`, 'g'), '$1rr$2');
  });
  word = word.replace(new RegExp('^eradic', 'g'), 'erradic');

  // Double s in prefix + s + vowel
  prefixS.forEach((pr) => {
    word = word.replace(new RegExp(`^(${pr})s([aàeèéiíïoòóuúü])`, 'g'), '$1ss$2');
  });

  // Hiatus in prefix + i
  prefixI.forEach((pr) => {
    word = word.replace(new RegExp(`^(${pr})i(.)`, 'g'), '$1ï$2');
  });

  // Both prefix + r/s or i/u
  prefix.forEach((pr) => {
    word = word.replace(new RegExp(`^(${pr})([rs])([aàeèéiíïoòóuúü])`, 'g'), '$1$2$2$3');
    word = word.replace(new RegExp(`^(${pr})i(.)`, 'g'), '$1ï$2');
    word = word.replace(new RegExp(`^(${pr})u(.)`, 'g'), '$1ü$2');
  });

  // Voiced s in prefix roots -fons-, -dins-, -trans-
  word = word.replace(new RegExp('^enfons([aàeèéiíoòóuú])', 'g'), 'enfonz$1');
  word = word.replace(new RegExp('^endins([aàeèéiíoòóuú])', 'g'), 'endinz$1');
  word = word.replace(new RegExp('tr([aà])ns([aàeèéiíoòóuúbdghlmv])', 'g'), 'tr$1nz$2');

  // in + ex > ineks/inegz
  word = word.replace(new RegExp('^inex', 'g'), 'inhex');

  return word;
}

function fixY(wordIn) {
  let word = wordIn;

  // y > vowel i else consonant /j/, except ny

  word = word.replace(/ny/g, 'ñ');

  word = word.replace(/y([^aeiouàèéêíòóôúïü])/g, 'i$1'); // vowel if not next to another vowel
  word = word.replace(/([^aeiouàèéêíòóôúïü·\-.])y/g, '$1i'); // excluding also syllables separators

  return word;
}

function joinSyllables(syllablesIn, options) {
  const syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress;

  syllables.forEach((syllIn, i) => {
    let syll = syllIn;
    syll = syll.onset + syll.vowel + syll.coda;

    if (i === syllables.stress - 1) { // primary stress
      syll = `ˈ${syll}`;
    } else if (syllables[i].stressed) { // secondary stress
      syll = `ˌ${syll}`;
    }

    syllables[i] = syll;
  });

  const syllableMarker = options.syllableMarker ? options.syllableMarker : '';
  let ipaString = syllables.join(syllableMarker);
  if (syllableMarker) {
    ipaString = ipaString.replace(new RegExp(`${syllableMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([ˈˌ])`, 'g'), '$1');
  }
  return `/${ipaString}/`.replace(/^\/(\?)\/$/, '$1');
}

function postprocessGeneral(syllablesIn) {
  const syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress;

  const voiced = {
    b: true,
    d: true,
    ɡ: true,
    m: true,
    n: true,
    ɲ: true,
    ɫ: true,
    l: true,
    ʎ: true,
    r: true,
    ɾ: true,
    v: true,
    z: true,
    ʒ: true
  };
  const voiceless = {
    p: true, t: true, k: true, f: true, s: true, ʃ: true, '': true
  };
  const voicing = {
    k: 'ɡ', f: 'v', p: 'b', t: 'd', s: 'z', ʃ: 'ʒ'
  };
  const devoicing = { b: 'p', d: 't', ɡ: 'k' };

  const lenition = {
    b: 'β',
    d: 'ð',
    ɡ: 'ɣ'
  };

  for (let i = 0; i < syllables.length; i++) {
    const current = syllables[i];
    const previous = syllables[i - 1];

    // Coda consonant losses
    if (i < (syllables.length - 1) || (i === (syllables.length - 1) && /s$/.test(current.coda))) {
      current.coda = current.coda.replace(/m[pb]/g, 'm');
      current.coda = current.coda.replace(/([ln])[td]/g, '$1');
      current.coda = current.coda.replace(/n[kɡ]/g, 'ŋ');
    }

    // Consonant assimilations
    if (i > 0) {
      // t + lateral/nasal assimilation
      const cons = current.onset.match(/^[lʎmn]/);
      if (cons) {
        previous.coda = previous.coda.replace(/t$/g, cons);
      }

      // n + labial > labialized assimilation
      if (/^[mbp]/.test(current.onset)) {
        previous.coda = previous.coda.replace(/n$/, 'm');
      } else if (/^[fv]/.test(current.onset)) {
        previous.coda = previous.coda.replace(/n$/, 'm'); // strictly ɱ // TODO: enable as alternative, but check if it influences other replacements
        // n + velar > velarized assimilation
      } else if (/^[ɡk]/.test(current.onset)) {
        previous.coda = previous.coda.replace(/n$/, 'ŋ');
        // l/n + palatal > palatalized assimilation
      } else if (/^[ʒʎʃɲ]/.test(current.onset) || /^t͡ʃ/.test(current.onset) || /^d͡ʒ/.test(current.onset)) {
        previous.coda = previous.coda.replace(/l$/, 'ʎ');
        previous.coda = previous.coda.replace(/n$/, 'ɲ');
      }

      // ɡʒ > d͡ʒ
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

    current.coda = current.coda.replace(/ɲs/g, 'ɲʃ');

    // Voicing or devoicing
    if (i > 0) {
      const codaLetter = previous.coda.substr(-1);
      const onsetLetter = current.onset.charAt(0);
      if (voiced[onsetLetter] && voicing[codaLetter]) {
        previous.coda = previous.coda.replace(new RegExp(`${codaLetter}$`), voicing[codaLetter]);
      } else if (voiceless[onsetLetter] && devoicing[codaLetter]) {
        previous.coda = previous.coda.replace(new RegExp(`${codaLetter}$`), devoicing[codaLetter]);
      } else {
        previous.coda = previous.coda.replace(/bs/g, 'ps');
        previous.coda = previous.coda.replace(/ds/g, 'ts');
      }
    }

    // Allophones of r
    if (i === 0) {
      current.onset = current.onset.replace(/^ɾ/, 'r');
    }

    if (i > 0) {
      if (/[lns]$/.test(previous.coda)) {
        current.onset = current.onset.replace(/^ɾ/, 'r');
      }
    }

    // Double sound of letter x > ks/gz (on cultisms, ambiguous in onsets)
    current.coda = current.coda.replace(/^ʃs?/, 'ks');
    if (i > 0 && previous.coda === 'kz') {
      previous.coda = 'ɡz'; // voicing the group
    }
    if (i > 0 && current.onset === 's') {
      previous.coda = previous.coda.replace(/s$/, ''); // reduction exs, exc(e/i) and sc(e/i)
    }

    if (i > 0 && previous.onset === '' && (previous.vowel === 'e' || previous.vowel === 'ɛ')
    && ((previous.coda === '' && current.onset === 'ʃ') || (previous.coda === 'ks' && current.onset === ''))) {
      // ex + (h) vowel > egz
      previous.coda = 'ɡ';
      current.onset = 'z';
    }

    if (i > 0 && /^[bdɡ]/.test(current.onset) && !/^d͡/.test(current.onset) && !/[pbtdkɡmɱnɲŋ]$/.test(previous.coda) && !(/[ɫlʎ]/.test(previous.coda) && current.onset === 'd') && (previous.stressed === false || current.stressed === false)) {
      current.onset = current.onset.replace(/b/, lenition.b).replace(/d/, lenition.d).replace(/ɡ/, lenition.ɡ);
    }
  }

  // Final devoicing
  let final = syllables[syllables.length - 1].coda;

  final = final.replace(/d͡ʒ/g, 't͡ʃ');
  final = final.replace(/d͡z/g, 't͡s');
  final = final.replace(/b/g, 'p');
  final = final.replace(/d/g, 't');
  final = final.replace(/ɡ/g, 'k');
  final = final.replace(/ʒ/g, 'ʃ');
  final = final.replace(/v/g, 'f');
  final = final.replace(/z/g, 's');

  // Final loses
  final = final.replace(/j(t͡ʃ)/g, '$1');
  final = final.replace(/([ʃs])s/g, '$1'); // homophone plurals -xs, -igs, -çs

  syllables[syllables.length - 1].coda = final;

  return syllables;
}

function replaceContextFree(consIn) {
  let cons = consIn;

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
  let word = wordIn;

  // Some structural forms do not have diaeresis per diacritic savings,
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
  let vowels = vowelsIn;
  const syllables = [{ onset: '', vowel: vowels.charAt(0), coda: '' }];

  vowels = vowels.substr(1);

  while (vowels !== '') {
    const syll = { onset: '', vowel: '', coda: '' };
    [, syll.onset, syll.vowel, vowels] = (vowels.match(/^([iu]?)(.)(.*?)$/) || ['', '', '', '']);
    syllables.push(syll);
  }

  const count = syllables.length;

  if (count >= 2 && (syllables[count - 1].vowel === 'i' || syllables[count - 1].vowel === 'u')) {
    syllables[count - 2].coda = syllables[count - 1].vowel;
    delete syllables[count - 1];
  }
  return syllables;
}

export function groupSortAndFormat(accents, syllables, options) {
  // Despite keeping the name, the grouping part from Wiktionary has
  // actually been omitted, so all variants are always included in the output.
  // This might get added back as an option.

  const out = {};

  Object.keys(accents).forEach((accent) => {
    const ipa = joinSyllables(accents[accent](syllables, options), options);
    out[accent] = ipa;
  });

  return out;
}


export function midVowelE(syllables) {
  // most common cases, other ones are supposed ambiguous
  let postConsonants = syllables[syllables.stress - 1].coda;
  let postVowel = '';
  let postLetters = postConsonants;
  if (syllables.stress === syllables.length - 1) {
    postConsonants += syllables[syllables.length - 1].onset;
    postVowel = syllables[syllables.length - 1].vowel;
    postLetters = postConsonants + postVowel + syllables[syllables.length - 1].coda;
  }

  if (syllables[syllables.stress - 1].vowel === 'e') {
    if (postVowel === 'i' || postVowel === 'u') {
      return 'è';
    } if (/^ct[ae]?s?$/.test(postLetters)) {
      return 'è';
    } if (postLetters === 'dre' || postLetters === 'dres') {
      return 'é';
    } if (/^l/.test(postConsonants) && syllables.stress === syllables.length) {
      return 'è';
    } if (postConsonants === 'l' || postConsonants === 'ls' || postConsonants === 'l·l') {
      return 'è';
    } if ((postLetters === 'ma' || postLetters === 'mes') && syllables.length > 2) {
      return 'ê';
    } if (postLetters === 'ns' || postLetters === 'na' || postLetters === 'nes') { // inflection of -è
      return 'ê';
    } if (postLetters === 'nse' || postLetters === 'nses') {
      return 'ê';
    } if (postLetters === 'nt' || postLetters === 'nts') {
      return 'é';
    } if (/^r[ae]?s?$/.test(postLetters)) {
      return 'é';
    } if (/^r[dfjlnrstxyz]/.test(postConsonants)) { // except bilabial and velar
      return 'è';
    } if (postLetters === 'sos' || postLetters === 'sa' || postLetters === 'ses') { // inflection of -ès
      return 'ê';
    } if (/^t[ae]?s?$/.test(postLetters)) {
      return 'ê';
    }
  } else if (syllables[syllables.stress - 1].vowel === 'è') {
    if (postLetters === 's' || postLetters === '') { // -ès, -è
      return 'ê';
    }
  }

  return null;
}

export function midVowelO(syllables) {
  // most common cases, other ones are supposed ambiguous
  let postConsonants = syllables[syllables.stress - 1].coda;
  let postVowel = '';
  let postLetters = postConsonants;
  if (syllables.stress === syllables.length - 1) {
    postConsonants += syllables[syllables.length - 1].onset;
    postVowel = syllables[syllables.length - 1].vowel;
    postLetters = postConsonants + postVowel + syllables[syllables.length - 1].coda;
  }

  if (postVowel === 'i' || postVowel === 'u') {
    return 'ò';
  } if (postLetters.charAt(0) === 'i' && postLetters.substr(0, 2) !== 'ix') { // diphthong oi
    return 'ò';
  } if (/^u[^s]/.test(postLetters)) { // diphthong ou, ambiguous if final
    return 'ò';
  } if (syllables.length === 1 && (postLetters === '' || postLetters === 's' || postLetters === 'ns')) { // monosyllable
    return 'ò';
  } if (postLetters === 'fa' || postLetters === 'fes') {
    return 'ò';
  } if (postConsonants === 'fr') {
    return 'ó';
  } if (postLetters === 'ldre') {
    return 'ò';
  } if (postLetters === 'ma' || postLetters === 'mes') {
    return 'ó';
  } if (postLetters === 'ndre') {
    return 'ò';
  } if (/^r[ae]?s?$/.test(postLetters)) {
    return 'ó';
  } if (/^r[ft]s?$/.test(postLetters)) {
    return 'ò';
  } if (postLetters === 'rme' || postLetters === 'rmes') {
    return 'ó';
  }

  return null;
}

// Reduction of unstressed a,e in Central and Balearic (Eastern Catalan)
export function reductionAE(syllables) {
  for (let i = 0; i < syllables.length; i++) {
    const current = syllables[i];
    const previous = syllables[i - 1] || { onset: '', vowel: '', coda: '' };
    const posterior = syllables[i + 1] || { onset: '', vowel: '', coda: '' };

    const preVowelPair = previous.vowel + previous.coda + current.onset + current.vowel;
    const postVowelPair = current.vowel + current.coda + posterior.onset + posterior.vowel;
    let reduction = true;

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

export function splitSyllables(word) {
  const syllables = [];
  let remainder = word;

  while (remainder !== '') {
    let consonants;
    let vowels;

    [, consonants, remainder] = remainder.match(/^([^aeiouàèéêíòóôúïü]*)(.*?)$/);
    [, vowels, remainder] = remainder.match(/^([aeiouàèéêíòóôúïü]*)(.*?)$/);

    if (vowels === '') {
      syllables[syllables.length - 1].coda += consonants;
    } else {
      let onset = consonants;
      const firstVowel = vowels.charAt(0);

      if ((/[gq]$/.test(onset) && (firstVowel === 'ü' || (firstVowel === 'u' && vowels !== 'u')))
      || ((onset === '' || onset === 'h') && syllables.length === 0 && firstVowel === 'i' && vowels !== 'i')) {
        onset += vowels.charAt(0);
        vowels = vowels.substr(1);
      }

      const vsyllables = splitVowels(vowels);
      vsyllables[0].onset = onset + vsyllables[0].onset;

      vsyllables.forEach((s) => {
        syllables.push(s);
      });
    }
  }

  // Shift over consonants from the onset to the preceding coda,
  // until the syllable onset is valid
  for (let i = 1; i < syllables.length; i++) {
    const current = syllables[i];
    const previous = syllables[i - 1];

    while (!(!current.onset || validOnsets[current.onset])) {
      const letter = current.onset.charAt(0);
      current.onset = current.onset.substr(1);
      if (!/[·\-.]/.test(letter)) { // syllables separators
        previous.coda += letter;
      } else {
        break;
      }
    }
  }

  // Detect stress
  syllables.forEach((syllIn, i) => {
    const syll = syllIn;
    if (/^[àèéêíòóôú]$/.test(syll.vowel)) {
      syllables.stress = i + 1; // primary stress: the last one stressed
      syll.stressed = true;
    }
  });

  if (!(syllables.stress)) {
    const count = syllables.length;

    if (count === 1) {
      syllables.stress = 1;
    } else {
      const final = syllables[count - 1];

      if (final.coda === '' || final.coda === 's' || (final.coda === 'n' && (final.vowel === 'e' || final.vowel === 'i'))) {
        syllables.stress = count - 1;
      } else {
        syllables.stress = count;
      }
    }
    syllables[syllables.stress - 1].stressed = true;
  }

  return syllables;
}

export function toIPA(syllablesIn, options) {
  const syllables = syllablesIn;
  // Stressed vowel is ambiguous
  if (/[eéèoòó]/.test(syllables[syllables.stress - 1].vowel)) {
    if (options.midVowelHint) {
      syllables[syllables.stress - 1].vowel = options.midVowelHint;
    } else if (syllables[syllables.stress - 1].vowel === 'e' || syllables[syllables.stress - 1].vowel === 'o') {
      const errMsg = `The stressed vowel "${syllables[syllables.stress - 1].vowel
      }" is ambiguous. Please mark it with an acute, grave, or circumflex accent: ${
        [0x0301, 0x0300, 0x0302].map(accent => syllables[syllables.stress - 1].vowel + String.fromCharCode(accent)).join(', ').replace(/^(.+), /, '$1, or ')
      }.`;

      if (options.throwError) {
        throw new Error(errMsg);
      } else {
        const returnVal = [{ onset: '', vowel: '?', coda: '' }];
        // eslint-disable-next-line no-underscore-dangle
        returnVal._error = errMsg;
        return returnVal;
      }
    }
  }

  let syllablesIPA = [];
  syllablesIPA.stress = syllables.stress;

  syllables.forEach((val, key) => {
    syllablesIPA[key] = {
      onset: val.onset, vowel: val.vowel, coda: val.coda, stressed: val.stressed || false
    };
  });

  // Replace letters with IPA equivalents
  syllablesIPA.forEach((syllIn, i) => {
    const syll = syllIn;
    // Voicing of s
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

    syll.vowel = syll.vowel.replace(new RegExp(`[${Object.keys(IPAVowels).join('')}]`, 'g'), m => IPAVowels[m]);
  });

  syllablesIPA = postprocessGeneral(syllablesIPA);

  return syllablesIPA;
}

export const wordFixes = (wordIn) => {
  let word = wordIn;
  word = word.replace(/-([rs]?)/g, '-$1$1');
  word = word.replace(/rç$/g, 'rrs'); // silent r only in plurals -rs
  word = fixPrefixes(word); // internal pause after a prefix
  word = restoreDiaereses(word); // no diaeresis saving
  word = fixY(word); // ny > ñ else y > i vowel or consonant

  return word;
};

export default {};
