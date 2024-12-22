export interface QueryRequest {
  db: string;
  table: string;
  query: any; // dexie-mongoify で使用する JSON 形式のクエリ
}
