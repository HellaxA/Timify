import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import { CategoryEntity } from '@/src/entities/category';
import { addCategoryAsync, updateCategoryAsync } from '@/src/db/db_setup';

interface Props {
    categoryId: number | null;
}

export default function AddOrEditCategory({ categoryId }: Props) {
    console.log('AddOrEdit catId: ' + categoryId);
    const db = useSQLiteContext();
    const [text, setText] = useState('');
    const [category, setCategory] = useState<CategoryEntity>();
    useEffect(() => {
        if (categoryId != null) {
            const fetchCategory = () => {
                const fetchedCategory = db.getFirstSync<CategoryEntity>('SELECT * FROM categories WHERE id = ?', categoryId); // TODO get the logic to db_setup.sql
                if (fetchedCategory != null) {
                    setCategory(fetchedCategory);
                }
                setText(fetchedCategory?.name || '');
            };
            fetchCategory();
        }
    }, [categoryId]);

    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <TextInput
                    onChangeText={(text) => setText(text)}
                    onSubmitEditing={async () => {
                        if (categoryId == null) {
                            await addCategoryAsync(db, text);
                        } else {
                            await updateCategoryAsync(db, text, categoryId);
                        }
                        router.back();
                    }}
                    placeholder="Category Name..."
                    style={styles.input}
                    value={text}
                />
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