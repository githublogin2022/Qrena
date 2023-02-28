import React, { createRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { useTypedSelector } from '../modules/app/hooks';

const Messages = () => {
  const flatListRef = createRef<FlatList>();
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);
  const data = [{ id: '1', text: 'hey' }];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={() => <View />}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: { height: 90, justifyContent: 'center', alignItems: 'center' },
});

export default Messages;
