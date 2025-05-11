import { addItemAsync, fetchCategories, updateItemAsync, updateItemWithCategoryAsync } from '@/src/db/db_setup';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ItemEntity } from '@/src/entities/item';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { CategoryEntity } from '@/src/entities/category';
import { formatDate, getLongMonth } from '@/src/utils/utilities';

interface Props {
    itemId: number | null;
}

export default function AddOrEditItem({ itemId }: Props) {
    const db = useSQLiteContext();
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [date, setDate] = useState(new Date());

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
            if (itemId != null) {
                const fetchedItem = db.getFirstSync<ItemEntity>('SELECT * FROM items WHERE id = ?', itemId); // TODO get the logic to db_setup.sql
                if (fetchedItem != null) {
                    setItem(fetchedItem);
                }
                setHours(fetchedItem?.hours || 0);
                setMinutes(fetchedItem?.minutes || 0);
                const splitDate = fetchedItem!.create_time.split("/");
                setDate(new Date(+splitDate[2], +splitDate[1] - 1, +splitDate[0]));
            };
        }
        const fetchCategory = () => {
            if (itemId != null) {
                const fetchedCategory = db.getFirstSync<CategoryEntity>('SELECT * FROM categories WHERE id = (SELECT category_id FROM items WHERE id = ?)', itemId); // TODO get the logic to db_setup.sql
                if (fetchedCategory != null) {
                    setSelectedCategoryId(fetchedCategory.id);
                }

            } else {
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

    const [show, setShow] = useState(false);
  
    const onChange = (event: DateTimePickerEvent, date?: Date | undefined) => {
        if (date) {
            setDate(date);
        }
        setShow(false);
    }

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
            <View>
                <TouchableOpacity 
                    style={styles.date}
                    onPress={() => setShow(true)}>

                    <Text style={styles.dateHeading}>{formatDate(date)}</Text>
                </TouchableOpacity>

                <View>
                    {show && (
                        <DateTimePicker
                            value={date}
                            mode='date'
                            is24Hour={true}
                            display='spinner'
                            onChange={onChange}
                        />
      )}
                </View>
            </View>
            <TouchableOpacity 
                style={styles.addItem}
                onPress={async () => {
                    if (selectedCategoryId == null) {// apparently this is here in case there are 0 categories
                        console.log('selectedCategoryId is null');
                    } else {
                        if (itemId == null) {
                            await addItemAsync(db, hours, minutes, formatDate(date), selectedCategoryId);
                        } else {
                            if (selectedCategoryId === item?.categoryId) {
                                await updateItemAsync(db, hours, minutes, formatDate(date), itemId);
                            } else {
                                // console.log("Selected cat id: " + selectedCategoryId);
                                await updateItemWithCategoryAsync(db, hours, minutes, formatDate(date), itemId, selectedCategoryId);
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
        fontSize: 16,
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
    },
    date: {
        marginTop: 20,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        padding: 10,
        borderColor: '#ccc',
        
    },
    dateHeading: {
        fontSize: 16,
        textAlign: 'center',
    },
});