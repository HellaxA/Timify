import { addItemAsync, fetchCategories, updateItemAsync, updateItemWithCategoryAsync } from '@/db/db_setup';
import { ItemEntity } from '@/src/entities/item';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { CategoryEntity } from '@/src/entities/category';

interface Props {
    itemId: number | null;
}

export default function AddOrEditItem({ itemId }: Props) {
    const db = useSQLiteContext();
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const [categories, setCategories] = useState<CategoryEntity[]>([]);
    const refetchCategories = useCallback(() => {
        const fetchedCategories = fetchCategories(db);
        setCategories(fetchedCategories);
    }, [db]);
    useFocusEffect(refetchCategories);//TODO remove useFocusEffect maybe

    const [item, setItem] = useState<ItemEntity>();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>();
    useEffect(() => {
        const fetchItem = () => {
            console.log('fetching item');
            if (itemId != null) {
                const fetchedItem = db.getFirstSync<ItemEntity>('SELECT * FROM items WHERE id = ?', itemId); // TODO get the logic to db_setup.sql
                if (fetchedItem != null) {
                    setItem(fetchedItem);
                }
                setHours(fetchedItem?.hours || 0);
                setMinutes(fetchedItem?.minutes || 0);
            };
        }
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
        if (categories.length > 0) {
            fetchCategory();//TODO what if there are 0 categories available
        } 
        fetchItem();//It is called twice on re-render because render -> useEffect() -> fetchItem() -> useFocusEffect() -> setCategories() -> re-render -> fetchItem()

    }, [itemId, categories, db]);

    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Hours</Text>
                    <TextInput onChangeText={(hours) => setHours(+hours)}
                        placeholder="HH"
                        style={styles.input}
                        value={hours.toString()}
                        keyboardType='numeric'
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Minutes</Text>
                    <TextInput
                        onChangeText={(minutes) => setMinutes(+minutes)}
                        placeholder='MM'
                        style={styles.input}
                        value={minutes.toString()}
                        keyboardType='numeric'
                    /> 
                </View>
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
            <TouchableOpacity 
                style={styles.addItem}
                onPress={async () => {
                    if (selectedCategoryId == null) {// apparently this is here in case there are 0 categories
                        console.log('selectedCategoryId is null');
                    } else {
                        if (itemId == null) {
                            await addItemAsync(db, hours, minutes, selectedCategoryId);
                        } else {
                            if (selectedCategoryId === item?.categoryId) {
                                await updateItemAsync(db, hours, minutes, itemId);
                            } else {
                                console.log("Selected cat id: " + selectedCategoryId);
                                await updateItemWithCategoryAsync(db, hours, minutes, itemId, selectedCategoryId);
                            }
                        }
                        router.back();
                    }
                }}
            >
                <Text style={styles.heading}>Save Item!</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minWidth: 60,
        textAlign: 'center',
        fontSize: 16,
    },
    flexRow: {
        marginBottom: 20,
        flexDirection: 'row',
    },
    inputGroup: {
        flex: 1, // each group takes half of the row
        alignItems: 'center',
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    picker: {
        height: 60,
        backgroundColor: '#f0f0f0',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    addItem: {
        marginTop: 20,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: '#006742',
        padding: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    inputLabel: {
        fontSize: 12
    }
});