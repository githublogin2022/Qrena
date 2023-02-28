import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useTypedSelector, useTypedDispatch } from '../modules/app/hooks';
import { updateVisibility } from '../modules/app/searchBarSlice';
import { Chat } from '../modules/chats/components';
import { read, readMore } from '../modules/chats/actions';

const Chats = () => {
  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const {
    theme: { theme },
    searchBar: { isVisible, searchText },
    chat: { chats, loadMore },
  } = useTypedSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, SetSnackbarMessage] = useState('');
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null;

    timer = setTimeout(async () => {
      timer = null;

      await onRefresh();
    }, 500);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  const onToggleSnackBar = (message: string) => {
    SetSnackbarMessage(message);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  const onEndReached = async () => {
    setLoading(true);

    await dispatch(readMore({ userType: 'user', queries: `limit=10&skip=${offset * 10}&searchString=${searchText}` }))
      .unwrap()
      .then(() => setOffset(offset + 1))
      .catch((error) => {
        error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
      });

    setLoading(false);
  };

  const onRefresh = async () => {
    setLoading(true);

    await dispatch(read({ userType: 'user', queries: `limit=10&searchString=${searchText}` }))
      .unwrap()
      .then(() => setOffset(1))
      .catch((error) => {
        error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
      });

    setLoading(false);
  };

  return (
    <>
      <FlatList
        style={[{ backgroundColor: theme.colors.background }]}
        data={chats}
        renderItem={({ item: chat }) => <Chat {...chat} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContentContainer}
        ListEmptyComponent={
          offset > 0 && chats.length === 0 ? (
            <View style={styles.flatListContainer}>
              <Text style={{ color: theme.colors.contrastText }}>{t('chats_no_results_text')}</Text>
            </View>
          ) : undefined
        }
        onScroll={() => {
          if (!searchText && isVisible) {
            dispatch(updateVisibility(false));
          }
        }}
        refreshing={loading}
        onRefresh={onRefresh}
        onEndReached={loadMore && !loading ? onEndReached : undefined}
        onEndReachedThreshold={0.05}
      />
      <Snackbar style={{ backgroundColor: theme.colors.tertiary }} visible={visible} onDismiss={onDismissSnackBar}>
        <Text style={[styles.snackbarText, { color: theme.colors.white }]}> {snackbarMessage} </Text>
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  flatListContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flatListContentContainer: { flexGrow: 1 },
  snackbarText: { textAlign: 'center' },
});

export default Chats;
