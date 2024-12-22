import { QueryMessage } from '/app/services/database/QueryMessage';
import { InitializeMessage } from '/app/services/database/InitializeMessage';
import { UpdateMessage } from '/app/services/database/UpdateMessage';

export type WorkerMessage = InitializeMessage | UpdateMessage | QueryMessage;
