export interface UpdateRequest {
  db: string;
  table: string;
  id: number | string;
  changes: any; // dexie-mongoify を使用する JSON 形式の更新内容
}
