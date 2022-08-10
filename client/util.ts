export const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));

type StateBagHandler = (veh: number, value: any) => void;

export const stateBagWrapper = async (bagKey: string, handler: StateBagHandler) => {
  return AddStateBagChangeHandler(bagKey, null as any, async (bagName: string, _key: string, value: any, _: number, replicated: boolean) => {
    const entNet = Number(bagName.replace('entity:', ''));
    const timeout = GetGameTimer() + 1500;

    while (!NetworkDoesEntityExistWithNetworkId(entNet)) {
      await Delay(0);
      if (timeout < GetGameTimer()) return;
    }

    const veh = NetToVeh(entNet)
    const amOwner = NetworkGetEntityOwner(veh) == PlayerId()

    // If we're the owner we want to use local (more responsive)
    if (!amOwner && replicated || amOwner && !replicated) return;
    handler(NetToVeh(entNet), value);
  })
}
