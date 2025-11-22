import {
	type APIInteractionResponseChannelMessageWithSource,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";

export default {
	name: "test",
	async chatInput() {
		return Response.json(
			{
				data: { content: "Woah!", flags: MessageFlags.Ephemeral },
				type: InteractionResponseType.ChannelMessageWithSource,
			} satisfies APIInteractionResponseChannelMessageWithSource,
			{ status: 200 },
		);
	},
} as const;
