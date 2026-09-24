import { nameError, normalizePhone, PHONE_ERROR } from '../lib/validate.ts';

let fail = 0;
const t = (label, got, want) => {
  const ok = got === want;
  if (!ok) fail += 1;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label.padEnd(34)} got=${JSON.stringify(got)} want=${JSON.stringify(want)}`);
};

console.log('--- names: must reject digits, accept real names ---');
t('plain',            nameError('Jordan Miller', 'Your name'), null);
t('digit inside',     !!nameError('Jordan2 Miller', 'Your name'), true);
t('all digits',       !!nameError('12345', 'Your name'), true);
t('trailing digit',   !!nameError('Jordan 1', 'Your name'), true);
t('hyphen',           nameError('Anne-Marie', 'Your name'), null);
t('apostrophe',       nameError("O'Brien", 'Your name'), null);
t('curly apostrophe', nameError('O’Brien', 'Your name'), null);
t('period',           nameError('J. R. Smith', 'Your name'), null);
t('accents',          nameError('José Álvarez', 'Your name'), null);
t('non-latin',        nameError('李明', 'Your name'), null);
t('single letter',    !!nameError('J', 'Your name'), true);
t('symbol',           !!nameError('Jordan@', 'Your name'), true);
t('empty is caller\u2019s job', nameError('', 'Your name'), null);
t('state ok',         nameError('Wyoming', 'State'), null);
t('state digit',      !!nameError('WY1', 'State'), true);
t('city with period', nameError('St. Louis', 'City'), null);

console.log('\n--- phones: US and local, one message for the rest ---');
t('us 10',            normalizePhone('3252024836'), '+13252024836');
t('us formatted',     normalizePhone('(325) 202-4836'), '+13252024836');
t('us 11',            normalizePhone('13252024836'), '+13252024836');
t('us e164',          normalizePhone('+1 325 202 4836'), '+13252024836');
t('pk e164',          normalizePhone('+92 300 1234567'), '+923001234567');
t('pk local 0',       normalizePhone('03001234567'), '+923001234567');
t('pk 12 digits',     normalizePhone('923001234567'), '+923001234567');
t('too short',        normalizePhone('12345'), null);
t('too long',         normalizePhone('1234567890123456'), null);
t('letters',          normalizePhone('not a number'), null);
t('empty',            normalizePhone(''), null);
t('other country',    normalizePhone('+44 20 7946 0958'), null);
t('error text says nothing about countries',
  /pakistan|united states|\bus\b/i.test(PHONE_ERROR), false);

console.log(fail ? `\n${fail} FAILING` : '\nall passing');
process.exit(fail ? 1 : 0);
