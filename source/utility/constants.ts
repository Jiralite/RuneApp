import { Minigame } from "runescape";

export const MAXIMUM_PLAYER_NAME_LENGTH = 12;
export const MINIMUM_PLAYER_NAME_LENGTH = 1;

export const MinigameToWikiURL = {
	[Minigame.PestControl]: "https://runescape.wiki/w/Pest_Control",
	[Minigame.SoulWars]: "https://runescape.wiki/w/Soul_Wars",
	[Minigame.FistOfGuthix]: "https://runescape.wiki/w/Fist_of_Guthix",
	[Minigame.BarbarianAssault]: "https://runescape.wiki/w/Barbarian_Assault",
	[Minigame.Conquest]: "https://runescape.wiki/w/Conquest",
	[Minigame.FishingTrawler]: "https://runescape.wiki/w/Fishing_Trawler",
	[Minigame.TheGreatOrbProject]: "https://runescape.wiki/w/The_Great_Orb_Project",
	[Minigame.FlashPowderFactory]: "https://runescape.wiki/w/Flash_Powder_Factory",
	[Minigame.CastleWars]: "https://runescape.wiki/w/Castle_Wars",
	[Minigame.StealingCreation]: "https://runescape.wiki/w/Stealing_Creation",
	[Minigame.CabbageFacepunchBonanza]: "https://runescape.wiki/w/Cabbage_Facepunch_Bonanza",
	[Minigame.Heist]: "https://runescape.wiki/w/Heist",
	[Minigame.MobilisingArmies]: "https://runescape.wiki/w/Mobilising_Armies",
	[Minigame.TroubleBrewing]: "https://runescape.wiki/w/Trouble_Brewing",
} as const satisfies Readonly<Record<Minigame, string>>;
