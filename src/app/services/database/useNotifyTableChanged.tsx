import Dexie from 'dexie';
import { useEffect } from 'react';

export const useNotifyTableChanged = (database: Dexie | Promise<Dexie>, tableName: string, callback: (db: Dexie) => void)=> {
  useEffect(() => {
    (async ()=>{
      const db = await database;
      const cb = () => callback(db);
      db.on('changes', cb);
      /*
      db.table(tableName).hook('creating', cb);
      db.table(tableName).hook('updating', cb);
      db.table(tableName).hook('deleting', cb);
       */
    })();
    /*
    return async()=>{
      const db = await database;
      db.table(tableName).hook('creating').unsubscribe(cb);
      db.table(tableName).hook('updating').unsubscribe(cb);
      db.table(tableName).hook('deleting').unsubscribe(cb);
    }
     */
  }, []);

}
