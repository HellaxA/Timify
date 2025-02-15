import { Link } from 'expo-router';
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
import { migrateDbIfNeeded } from '@/db/db_setup';

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
  const [text, setText] = useState('');
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);

  const refetchItems = useCallback(() => {
    async function refetch() {
      await db.withExclusiveTransactionAsync(async () => {
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
    refetchItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SQLite Example</Text>

      <View style={styles.flexRow}>
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
      </View>
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

async function deleteItemAsync(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM items where id = ?', id);
}

async function addItemAsync(db: SQLiteDatabase, text: string): Promise<void> {
  if (text !== '') {
    try {
      await db.runAsync(
        'INSERT INTO items (description) VALUES (?);',
        text
      );
    } catch (error) {
      console.error('Error inserting into database:', error);
    }
  }
 // let entities = await db.getAllAsync<ItemEntity>(
 //   'SELECT * FROM items'
 // )
 // console.log("Entities: ", entities);
  
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 64,
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