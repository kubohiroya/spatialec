import { AbstractMessage } from '/app/services/database/AbstractMessage';

export interface InitializeMessage extends AbstractMessage {
  action: 'initialize';
  data: {
    dbName: string;
    tableSchemas: { [tableName: string]: string };
  };
}
