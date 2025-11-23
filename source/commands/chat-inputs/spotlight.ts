import {
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	ButtonStyle,
	ComponentType,
	InteractionResponseType,
	MessageFlags,
	SeparatorSpacingSize,
} from "discord-api-types/v10";
import { minigameSpotlight } from "runescape";
import { MinigameToWikiURL } from "../../utility/constants.js";
import { getBoolean } from "../../utility/functions.js";

export default {
	name: "spotlight",
	async chatInput(interaction: APIChatInputApplicationCommandInteraction) {
		const hide = getBoolean(interaction, "hide", false) ?? false;
		const spotlights: string[] = [];
		let currentTime = new Date().setUTCHours(0, 0, 0, 0);
		let currentSpotlight = minigameSpotlight(currentTime);
		let spotlightStart = currentTime;
		let spotlightIndex = 1;

		while (spotlights.length < 27) {
			currentTime += 86_400_000;
			const nextSpotlight = minigameSpotlight(currentTime);

			if (nextSpotlight !== currentSpotlight) {
				const startTimestamp = Math.floor(spotlightStart / 1000);
				const current = spotlightIndex === 1 ? " **(Current)**" : "";

				spotlights.push(
					`${spotlightIndex}. [${currentSpotlight}](${MinigameToWikiURL[currentSpotlight]})${current} - <t:${startTimestamp}:s> (<t:${startTimestamp}:R>)`,
				);

				spotlightIndex++;
				currentSpotlight = nextSpotlight;
				spotlightStart = currentTime;
			}
		}

		let flags = MessageFlags.IsComponentsV2;

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
										type: ComponentType.Button,
										style: ButtonStyle.Link,
										url: "https://runescape.wiki/w/Minigames",
										label: "Wiki",
									},
									components: [
										{
											type: ComponentType.TextDisplay,
											content: "## Minigame spotlight",
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
									content: spotlights.join("\n"),
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
