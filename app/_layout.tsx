import { migrateDbIfNeeded } from "@/db/db_setup";
import { Stack } from "expo-router";
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName='timify.db' onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>

  );
}
