-- ArenaRienWeapons: our own weapon / motion / prescript-tier pipeline.
local NAMES = {
  "RienWeapon01Hatchet","RienWeapon02Stiletto","RienWeapon03Greatsword",
  "RienWeapon04Rapier","RienWeapon05Sledgehammer","RienWeapon06Ultragreatsword",
  "RienWeapon07Lance","RienWeapon08Chain","RienWeapon09Scythe"
}
local MOT = { "S2","S5","S1","S4","S7","S8","S6","S9","S3" }

function ArenaDraw()
  local w = random(1, 9)
  for i = 1, 9 do destroybuff("Self", NAMES[i], 0, 100, true) end
  buff("Self", NAMES[w], 1, 0, 0)
  print("ARENA_DRAW " .. NAMES[w])

  if (getldata("Self", "ArenaUsed_" .. w) or 0) == 0 then
    setldata("Self", "ArenaUsed_" .. w, 1)
    local n = (getldata("Self", "ArenaCount") or 0) + 1
    setldata("Self", "ArenaCount", n)

    local tier = 0
    if n >= 9 then tier = 3 elseif n >= 6 then tier = 2 elseif n >= 3 then tier = 1 end
    for i = 0, 3 do destroybuff("Self", "IndexPrescriptRien_" .. i, 0, 100, true) end
    buff("Self", "IndexPrescriptRien_" .. tier, 1, 0, 0)
    print("ARENA_COUNT " .. n .. " tier " .. tier)

    if n >= 9 then
      for _, orig in ipairs({1013810, 1013811, 1013812}) do
        skillslotreplace(0, orig, 1013820)
      end
      print("ARENA_FURIOSO unlocked")
    end
  end
end

function ArenaMotion()
  -- 禁用：动作由原生 ChangeSkillMotion -> GetSkillMotion 决定
  -- 这里再写 changemotion 会与原生双写，导致 buff/动作不一致
  return
end