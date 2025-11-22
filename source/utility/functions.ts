import {
	type APIApplicationCommandInteractionDataStringOption,
	type APIChatInputApplicationCommandInteraction,
	type APIInteraction,
	ApplicationCommandOptionType,
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

export function getString(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required: true,
): string;

export function getString(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required?: false,
): string | null;

export function getString(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required = false,
) {
	const option = interaction.data.options?.find(
		(option): option is APIApplicationCommandInteractionDataStringOption =>
			option.type === ApplicationCommandOptionType.String && option.name === name,
	);

	if (!option && required) {
		throw new Error(`Missing required option: ${name}`);
	}

	return option?.value ?? null;
}
