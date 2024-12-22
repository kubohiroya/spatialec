declare module 'dexie-mongoify' {
  export function dexieMongoify(table: Dexie.Table<any, any>): MongoifiedTable;

  interface MongoifiedTable {
    find(query: any): MongoifiedQuery;
  }

  interface MongoifiedQuery {
    toArray(): Promise<any[]>;
  }
}
