import { Link, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from 'expo-sqlite';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ItemEntity } from '@/src/Item';
import { CategoryEntity } from '@/src/Category';
import { migrateDbIfNeeded, addItemAsync, deleteItemAsync } from '@/db/db_setup';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName='timify.db' onInit={migrateDbIfNeeded}>
        <Main />
      </SQLiteProvider>
    </View>
  );
}
export function Main() {
  const db = useSQLiteContext();
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);

  const refetchItems = useCallback(() => {
    async function refetch() {
      console.log('Executing refetch()')
      await db.withExclusiveTransactionAsync(async () => {
        console.log('In db.exec')
        setItems(
          await db.getAllAsync<ItemEntity>(
            'SELECT * FROM items'
          )
        );
      })
    }
    refetch();
  }, [db]);

  useEffect(() => {
    console.log('In useEffect');
    refetchItems();
  }, []);
  // TODO deleteItem doesn't work after addItem on the separate page
  // TODO list isn't updated after adding an item 


  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('Screen focues, executing refetech...');
  //     refetchItems();
  //   }, [refetchItems])
  // );

  return (
    <View style={styles.container}>
      {/* <View style={styles.flexRow}>
        <TextInput
          onChangeText={(text) => setText(text)}
          onSubmitEditing={async () => {
            await addItemAsync(db, text);
            await refetchItems();
            setText('');
          }}
          placeholder="What have you done this time?"
          style={styles.input}
          value={text}
        />
      </View> */}
      <ScrollView style={styles.listArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Logged Activities</Text>
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
              onPressItem={async (id) => {
                await deleteItemAsync(db, id);
                await refetchItems();
              }}
            />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addItem}>
        <Link href="/addItem" style={styles.heading}>Add Item</Link>
      </TouchableOpacity>
    </View>
  );
}

function Item({item, onPressItem}:
  {
    item: ItemEntity;
    onPressItem: (id: number) => void | Promise<void>;
  }) {
  const { id, description } = item;
  return (
    <TouchableOpacity
      onPress={() => onPressItem?.(id) }
      style={(styles.item)}
    >

      <Text style={styles.itemText}>
        {description}
      </Text>
    </TouchableOpacity>
  );
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
    paddingTop: 32,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  input: {
    // borderColor: '#4630eb',
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