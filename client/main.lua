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
local wasInVehicle = false
local lastVeh = nil

local debug = false -- enable for debug print

local function isAllowedSirens(veh, ped)
    return GetPedInVehicleSeat(veh, -1) == ped and GetVehicleClass(veh) == 18 and not IsPedInAnyHeli(ped) and not IsPedInAnyPlane(ped)
end

CreateThread(function()
    while true do
        local curSirenSound = sirenSync.getCurSirenSound()
        local curSiren2Sound = sirenSync.getCurSiren2Sound()
        local curHornSound = sirenSync.getCurHornSound()

        for k, v in pairs(curSirenSound) do
            sirenSync.releaseSirenSound(k, v, true)
        end

        for k, v in pairs(curSiren2Sound) do
            sirenSync.releaseSiren2Sound(k, v, true)
        end

        for k, v in pairs(curHornSound) do
            sirenSync.releaseHornSound(k, v, true)
        end

        Wait(1000)
    end
end)

CreateThread(function()
    while true do
        local ped <const> = PlayerPedId()
        local curVeh <const> = GetVehiclePedIsIn(ped, false)
        local ent <const> = Entity(curVeh).state
        local sleep = 0

        if curVeh == 0 then
            if wasInVehicle then
                wasInVehicle = false
                lastVeh = GetVehiclePedIsIn(ped, true)
                if lastVeh ~= 0 then
                    ent:set("sirenMode", 0, true)
                    ent:set("sirenOn", false, true)
                    ent:set("horn", false, true)
                end
            end

            sleep = 250
            goto skipLoop
        end

        if not isAllowedSirens(curVeh, ped) then
            sleep = 250
            goto skipLoop
        end

        if not ent.stateEnsured then
            if debug then print(("State bag doesn't exist for vehicle %s, ensuring"):format(curVeh)) end
            TriggerServerEvent("pma-sirensync:ensureStateBag", VehToNet(curVeh))
            sleep = 500
            goto skipLoop
        end

        wasInVehicle = true

        SetVehRadioStation(curVeh, "OFF")
        SetVehicleRadioEnabled(curVeh, false)

        -- These are disabled to prevent game mechanices from interfering with the keymapping
        DisableControlAction(0, 80, true) -- R
        DisableControlAction(0, 81, true) -- .
        DisableControlAction(0, 82, true) -- ,
        DisableControlAction(0, 83, true) -- =
        DisableControlAction(0, 84, true) -- -
        DisableControlAction(0, 85, true) -- Q
        DisableControlAction(0, 86, true) -- E
        DisableControlAction(0, 172, true) -- Up arrow

        :: skipLoop ::

        Wait(sleep)
    end
end)