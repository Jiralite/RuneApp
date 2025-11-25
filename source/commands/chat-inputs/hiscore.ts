import {
	type APIChatInputApplicationCommandInteraction,
	ComponentType,
	MessageFlags,
	SeparatorSpacingSize,
} from "discord-api-types/v10";
import { avatar, type HiScore, hiScore, playerPage, RuneScapeAPIError } from "runescape";
import { formatEmoji, SkillToEmoji } from "../../utility/emojis.js";
import {
	deferChannelMessageWithSource,
	editDeferredMessage,
	getBoolean,
	getString,
} from "../../utility/functions.js";

function formatSkill(
	skill: HiScore[keyof HiScore],
	maximumLevelLength: number,
	maximumTotalExperienceLength: number,
) {
	return `${formatEmoji(SkillToEmoji[skill.name])} \`${skill.level.toString().padStart(maximumLevelLength, " ")}\` | \`${skill.totalXP.toLocaleString().padStart(maximumTotalExperienceLength, " ")}\` | #${skill.rank.toLocaleString()}`;
}

export default {
	name: "hiscore",
	async chatInput(interaction: APIChatInputApplicationCommandInteraction, ctx: ExecutionContext) {
		const playerName = getString(interaction, "player-name", true);
		const hide = getBoolean(interaction, "hide", false) ?? false;

		editDeferredMessage(interaction, ctx, async () => {
			let hiScoreResponse: HiScore;

			try {
				hiScoreResponse = await hiScore({ name: playerName });
			} catch (error) {
				if (error instanceof RuneScapeAPIError && error.statusCode === 404) {
					return {
						content: `Could not find the HiScores of \`${playerName}\`.`,
					};
				}

				throw error;
			}

			const skills = Object.values(hiScoreResponse) as readonly HiScore[keyof HiScore][];
			let maximumLevelLength = 0;
			let maximumTotalExperienceLength = 0;

			for (const skill of skills) {
				maximumLevelLength = Math.max(maximumLevelLength, skill.level.toString().length);

				maximumTotalExperienceLength = Math.max(
					maximumTotalExperienceLength,
					skill.totalXP.toLocaleString().length,
				);
			}

			const skillsContent = [];

			for (const skill of skills) {
				skillsContent.push(formatSkill(skill, maximumLevelLength, maximumTotalExperienceLength));
			}

			const playerPageResponse = playerPage({ name: playerName });
			let flags = MessageFlags.IsComponentsV2;

			if (hide) {
				flags |= MessageFlags.Ephemeral;
			}

			return {
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
										content: `## HiScores for \`${playerName}\``,
									},
									{
										type: ComponentType.TextDisplay,
										content: `[RuneScape](${playerPageResponse.RuneScape}) | [RuneMetrics](${playerPageResponse.RuneMetrics}) | [Runepixels](${playerPageResponse.Runepixels})`,
									},
								],
							},
							{
								type: ComponentType.Separator,
								divider: true,
								spacing: SeparatorSpacingSize.Small,
							},
							{
								type: ComponentType.TextDisplay,
								content: skillsContent.join("\n"),
							},
						],
					},
				],
				flags,
			};
		});

		return deferChannelMessageWithSource({ flags: hide ? MessageFlags.Ephemeral : undefined });
	},
} as const;
