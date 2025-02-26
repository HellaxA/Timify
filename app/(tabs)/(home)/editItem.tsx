import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Main from "./main";

export default function EditItem() {
    const params = useLocalSearchParams<{ itemId?: string }>();
    const itemId = params?.itemId ? Number(params.itemId) : null;
    return (
        <View>
            <Main itemId={itemId} />
        </View>
    )
}