import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
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
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="addItem" options={{ title: 'Add Item' }}/>
      <Stack.Screen name="editItem" options={{ title: 'Edit Item' }}/>
    </Stack>
  );
}
