import Dexie from 'dexie';
import { dexieMongoify } from 'dexie-mongoify';
import { QueryMessage } from '/app/services/database/QueryMessage';
import { UpdateMessage } from '/app/services/database/UpdateMessage';
import { InitializeRequest } from '/app/services/database/InitializeRequest';
import { WorkerMessage } from '/app/services/database/WorkerMessage';

type UpdateQueueKey = string; // 'dbName.tableName.id' の形式

export class DexieWorker<T> {
  private db: Dexie | null = null;
  private updateQueue: Map<
    UpdateQueueKey,
    { timeoutId: NodeJS.Timeout; changes: T }
  > = new Map();

  async initialize(request: InitializeRequest) {
    this.db = new Dexie(request.dbName);
    this.db.version(1).stores(request.tableSchemas);
    await this.db.open();
    console.log(`Database ${request.dbName} initialized and opened.`);
  }

  private initializeDatabase(
    dbName: string,
    tableSchemas: { [tableName: string]: string }
  ) {
    this.db = new Dexie(dbName);
    this.db.version(1).stores(tableSchemas);
  }

  private handleUpdateRequest(message: UpdateMessage) {
    if (!this.db) return; // エラーハンドリング
    const { table, id, changes } = message.data;
    const key: UpdateQueueKey = `${this.db.name}.${table}.${id}`;

    if (this.updateQueue.has(key)) {
      clearTimeout(this.updateQueue.get(key)!.timeoutId);
    }

    const timeoutId = setTimeout(async () => {
      await this.db!.table(table).update(id, changes);
      this.updateQueue.delete(key);
    }, 100); // デバウンス時間

    this.updateQueue.set(key, { timeoutId, changes });
  }

  private handleQueryRequest(message: QueryMessage) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }
    const { table, query } = message.data;

    const executeQuery = async () => {
      const collection = dexieMongoify(this.db!.table(table));
      const result = await collection.find(query).toArray();
      postMessage({ action: 'queryResult', data: result });
    };

    if (this.updateQueue.size === 0) {
      executeQuery();
    } else {
      const timeoutId = setTimeout(() => executeQuery(), 100); // デバウンス時間
      this.updateQueue.set('query', { timeoutId, changes: query });
    }
  }

  handleMessage(message: WorkerMessage) {
    switch (message.action) {
      case 'initialize':
        this.initializeDatabase(message.data.dbName, message.data.tableSchemas);
        break;
      case 'query':
        this.handleQueryRequest(message as QueryMessage);
        break;
      case 'update':
        if (!this.db) {
          console.error('Database not initialized');
          return;
        }
        this.handleUpdateRequest(message as UpdateMessage);
        break;
      default:
        console.error('Unsupported action:', message);
    }
  }
}
