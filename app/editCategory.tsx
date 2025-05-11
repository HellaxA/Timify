import { TouchableOpacity, View,StyleSheet } from "react-native";

import { router } from 'expo-router';
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deleteCategoryAsync } from "@/src/db/db_setup";
import { useSQLiteContext } from "expo-sqlite";
import AddOrEditCategory from "./addOrEditCategory";

export default function EditItem() {
    const params = useLocalSearchParams<{ categoryId?: string }>();
    const categoryId = params?.categoryId ? Number(params.categoryId) : null;
    const db = useSQLiteContext();

    return (
        <View>
            <Stack.Screen 
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            style={styles.deleteBlock}
                            onPressIn={async () => handleDelete(categoryId)}
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
            <AddOrEditCategory categoryId={categoryId} />
        </View>
    )

    async function handleDelete(categoryId: number | null) {
        if (categoryId == null) {
            console.error('ID is null');
        } else {
            await deleteCategoryAsync(db, categoryId);
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