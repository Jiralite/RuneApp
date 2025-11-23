import clan from "./chat-inputs/clan.js";
import eventLog from "./chat-inputs/event-log.js";
import spotlight from "./chat-inputs/spotlight.js";

export const CHAT_INPUT_COMMANDS = [clan, eventLog, spotlight] as const;
