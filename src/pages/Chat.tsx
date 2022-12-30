import React, { createRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Chat = () => {
  const scrollRef = createRef<ScrollView>();

  const scrollViewSizeChanged = (height: number) => {
    scrollRef.current?.scrollTo({ y: height, animated: true });
  };

  return (
    <View style={styles.Container}>
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={(width, height) => {
          scrollViewSizeChanged(height);
        }}>
        <Text style={styles.child}>child</Text>
        <Text style={styles.child}>child</Text>
        <Text style={styles.child}>child</Text>
        <Text style={styles.child}>child</Text>
        <Text style={styles.child}>child</Text>
      </ScrollView>
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
