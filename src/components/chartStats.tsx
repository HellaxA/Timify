import { DataPiece } from "@/app/(tabs)/(home)";
import { 
    View,
    StyleSheet,
    Text,
    ScrollView
} from "react-native";
import { getHoursMinutesString } from "../utils/utilities";

export default function ChartStats({ data }: { data: DataPiece[] }) {


    return (
        <ScrollView>
            {data.map((piece: DataPiece) => (
                <View key={piece.id} style={styles.container}>
                    <View style={styles.entry}>
                        {renderDot(piece.color)}
                        <Text style={styles.labelStyle}>{piece.text}{piece.id !== -1 && ': ' + getHoursMinutesString(piece.value)}</Text>
                    </View>
                </View>
            ))}

        </ScrollView>
    );
}

const renderDot = (color: string) => {
    return (
        <View
            style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: color,
                marginRight: 10,
            }}
        />
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    entry: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 220, 
        marginRight: 10,
    },
    labelStyle: {
        color: 'white'
    },
});