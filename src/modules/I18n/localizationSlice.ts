import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as RNLocalize from 'react-native-localize';

import i18n from './i18n';

const getLanguageCode = () => {
  const currentLanguageCode = RNLocalize.getLocales()[0].languageCode;

  return ['en', 'ar'].includes(currentLanguageCode) ? currentLanguageCode : 'en';
};

const initialState = {
  language: getLanguageCode(),
} as {
  language: string;
};

i18n.defaultLocale = getLanguageCode();
i18n.locale = getLanguageCode();

const {
  reducer,
  actions: { changeLanguage },
} = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    changeLanguage: (state, { payload }: PayloadAction<string>) => {
      state.language = payload;
      i18n.defaultLocale = payload;
      i18n.locale = payload;
    },
  },
});

export { changeLanguage };

export default reducer;
