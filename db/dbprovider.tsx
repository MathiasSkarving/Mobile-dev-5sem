// db/DatabaseProvider.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { migrateDbIfNeeded } from './db';

const DatabaseContext = createContext<SQLite.SQLiteDatabase | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    (async () => {
      const database = await SQLite.openDatabaseAsync('myapp.db');
      await migrateDbIfNeeded(database);
      setDb(database);
    })();
  }, []);

  if (!db) {
    return null; 
  }

  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): SQLite.SQLiteDatabase {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('useDatabase must be used within a DatabaseProvider, and after init has completed');
  }
  return db;
}