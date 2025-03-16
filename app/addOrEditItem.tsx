import { addItemAsync, fetchCategories, updateItemAsync, updateItemWithCategoryAsync } from '@/db/db_setup';
import { ItemEntity } from '@/src/entities/item';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
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

    const [categories, setCategories] = useState<CategoryEntity[]>([]);
    const refetchCategories = useCallback(() => {
        setCategories(
            fetchCategories(db)
       );
    }, []);
    useFocusEffect(refetchCategories);

    const [item, setItem] = useState<ItemEntity>();
    useEffect(() => {
        const fetchItem = () => {
            if (itemId != null) {
                const fetchedItem = db.getFirstSync<ItemEntity>('SELECT * FROM items WHERE id = ?', itemId); // TODO get the logic to db_setup.sql
                if (fetchedItem != null) {
                    setItem(fetchedItem);
                }
                setText(fetchedItem?.description || '');
            };
        }
        fetchItem();
    }, [itemId]);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>();
    useEffect(() => {//TODO move to useEffect up in the Item
        const fetchCategory = () => {
            if (itemId != null) {
                const fetchedCategory = db.getFirstSync<CategoryEntity>('SELECT * FROM categories WHERE id = (SELECT category_id FROM items WHERE id = ?)', itemId); // TODO get the logic to db_setup.sql
                if (fetchedCategory != null) {
                    console.log('Fetched cat for this item: ' + fetchedCategory.id);
                    setSelectedCategoryId(fetchedCategory.id);
                }

            } else {
                console.log('Cats len: ' + categories.length);
                if (categories.length !== 0) {
                    setSelectedCategoryId(categories[0].id);
                }
            }
        }
        fetchCategory();
    }, [itemId, categories]);

    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <TextInput
                    onChangeText={(text) => setText(text)}
                    onSubmitEditing={async () => {
                        if (selectedCategoryId == null) {
                            console.log('selectedCategoryId is null');
                        } else {
                            if (itemId == null) {
                                await addItemAsync(db, text, selectedCategoryId);
                            } else {
                                if (selectedCategoryId === item?.categoryId) {
                                    await updateItemAsync(db, text, itemId);
                                } else {
                                    console.log("Selected cat id: " + selectedCategoryId);
                                    await updateItemWithCategoryAsync(db, text, itemId, selectedCategoryId);
                                }
                            }
                            router.back();
                        }
                    }}
                    placeholder="What have you done this time?"
                    style={styles.input}
                    value={text}
                />
            </View>
            <View>
                <Picker
                    selectedValue={selectedCategoryId}
                    onValueChange={(categoryId) => {
                        setSelectedCategoryId(categoryId);
                    }}
                    style={styles.picker}
                >
                    {categories.map((category) => (
                        <Picker.Item label={category.name} value={category.id} key={category.id} />
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