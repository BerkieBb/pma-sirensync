local sirenSync <const> = exports['pma-sirensync']
local Wait <const> = Wait
local PlayerPedId <const> = PlayerPedId
local GetVehiclePedIsIn <const> = GetVehiclePedIsIn
local TriggerServerEvent <const> = TriggerServerEvent
local SetVehRadioStation <const> = SetVehRadioStation
local SetVehicleRadioEnabled <const> = SetVehicleRadioEnabled
local DisableControlAction <const> = DisableControlAction
local GetPedInVehicleSeat <const> = GetPedInVehicleSeat
local GetVehicleClass <const> = GetVehicleClass
local IsPedInAnyHeli <const> = IsPedInAnyHeli
local IsPedInAnyPlane <const> = IsPedInAnyPlane
local debug

local function isAllowedSirens(veh, ped)
    return GetPedInVehicleSeat(veh, -1) == ped and GetVehicleClass(veh) == 18 and not IsPedInAnyHeli(ped) and not IsPedInAnyPlane(ped)
end

CreateThread(function()
    debug = sirenSync.getDebug()
    local audioBanks = sirenSync.getAddonAudioBanks()
    for _, v in pairs(audioBanks) do
        RequestScriptAudioBank(v.bankName, false)
    end
    while true do
        local curSirenSound = sirenSync.getCurSirenSound()
        local curSiren2Sound = sirenSync.getCurSiren2Sound()
        local curHornSound = sirenSync.getCurHornSound()

        for veh, soundId in pairs(curSirenSound) do
            sirenSync.releaseSirenSound(veh, soundId, true)
        end

        for veh, soundId in pairs(curSiren2Sound) do
            sirenSync.releaseSiren2Sound(veh, soundId, true)
        end

        for veh, soundId in pairs(curHornSound) do
            sirenSync.releaseHornSound(veh, soundId, true)
        end

        Wait(1000)
    end
end)

CreateThread(function()
    local ped = PlayerPedId()
    local curState
    local curVeh = 0
    local lastVeh = 0
    local ensuringState = false
    local changedVehicle = false
    local allowedSirens = false
    local sleep = 0

    while true do
        ped = PlayerPedId()
        curVeh = GetVehiclePedIsIn(ped, false)
        allowedSirens = isAllowedSirens(curVeh, ped)

        if curVeh ~= lastVeh then
            if curVeh ~= 0 then
                curState = Entity(curVeh).state

                if allowedSirens then
                    SetVehRadioStation(curVeh, "OFF")
                    SetVehicleRadioEnabled(curVeh, false)
                end
            end

            changedVehicle = true
        end

        -- Update the state whilst it's ensuring
        curState = ensuringState and Entity(curVeh).state or curState

        sleep = 0

        if changedVehicle and curVeh == 0 then
            if lastVeh ~= 0 then
                curState:set("sirenMode", 0, true)
                curState:set("siren2Mode", 0, true)
                curState:set("sirenOn", false, true)
                curState:set("siren2On", false, true)
                curState:set("horn", false, true)
            end

            sleep = 250
            goto skipLoop
        end

        if curVeh == 0 or not allowedSirens then
            sleep = 250
            goto skipLoop
        end

        if changedVehicle and not ensuringState and not curState.stateEnsured then
            if debug then
                print(("State bag doesn't exist for vehicle %s, ensuring"):format(curVeh))
            end

            ensuringState = true
            TriggerServerEvent("pma-sirensync:ensureStateBag", VehToNet(curVeh))
            sleep = 500

            goto skipLoop
        else
            ensuringState = false
        end

        -- These are disabled to prevent game mechanics from interfering with the keymapping
        DisableControlAction(0, 80, true) -- R
        DisableControlAction(0, 81, true) -- .
        DisableControlAction(0, 82, true) -- ,
        DisableControlAction(0, 83, true) -- =
        DisableControlAction(0, 84, true) -- -
        DisableControlAction(0, 85, true) -- Q
        DisableControlAction(0, 86, true) -- E
        DisableControlAction(0, 172, true) -- Up arrow

        :: skipLoop ::

        lastVeh = curVeh
        changedVehicle = false

        Wait(sleep)
    end
end)
