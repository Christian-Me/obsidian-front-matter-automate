import { ScriptingTools } from './src/tools';

test('basic test', () => {
  expect(1 + 1).toBe(2);
});
describe('isISOString', () => {
    const scriptingTools = new ScriptingTools();

    test('valid ISO string with date and time', () => {
        expect(scriptingTools.isISOString('2023-03-15T12:34:56')).toBe(true);
    });

    test('valid ISO string with date, time, and milliseconds', () => {
        expect(scriptingTools.isISOString('2023-03-15T12:34:56.789', { withMilliseconds: true })).toBe(true);
    });

    test('valid ISO string with date, time, milliseconds, and timezone', () => {
        expect(scriptingTools.isISOString('2023-03-15T12:34:56.789Z', { withMilliseconds: true, withTimezone: true })).toBe(true);
        expect(scriptingTools.isISOString('2023-03-15T12:34:56.789+02:00', { withMilliseconds: true, withTimezone: true })).toBe(true);
    });

    test('valid ISO string with date only', () => {
        expect(scriptingTools.isISOString('2023-03-15', { withDate: true, withTime: false })).toBe(true);
    });

    test('valid ISO string with time only', () => {
        expect(scriptingTools.isISOString('12:34:56', { withDate: false, withTime: true })).toBe(true);
        expect(scriptingTools.isISOString('12:34:56.789', { withDate: false, withTime: true, withMilliseconds: true })).toBe(true);
    });

    test('invalid ISO string with missing date', () => {
        expect(scriptingTools.isISOString('T12:34:56')).toBe(false);
    });

    test('invalid ISO string with missing time', () => {
        expect(scriptingTools.isISOString('2023-03-15T')).toBe(false);
    });

    test('invalid ISO string with incorrect format', () => {
        expect(scriptingTools.isISOString('15-03-2023T12:34:56')).toBe(false);
        expect(scriptingTools.isISOString('2023/03/15T12:34:56')).toBe(false);
    });

    test('invalid ISO string with extra characters', () => {
        expect(scriptingTools.isISOString('2023-03-15T12:34:56abc')).toBe(false);
    });

    test('valid ISO string with timezone but without milliseconds', () => {
        expect(scriptingTools.isISOString('2023-03-15T12:34:56Z', { withMilliseconds: false, withTimezone: true })).toBe(true);
    });

    test('invalid ISO string with milliseconds when not allowed', () => {
        expect(scriptingTools.isISOString('2023-03-15T12:34:56.789', { withMilliseconds: false })).toBe(false);
    });

    test('invalid ISO string with timezone when not allowed', () => {
        expect(scriptingTools.isISOString('2023-03-15T12:34:56Z', { withTimezone: false })).toBe(false);
    });

    test('invalid ISO string with neither date nor time', () => {
        expect(scriptingTools.isISOString('', { withDate: false, withTime: false })).toBe(false);
    });
});
