import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { deleteCats, deleteItems, fetchCategories, getAllItems, saveCategories, saveItems } from '../db/db_setup';
import { SQLiteDatabase } from 'expo-sqlite';
export const Separator = '-----'
export async function exportDb(db: SQLiteDatabase) {
    try {
        const items = getAllItems(db).map((item) => (
            Object.values(item).join(','))
        ).join('\n')

        const categories = fetchCategories(db).map((item) => (
            Object.values(item).join(','))
        ).join('\n')

        const result = items + '\n' + Separator + '\n' + categories

        const path = FileSystem.documentDirectory + 'export.csv'
        await FileSystem.writeAsStringAsync(path, result, {
            encoding: FileSystem.EncodingType.UTF8,
          });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(path);
        } else {
          console.log('Sharing not available');
        }
    } catch(error) {
        console.error('Failed to export: ' + error)
    }
}

export async function importDb(db: SQLiteDatabase) {
    const result = await DocumentPicker.getDocumentAsync()
    if (result.assets) {
        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const tableArray = fileContent.split(Separator)
        const categories = tableArray[1].split('\n')
        const items = tableArray[0].split('\n')
        deleteItems(db)
        deleteCats(db)
        saveCategories(categories, db)
        saveItems(items, db)
    }
}

