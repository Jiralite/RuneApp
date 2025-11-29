import { Minigame, WildernessFlashEvent } from "runescape";

export const MAXIMUM_PLAYER_NAME_LENGTH = 12 as const;
export const MINIMUM_PLAYER_NAME_LENGTH = 1 as const;

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

export const WildernessFlashEventToWikiURL = {
	[WildernessFlashEvent.KingBlackDragonRampage]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#King_Black_Dragon_Rampage",
	[WildernessFlashEvent.ForgottenSoldiers]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Forgotten_Soldiers",
	[WildernessFlashEvent.SurprisingSeedlings]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Surprising_Seedlings",
	[WildernessFlashEvent.HellhoundPack]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Hellhound_Pack",
	[WildernessFlashEvent.InfernalStar]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Infernal_Star",
	[WildernessFlashEvent.LostSouls]: "https://runescape.wiki/w/Wilderness_Flash_Events#Lost_Souls",
	[WildernessFlashEvent.RamokeeIncursion]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Ramokee_Incursion",
	[WildernessFlashEvent.DisplacedEnergy]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Displaced_Energy",
	[WildernessFlashEvent.EvilBloodwoodTree]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Evil_Bloodwood_Tree",
	[WildernessFlashEvent.SpiderSwarm]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Spider_Swarm",
	[WildernessFlashEvent.UnnaturalOutcrop]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Unnatural_Outcrop",
	[WildernessFlashEvent.StrykeTheWyrm]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Stryke_the_Wyrm",
	[WildernessFlashEvent.DemonStragglers]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Demon_Stragglers",
	[WildernessFlashEvent.ButterflySwarm]:
		"https://runescape.wiki/w/Wilderness_Flash_Events#Butterfly_Swarm",
} as const satisfies Readonly<Record<WildernessFlashEvent, string>>;
