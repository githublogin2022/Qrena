import React from 'react';
import { Text, FlatList, StyleSheet, View } from 'react-native';

import { useTypedSelector, useTypedDispatch } from '../modules/app/hooks';
import { updateVisibility } from '../modules/app/searchBarSlice';

const Chats = () => {
  const dispatch = useTypedDispatch();
  const {
    theme: { theme },
    searchBar: { isVisible, searchText },
  } = useTypedSelector((state) => state);

  const data = [
    { id: '1', user: 'Ahmed' },
    { id: '2', user: 'salaah' },
    { id: '3', user: 'mohamed' },
    { id: '4', user: 'maged' },
    { id: '5', user: 'gehan' },
  ];

  const filterData = (searchString: string) => {
    const filteredData = data.filter((item) => item.user.toLowerCase().toString().includes(searchString.toLowerCase()));

    return filteredData;
  };

  return (
    <FlatList
      style={[{ backgroundColor: theme.colors.background }]}
      data={filterData(searchText)}
      renderItem={({ item }) => <Text style={{ color: theme.colors.contrastText }}>{item.user}</Text>}
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
