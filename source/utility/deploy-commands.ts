import process from "node:process";
import { info, setFailed, summary } from "@actions/core";
import {
	API,
	ApplicationCommandOptionType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPutAPIApplicationCommandsJSONBody,
} from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { z } from "zod/v4";
import { MAXIMUM_PLAYER_NAME_LENGTH, MINIMUM_PLAYER_NAME_LENGTH } from "./constants.js";

const envSchema = z.object({
	GITHUB_ACTIONS: z
		.string()
		.optional()
		.transform((value) => value === "true"),
	DISCORD_TOKEN: z.string().min(1),
});

const { GITHUB_ACTIONS, DISCORD_TOKEN } = envSchema.parse(process.env);

const errors = [];

const COMMANDS: RESTPutAPIApplicationCommandsJSONBody = [
	{
		name: "clan",
		description: "Returns the clan of a player.",
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: "player-name",
				description: "The player to check.",
				required: true,
				min_length: MINIMUM_PLAYER_NAME_LENGTH,
				max_length: MAXIMUM_PLAYER_NAME_LENGTH,
			},
			{
				type: ApplicationCommandOptionType.Boolean,
				name: "hide",
				description: "Whether to hide the response.",
				required: false,
			},
		],
		integration_types: [
			ApplicationIntegrationType.GuildInstall,
			ApplicationIntegrationType.UserInstall,
		],
		contexts: [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel,
		],
	},
	{
		name: "event-log",
		description: "Returns the event log of a player.",
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: "player-name",
				description: "The player to check.",
				required: true,
				min_length: MINIMUM_PLAYER_NAME_LENGTH,
				max_length: MAXIMUM_PLAYER_NAME_LENGTH,
			},
			{
				type: ApplicationCommandOptionType.Boolean,
				name: "hide",
				description: "Whether to hide the response.",
				required: false,
			},
		],
		integration_types: [
			ApplicationIntegrationType.GuildInstall,
			ApplicationIntegrationType.UserInstall,
		],
		contexts: [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel,
		],
	},
	{
		name: "spotlight",
		description: "Returns the spotlight schedule.",
		options: [
			{
				type: ApplicationCommandOptionType.Boolean,
				name: "hide",
				description: "Whether to hide the response.",
				required: false,
			},
		],
		integration_types: [
			ApplicationIntegrationType.GuildInstall,
			ApplicationIntegrationType.UserInstall,
		],
		contexts: [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel,
		],
	},
] as const;

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
const api = new API(rest);
const applicationId = (await api.users.getCurrent()).id;
info("Setting application commands...");

try {
	await api.applicationCommands.bulkOverwriteGlobalCommands(applicationId, COMMANDS);
} catch (error) {
	errors.push(error);
}

const deploymentResults = [];

if (errors.length > 0) {
	deploymentResults.push(["Discord", "Failed", `${errors.length} error(s).`]);
} else {
	deploymentResults.push(["Discord", "Success", `${COMMANDS.length} command(s).`]);
}

const result = summary.addHeading("Commands deployment").addTable([
	[
		{ data: "Platform", header: true },
		{ data: "Status", header: true },
		{ data: "Details", header: true },
	],
	...deploymentResults,
]);

if (errors.length > 0) {
	result.addDetails("Errors", `\`\`\`\n${errors.join("\n\n")}\n\`\`\``);
}

if (GITHUB_ACTIONS) {
	await result.write();
} else {
	info(result.stringify());
}

if (errors.length > 0) {
	setFailed("Command deployment failed.");
	process.exit(1);
}
