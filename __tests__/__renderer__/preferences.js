/* eslint-disable no-undef */
'use strict';

const fs = require('fs');
const path = require('path');
const {
    defaultPreferences,
    getPreferencesFilePath,
    savePreferences
} = require('../../js/user-preferences');
const i18n = require('../../src/configs/i18next.config');

/* eslint-disable-next-line no-global-assign */
window.$ = require('jquery');
const {
    refreshContent,
    populateLanguages,
    listenerLanguage,
    renderPreferencesWindow,
} = require('../../src/preferences');

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

    describe('Initial window with default preferences', () =>
    {
        test('Displays window correctly', () =>
        {
            prepareMockup();

            renderPreferencesWindow();

            //testing to see some of the items are correctly displayed or not
            expect($('#number-of-entries').val()).toBe('fixed');
            expect($('#view').val()).toBe('month');
        });
    });

    describe('Changing value of workday', () =>
    {
        test('Uncheck Monday', () =>
        {
            prepareMockup();

            testPreferences['working-days-monday'] = false;

            $('#monday').val(testPreferences['working-days-monday']);

            savePreferences(testPreferences);
            refreshContent();

            expect($('#monday').val()).toBe('false');
        });
    });

    describe('Changing value of hours-per-day', () =>
    {
        test('Changing 8-hr per day to 6', () =>
        {
            prepareMockup();

            testPreferences['hours-per-day'] = '06:00';

            $('#hours-per-day').val(testPreferences['hours-per-day']);

            savePreferences(testPreferences);
            refreshContent();

            expect($('#hours-per-day').val()).toBe('06:00');
        });
    });

    describe('Changing value of number-of-entries', () =>
    {
        test('Changing number-of-entries to flexible', () =>
        {
            prepareMockup();

            $('#number-of-entries').val(testPreferences['number-of-entries']);

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

            savePreferences(testPreferences);
            refreshContent();
            expect($('#theme').val()).toBe('light');
        });
    });

    describe('Changing language', () =>
    {
        test('From en to pt_BR', () =>
        {
            prepareMockup();
            populateLanguages(i18n);
            listenerLanguage();

            expect($('#language').val()).toBe('en');

            testPreferences['language'] = 'pt-BR';
            $('#language').val(testPreferences['language']);

            savePreferences(testPreferences);
            refreshContent();

            expect($('#language').val()).toBe('pt-BR');
        });
    });
});
