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

    describe('toWikiLink', () => {
        const scriptingTools = new ScriptingTools();

        test('convert single path string to WikiLink', () => {
            const input = 'path/to/File';
            const result = scriptingTools.toWikiLink(input);
            expect(result).toBe('[[File]]');
        });

        test('convert single path string with extension to WikiLink', () => {
            const input = 'path/to/File.md';
            const result = scriptingTools.toWikiLink(input);
            expect(result).toBe('[[File]]');
        });

        test('convert single string with spaces in title to WikiLink', () => {
            const input = 'path/to/My File';
            const result = scriptingTools.toWikiLink(input, '_');
            expect(result).toBe('[[My_File]]');
        });

        test('convert array of strings to WikiLinks', () => {
            const input = ['path/to/file1|Title1', 'path/to/file2|Title2'];
            const result = scriptingTools.toWikiLink(input);
            expect(result).toBe('[[Title1]], [[Title2]]');
        });

        test('convert array of strings with spaces in titles to WikiLinks', () => {
            const input = ['path/to/file1|My Title1', 'path/to/file2|My Title2'];
            const result = scriptingTools.toWikiLink(input, '_');
            expect(result).toBe('[[My_Title1]], [[My_Title2]]');
        });

        test('return input if not a string or array', () => {
            const input = 12345;
            const result = scriptingTools.toWikiLink(input);
            expect(result).toBe(input);
        });

        test('handle empty string input', () => {
            const input = '';
            const result = scriptingTools.toWikiLink(input);
            expect(result).toBe(input);
        });

        test('handle array with empty strings', () => {
            const input = ['', 'path/to/file1|Title1'];
            const result = scriptingTools.toWikiLink(input);
            expect(result).toBe('[[Title1]]');
        });


    });
});
