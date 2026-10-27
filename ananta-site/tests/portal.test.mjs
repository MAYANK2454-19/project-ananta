import assert from 'node:assert/strict';
import test from 'node:test';
import {
  emailAllowed,
  friendlyError,
  normaliseUrl,
  safeNext,
} from '../lib/portal.ts';

test(
  'safeNext accepts same-site paths and rejects external or malformed targets',
  () => {
    assert.equal(safeNext('/account'), '/account');
    assert.equal(safeNext('/register/form?x=1'), '/register/form?x=1');
    assert.equal(safeNext('/'), '/');
    assert.equal(safeNext('//example.com/steal'), '/account');
    assert.equal(safeNext('/\\\\example.com'), '/account');
    assert.equal(safeNext('https://example.com'), '/account');
    assert.equal(safeNext(null, '/register/form'), '/register/form');
  },
);

test(
  'normaliseUrl upgrades bare profiles to HTTPS without changing valid HTTPS URLs',
  () => {
    assert.equal(
      normaliseUrl(' github.com/mayank '),
      'https://github.com/mayank',
    );
    assert.equal(
      normaliseUrl('http://github.com/mayank'),
      'https://github.com/mayank',
    );
    assert.equal(
      normaliseUrl('https://github.com/mayank'),
      'https://github.com/mayank',
    );
    assert.equal(normaliseUrl(''), '');
  },
);

test('emailAllowed checks exact domains case-insensitively', () => {
  assert.equal(emailAllowed('STUDENT@SMVDU.AC.IN', ['smvdu.ac.in']), true);
  assert.equal(emailAllowed('student@example.com', ['smvdu.ac.in']), false);
  assert.equal(emailAllowed('student@sub.smvdu.ac.in', ['smvdu.ac.in']), false);
  assert.equal(emailAllowed('student@example.com', []), true);
});

test('friendlyError maps common auth errors to actionable messages', () => {
  assert.equal(
    friendlyError({ message: 'Invalid login credentials' }),
    'Wrong email or password.',
  );
  assert.equal(
    friendlyError({ message: 'Email not confirmed' }),
    'Confirm your email first: open the link we sent you.',
  );
  assert.equal(
    friendlyError({ message: 'Failed to fetch' }),
    'Could not reach the server. Check your connection and try again.',
  );
  assert.equal(
    friendlyError({ message: 'unexpected issue' }),
    'unexpected issue',
  );
});
