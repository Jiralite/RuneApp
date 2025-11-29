import {
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	ButtonStyle,
	ComponentType,
	InteractionResponseType,
	MessageFlags,
	SeparatorSpacingSize,
} from "discord-api-types/v10";
import { wildernessFlashEvent } from "runescape";
import { WildernessFlashEventToWikiURL } from "../../utility/constants.js";
import { getBoolean } from "../../utility/functions.js";

export default {
	name: "wilderness-flash-events",
	async chatInput(interaction: APIChatInputApplicationCommandInteraction) {
		const hide = getBoolean(interaction, "hide", false) ?? false;
		const wildernessFlashEvents: string[] = [];
		let currentTime = new Date().setUTCMinutes(0, 0, 0);
		let currentWildernessFlashEvent = wildernessFlashEvent(currentTime);
		let wildernessFlashEventsStart = currentTime;
		let wildernessFlashEventsIndex = 1;

		while (wildernessFlashEvents.length < 14) {
			currentTime += 3_600_000;
			const nextWildernessFlashEvent = wildernessFlashEvent(currentTime);

			if (nextWildernessFlashEvent !== currentWildernessFlashEvent) {
				const startTimestamp = Math.floor(wildernessFlashEventsStart / 1000);
				const current = wildernessFlashEventsIndex === 1 ? " **(Current)**" : "";

				wildernessFlashEvents.push(
					`${wildernessFlashEventsIndex}. [${currentWildernessFlashEvent}](${WildernessFlashEventToWikiURL[currentWildernessFlashEvent]})${current} - <t:${startTimestamp}:t> (<t:${startTimestamp}:R>)`,
				);

				wildernessFlashEventsIndex++;
				currentWildernessFlashEvent = nextWildernessFlashEvent;
				wildernessFlashEventsStart = currentTime;
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
										url: "https://runescape.wiki/w/Wilderness_Flash_Events",
										label: "Wiki",
									},
									components: [
										{
											type: ComponentType.TextDisplay,
											content: "## Wilderness flash events",
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
									content: wildernessFlashEvents.join("\n"),
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
