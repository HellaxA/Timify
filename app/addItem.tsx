import {
  View,
} from 'react-native';
import AddOrEditItem from './addOrEditItem';

export default function AddItemScreen() {
  return (
    <View>
      <AddOrEditItem itemId={null} />
    </View>
  );
}