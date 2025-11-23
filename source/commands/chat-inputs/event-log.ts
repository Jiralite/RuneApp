import {
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	ComponentType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import {
	avatar,
	type Profile,
	profile,
	RuneScapeError,
	RuneScapeErrorCode,
	standardiseProfileActivityLog,
} from "runescape";
import { getBoolean, getString } from "../../utility/functions.js";

export default {
	name: "event-log",
	async chatInput(interaction: APIChatInputApplicationCommandInteraction) {
		let playerName = getString(interaction, "player-name", true);
		const hide = getBoolean(interaction, "hide", false) ?? false;
		let profileResponse: Profile;

		try {
			profileResponse = await profile({ name: playerName, activities: 20 });
		} catch (error) {
			if (error instanceof RuneScapeError) {
				let content: string;

				switch (error.code) {
					case RuneScapeErrorCode.ProfileNotAMember:
						content = `\`${playerName}\` does not have an accessible event log.`;
						break;
					case RuneScapeErrorCode.ProfilePrivate:
						content = `The RuneMetrics profile of \`${playerName}\` is not public.`;
						break;
					case RuneScapeErrorCode.ProfileNone:
						content = `\`${playerName}\` does not appear to have a RuneMetrics profile. Does this account exist?`;
						break;
					case RuneScapeErrorCode.ProfileError:
						content = `There was an error retrieving the profile of \`${playerName}\`. Please report this!`;
						break;
				}

				return Response.json(
					{
						type: InteractionResponseType.ChannelMessageWithSource,
						data: {
							content,
							flags: MessageFlags.Ephemeral,
						},
					},
					{ status: 200 },
				);
			}

			throw error;
		}

		// Ensures stylisation is correct.
		playerName = profileResponse.name;

		const content = profileResponse.activities
			.map((activity) => {
				const timestamp = Math.floor(activity.timestamp / 1000);
				return `- ${standardiseProfileActivityLog(activity.text)} - <t:${timestamp}:s> (<t:${timestamp}:R>)`;
			})
			.join("\n");

		if (!content) {
			return Response.json(
				{
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						content: `\`${playerName}\` has no recent events in their event log.`,
						flags: MessageFlags.Ephemeral,
					},
				},
				{ status: 200 },
			);
		}

		let flags = MessageFlags.SuppressEmbeds | MessageFlags.IsComponentsV2;

		if (hide) {
			flags |= MessageFlags.Ephemeral;
		}

		return Response.json(
			{
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					components: [
						{
							type: ComponentType.Container,
							components: [
								{
									type: ComponentType.Section,
									accessory: {
										type: ComponentType.Thumbnail,
										media: { url: avatar({ name: playerName }) },
									},
									components: [
										{
											type: ComponentType.TextDisplay,
											content: `## Event log for \`${playerName}\``,
										},
										{
											type: ComponentType.TextDisplay,
											content,
										},
									],
								},
							],
						},
					],
					flags,
				},
			} satisfies APIInteractionResponseChannelMessageWithSource,
			{ status: 200 },
		);
	},
} as const;
