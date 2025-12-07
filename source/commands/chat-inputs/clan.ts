import {
	type APIChatInputApplicationCommandInteraction,
	MessageFlags,
} from "discord-api-types/v10";
import { clanPage, clanPageRunepixels, playerDetails, playerPageRuneMetrics } from "runescape";
import {
	deferChannelMessageWithSource,
	editDeferredMessage,
	getBoolean,
	getString,
} from "../../utility/functions.js";

export default {
	name: "clan",
	async chatInput(interaction: APIChatInputApplicationCommandInteraction, ctx: ExecutionContext) {
		const playerName = getString(interaction, "player-name", true);
		const hide = getBoolean(interaction, "hide", false) ?? false;

		editDeferredMessage(interaction, ctx, async () => {
			const playerDetailsResponse = await playerDetails({ names: [playerName] });
			const { clan, name } = playerDetailsResponse[0]!;
			let content = `[\`${name}\`](${playerPageRuneMetrics(name)}) `;

			if (clan) {
				content += `is in the clan \`${clan}\`. (${`[RS](${clanPage(clan)}) | [Rp](${clanPageRunepixels(clan)})`})`;
			} else {
				content += "is not in a clan.";
			}

			return {
				content,
				flags: MessageFlags.SuppressEmbeds,
			};
		});

		return deferChannelMessageWithSource({ flags: hide ? MessageFlags.Ephemeral : undefined });
	},
} as const;
