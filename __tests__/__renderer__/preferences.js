/* eslint-disable no-undef */
'use strict';

const fs = require('fs');
const path = require('path');
const {
    defaultPreferences,
    getPreferencesFilePath,
    savePreferences
} = require('../../js/user-preferences');

/* eslint-disable-next-line no-global-assign */
window.$ = require('jquery');
const { refreshContent, changeValue } = require('../../src/preferences');

function prepareMockup()
{
    const userPreferences = path.join(__dirname, '../../src/preferences.html');
    const content = fs.readFileSync(userPreferences);
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(content, 'text/html');
    document.body.innerHTML = htmlDoc.body.innerHTML;
}

describe('Test Preferences Window', () =>
{
    process.env.NODE_ENV = 'test';

    const preferencesFilePath = getPreferencesFilePath();
    if (fs.existsSync(preferencesFilePath)) fs.unlinkSync(preferencesFilePath);

    let testPreferences = defaultPreferences;
    testPreferences['number-of-entries'] = 'flexible';
    testPreferences['view'] = 'day';
    testPreferences['theme'] = 'light';

    describe('Changing value of number-of-entries', () =>
    {
        test('Changing number-of-entries to flexible', () =>
        {
            prepareMockup();

            $('#number-of-entries').val(testPreferences['number-of-entries']);
            changeValue('number-of-entries', 'flexible');

            savePreferences(testPreferences);
            refreshContent();
            expect($('#number-of-entries').val()).toBe('flexible');
        });
    });

    describe('Changing value of view', () =>
    {
        test('Changing view from month to day', () =>
        {
            prepareMockup();

            $('#view').val(testPreferences['view']);
            changeValue('view', 'day');

            savePreferences(testPreferences);
            refreshContent();
            expect($('#view').val()).toBe('day');
        });
    });

    describe('Changing value of theme', () =>
    {
        test('Changing theme from system-default to light', () =>
        {
            prepareMockup();

            $('#theme').val(testPreferences['theme']);
            changeValue('theme', 'light');

            savePreferences(testPreferences);
            refreshContent();
            expect($('#theme').val()).toBe('light');
        });
    });
});
