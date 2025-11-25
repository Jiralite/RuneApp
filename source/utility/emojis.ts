import type { Snowflake } from "discord-api-types/v10";

interface Emoji {
	name: string;
	id: Snowflake;
}

export function formatEmoji(emoji: Emoji) {
	return `<:${emoji.name}:${emoji.id}>`;
}

export const EMOJIS = {
	Agility: { name: "agility", id: "1442895117529780366" },
	Archaeology: { name: "archaeology", id: "1442895119010369696" },
	Attack: { name: "attack", id: "1442895120528838769" },
	Constitution: { name: "constitution", id: "1442895122059628645" },
	Construction: { name: "construction", id: "1442895123208868043" },
	Cooking: { name: "cooking", id: "1442895124588789771" },
	Crafting: { name: "crafting", id: "1442895125750616096" },
	Defence: { name: "defence", id: "1442895128242032690" },
	Divination: { name: "divination", id: "1442895129240404061" },
	Dungeoneering: { name: "dungeoneering", id: "1442895131048149103" },
	Farming: { name: "farming", id: "1442895132637663343" },
	Firemaking: { name: "firemaking", id: "1442895134114185418" },
	Fishing: { name: "fishing", id: "1442895135183732941" },
	Fletching: { name: "fletching", id: "1442895136773378139" },
	Herblore: { name: "herblore", id: "1442895138249506877" },
	Hunter: { name: "hunter", id: "1442895140321497208" },
	Invention: { name: "invention", id: "1442895141684776960" },
	Magic: { name: "magic", id: "1442895143064567829" },
	Mining: { name: "mining", id: "1442895143811416177" },
	Necromancy: { name: "necromancy", id: "1442895144977170473" },
	Prayer: { name: "prayer", id: "1442895146407563474" },
	Ranged: { name: "ranged", id: "1442895147624042506" },
	Runecrafting: { name: "runecrafting", id: "1442895148710232095" },
	Slayer: { name: "slayer", id: "1442895150035632269" },
	Smithing: { name: "smithing", id: "1442895151205843006" },
	Strength: { name: "strength", id: "1442895152304885805" },
	Summoning: { name: "summoning", id: "1442895153420570644" },
	Thieving: { name: "thieving", id: "1442895154636652735" },
	Woodcutting: { name: "woodcutting", id: "1442895156146733319" },
	Total: { name: "total", id: "1442897253546328084" },
} as const satisfies Readonly<Record<string, Emoji>>;

export const SkillToEmoji = {
	Agility: EMOJIS.Agility,
	Archaeology: EMOJIS.Archaeology,
	Attack: EMOJIS.Attack,
	Constitution: EMOJIS.Constitution,
	Construction: EMOJIS.Construction,
	Cooking: EMOJIS.Cooking,
	Crafting: EMOJIS.Crafting,
	Defence: EMOJIS.Defence,
	Divination: EMOJIS.Divination,
	Dungeoneering: EMOJIS.Dungeoneering,
	Farming: EMOJIS.Farming,
	Firemaking: EMOJIS.Firemaking,
	Fishing: EMOJIS.Fishing,
	Fletching: EMOJIS.Fletching,
	Herblore: EMOJIS.Herblore,
	Hunter: EMOJIS.Hunter,
	Invention: EMOJIS.Invention,
	Magic: EMOJIS.Magic,
	Mining: EMOJIS.Mining,
	Necromancy: EMOJIS.Necromancy,
	Prayer: EMOJIS.Prayer,
	Ranged: EMOJIS.Ranged,
	Runecrafting: EMOJIS.Runecrafting,
	Slayer: EMOJIS.Slayer,
	Smithing: EMOJIS.Smithing,
	Strength: EMOJIS.Strength,
	Summoning: EMOJIS.Summoning,
	Thieving: EMOJIS.Thieving,
	Woodcutting: EMOJIS.Woodcutting,
	Total: EMOJIS.Total,
} as const satisfies Readonly<Record<keyof typeof EMOJIS, Emoji>>;
