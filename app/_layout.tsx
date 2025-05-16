import Import from "@/src/components/import";
import { migrateDbIfNeeded } from "@/src/db/db_setup";
import { exportDb, importDb } from "@/src/port/port";
import { Stack } from "expo-router";
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName='timify.db' onInit={migrateDbIfNeeded}>
      <NoDbLayout></NoDbLayout>
    </SQLiteProvider>
  )

}
export function NoDbLayout() {
  const db = useSQLiteContext();
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#3D4E8C',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20
      }
    }}>
      <Stack.Screen name="(tabs)" options={{
        title: 'Timify',
        headerRight: () => (
          <>
            <TouchableOpacity style={styles.chartToggle}
              onPress={() => exportDb(db)}>
              <Text style={styles.toggleTitle}>Export</Text>
            </TouchableOpacity>
            <Import db={db}/>
          </>
        )
      }} />
      <Stack.Screen name="addItem" options={{ title: 'Add Item' }} />
      <Stack.Screen name="editItem" options={{ title: 'Edit Item' }} />
      <Stack.Screen name="addCategory" options={{ title: 'Add Category' }} />
      <Stack.Screen name="editCategory" options={{ title: 'Edit Category' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  chartToggle: {
    backgroundColor: '#232B5D',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius:5  
  },
  toggleTitle: {
    color: 'white',
  }
})