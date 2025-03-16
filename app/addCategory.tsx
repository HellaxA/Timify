import {
  View,
} from 'react-native';
import AddOrEditCategory from './addOrEditCategory';

export default function AddCategoryScreen() {
  return (
    <View>
      <AddOrEditCategory categoryId={null} />
    </View>
  );
}