import { authHandlers } from "./auth";
import { usersHandlers } from "./users";
import { engineeringHandlers } from "./engineering";
import { workflowHandlers } from "./workflow";
import { studyHandlers } from "./study";
import { aiChatHandlers } from "./aiChat";

export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...engineeringHandlers,
  ...workflowHandlers,
  ...studyHandlers,
  ...aiChatHandlers,
];
