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
import Chart from '@/src/components/chart';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Main />
    </View>
  );
}
export interface DataPiece {
  id: number,
  value: number;
  text: string;
  color: string;
}

const DefaultDataPiece = { value: 1, text: 'Nothing Done :((', color: 'white', id: -1 }

export const Colors = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#0082c8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#d2f53c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#aa6e28',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000080',
  '#808080',
]

export function Main() {
  const db = useSQLiteContext();
  const [data, setData] = useState<DataPiece[]>([DefaultDataPiece]);
  const [curDate, setCurDate] = useState<Date>(new Date());
  const [items, setItems] = useState<ItemEntityWithCatName[]>([]);
  const [dayItems, setDayItems] = useState<Map<string, ItemEntityWithCatName[]>>(new Map())
  const [isChart, setChart] = useState<boolean>(false)

  const refetchItems = useCallback(() => {
    const newItems = getAllItemsSorted(db, curDate)
    setItems(newItems);
    const dayItems = getCatItemMap(newItems);
    setDayItems(
      dayItems
    );
    setData(parseItemsToChartItemFormat(newItems));
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
      <View style={styles.chartBox}>
        <TouchableOpacity
          style={styles.chartToggle}
          onPress={() => setChart(!isChart)}>
          <Text style={styles.toggleTitle}>{!isChart && 'Show Chart' || isChart && 'Show List'}</Text>
        </TouchableOpacity>
      </View>
      {isChart && <Chart data={data}/>}

      {!isChart && <ScrollView style={styles.listArea}>
        <View style={styles.sectionContainer}>
          {Array.from(dayItems.entries())
            .map(([date, items]) => (
              <View key={date} style={{ marginBottom: 10 }}>
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
      }
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

function parseItemsToChartItemFormat(items: ItemEntityWithCatName[]) {
  let res = []
  if (items.length === 0) {
    return [DefaultDataPiece];
  }
  let catHours = new Map();

  for (let i = 0; i < items.length; i++) {
    let curCatName = items[i].categoryName
    if (!catHours.has(curCatName)) {
      catHours.set(curCatName, items[i].hours * 60 + items[i].minutes)
    } else {
      catHours.set(curCatName, catHours.get(curCatName) + items[i].hours * 60 + items[i].minutes)
    }
  }

  let colorId = 0;
  let id = 0;
  for (let [key, value] of catHours) {
    if (colorId === Colors.length) colorId = 0;
    res.push(
      {
        "id": id++,
        "text": key,
        "value": value,
        "color": Colors[colorId++],
      }
    )
  }

  return res;
}

function getCatItemMap(newItems: ItemEntityWithCatName[]) {
  return newItems.reduce((map: Map<string, ItemEntityWithCatName[]>, item: ItemEntityWithCatName) => {
    const key = item.create_time;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
    return map;
  }, new Map<string, ItemEntityWithCatName[]>());
}

const styles = StyleSheet.create({
  addItem: {
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: '#3D4E8C',
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
  chart: {
    flex: 1,
    alignItems: 'center'
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
  },
  chartBox: {
    marginBottom: 10,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  chartToggle: {
    backgroundColor: '#232B5D',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius:5  

  // padding: 15px 32px;
  // text-align: center;
  // text-decoration: none;
  // display: inline-block;
  // font-size: 16px;
  },
  toggleTitle: {
    color: 'white',
  }
});

