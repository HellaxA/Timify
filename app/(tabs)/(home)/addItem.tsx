import { addItemAsync } from '@/db/db_setup';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { router } from 'expo-router';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

export default function AddItemScreen() {
  return (
    <View >
      <Main />
    </View>
  );
}
export function Main() {
    const db = useSQLiteContext();
    const [text, setText] = useState('');
    return (
        <View style={styles.flexRow}>
            <TextInput
                onChangeText={(text) => setText(text)}
                onSubmitEditing={async () => {
                    await addItemAsync(db, text);
                    router.back();
          
                }}
                placeholder="What have you done this time?"
                style={styles.input}
                value={text}
            />
        </View>
    )
}
const styles = StyleSheet.create({
  input: {
    // borderColor: '#4630eb',
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  flexRow: {
    flexDirection: 'row',
  },
});