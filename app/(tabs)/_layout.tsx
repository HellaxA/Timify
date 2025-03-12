import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="(home)" options={{
                headerShown: false,
                title: "Items",
                tabBarIcon: () => (
                    <AntDesign name="book" size={24} color="black" />
                ),

            }}/>
            <Tabs.Screen name="categories" options={{
                headerShown: false,
                title: "Categories",
                tabBarIcon: () => (
                    <MaterialIcons name="category" size={24} color="black" />
                ),
            }} />
        </Tabs>
    );
}