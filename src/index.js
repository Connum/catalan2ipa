import accents from './accents';
import {
  groupSortAndFormat,
  midVowelE,
  midVowelO,
  splitSyllables,
  toIPA,
  wordFixes
} from './helpers';

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

const defaultOptions = {
  midVowelHint: null,
  syllableMarker: true,
  throwError: true,
};

function translit(wordIn, optionsArg = defaultOptions) {
  const word = wordFixes(wordIn.toLowerCase());
  let options = optionsArg;

  if (options !== defaultOptions) {
    options = Object.assign({}, defaultOptions, options);
  } else {
    options = Object.assign({}, defaultOptions);
  }

  let syllables = splitSyllables(word);

  if (options.syllableMarker === true) {
    options.syllableMarker = '.';
  }

  if (options.midVowelHint === null) {
    if (/[éêòóô]/.test(syllables[syllables.stress - 1].vowel)) {
      [options.midVowelHint] = syllables[syllables.stress - 1].vowel.match(/[éêòóô]/, '');
    } else if (/[eè]/.test(syllables[syllables.stress - 1].vowel)) {
      options.midVowelHint = midVowelE(syllables);
    } else if (syllables[syllables.stress - 1].vowel === 'o') {
      options.midVowelHint = midVowelO(syllables);
    }
  }

  syllables = toIPA(syllables, options);

  const returnValue = groupSortAndFormat(accents, syllables, options);

  /* eslint-disable no-underscore-dangle */
  if (syllables._error) {
    returnValue._error = syllables._error;
  }
  /* eslint-enable no-underscore-dangle */

  return returnValue;
}

export default translit;
