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
import { getAllItemsSorted } from '@/src/db/db_setup';
import { ItemEntityWithCatName } from '@/src/entities/itemWithCatName';
import { formatDate, get4DigitYear, getLongMonth } from '@/src/utils/utilities';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Main />
    </View>
  );
}
export function Main() {
  const db = useSQLiteContext();

  const [curDate, setCurDate] = useState<Date>(new Date());
  const [dayItems, setItems] = useState<Map<string, ItemEntityWithCatName[]>>(new Map())
  const refetchItems = useCallback(() => {
    const items = getAllItemsSorted(db, curDate)
    const dayItems = items.reduce((map: Map<string, ItemEntityWithCatName[]>, item: ItemEntityWithCatName) => {
      const key = item.create_time;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
      return map;
    }, new Map<string, ItemEntityWithCatName[]>());
    setItems(
      dayItems
    );
  }, [db]);
  
  useFocusEffect(refetchItems);

  function editItem(id: number) {
    router.push(`/editItem?itemId=${id}`);
  }

  function nextMonth() {
    if (curDate.getMonth() === 11) {
      curDate.setFullYear(curDate.getFullYear() + 1)
      curDate.setMonth(0)
    } else {
      curDate.setMonth(curDate.getMonth() + 1)
    }
    setCurDate(curDate)
    refetchItems()
  }

  function prevMonth() {
    if (curDate.getMonth() === 0) {
      curDate.setFullYear(curDate.getFullYear() - 1)
      curDate.setMonth(11)
    } else {
      curDate.setMonth(curDate.getMonth() - 1)
    }
    setCurDate(curDate)
    refetchItems()
  }

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => prevMonth()}
        >
          <Text style={styles.navHeading}>Prev</Text>
        </TouchableOpacity>
        <View style={styles.navButton}>
          <Text style={styles.navHeading}>{getLongMonth(curDate)} {get4DigitYear(curDate)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => nextMonth()}
        >
          <Text style={styles.navHeading}>Next</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.listArea}>
        <View style={styles.sectionContainer}>
          {Array.from(dayItems.entries())
            .map(([date, items]) => (
              <View key={date} style={{marginBottom: 10}}>
                <Text>{date.split("/")[0]}th</Text>
                {items.map((item) => (
                  <Item
                    key={item.id}
                    item={item}
                    onPressItem={(id) => {
                      editItem(id);
                    }}
                  />
                ))}
              </View>
            ))
          }
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addItem}
        onPress={() => router.push(`/addItem?curDate=${formatDate(curDate)}`)}
      >
        <Text style={styles.heading}>Add Item</Text>

      </TouchableOpacity>
    </View>
  );
}

function Item({item, onPressItem}:
  {
    item: ItemEntityWithCatName;
    onPressItem: (id: number) => void | Promise<void>;
  }) {
  const { id, hours, minutes, create_time, categoryName } = item;
  // console.log("ID: " + id)
  // console.log("hours: " + hours)
  // console.log("create: " + create_time)
  // console.log("cat: " + categoryName)
  return (
    <TouchableOpacity
      onPress={() => onPressItem?.(id) }
      style={(styles.item)}
    >

      <Text style={styles.itemText}>
        {hours}h {minutes > 0 && minutes + "m"} --- {categoryName}
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
    borderBottomWidth: 1,
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
  navRow: {
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
  },
  navButton: {
    flex: 1, // each group takes half of the row
    borderRadius: 4,
    borderLeftWidth: 1,
    alignItems: 'center',
  },
  navHeading: {
    fontSize: 18,
    marginBottom: 8,
  }
});