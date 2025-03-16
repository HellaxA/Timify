import { addItemAsync, fetchCategories, updateItemAsync } from '@/db/db_setup';
import { ItemEntity } from '@/src/entities/item';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { CategoryEntity } from '@/src/entities/category';

interface Props {
    itemId: number | null;
}

export default function AddOrEditItem({ itemId }: Props) {
    const db = useSQLiteContext();
    const [text, setText] = useState('');
    const [item, setItem] = useState<ItemEntity>();
    const [selectedValue, setSelectedValue] = useState<string>('apple');
    useEffect(() => {
        if (itemId != null) {
            const fetchItem = () => {
                const fetchedItem = db.getFirstSync<ItemEntity>('SELECT * FROM items WHERE id = ?', itemId); // TODO get the logic to db_setup.sql
                if (fetchedItem != null) {
                    setItem(fetchedItem);
                }
                setText(fetchedItem?.description || '');
            };
            fetchItem();
        }
    }, [itemId]);

    const [categories, setCategories] = useState<CategoryEntity[]>([]);

    const refetchCategories = useCallback(() => {
       setCategories(
            fetchCategories(db)
       );
    }, []);
    useFocusEffect(refetchCategories);

    return (
        <View style={styles.container}>
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
            <View>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue: SetStateAction<string>, itemIndex: any) => setSelectedValue(itemValue)}
                    style={styles.picker}
                >
                    {categories.map((category) => (
                        <Picker.Item label={category.name} value={category.name} key={category.id} />
                    ))}

                </Picker>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    input: {
        borderRadius: 4,
        borderWidth: 1,
        flex: 1,
        height: 48,
        padding: 8,
    },
    flexRow: {
        flexDirection: 'row',
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    picker: {
        height: 60,
        backgroundColor: '#f0f0f0',
    },
});