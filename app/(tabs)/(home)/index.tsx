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
import { ItemEntity } from '@/src/entities/item';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Main />
    </View>
  );
}
export function Main() {
  const db = useSQLiteContext();
  const [items, setItems] = useState<ItemEntity[]>([]);

  const refetchItems = useCallback(() => {
    setItems(
      db.getAllSync<ItemEntity>(
        'SELECT * FROM items'// TODO get the logic to db_setup.sql
      )
    );
  }, []);
  
  useFocusEffect(refetchItems);

  function editItem(id: number) {
    router.push(`/editItem?itemId=${id}`);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.listArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Logged Activities</Text>
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
              onPressItem={ (id) => {
                editItem(id);
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
  const { id, hours, minutes } = item;
  return (
    <TouchableOpacity
      onPress={() => onPressItem?.(id) }
      style={(styles.item)}
    >

      <Text style={styles.itemText}>
        {hours}h {minutes}m
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
    // paddingTop: 32,
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