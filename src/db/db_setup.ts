import { CategoryEntity } from '@/src/entities/category';
import { ItemEntityWithCatName } from '@/src/entities/itemWithCatName';
import {
    type SQLiteDatabase,
} from 'expo-sqlite';
import { get2DigitMonth, get4DigitYear } from '../utils/utilities';
import { ItemEntity } from '../entities/item';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    let result = await db.getFirstAsync<{ user_version: number; }>('PRAGMA user_version');
    if (result == null) {
        throw new Error('Failed to retrieve the current database version');
    }
    let currentDbVersion = result.user_version;

    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, hours INTEGER, minutes INTEGER, create_time TEXT, category_id INTEGER NOT NULL, FOREIGN KEY (category_id) REFERENCES categories(id));
      CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY NOT NULL, name TEXT);
    `);

    db.execSync(`INSERT INTO categories (id, name) VALUES (999,'Work')`);
    // );
    // db.execSync(
    //     `INSERT INTO items (hours, minutes, create_time, category_id) VALUES(999,1,'2025-04-08 10:10:10', 999)`
    // );
    // db.execSync(
    //     `INSERT INTO items (hours, minutes, create_time, category_id) VALUES(1,1,'2030-04-08 20:10:10', 999)`
    // );
    // db.execSync(
    //     `INSERT INTO items (hours, minutes, create_time, category_id) VALUES(1,1,'2025-04-08 20:10:10', 999)`
    // );
    // db.execSync(
    //     `INSERT INTO items (hours, minutes, create_time, category_id) VALUES(1,1,'2021-04-08 20:10:10', 999)`
    // );
    currentDbVersion = 1;
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export function getAllItems(db: SQLiteDatabase) {
    return db.getAllSync<ItemEntity>(
        'SELECT * FROM items'
    );
}

export function getAllItemsSorted(db: SQLiteDatabase, curDate: Date) {
    const pattern =  '%/'+ get2DigitMonth(curDate) + '/' + get4DigitYear(curDate)
    return db.getAllSync<ItemEntityWithCatName>(
        'SELECT i.id, i.hours, i.minutes, i.create_time, c.name as categoryName ' +
        'FROM items i INNER JOIN categories c ON i.category_id = c.id ' +
        'WHERE i.create_time LIKE ? ' + 
        'ORDER BY i.create_time DESC',
        pattern
    );
}
export async function deleteItemAsync(db: SQLiteDatabase, id: number | null): Promise<void> {
    try {
        await db.runAsync('DELETE FROM items where id = ?', id);
    } catch(exc) {
        console.error('Error deleting: ', exc);
    }
}

export async function addItemAsync(db: SQLiteDatabase, hours: number, minutes: number, date: string, categoryId: number): Promise<void> {
    if (hours !== 0 || minutes !== 0) {
        try {
            await db.runAsync(
                'INSERT INTO items (hours, minutes, create_time, category_id) VALUES (?, ?, ?, ?);',
                hours,
                minutes,
                date, // dd/MM/yyyy
                categoryId
            );
        } catch (error) {
            console.error('Error inserting into database:', error);
        }
    }
}

export async function updateItemAsync(db: SQLiteDatabase, hours: number, minutes: number, date: string, id: number): Promise<void> {
    if (hours === 0 && minutes === 0) {
        deleteItemAsync(db, id);
    }
    try {
        await db.runAsync(
            'UPDATE items SET hours = ?, minutes = ?, create_time = ? WHERE id = ?;',
            hours,
            minutes,
            date,
            id
        );
    } catch (error) {
        console.error('Error updating the item:', error);
    }
}
export async function updateItemWithCategoryAsync(db: SQLiteDatabase, hours: number, minutes: number, date: string, id: number, categoryId: number): Promise<void> {
    if (hours === 0 && minutes === 0) {
        deleteItemAsync(db, id);
    }
    try {
        await db.runAsync(
            'UPDATE items SET hours = ?, minutes = ?, create_time = ?, category_id = ? WHERE id = ?;',
            hours,
            minutes,
            date,
            categoryId,
            id
        );
    } catch (error) {
        console.error('Error updating the item:', error);
    }
}

export function fetchCategories(db: SQLiteDatabase) {
    return db.getAllSync<CategoryEntity>('SELECT * FROM categories');
}

export async function deleteCategoryAsync(db: SQLiteDatabase, id: number | null): Promise<void> {
    try {
        await db.runAsync('DELETE FROM categories where id = ?', id);
    } catch(exc) {
        console.error('Error deleting category: ', exc);
    }
}

export async function addCategoryAsync(db: SQLiteDatabase, text: string): Promise<void> {
    if (text !== '') {
        try {
            await db.runAsync(
                'INSERT INTO categories (name) VALUES (?);',
                text
            );
        } catch (error) {
            console.error('Error inserting category into database:', error);
        }
    }
}

export async function updateCategoryAsync(db: SQLiteDatabase, text: string, id: number): Promise<void> {
    if (text !== '') {
        try {
            await db.runAsync(
                'UPDATE categories SET name = ? WHERE id = ?;',
                text,
                id
            );
        } catch (error) {
            console.error('Error updating the category:', error);
        }
    }
}

export function saveItems(items: string[], db: SQLiteDatabase) {
    db.withTransactionSync(() => {
        for (let i = 0; i < items.length; i++) {
            if (!items[i]) continue
            let fields = items[i].split(',')
            db.runSync(
                'INSERT INTO items(id, hours, minutes, create_time, category_id) VALUES (?, ?, ?, ?, ?);',
                fields[0],
                fields[1],
                fields[2],
                fields[3],
                fields[4],
            );
        }
    })
}
export function saveCategories(categories: string[], db: SQLiteDatabase) {
    for (let i = 0; i < categories.length; i++) {
        console.log(categories[i])
    }
    db.withTransactionSync(() => {
        for (let i = 0; i < categories.length; i++) {
            if (!categories[i]) continue
            let fields = categories[i].split(',')
            db.runSync(
                'INSERT INTO categories(id, name) VALUES (?, ?)',
                fields[0],
                fields[1]
            );
        }
    })
}
export function deleteCats(db: SQLiteDatabase) {
    db.runSync('DELETE FROM categories')
}
export function deleteItems(db: SQLiteDatabase) {
    db.runSync('DELETE FROM items')
}