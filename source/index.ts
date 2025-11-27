import { API } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";
import { captureException, withSentry } from "@sentry/cloudflare";
import {
	type APIInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	type APIInteractionResponsePong,
	InteractionResponseType,
	InteractionType,
	MessageFlags,
} from "discord-api-types/v10";
import { playerCount } from "runescape";
import { CHAT_INPUT_COMMANDS } from "./commands/index.js";
import { hexToUint8Array, isChatInputCommand } from "./utility/functions.js";

interface Env {
	PUBLIC_KEY: string;
	DISCORD_TOKEN: string;
	SENTRY_DATA_SOURCE_NAME: string;
	CF_VERSION_METADATA: WorkerVersionMetadata;
}

export default withSentry(
	(env) => ({
		dsn: env.SENTRY_DATA_SOURCE_NAME,
		release: env.CF_VERSION_METADATA.id,
		sendDefaultPii: true,
	}),
	{
		async fetch(request, env, ctx) {
			if (request.method !== "POST") {
				return new Response(null, { status: 405 });
			}

			const signature = request.headers.get("X-Signature-Ed25519");
			const timestamp = request.headers.get("X-Signature-Timestamp");
			const body = await request.text();

			if (!(signature && timestamp && body)) {
				return new Response(null, { status: 401 });
			}

			const encoder = new TextEncoder();
			const message = encoder.encode(timestamp + body);
			const signatureUint8 = hexToUint8Array(signature);
			const publicKeyUint8 = hexToUint8Array(env.PUBLIC_KEY);

			const key = await crypto.subtle.importKey("raw", publicKeyUint8, { name: "Ed25519" }, false, [
				"verify",
			]);

			const verified = await crypto.subtle.verify("Ed25519", key, signatureUint8, message);

			if (!verified) {
				return new Response(null, { status: 401 });
			}

			const interaction = JSON.parse(body) as APIInteraction;

			if (interaction.type === InteractionType.Ping) {
				console.info("Ping.", interaction);

				return Response.json(
					{ type: InteractionResponseType.Pong } satisfies APIInteractionResponsePong,
					{ status: 200 },
				);
			}

			if (isChatInputCommand(interaction)) {
				const command = CHAT_INPUT_COMMANDS.find(({ name }) => name === interaction.data.name);

				if (!command) {
					return Response.json(
						{
							data: { content: "Unknown.", flags: MessageFlags.Ephemeral },
							type: InteractionResponseType.ChannelMessageWithSource,
						} satisfies APIInteractionResponseChannelMessageWithSource,
						{ status: 200 },
					);
				}

				try {
					return await command.chatInput(interaction, ctx);
				} catch (error) {
					captureException(error);

					return Response.json(
						{
							data: { content: "An error occurred.", flags: MessageFlags.Ephemeral },
							type: InteractionResponseType.ChannelMessageWithSource,
						} satisfies APIInteractionResponseChannelMessageWithSource,
						{ status: 200 },
					);
				}
			}

			return Response.json(
				{
					data: { content: "Unknown.", flags: MessageFlags.Ephemeral },
					type: InteractionResponseType.ChannelMessageWithSource,
				} satisfies APIInteractionResponseChannelMessageWithSource,
				{ status: 200 },
			);
		},
		async scheduled(controller, env) {
			await new API(new REST().setToken(env.DISCORD_TOKEN)).applications.editCurrent({
				description: `Interacts with the non-existent RuneScape API.\n\nPlayers online: ${(await playerCount()).toLocaleString()} (as of <t:${Math.floor(controller.scheduledTime / 1000)}:R>)`,
			});
		},
	} satisfies ExportedHandler<Env>,
);
