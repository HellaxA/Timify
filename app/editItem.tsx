import { TouchableOpacity, View,StyleSheet } from "react-native";

import { router } from 'expo-router';
import { useLocalSearchParams, Stack } from "expo-router";
import AddOrEditItem from "./addOrEditItem";
import { Ionicons } from "@expo/vector-icons";
import { deleteItemAsync } from "@/db/db_setup";
import { useSQLiteContext } from "expo-sqlite";

export default function EditItem() {
    const params = useLocalSearchParams<{ itemId?: string }>();
    const itemId = params?.itemId ? Number(params.itemId) : null;
    const db = useSQLiteContext();

    return (
        <View>
            <Stack.Screen 
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            style={styles.deleteBlock}
                            onPressIn={async () => handleDelete(itemId)}
                        >
                            <Ionicons
                                name="trash-bin-outline"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    )
                }} 
            />
            <AddOrEditItem itemId={itemId} />
        </View>
    )

    async function handleDelete(itemId: number | null) {
        if (itemId == null) {
            console.error('ID is null');
        } else {
            await deleteItemAsync(db, itemId);
        }
        router.back();
    }
}
const styles = StyleSheet.create({
  deleteBlock: {
    // borderWidth: 1, //To check borders of the div
    padding: 8,
  }
});