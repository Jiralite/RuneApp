import {
	type APIChatInputApplicationCommandInteraction,
	type APIInteraction,
	ApplicationCommandType,
	InteractionType,
} from "discord-api-types/v10";

export function hexToUint8Array(hex: string) {
	const uint8 = new Uint8Array(hex.length / 2);

	for (let i = 0; i < hex.length; i += 2) {
		uint8[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16);
	}

	return uint8;
}

export function isChatInputCommand(
	interaction: APIInteraction,
): interaction is APIChatInputApplicationCommandInteraction {
	return (
		interaction.type === InteractionType.ApplicationCommand &&
		interaction.data.type === ApplicationCommandType.ChatInput
	);
}
