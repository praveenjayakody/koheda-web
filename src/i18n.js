import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// don't want to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init
i18n
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources: {
            en: {
                welcome: require('./locales/en/welcome.json'),
                general: require('./locales/en/general.json'),
                home: require('./locales/en/home.json'),
                account: require('./locales/en/account.json'),
                title: require('./locales/en/title.json'),
            },
            si: {
                welcome: require('./locales/si/welcome.json'),
                general: require('./locales/si/general.json'),
                home: require('./locales/si/home.json'),
                account: require('./locales/si/account.json'),
                title: require('./locales/si/title.json'),
            }
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });
export default i18n;