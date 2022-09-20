onNet("pma-sirensync:ensureStateBag", (vehNet: number) => {
	const veh = NetworkGetEntityFromNetworkId(vehNet);

	if (veh === 0) return;

	const ent = Entity(veh).state

	if (ent.stateEnsured) return;

	ent.stateEnsured = true;
	ent.sirenMode = 0;
	ent.siren2Mode = 0;
	ent.horn = false;
	ent.lightsOn = false;
	ent.siren2On = false;
	ent.sirenOn = false;
});