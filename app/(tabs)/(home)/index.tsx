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
import { Category } from '@/src/Category';// TODO change to CategoryEntity

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
  const [categories, setCategories] = useState<Category[]>([]);

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
      <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Todo</Text>
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
            />
          ))}
        </View>
    </View>
  );
}

function Item({item}: {item: ItemEntity}) {
  const { id, description } = item;
  console.log("Rendering the Item: ", item);
  return (
      <Text style={styles.itemText}>
        {description}
      </Text>
  );
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

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{ user_version: number; }>('PRAGMA user_version');
  if (result == null) {
    throw new Error('Failed to retrieve the current database version');
  }
  let currentDbVersion = result.user_version;

  console.log('Current db version: ', currentDbVersion);
  await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, description TEXT);`);
  currentDbVersion = 1;
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);


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
    borderColor: '#4630eb',
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