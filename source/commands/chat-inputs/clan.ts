import {
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { clanPage, playerDetails, playerPage } from "runescape";
import { getBoolean, getString } from "../../utility/functions.js";

export default {
	name: "clan",
	async chatInput(interaction: APIChatInputApplicationCommandInteraction) {
		const playerName = getString(interaction, "player-name", true);
		const hide = getBoolean(interaction, "hide", false) ?? false;
		const playerDetailsResponse = await playerDetails({ names: [playerName] });
		const { clan, name } = playerDetailsResponse[0]!;
		let content = `[\`${name}\`](${playerPage({ name }).RuneMetrics}) `;

		if (clan) {
			const clanPages = clanPage({ clan });
			const mainClanLink = clanPages.RuneScape;
			const runepixelsLink = clanPages.Runepixels;
			content += `is in the clan \`${clan}\`. (${`[RS](${mainClanLink}) | [Rp](${runepixelsLink})`})`;
		} else {
			content += "is not in a clan.";
		}

		let flags = MessageFlags.SuppressEmbeds;

		if (hide) {
			flags |= MessageFlags.Ephemeral;
		}

		const json: APIInteractionResponseChannelMessageWithSource = {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: content,
				flags,
			},
		};

		return Response.json(json, { status: 200 });
	},
} as const;
