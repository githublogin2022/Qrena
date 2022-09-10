import { I18n } from 'i18n-js';

import { ar, en } from './languages';

const i18n = new I18n({ en: { ...en }, ar: { ...ar } });

export default i18n;
