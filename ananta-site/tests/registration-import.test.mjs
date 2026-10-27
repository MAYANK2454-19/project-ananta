import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findHeader,
  makeSourceId,
  normaliseHeader,
  parseGoogleTimestamp,
} from '../lib/registration-import.ts';

test('normaliseHeader removes accents, punctuation and case', () => {
  assert.equal(normaliseHeader('É-mail Address!'), 'emailaddress');
  assert.equal(normaliseHeader('  Student Name  '), 'studentname');
});

test('findHeader resolves aliases against normalized Google Forms headings', () => {
  assert.equal(
    findHeader(['Timestamp', 'Student Name', 'Email Address'], ['full name', 'student name']),
    'Student Name',
  );
  assert.equal(findHeader(['Timestamp'], ['Email Address']), undefined);
});

test('makeSourceId is stable across column order and surrounding whitespace', () => {
  const first = { 'Full Name': ' Mayank ', 'Email Address': 'mayank@smvdu.ac.in' };
  const reordered = { 'Email Address': 'mayank@smvdu.ac.in', 'Full Name': 'Mayank' };
  assert.equal(makeSourceId(first), makeSourceId(reordered));
  assert.match(makeSourceId(first), /^[a-f0-9]{64}$/);
});

test('parseGoogleTimestamp respects explicit ISO time zones', () => {
  assert.equal(
    parseGoogleTimestamp('2026-11-04T23:59:00+05:30'),
    '2026-11-04T18:29:00.000Z',
  );
});

test('parseGoogleTimestamp interprets ambiguous dates as India day-first IST', () => {
  assert.equal(
    parseGoogleTimestamp('04/11/2026, 11:59 PM'),
    '2026-11-04T18:29:00.000Z',
  );
  assert.equal(
    parseGoogleTimestamp('04/11/2026, 12:00 AM'),
    '2026-11-03T18:30:00.000Z',
  );
});

test('parseGoogleTimestamp rejects malformed and impossible dates', () => {
  assert.equal(parseGoogleTimestamp(''), null);
  assert.equal(parseGoogleTimestamp('31/02/2026'), null);
  assert.equal(parseGoogleTimestamp('13/13/2026'), null);
  assert.equal(parseGoogleTimestamp('04/11/2026, 13:00 PM'), null);
  assert.equal(parseGoogleTimestamp('not a date'), null);
});
