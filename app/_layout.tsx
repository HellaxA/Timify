import { migrateDbIfNeeded } from "@/db/db_setup";
import { Stack } from "expo-router";
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

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
      </Stack>
    </SQLiteProvider>

  );
}
