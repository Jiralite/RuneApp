import {
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { clanPage, playerDetails } from "runescape";
import { getBoolean, getString } from "../../utility/functions.js";

export default {
	name: "clan",
	async chatInput(interaction: APIChatInputApplicationCommandInteraction) {
		const playerName = getString(interaction, "player-name", true);
		const hide = getBoolean(interaction, "hide", false) ?? false;
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

		const json: APIInteractionResponseChannelMessageWithSource = {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: content,
			},
		};

		if (hide) {
			json.data.flags = MessageFlags.Ephemeral;
		}

		return Response.json(json, { status: 200 });
	},
} as const;
