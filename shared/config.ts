import { joaat } from "./utils";

export const HornOverride: Map<number, string> = new Map<number, string>()
	.set(joaat("firetruk"), "VEHICLES_HORNS_FIRETRUCK_WARNING")

export const PrimarySirenOverride: Map<number, string | string[]> = new Map<number, string | string[]>()
	.set(joaat("firetruk"), "")

export const AddonAudioBanks: string[] = [
	"",
];

export const Debug: boolean = false;