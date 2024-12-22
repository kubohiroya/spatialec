import { UpdateRequest } from '/app/services/database/UpdateRequest';
import { AbstractMessage } from '/app/services/database/AbstractMessage';

export interface UpdateMessage extends AbstractMessage {
  action: 'update';
  data: UpdateRequest;
}
