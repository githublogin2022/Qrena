import React from 'react';
import { Text, FlatList, StyleSheet, View } from 'react-native';

import { useTypedSelector, useTypedDispatch } from '../modules/app/hooks';
import { updateVisibility } from '../modules/app/searchBarSlice';
import { Chat } from '../modules/chats/components';

const Chats = () => {
  const dispatch = useTypedDispatch();
  const {
    theme: { theme },
    searchBar: { isVisible, searchText },
  } = useTypedSelector((state) => state);

  const data = [
    {
      id: '1',
      user: 'Ahmed Mohamed',
      content: 'Welcome to chat screen',
      date: new Date('2023-01-15').toLocaleString('en-GB').slice(0, 5),
      notifications: 1,
    },
    {
      id: '2',
      user: 'Sarah Youssef',
      content: 'Welcome to chat screen',
      date: new Date('2023-01-15').toLocaleString('en-GB').slice(0, 5),
      notifications: 1,
    },
    {
      id: '3',
      user: 'Yousra Mostafa',
      content: 'Welcome to chat screen',
      date: new Date('2023-01-15').toLocaleString('en-GB').slice(0, 5),
      notifications: 1,
    },
    {
      id: '4',
      user: 'Mahmoud Shalaby',
      content: 'Welcome to chat screen',
      date: new Date('2023-01-15').toLocaleString('en-GB').slice(0, 5),
      notifications: 1,
    },
    {
      id: '5',
      user: 'Islam Mohamed',
      content: 'Welcome to chat screen',
      date: new Date('2023-01-15').toLocaleString('en-GB').slice(0, 5),
    },
  ];

  const filterData = (searchString: string) => {
    const filteredData = data.filter((item) => item.user.toLowerCase().toString().includes(searchString.toLowerCase()));

    return filteredData;
  };

  return (
    <FlatList
      style={[{ backgroundColor: theme.colors.background }]}
      data={filterData(searchText)}
      renderItem={({ item }) => (
        <Chat user={item.user} content={item.content} date={item.date} notifications={item.notifications} />
      )}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.FlatListContentContainer}
      ListEmptyComponent={
        <View style={styles.FlatListContainer}>
          <Text style={{ color: theme.colors.contrastText }}>No results found</Text>
        </View>
      }
      onScroll={() => {
        if (!searchText && isVisible) {
          dispatch(updateVisibility(false));
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  FlatListContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  FlatListContentContainer: { flexGrow: 1 },
});

export default Chats;
