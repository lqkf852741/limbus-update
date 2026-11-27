--Timeing:AfterSlots On Passives 

function GiveRandomSkill()
         local SkillSlots = skillslotcount("Self") or 1
         local Skill1 = {1013711,1013712,1013713}
         local Skill2 = {1013721,1013722,1013723}
         local Skill3 = {1013731,1013732,1013733}
         local skill
         local GiveSkill
         local Random

    for i = 0, (SkillSlots - 1) do

        Random = random(1,3)
        skill = Skill1[Random]
        GiveSkill = skill

        skillslotreplace(i, 1013710, GiveSkill)
    end

    for i = 0, (SkillSlots - 1) do

        Random = random(1,3)
        skill = Skill2[Random]
        GiveSkill = skill

        skillslotreplace(i, 1013720, GiveSkill)
    end

    for i = 0, (SkillSlots - 1) do

        Random = random(1,3)
        skill = Skill3[Random]
        GiveSkill = skill

        skillslotreplace(i, 1013730, GiveSkill)
    end
end


