import { addItemAsync, addItemAsyncDefaultDb } from '@/db/db_setup';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddItemScreen() {
  return (
    <View >
      <SQLiteProvider databaseName='timify.db'>
        <Main />
      </SQLiteProvider>
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
                    router.navigate('/');
          
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