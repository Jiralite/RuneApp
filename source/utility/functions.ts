import {
	type APIApplicationCommandInteractionDataBooleanOption,
	type APIApplicationCommandInteractionDataStringOption,
	type APIChatInputApplicationCommandInteraction,
	type APIInteraction,
	type APIInteractionResponseDeferredChannelMessageWithSource,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionResponseType,
	InteractionType,
	MessageFlags,
	type RESTPatchAPIInteractionOriginalResponseJSONBody,
	Routes,
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
): APIApplicationCommandInteractionDataStringOption["value"];

export function getString(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required?: false,
): APIApplicationCommandInteractionDataStringOption["value"] | null;

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
		throw new Error(`Missing required string option: ${name}`);
	}

	return option?.value ?? null;
}

export function getBoolean(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required: true,
): APIApplicationCommandInteractionDataBooleanOption["value"];

export function getBoolean(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required?: false,
): APIApplicationCommandInteractionDataBooleanOption["value"] | null;

export function getBoolean(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required = false,
) {
	const option = interaction.data.options?.find(
		(option): option is APIApplicationCommandInteractionDataBooleanOption =>
			option.type === ApplicationCommandOptionType.Boolean && option.name === name,
	);

	if (!option && required) {
		throw new Error(`Missing required boolean option: ${name}`);
	}

	return option?.value ?? null;
}

export function deferChannelMessageWithSource(
	data: APIInteractionResponseDeferredChannelMessageWithSource["data"] = {},
) {
	return Response.json(
		{
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data,
		} satisfies APIInteractionResponseDeferredChannelMessageWithSource,
		{ status: 200 },
	);
}

export function editDeferredMessage(
	interaction: APIChatInputApplicationCommandInteraction,
	ctx: ExecutionContext,
	handler: () => Promise<RESTPatchAPIInteractionOriginalResponseJSONBody>,
) {
	ctx.waitUntil(
		(async () => {
			try {
				const response = await fetch(
					`https://discord.com/api/v10${Routes.webhookMessage(interaction.application_id, interaction.token, "@original")}`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(await handler()),
					},
				);

				if (!response.ok) {
					throw await response.json();
				}
			} catch (error) {
				console.error("Error in deferred interaction handler.", error);

				await fetch(
					`https://discord.com/api/v10${Routes.webhookMessage(interaction.application_id, interaction.token, "@original")}`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							content: "An error occurred. Please report this!",
							flags: MessageFlags.Ephemeral,
						} satisfies RESTPatchAPIInteractionOriginalResponseJSONBody),
					},
				);
			}
		})(),
	);
}
