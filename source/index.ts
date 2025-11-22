import {
	type APIInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	type APIInteractionResponsePong,
	InteractionResponseType,
	InteractionType,
	MessageFlags,
} from "discord-api-types/v10";
import { hexToUint8Array } from "./utility/functions.js";

interface Env {
	PUBLIC_KEY: string;
}

export default {
	async fetch(request, env) {
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

		return Response.json(
			{
				data: { content: "Woah!", flags: MessageFlags.Ephemeral },
				type: InteractionResponseType.ChannelMessageWithSource,
			} satisfies APIInteractionResponseChannelMessageWithSource,
			{ status: 200 },
		);
	},
} satisfies ExportedHandler<Env>;
