import { assert } from 'chai';
import catalan2ipa from '../src';

describe('Wiktionary testcases from Module:ca-IPA/testcases', () => {
  it('should transliterate "també"', () => {
    const expectedVal = {
      ca: '/təmˈbe/',
      'ca-valencia': '/tamˈbe/',
      'ca-XB': '/təmˈbe/'
    };
    assert.deepEqual(catalan2ipa('també'), expectedVal);
  });

  it('should transliterate "sec" (options.midVowelHint = "ê")', () => {
    const expectedVal = {
      ca: '/ˈsɛk/',
      'ca-valencia': '/ˈsek/',
      'ca-XB': '/ˈsək/'
    };
    assert.deepEqual(catalan2ipa('sec', { midVowelHint: 'ê' }), expectedVal);
  });

  it('should transliterate "contrari"', () => {
    const expectedVal = {
      ca: '/kunˈtɾa.ɾi/',
      'ca-valencia': '/konˈtɾa.ɾi/',
      'ca-XB': '/konˈtɾa.ɾi/'
    };
    assert.deepEqual(catalan2ipa('contrari'), expectedVal);
  });

  it('should transliterate "contraure"', () => {
    const expectedVal = {
      ca: '/kunˈtɾaw.ɾə/',
      'ca-valencia': '/konˈtɾaw.ɾe/',
      'ca-XB': '/konˈtɾaw.ɾə/'
    };
    assert.deepEqual(catalan2ipa('contraure'), expectedVal);
  });

  it('should transliterate "contrarellotge" (options.midVowelHint = "ò")', () => {
    const expectedVal = {
      ca: '/kun.tɾə.rəˈʎɔ.d͡ʒə/',
      'ca-valencia': '/kon.tɾa.reˈʎɔ.d͡ʒe/',
      'ca-XB': '/kon.tɾə.rəˈʎɔ.d͡ʒə/'
    };
    assert.deepEqual(catalan2ipa('contrarellotge', { midVowelHint: 'ò' }), expectedVal);
  });
});

describe('Additional test cases', () => {
  it('should transliterate "Catalunya"', () => {
    const expectedVal = {
      ca: '/kə.təˈlu.ɲə/',
      'ca-valencia': '/ka.taˈlu.ɲa/',
      'ca-XB': '/kə.təˈlu.ɲə/'
    };
    assert.deepEqual(catalan2ipa('Catalunya'), expectedVal);
  });

  it('should transliterate "investigació"', () => {
    const expectedVal = {
      ca: '/im.bəs.ti.ɡə.siˈo/',
      'ca-valencia': '/im.ves.ti.ɡa.siˈo/',
      'ca-XB': '/im.vəs.ti.ɡə.siˈo/'
    };
    assert.deepEqual(catalan2ipa('investigació'), expectedVal);
  });

  it('should transliterate "rellotge" (options.midVowelHint = "ò")', () => {
    const expectedVal = {
      ca: '/rəˈʎɔ.d͡ʒə/',
      'ca-valencia': '/reˈʎɔ.d͡ʒe/',
      'ca-XB': '/rəˈʎɔ.d͡ʒə/'
    };
    assert.deepEqual(catalan2ipa('rellotge', { midVowelHint: 'ò' }), expectedVal);
  });

  it('should transliterate "Bellreguard"', () => {
    const expectedVal = {
      ca: '/bəʎ.ɾəˈɡwart/',
      'ca-valencia': '/beʎ.ɾeˈɡwaɾt/',
      'ca-XB': '/bəʎ.ɾəˈɡwaɾt/'
    };
    assert.deepEqual(catalan2ipa('Bellreguard'), expectedVal);
  });

  it('should transliterate "col·laborar"', () => {
    const expectedVal = {
      ca: '/kul.lə.buˈɾa/',
      'ca-valencia': '/kol.la.boˈɾaɾ/',
      'ca-XB': '/kol.lə.boˈɾa/'
    };
    assert.deepEqual(catalan2ipa('col·laborar'), expectedVal);
  });

  it('should transliterate "mira"', () => {
    const expectedVal = {
      ca: '/ˈmi.ɾə/',
      'ca-valencia': '/ˈmi.ɾa/',
      'ca-XB': '/ˈmi.ɾə/'
    };
    assert.deepEqual(catalan2ipa('mira'), expectedVal);
  });

  it('should throw an exception transliterating "sent"', () => {
    const expectedVal = 'The stressed vowel "e" is ambiguous. Please mark it with an acute, grave, or circumflex accent: é, è, or ê.';
    assert.throws(() => catalan2ipa('sec'), expectedVal);
  });
});

describe('Test options', () => {
  it('should return correct "_error" key and return values for "sent" with options.throwError = false;', () => {
    const expectedVal = {
      _error: 'The stressed vowel "e" is ambiguous. Please mark it with an acute, grave, or circumflex accent: é, è, or ê.',
      ca: '?',
      'ca-valencia': '?',
      'ca-XB': '?'
    };
    assert.deepEqual(catalan2ipa('sec', { throwError: false }), expectedVal);
  });

  it('should now throw an exception transliterating "sent" with options.modVowelHint = "ê";', () => {
    assert.doesNotThrow(() => catalan2ipa('sec', { midVowelHint: 'ê' }));
  });

  it('should transliterate "sent" with options.modVowelHint = "ê";', () => {
    const expectedVal = {
      ca: '/ˈsɛk/',
      'ca-valencia': '/ˈsek/',
      'ca-XB': '/ˈsək/'
    };
    assert.deepEqual(catalan2ipa('sec', { midVowelHint: 'ê' }), expectedVal);
  });

  it('options.syllableMarker = false; should work', () => {
    const expectedVal = {
      ca: '/kətəˈluɲə/',
      'ca-valencia': '/kataˈluɲa/',
      'ca-XB': '/kətəˈluɲə/'
    };
    assert.deepEqual(catalan2ipa('Catalunya', { syllableMarker: false }), expectedVal);
  });

  it('options.syllableMarker = ""; should work', () => {
    const expectedVal = {
      ca: '/kətəˈluɲə/',
      'ca-valencia': '/kataˈluɲa/',
      'ca-XB': '/kətəˈluɲə/'
    };
    assert.deepEqual(catalan2ipa('Catalunya', { syllableMarker: '' }), expectedVal);
  });

  it('options.syllableMarker = "|"; should work', () => {
    const expectedVal = {
      ca: '/kə|təˈlu|ɲə/',
      'ca-valencia': '/ka|taˈlu|ɲa/',
      'ca-XB': '/kə|təˈlu|ɲə/'
    };
    assert.deepEqual(catalan2ipa('Catalunya', { syllableMarker: '|' }), expectedVal);
  });
});
