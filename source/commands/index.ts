import clan from "./chat-inputs/clan.js";
import eventLog from "./chat-inputs/event-log.js";
import hiscore from "./chat-inputs/hiscore.js";
import spotlight from "./chat-inputs/spotlight.js";

export const CHAT_INPUT_COMMANDS = [clan, eventLog, hiscore, spotlight] as const;
