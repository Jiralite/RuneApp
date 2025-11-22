import {
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { clanPage, playerDetails } from "runescape";
import { getString } from "../../utility/functions.js";

export default {
	name: "clan",
	async chatInput(interaction: APIChatInputApplicationCommandInteraction) {
		const playerName = getString(interaction, "player-name", true);
		const playerDetailsResponse = await playerDetails({ names: [playerName] });
		const { clan, name } = playerDetailsResponse[0]!;
		let content: string;

		if (clan) {
			const clanPages = clanPage({ clan });
			const mainClanLink = clanPages.RuneScape;
			const runepixelsLink = clanPages.Runepixels;
			content = `\`${name}\` is in the clan \`${clan}\`. (${`[RS](<${mainClanLink}>) | [Rp](<${runepixelsLink}>)`})`;
		} else {
			content = `\`${name}\` is not in a clan.`;
		}

		return Response.json(
			{
				data: {
					content: content,
					flags: MessageFlags.Ephemeral,
				},
				type: InteractionResponseType.ChannelMessageWithSource,
			} satisfies APIInteractionResponseChannelMessageWithSource,
			{ status: 200 },
		);
	},
} as const;
