import React, { createRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const Chat = () => {
  const flatListRef = createRef<FlatList>();
  const data = [{ id: '1', text: 'hey' }];

  return (
    <View style={styles.Container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => <Text style={styles.child}>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.footer}>
        <Text>footer</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1 },
  child: { color: 'black' },
  footer: { backgroundColor: 'red', height: 90, justifyContent: 'center', alignItems: 'center' },
});

export default Chat;
