export interface InitializeRequest {
  dbName: string;
  tableSchemas: { [tableName: string]: string };
}
