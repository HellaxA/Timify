import Dialog from "react-native-dialog";
import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { SQLiteDatabase } from 'expo-sqlite';
import { importDb } from "../port/port";
export default function Import({db}: {db: SQLiteDatabase}) {
    const [visible, setVisible] = useState(false);
    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleDelete = () => {
        importDb(db);
        setVisible(false);
    };
    return (
        <View>
            <TouchableOpacity style={styles.chartToggle}
              onPress={() => showDialog()}>
              <Text style={styles.toggleTitle}>Import</Text>
            </TouchableOpacity>
            <Dialog.Container visible={visible}>
                <Dialog.Title>Delete & Import New Data</Dialog.Title>
                <Dialog.Description>
                    Import will delete ALL your local data! Do you want to continue? 
                </Dialog.Description>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Delete & Import" onPress={handleDelete} />
            </Dialog.Container>
        </View>

    ) 
}
const styles = StyleSheet.create({
  chartToggle: {
    backgroundColor: '#232B5D',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius:5,
    marginLeft: 5
  },
  toggleTitle: {
    color: 'white',
  }
})