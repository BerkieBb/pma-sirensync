import { stateBagWrapper } from "./util";
import { HornOverride, PrimarySirenOverride, Debug } from "../shared/config";

const curSirenSound: Map<number, number> = new Map();
const curSiren2Sound: Map<number, number> = new Map();
const curHornSound: Map<number, number> = new Map();

const exp = global.exports;

exp("getCurSirenSound", () => curSirenSound);
exp("getCurSiren2Sound", () => curSiren2Sound);
exp("getCurHornSound", () => curHornSound);

const isAllowedSirens = (veh: number, ped: number): boolean =>
  GetPedInVehicleSeat(veh, -1) === ped && GetVehicleClass(veh) === 18 && !IsPedInAnyHeli(ped) && !IsPedInAnyPlane(ped);

exp("isAllowedSirens", isAllowedSirens);

const releaseSirenSound = (veh: number, soundId: number, isCleanup = false): void => {
  if (isCleanup && (DoesEntityExist(veh) && !IsEntityDead(veh))) return;
  StopSound(soundId);
  ReleaseSoundId(soundId);
  curSirenSound.delete(veh);
}

exp("releaseSirenSound", releaseSirenSound);

const releaseSiren2Sound = (veh: number, soundId: number, isCleanup = false): void => {
  if (isCleanup && (DoesEntityExist(veh) && !IsEntityDead(veh))) return;
  StopSound(soundId);
  ReleaseSoundId(soundId);
  curSiren2Sound.delete(veh);
}

exp("releaseSiren2Sound", releaseSiren2Sound);

const releaseHornSound = (veh: number, soundId: number, isCleanup = false): void => {
  if (isCleanup && (DoesEntityExist(veh) && !IsEntityDead(veh))) return;
  StopSound(soundId);
  ReleaseSoundId(soundId);
  curHornSound.delete(veh);
}

exp("releaseHornSound", releaseHornSound);

let restoreSiren: number = 0;

RegisterCommand("+sirenModeHold", () => {
  const ped: number = PlayerPedId();
  const veh: number = GetVehiclePedIsIn(ped, false);

  if (!isAllowedSirens(veh, ped)) return;

  const ent: StateBagInterface = Entity(veh).state;

  if (ent.sirenOn && ent.lightsOn) {
    PlaySoundFrontend(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
    let newSirenMode: number = (ent.sirenMode || 0) + 1;
    if (newSirenMode > 3) {
      newSirenMode = 1
    }
    ent.set("sirenMode", newSirenMode, true);
  } else {
    ent.set("sirenMode", 1, true);
  }
}, false);

RegisterCommand("-sirenModeHold", () => {
  const ped: number = PlayerPedId();
  const veh: number = GetVehiclePedIsIn(ped, false);

  if (!isAllowedSirens(veh, ped)) return;

  const ent: StateBagInterface = Entity(veh).state;

  ent.set("sirenMode", 0, true);
}, false);

RegisterKeyMapping("+sirenModeHold", "Hold this button to sound your emergency vehicle's siren", "keyboard", "R");

RegisterCommand("sirenSoundToggle", () => {
  const ped: number = PlayerPedId();
  const veh: number = GetVehiclePedIsIn(ped, false);

  if (!isAllowedSirens(veh, ped)) return;

  const ent: StateBagInterface = Entity(veh).state;

  if (!ent.lightsOn) return;
  PlaySoundFrontend(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
  const curMode: boolean = ent.sirenOn

  ent.set("sirenMode", curMode ? 0 : 1, true);
  ent.set("sirenOn", !curMode, true);
}, false);

RegisterKeyMapping("sirenSoundToggle", "Toggle your emergency vehicle's siren sounds whilst your siren light is on", "keyboard", "COMMA");

RegisterCommand("+emergencyHornHold", () => {
  const ped: number = PlayerPedId();
  const veh: number = GetVehiclePedIsIn(ped, false);

  if (!isAllowedSirens(veh, ped)) return;

  const ent: StateBagInterface = Entity(veh).state;

  ent.set("horn", true, true);
  restoreSiren = ent.sirenMode;
  ent.set("sirenMode", 0, true);
}, false);

RegisterCommand("-emergencyHornHold", () => {
  const ped: number = PlayerPedId();
  const veh: number = GetVehiclePedIsIn(ped, false);

  if (!isAllowedSirens(veh, ped)) return;

  const ent: StateBagInterface = Entity(veh).state;

  if (!ent.horn) return;

  ent.set("horn", false, true);
  ent.set("sirenMode", ent.lightsOn ? restoreSiren : 0, true);
  restoreSiren = 0;
}, false);

RegisterKeyMapping("+emergencyHornHold", "Hold this button to sound your emergency vehicle's horn", "keyboard", "E");

RegisterCommand("sirenSound2Toggle", () => {
  const ped: number = PlayerPedId();
  const veh: number = GetVehiclePedIsIn(ped, false);

  if (!isAllowedSirens(veh, ped)) return;

  const ent: StateBagInterface = Entity(veh).state;

  ent.set("siren2On", !ent.siren2On, true);
}, false);

RegisterKeyMapping("sirenSound2Toggle", "Toggle your emergency vehicle's second siren sound", "keyboard", "UP");

RegisterCommand("sirenLightsToggle", () => {
  const ped: number = PlayerPedId();
  const veh: number = GetVehiclePedIsIn(ped, false);

  if (!isAllowedSirens(veh, ped)) return;

  const ent: StateBagInterface = Entity(veh).state;

  PlaySoundFrontend(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
  const curMode: boolean = ent.lightsOn;
  ent.set("lightsOn", !curMode, true);

  if (!curMode) return;

  ent.set("siren2On", false, true);
  ent.set("sirenOn", false, true);
  ent.set("sirenMode", 0, true);
}, false);

RegisterKeyMapping("sirenLightsToggle", "Toggle your emergency vehicle's siren lights", "keyboard", "Q");

stateBagWrapper("horn", (ent: number, value: boolean) => {
  const relHornId: number | undefined = curHornSound.get(ent);
  if (relHornId !== undefined) {
    releaseHornSound(ent, relHornId);
    if (Debug) console.log(`[horn] ${ent} has sound, releasing sound id ${relHornId}`);
  };
  if (!value) return;
  const soundId: number = GetSoundId();
  if (Debug) console.log(`[horn] Setting sound id ${soundId} for ${ent}`);
  curHornSound.set(ent, soundId);
  const soundName: string = HornOverride.get(GetEntityModel(ent)) || "SIRENS_AIRHORN";
  PlaySoundFromEntity(soundId, soundName, ent, 0 as any, false, 0);
});

stateBagWrapper("lightsOn", (ent: number, value: boolean) => {
  SetVehicleHasMutedSirens(ent, true);
  SetVehicleSiren(ent, value);
  if (Debug) console.log(`[lights] ${ent} has sirens ${value ? 'on' : 'off'}`);
});

stateBagWrapper("siren2On", (ent: number, enabled: boolean) => {
  const relSoundId: number | undefined = curSiren2Sound.get(ent);
  if (relSoundId !== undefined) {
    releaseSiren2Sound(ent, relSoundId);
    if (Debug) console.log(`[siren2] ${ent} has sound, releasing sound id ${relSoundId}`);
  }
  if (!enabled) return;
  const soundId: number = GetSoundId();
  if (Debug) console.log(`[siren2] Setting sound id ${soundId} for ${ent}`);
  curSiren2Sound.set(ent, soundId);
  let soundName: string = PrimarySirenOverride.get(GetEntityModel(ent)) || "VEHICLES_HORNS_SIREN_1";
  PlaySoundFromEntity(soundId, soundName, ent, 0 as any, false, 0)
});

stateBagWrapper("sirenMode", (ent: number, soundMode: number) => {
  const relSoundId: number | undefined = curSirenSound.get(ent);
  if (relSoundId !== undefined) {
    releaseSirenSound(ent, relSoundId);
    if (Debug) console.log(`[sirenMode] ${ent} has sound, releasing sound id ${relSoundId}`);
  };
  if (soundMode === 0) return;
  const soundId: number = GetSoundId();
  curSirenSound.set(ent, soundId);
  if (Debug) console.log(`[sirenMode] Setting sound id ${soundId} for ${ent}`);
  switch (soundMode) {
    case 1: {
      let soundName: string = PrimarySirenOverride.get(GetEntityModel(ent)) || "VEHICLES_HORNS_SIREN_1";
      PlaySoundFromEntity(soundId, soundName, ent, 0 as any, false, 0)
      break;
    }
    case 2: {
      PlaySoundFromEntity(soundId, "VEHICLES_HORNS_SIREN_2", ent, 0 as any, false, 0);
      break;
    }
    case 3: {
      PlaySoundFromEntity(soundId, "VEHICLES_HORNS_POLICE_WARNING", ent, 0 as any, false, 0);
      break;
    }
    default: {
      releaseSirenSound(ent, soundId);
      if (Debug) console.log("hit default? releasing sound");
    }
  }
});