import { QueryRequest } from '/app/services/database/QueryRequest';
import { AbstractMessage } from '/app/services/database/AbstractMessage';

export interface QueryMessage extends AbstractMessage {
  action: 'query';
  data: QueryRequest;
}
