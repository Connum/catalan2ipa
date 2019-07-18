import { assert } from 'chai';
// eslint-disable-next-line import/no-unresolved
import catalan2ipa from '../lib';
// eslint-disable-next-line import/extensions
import catalan2ipaDist from '../dist/catalan2ipa.js';
// eslint-disable-next-line import/extensions
import catalan2ipaMin from '../dist/catalan2ipa.min.js';

// eslint-disable-next-line import/no-unresolved
const catalan2ipaRequire = require('../lib');
const catalan2ipaDistRequire = require('../dist/catalan2ipa.js');
const catalan2ipaMinRequire = require('../dist/catalan2ipa.min.js');

describe('Test dist files (import)', () => {
  it('lib as module should transliterate "Catalunya"', () => {
    const expectedVal = {
      ca: '/kə-təˈlu-ɲə/',
      'ca-valencia': '/ka-taˈlu-ɲa/',
      'ca-XB': '/kə-təˈlu-ɲə/'
    };
    assert.deepEqual(catalan2ipa('Catalunya', { syllableMarker: '-' }), expectedVal);
  });

  it('unminified lib should transliterate "Catalunya"', () => {
    const expectedVal = {
      ca: '/kə-təˈlu-ɲə/',
      'ca-valencia': '/ka-taˈlu-ɲa/',
      'ca-XB': '/kə-təˈlu-ɲə/'
    };
    assert.deepEqual(catalan2ipaDist('Catalunya', { syllableMarker: '-' }), expectedVal);
  });

  it('minified lib should transliterate "Catalunya"', () => {
    const expectedVal = {
      ca: '/kə-təˈlu-ɲə/',
      'ca-valencia': '/ka-taˈlu-ɲa/',
      'ca-XB': '/kə-təˈlu-ɲə/'
    };
    assert.deepEqual(catalan2ipaMin('Catalunya', { syllableMarker: '-' }), expectedVal);
  });
});

describe('Test dist files (require)', () => {
  it('lib as module should transliterate "Catalunya"', () => {
    const expectedVal = {
      ca: '/kə-təˈlu-ɲə/',
      'ca-valencia': '/ka-taˈlu-ɲa/',
      'ca-XB': '/kə-təˈlu-ɲə/'
    };
    assert.deepEqual(catalan2ipaRequire('Catalunya', { syllableMarker: '-' }), expectedVal);
  });

  it('unminified lib should transliterate "Catalunya"', () => {
    const expectedVal = {
      ca: '/kə-təˈlu-ɲə/',
      'ca-valencia': '/ka-taˈlu-ɲa/',
      'ca-XB': '/kə-təˈlu-ɲə/'
    };
    assert.deepEqual(catalan2ipaDistRequire('Catalunya', { syllableMarker: '-' }), expectedVal);
  });

  it('minified lib should transliterate "Catalunya"', () => {
    const expectedVal = {
      ca: '/kə-təˈlu-ɲə/',
      'ca-valencia': '/ka-taˈlu-ɲa/',
      'ca-XB': '/kə-təˈlu-ɲə/'
    };
    assert.deepEqual(catalan2ipaMinRequire('Catalunya', { syllableMarker: '-' }), expectedVal);
  });
});
