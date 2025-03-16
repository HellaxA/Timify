import { migrateDbIfNeeded } from "@/db/db_setup";
import { Stack } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName='timify.db' onInit={migrateDbIfNeeded}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#006742',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20
          }
        }}>
        <Stack.Screen name="(tabs)" options={{ title: 'Timify' }} />
      <Stack.Screen name="addItem" options={{ title: 'Add Item' }}/>
      <Stack.Screen name="editItem" options={{ title: 'Edit Item' }}/>
      <Stack.Screen name="addCategory" options={{ title: 'Add Category' }}/>
      <Stack.Screen name="editCategory" options={{ title: 'Edit Category' }}/>
      </Stack>
    </SQLiteProvider>

  );
}
