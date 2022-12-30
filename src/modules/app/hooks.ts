import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import type { RootState, AppDispatch, RootStackParams } from './types';

export const useTypedDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedNavigation = () => useNavigation<NativeStackNavigationProp<RootStackParams>>();
