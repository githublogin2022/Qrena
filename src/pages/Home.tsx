import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HomeProps {
  toggleTabBar: (display: 'none' | undefined) => void;
}

const Home: React.FC<HomeProps> = (props) => {
  const { toggleTabBar } = props;

  useEffect(() => {
    toggleTabBar(undefined);
  }, [toggleTabBar]);

  return (
    <View style={styles.Container}>
      <Text> welcome from Home </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
