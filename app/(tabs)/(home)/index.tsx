import { useFocusEffect, router} from 'expo-router';
import {  } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  useSQLiteContext
} from 'expo-sqlite';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ItemEntity } from '@/src/Item';
import { CategoryEntity } from '@/src/Category';
import { deleteItemAsync } from '@/db/db_setup';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Main />
    </View>
  );
}
export function Main() {
  console.log('Main begin');

  const db = useSQLiteContext();
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);

  const refetchItems = async function() {
      // TODO add to README.md
      // -> React renders the element, executes Main, executes setItems -> setItems calls re-render -> infinite loop.
      setItems(
        db.getAllSync<ItemEntity>(
          'SELECT * FROM items'
        )
      );
  }
  // TODO add to README.md
  // useFocusEffect if you want it to reexecute the function everytime user focuses on this Screen.
  useFocusEffect(
    useCallback(() => {
      refetchItems();
    }, [db])
  );


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
                refetchItems();
              }}
            />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addItem}
        onPress={() => router.push("/addItem")}
      >
        <Text style={styles.heading}>Add Item</Text>
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