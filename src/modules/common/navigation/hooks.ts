import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from './types';

export const useTypedNavigation = () => useNavigation<NativeStackNavigationProp<RootStackParams>>();
