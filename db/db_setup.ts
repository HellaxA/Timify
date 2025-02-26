import {
    useSQLiteContext,
    type SQLiteDatabase,
} from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    let result = await db.getFirstAsync<{ user_version: number; }>('PRAGMA user_version');
    if (result == null) {
        throw new Error('Failed to retrieve the current database version');
    }
    let currentDbVersion = result.user_version;

    console.log('Current db version: ', currentDbVersion);
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, description TEXT);`);
    currentDbVersion = 1;
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
export async function deleteItemAsync(db: SQLiteDatabase, id: number): Promise<void> {
    console.log('In delete DB function')
    console.log('DB: ', db);
    try {
        await db.runAsync('DELETE FROM items where id = ?', id);
    } catch(exc) {
        console.error('Error deleting: ', exc);
    }
    console.log('After deletion');
}

export async function addItemAsync(db: SQLiteDatabase, text: string): Promise<void> {
    if (text !== '') {
        try {
            await db.runAsync(
                'INSERT INTO items (description) VALUES (?);',
                text
            );
        } catch (error) {
            console.error('Error inserting into database:', error);
        }
    }
}

export async function updateItemAsync(db: SQLiteDatabase, text: string, id: number): Promise<void> {
    if (text !== '') {
        try {
            await db.runAsync(
                'UPDATE items SET description = ? WHERE id = ?;',
                text,
                id
            );
        } catch (error) {
            console.error('Error updating the item:', error);
        }
    }
}