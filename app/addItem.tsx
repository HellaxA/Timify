import {
  View,
} from 'react-native';
import AddOrEditItem from './addOrEditItem';
import { useLocalSearchParams } from 'expo-router';

export default function AddItemScreen() {
  const params = useLocalSearchParams<{ curDate?: string }>();
  const curDateVar = params?.curDate ? params?.curDate : null;

  return (
    <View>
      <AddOrEditItem itemId={null} curDateParam={curDateVar} />
    </View>
  );
}