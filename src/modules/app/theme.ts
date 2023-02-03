import { Appearance, ColorSchemeName, Dimensions } from 'react-native';
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { MD3LightTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Type = 'user' | 'phone';

const initialState = {
  theme: {
    ...MD3LightTheme,
    dark: false,
    custom: 'property',
    windowHeight: Dimensions.get('window').height,
    windowWidth: Dimensions.get('window').width,
    colors: {
      ...MD3LightTheme.colors,
      primary: 'rgba(24, 166, 211, 1)',
      secondary: 'rgba(41, 39, 39, 1)',
      tertiary: 'rgba(65, 178, 156, 1)',
      background: 'rgba(255, 255, 255, 1)',
      header: 'rgba(255, 255, 255, 1)',
      contrastText: 'rgba(0, 0, 0, 1)',
      error: 'rgb(255, 0, 0)',
      white: 'rgba(256, 256, 256, 1)',
      grey: {
        '50': 'rgba(250, 250, 250, 1)',
        '100': '#f5f5f5',
        '200': 'rgba(245, 245, 245, 1)',
        '300': 'rgba(224, 224, 224, 1)',
        '400': 'rgba(189, 189, 189, 1)',
        '500': 'rgba(158, 158, 158, 1)',
        '600': 'rgba(117, 117, 117, 1)',
        '700': 'rgba(97, 97, 97, 1)',
        '800': 'rgba(66, 66, 66, 1)',
        '900': 'rgba(33, 33, 33, 1)',
        A100: 'rgba(245, 245, 245, 1)',
        A200: 'rgba(238, 238, 238, 1)',
        A400: 'rgba(189, 189, 189, 1)',
        A700: 'rgba(97, 97, 97, 1)',
      },
    },
  },
};

export const read = createAsyncThunk(
  'theme/read',
  async () => (await AsyncStorage.getItem('colorScheme')) || Appearance.getColorScheme()
);

export const update = createAsyncThunk(
  'theme/update',
  async ({ type, colorScheme }: { type: Type; colorScheme: ColorSchemeName }) => {
    if (!colorScheme) {
      await AsyncStorage.removeItem('colorScheme');
      colorScheme = Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
    }

    if (type === 'user') {
      await AsyncStorage.setItem('colorScheme', colorScheme);
    }

    return colorScheme;
  }
);

const { reducer } = createSlice({
  name: 'theme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(read.fulfilled, update.fulfilled), (state, { payload }) => {
      if (payload === 'light') {
        state.theme = initialState.theme;
      } else if (payload === 'dark') {
        state.theme = {
          ...initialState.theme,
          dark: true,
          colors: {
            ...initialState.theme.colors,
            secondary: 'rgba(4, 13, 28, 1)',
            background: 'rgba(15, 24, 40, 0.96)',
            header: 'rgba(4, 13, 28, 1)',
            contrastText: 'rgba(256, 256, 256, 1)',
          },
        };
      }
    });
  },
});

export default reducer;
