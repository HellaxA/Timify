
import { addItemAsync, updateItemAsync } from '@/db/db_setup';
import { ItemEntity } from '@/src/Item';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput
} from 'react-native';

interface Props {
    itemId: number | null;
}

export default function Main({ itemId }: Props) {
    const db = useSQLiteContext();
    const [text, setText] = useState('');
    const [item, setItem] = useState<ItemEntity>();

    useEffect(() => {
        if (itemId != null) {
            const fetchItem = () => {
                const fetchedItem = db.getFirstSync<ItemEntity>('SELECT * FROM items WHERE id = ?', itemId); // TODO get the logic to db_setup.sql
                console.log(fetchedItem);
                if (fetchedItem != null) {
                    setItem(fetchedItem);
                }
                setText(fetchedItem?.description || '');
            };
            fetchItem();
        }
    }, [itemId]);

    return (
        <View style={styles.flexRow}>
            <TextInput
                onChangeText={(text) => setText(text)}
                onSubmitEditing={async () => {
                    if (itemId == null) {
                        await addItemAsync(db, text);
                    } else {
                        await updateItemAsync(db, text, itemId);
                    }
                    router.back();
                }}
                placeholder="What have you done this time?"
                style={styles.input}
                value={text}
            />
        </View>
    )
}
const styles = StyleSheet.create({
  input: {
    // borderColor: '#4630eb',
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  flexRow: {
    flexDirection: 'row',
  },
});