import { PieChart } from "react-native-gifted-charts";
import { 
    View,
    StyleSheet,
    Text
} from "react-native";
import { DataPiece } from "@/app/(tabs)/(home)";
import ChartStats from "./chartStats";
import { getHoursMinutesString } from "../utils/utilities";

export default function Chart({data}: {data: DataPiece[]}) {
    const longestPiece = getLongestPiece(data);
    return <View style={styles.container} >
        <Text style={styles.title}>
            Performance
        </Text>
        <View style={{ padding: 20, alignItems: 'center' }}>
            <PieChart
                data={data}
                donut
                showGradient
                sectionAutoFocus
                radius={120}
                innerRadius={60}
                innerCircleColor={'#232B5D'}
                centerLabelComponent={() => {
                    return (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {longestPiece.id !== -1 && <View>
                                <Text
                                    style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                                    {getHoursMinutesString(longestPiece.value)}
                                </Text>
                                <Text style={{ fontSize: 14, color: 'white' }}>{longestPiece.text}</Text>
                            </View>}
                        </View>
                    );
                }}
            />
        </View>
        <ChartStats data={data} />
    </View>
}
function getLongestPiece(data: DataPiece[]) {
    let longestPiece = data[0]
    for (let i = 1; i < data.length; i++) {
        if (data[i].value > longestPiece.value) {
            longestPiece = data[i]
        }
    }
    return longestPiece
}
const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#232B5D',
        flex: 1
    },
    title: {
        color: 'white', 
        fontSize: 16,
        fontWeight: 'bold' 
    },
});

