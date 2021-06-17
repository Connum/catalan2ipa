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

import { reductionAE } from './helpers';

const accents = {};

accents.ca = (syllablesIn) => {
  let syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress;

  // Reduction of unstressed vowels a,e
  syllables = reductionAE(syllables);

  // Final consonant losses
  let final = syllables[syllables.length - 1].coda;

  final = final.replace(/^ɾ(s?)$/g, '$1'); // no loss with hint -rr
  final = final.replace(/m[pb]$/g, 'm');
  final = final.replace(/([ln])[td]$/g, '$1');
  final = final.replace(/[nŋ][kɡ]$/g, 'ŋ');

  syllables[syllables.length - 1].coda = final;

  for (let i = 0; i < syllables.length; i++) {
    const current = syllables[i];
    const previous = syllables[i - 1];

    // Reduction of unstressed o
    if (current.vowel === 'o' && !(current.stressed || current.coda === 'w')) {
      current.vowel = current.vowel.replace(/o/g, 'u');
    }

    // v > b
    if (/v/.test(current.onset)) {
      current.onset = current.onset.replace(/v/g, 'b');
      if (i > 0 && !/[pbtdkɡmɱnɲŋ]$/.test(previous.coda) && (previous.stressed === false || current.stressed === false)) {
        current.onset = current.onset.replace(/^b/, 'β');
      } else if (i > 0 && /^b/.test(current.onset)) {
        previous.coda = previous.coda.replace(/[ɱn]$/, 'm');
      }
      current.coda = current.coda.replace(/[ɱn]b/, 'mb');
    }

    // allophones of r
    current.coda = current.coda.replace(/ɾ/g, 'r');

    // no spirants after r/z
    if (i > 0 && /[rz]$/.test(previous.coda)) {
      current.onset = current.onset
        .replace(/^[β]/, 'b')
        .replace(/^[ð]/, 'd')
        .replace(/^[ɣ]/, 'g');
    }

    // Poststressed gemination bl, gl
    if (i > 0 && (current.onset === 'βɫ' || current.onset === 'ɣɫ') && previous.coda === '' && previous.stressed) {
      current.onset = current.onset
        .replace(/[β]/, 'b')
        .replace(/[ɣ]/, 'g');
      previous.coda = current.onset.substr(0, 1);
    }

    // tl > ll
    if (i > 0 && current.onset === 'ɫ') {
      previous.coda = previous.coda.replace('d', 'ɫ');
    }

    // Velarization -gn-, -cn-
    if (i > 0 && current.onset === 'n') {
      previous.coda = previous.coda.replace('ɡ', 'ŋ');
    }

    // Remove j before palatal obstruents
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

accents['ca-valencia'] = (syllablesIn, options) => {
  const syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress;

  for (let i = 0; i < syllables.length; i++) {
    const current = syllables[i];
    const previous = syllables[i - 1];

    // Variable mid vowel
    if (i === syllables.stress - 1 && (options.midVowelHint === 'ê' || options.midVowelHint === 'ô')) {
      current.vowel = current.vowel.replace(/ɛ/g, 'e');
      current.vowel = current.vowel.replace(/ɔ/g, 'o');
    }

    // Fortition of palatal fricatives
    current.onset = current.onset.replace(/ʒ/g, 'd͡ʒ');
    current.onset = current.onset.replace(/d͡d/g, 'd');

    current.coda = current.coda.replace(/ʒ/g, 'd͡ʒ');
    current.coda = current.coda.replace(/d͡d/g, 'd');

    if (i > 0 && previous.vowel === 'i' && previous.coda === '' && current.onset === 'd͡z') {
      current.onset = 'z';
    } else if ((i === 0 && current.onset === 'ʃ')
      || (i > 0 && current.onset === 'ʃ' && previous.coda !== '' && previous.coda !== 'j')) {
      current.onset = 't͡ʃ';
    }

    // No palatal gemination ʎʎ > ll or ʎ, in Valencian and Balearic
    if (i > 0 && current.onset === 'ʎ' && previous.coda === 'ʎ') {
      const prevSyll = previous.onset + previous.vowel + previous.coda;
      if (/[bpw]aʎ$/.test(prevSyll)
        || /[mv]eʎ$/.test(prevSyll)
        || /tiʎ$/.test(prevSyll)
        || /m[oɔ]ʎ$/.test(prevSyll)
        || (/uʎ$/.test(prevSyll) && current.vowel === 'a')
      ) {
        previous.coda = 'l';
        current.onset = 'l';
      } else {
        previous.coda = '';
      }
    }

    // Hint -rr only for Central
    if (i === syllables.length - 1) {
      current.coda = current.coda.replace(/r(s?)$/g, 'ɾ$1');
    }
  }

  return syllables;
};

accents['ca-XB'] = (syllablesIn, options) => {
  let syllables = JSON.parse(JSON.stringify(syllablesIn));
  syllables.stress = syllablesIn.stress;

  // Reduction of unstressed vowels a,e
  syllables = reductionAE(syllables);

  for (let i = 0; i < syllables.length; i++) {
    const current = syllables[i];
    const previous = syllables[i - 1];

    // Reduction of unstressed o per vowel harmony
    if (i > 0 && current.stressed && /[iu]/.test(current.vowel) && !previous.stressed) {
      previous.vowel = previous.vowel.replace(/o/g, 'u');
    }

    // Stressed schwa
    if (i === syllables.stress - 1 && options.midVowelHint === 'ê') {
      current.vowel = current.vowel.replace(/ɛ/g, 'ə');
    }

    // Remove j before palatal obstruents
    current.coda = current.coda.replace(/j([ʃʒ])/g, '$1');
    current.coda = current.coda.replace(/j(t͡ʃ)/g, '$1');
    current.coda = current.coda.replace(/j(d͡ʒ)/g, '$1');

    if (i > 0) {
      if (/^[ʃʒ]/.test(current.onset) || /^t͡ʃ/.test(current.onset) || /^d͡ʒ/.test(current.onset)) {
        previous.coda = previous.coda.replace(/j$/g, '');
      }
    }

    // No palatal gemination ʎʎ > ll or ʎ, in Valencian and Balearic
    if (i > 0 && current.onset === 'ʎ' && previous.coda === 'ʎ') {
      const prevSyll = previous.onset + previous.vowel + previous.coda;
      if (/[bpw]aʎ$/.test(prevSyll)
        || /[mv]eʎ$/.test(prevSyll)
        || /tiʎ$/.test(prevSyll)
        || /m[oɔ]ʎ$/.test(prevSyll)
        || (/uʎ$/.test(prevSyll) && current.vowel === 'a')
      ) {
        previous.coda = 'l';
        current.onset = 'l';
      } else {
        previous.coda = '';
      }
    }

    // Final consonant losses
    if (syllables.length === 1) {
      current.coda = current.coda.replace(/ɾ(s?)$/g, '$1'); // no loss with hint -rr in monosyllables
    } else if (i === syllables.length - 1) {
      current.coda = current.coda.replace(/[rɾ](s?)$/g, '$1'); // including hint -rr
    }
  }

  return syllables;
};

export default accents;
