import { fetchCategories } from '@/db/db_setup';
import { CategoryEntity } from '@/src/entities/category';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native';

export default function SettingsScreen() {
    const db = useSQLiteContext();
    const [categories, setCategories] = useState<CategoryEntity[]>([]);

    const refetchCategories = useCallback(() => {
       setCategories(
            fetchCategories(db)
       );
    }, []);
    useFocusEffect(refetchCategories);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.listArea}>
                <View style={styles.sectionContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => editCategory()}
                            style={(styles.item)}
                        >

                            <Text 
                                style={styles.itemText}>
                                {category.name}
                            </Text>

                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function editCategory() {
    console.log('Editing Category...');
}

const styles = StyleSheet.create({
  addItem: {
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: '#006742',
    padding: 10,

  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  flexRow: {
    flexDirection: 'row',
  },
  input: {
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
  item: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    padding: 8,
  },
  itemDone: {
    backgroundColor: '#1c9963',
  },
  itemText: {
    color: '#000',
  },
  itemTextDone: {
    color: '#fff',
  },
});