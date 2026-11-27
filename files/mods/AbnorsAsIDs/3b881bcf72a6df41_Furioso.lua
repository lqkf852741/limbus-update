--Timeing:WhenUse On Passives 
function FuriosoCountCheck(Timing)
    if Timing == "WhenUse" then
        local CheckSkill = getskillid()
        local CheckBuff = getbuff("Self","StackRienSpecialSkillAlly","stack")
        local check = getldata("Self","CheckSkillID"..CheckSkill) or 0

        if CheckBuff < 9 then

            if CheckSkill == 1013711 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            elseif CheckSkill == 1013712 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            elseif CheckSkill == 1013713 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            elseif CheckSkill == 1013721 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            elseif CheckSkill == 1013722 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            elseif CheckSkill == 1013723 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            elseif CheckSkill == 1013731 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            elseif CheckSkill == 1013732 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            elseif CheckSkill == 1013733 and check == 0 then
                setldata("Self","CheckSkillID"..CheckSkill,1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
            end

        end

        if CheckSkill == 101375 then
            destroybuff("Self","StackRienSpecialSkillAlly",0)
            setldata("Self","CheckSkillID1013711",0)
            setldata("Self","CheckSkillID1013712",0)
            setldata("Self","CheckSkillID1013713",0)
            setldata("Self","CheckSkillID1013721",0)
            setldata("Self","CheckSkillID1013722",0)
            setldata("Self","CheckSkillID1013723",0)
            setldata("Self","CheckSkillID1013731",0)
            setldata("Self","CheckSkillID1013732",0)
            setldata("Self","CheckSkillID1013733",0)
        end
    elseif Timing == "EncounterStart" then
        setldata("Self","CheckSkillID1013711",0)
        setldata("Self","CheckSkillID1013712",0)
        setldata("Self","CheckSkillID1013713",0)
        setldata("Self","CheckSkillID1013721",0)
        setldata("Self","CheckSkillID1013722",0)
        setldata("Self","CheckSkillID1013723",0)
        setldata("Self","CheckSkillID1013731",0)
        setldata("Self","CheckSkillID1013732",0)
        setldata("Self","CheckSkillID1013733",0)
    elseif Timing == "AfterSlots" then
        local CheckBuff = getbuff("Self","StackRienSpecialSkillAlly","stack")

        if CheckBuff == 9 then
            skillslotreplace(0, 1013731, 101375)
            skillslotreplace(0, 1013732, 101375)
            skillslotreplace(0, 1013733, 101375)
        elseif CheckBuff < 9 then
            skillslotreplace(0, 101375, 1013731)
        end
    
    end

         
end

function FuriosoCountCheckCounter(Timing)
    if Timing == "WhenUse" then
        local Skill11 = getldata("Self","CheckSkillID1013711") or 0
        local Skill12 = getldata("Self","CheckSkillID1013712") or 0
        local Skill13 = getldata("Self","CheckSkillID1013713") or 0
        local Skill21 = getldata("Self","CheckSkillID1013721") or 0
        local Skill22 = getldata("Self","CheckSkillID1013722") or 0
        local Skill23 = getldata("Self","CheckSkillID1013723") or 0
        local Skill31 = getldata("Self","CheckSkillID1013731") or 0
        local Skill32 = getldata("Self","CheckSkillID1013732") or 0
        local Skill33 = getldata("Self","CheckSkillID1013733") or 0
        local StopChecking = getldata("Self","StopChecking") or 0

        if Skill11 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013711",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)

        elseif Skill12 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013712",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)

        elseif Skill13 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013713",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)

        elseif Skill21 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013721",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)

        elseif Skill22 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013722",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)

        elseif Skill23 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013723",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)

        elseif Skill31 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013731",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)

        elseif Skill32 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013732",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)

        elseif Skill33 == 0 and StopChecking == 0 then

            setldata("Self","StopChecking",1)
            StopChecking = getldata("Self","StopChecking")
            setldata("Self","CheckSkillID1013733",1)
            buff("Self","StackRienSpecialSkillAlly",1,0,0)
        end
    elseif Timing == "StartBattle" then

        setldata("Self","CounterUse",1)
        setdata("Self","10137021",1)
    
    elseif Timing == "EndBattle" then
        local CheckBuff = getbuff("Self","UnlockBuffAlly_3","stack")
        local CheckBlessing = getbuff("Self","BlessingOfIndexPrescriptAlly","stack")
        local Blessing
        local GiveBlessing
        local GiveKarma
        local CounterCheck = getldata("Self","CounterUse")
        setldata("Self","StopChecking",0)

        if CheckBlessing < 3 then
            Blessing = 3
        elseif CheckBlessing >= 3 and CheckBlessing < 6 then
            Blessing = 6
        elseif CheckBlessing >= 6 and CheckBlessing < 9 then
            Blessing = 9
        end

        GiveBlessing = Blessing - CheckBlessing
        GiveKarma = GiveBlessing * 5

        if CheckBuff == 0 and CounterCheck == 1 then
            buff("Self","BlessingOfIndexPrescriptAlly",GiveBlessing,0,0)
            buff("Self","KarmaOfIndexAlly",GiveKarma,0,1)
        end
        
        setldata("Self","CounterUse",0)
        setdata("Self","10137021",0)
    end

end

function FuriosoCountCheckNEW(Timing)
    if Timing == "OCT" then
        local CheckBuff = getldata("Self", "Rien_RemoveWeapon") or 0
        local CheckUnlockStage1 = getbuff("Self","UnlockBuffAlly_1","stack") or 0
        local CheckUnlockStage2 = getbuff("Self","UnlockBuffAlly_2","stack") or 0
        local CheckUnlockStage3 = getbuff("Self","UnlockBuffAlly_3","stack") or 0
        local UnlockStage = 0
        local CombineUnlockStage
        local StopGaining = getldata("Self","StopGainingStackRienSpecialSkill") or 0
        local check = getldata("Self","CheckBuffID"..CheckBuff) or 0
        local GainingCount = getldata("Self","GainingCount") or 0
        local GainingCountLimit = getldata("Self","GainingCountLimit") or 0

        if CheckUnlockStage1 == 1 then 
            UnlockStage = 1 
        end

        if CheckUnlockStage2 == 1 then 
            UnlockStage = 2 
        end

        if CheckUnlockStage3 == 1 then 
            UnlockStage = 3 
        end

        if GainingCount == 8 then
            if CheckUnlockStage2 == 0 then
                if CheckUnlockStage3 == 0 then
                        StopGaining = 1
                end
            end
        end

        CombineUnlockStage = 1 + UnlockStage

    if StopGaining == 0 and GainingCountLimit < CombineUnlockStage then

            print(check.." and "..CheckBuff.." Weapon This Time DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")

        if check == 0 then

            if CheckBuff == "RienWeapon01Hatchet" or CheckBuff == "RienWeapon01Hatchet2phase" then
                setldata("Self","CheckBuffIDRienWeapon01Hatchet",1)
                setldata("Self","CheckBuffIDRienWeapon01Hatchet2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1          
            end

            if CheckBuff == "RienWeapon02Stiletto" or CheckBuff == "RienWeapon02Stiletto2phase" then
                setldata("Self","CheckBuffIDRienWeapon02Stiletto",1)
                setldata("Self","CheckBuffIDRienWeapon02Stiletto2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if CheckBuff == "RienWeapon03Greatsword" or CheckBuff == "RienWeapon03Greatsword2phase" then
                setldata("Self","CheckBuffIDRienWeapon03Greatsword",1)
                setldata("Self","CheckBuffIDRienWeapon03Greatsword2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if CheckBuff == "RienWeapon04Rapier" or CheckBuff == "RienWeapon04Rapier2phase" then
                setldata("Self","CheckBuffIDRienWeapon04Rapier",1)
                setldata("Self","CheckBuffIDRienWeapon04Rapier2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if CheckBuff == "RienWeapon05Sledgehammer" or CheckBuff == "RienWeapon05Sledgehammer2phase" then
                setldata("Self","CheckBuffIDRienWeapon05Sledgehammer",1)
                setldata("Self","CheckBuffIDRienWeapon05Sledgehammer2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if CheckBuff == "RienWeapon06Ultragreatsword" or CheckBuff == "RienWeapon06Ultragreatsword2phase" then
                setldata("Self","CheckBuffIDRienWeapon06Ultragreatsword",1)
                setldata("Self","CheckBuffIDRienWeapon06Ultragreatsword2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if CheckBuff == "RienWeapon07Lance" or CheckBuff == "RienWeapon07Lance2phase" then
                setldata("Self","CheckBuffIDRienWeapon07Lance",1)
                setldata("Self","CheckBuffIDRienWeapon07Lance2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if CheckBuff == "RienWeapon08Chain" or CheckBuff == "RienWeapon08Chain2phase" then
                setldata("Self","CheckBuffIDRienWeapon08Chain",1)
                setldata("Self","CheckBuffIDRienWeapon08Chain2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if CheckBuff == "RienWeapon09Scythe" or CheckBuff == "RienWeapon09Scythe2phase" then
                setldata("Self","CheckBuffIDRienWeapon09Scythe",1)
                setldata("Self","CheckBuffIDRienWeapon09Scythe2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end
        end

            setldata("Self","GainingCount",GainingCount)
            setldata("Self","GainingCountLimit",GainingCountLimit)
    end
            
    elseif Timing == "RoundStart" then
        local StopGaining = getldata("Self","StopGainingStackRienSpecialSkill") or 0

            if (getbuff("Self","StackRienSpecialSkillAlly","stack")) == 9 and (getbuff("Self","BurningWoundRienAlly","stack")) == 1 then
                buff("Self","BlackNightmareRienAlly",1,0,0)
            end
            
            if StopGaining == 1 then
                setldata("Self","CheckBuffIDRienWeapon01Hatchet",0)
                setldata("Self","CheckBuffIDRienWeapon02Stiletto",0)
                setldata("Self","CheckBuffIDRienWeapon03Greatsword",0)
                setldata("Self","CheckBuffIDRienWeapon04Rapier",0)
                setldata("Self","CheckBuffIDRienWeapon05Sledgehammer",0)
                setldata("Self","CheckBuffIDRienWeapon06Ultragreatsword",0)
                setldata("Self","CheckBuffIDRienWeapon07Lance",0)
                setldata("Self","CheckBuffIDRienWeapon08Chain",0)
                setldata("Self","CheckBuffIDRienWeapon09Scythe",0)

                setldata("Self","CheckBuffIDRienWeapon01Hatchet2phase",0)
                setldata("Self","CheckBuffIDRienWeapon02Stiletto2phase",0)
                setldata("Self","CheckBuffIDRienWeapon03Greatsword2phase",0)
                setldata("Self","CheckBuffIDRienWeapon04Rapier2phase",0)
                setldata("Self","CheckBuffIDRienWeapon05Sledgehammer2phase",0)
                setldata("Self","CheckBuffIDRienWeapon06Ultragreatsword2phase",0)
                setldata("Self","CheckBuffIDRienWeapon07Lance2phase",0)
                setldata("Self","CheckBuffIDRienWeapon08Chain2phase",0)
                setldata("Self","CheckBuffIDRienWeapon09Scythe2phase",0)
            end

            setldata("Self","GainingCountLimit",0)
            setldata("Self","StopGainingStackRienSpecialSkill",0)
            
    elseif Timing == "EncounterStart" then
            setldata("Self","CheckBuffIDRienWeapon01Hatchet",0)
            setldata("Self","CheckBuffIDRienWeapon02Stiletto",0)
            setldata("Self","CheckBuffIDRienWeapon03Greatsword",0)
            setldata("Self","CheckBuffIDRienWeapon04Rapier",0)
            setldata("Self","CheckBuffIDRienWeapon05Sledgehammer",0)
            setldata("Self","CheckBuffIDRienWeapon06Ultragreatsword",0)
            setldata("Self","CheckBuffIDRienWeapon07Lance",0)
            setldata("Self","CheckBuffIDRienWeapon08Chain",0)
            setldata("Self","CheckBuffIDRienWeapon09Scythe",0)
            setldata("Self","StopGainingStackRienSpecialSkill",0)

            setldata("Self","CheckBuffIDRienWeapon01Hatchet2phase",0)
            setldata("Self","CheckBuffIDRienWeapon02Stiletto2phase",0)
            setldata("Self","CheckBuffIDRienWeapon03Greatsword2phase",0)
            setldata("Self","CheckBuffIDRienWeapon04Rapier2phase",0)
            setldata("Self","CheckBuffIDRienWeapon05Sledgehammer2phase",0)
            setldata("Self","CheckBuffIDRienWeapon06Ultragreatsword2phase",0)
            setldata("Self","CheckBuffIDRienWeapon07Lance2phase",0)
            setldata("Self","CheckBuffIDRienWeapon08Chain2phase",0)
            setldata("Self","CheckBuffIDRienWeapon09Scythe2phase",0)

            setldata("Self","GainingCount",0)
            setldata("Self","GainingCountLimit",0)
    elseif Timing == "AfterSlots" then
        local CheckBuff = getbuff("Self","StackRienSpecialSkillAlly","stack")

        if CheckBuff == 9 and (getbuff("Self","BurningWoundRienAlly","stack")) == 0 then
            setldata("Self","StopGainingStackRienSpecialSkill",1)
            skillslotreplace(0, 1013711, 101375)
            skillslotreplace(0, 1013712, 101375)
            skillslotreplace(0, 1013713, 101375)
            skillslotreplace(0, 1013721, 101375)
            skillslotreplace(0, 1013722, 101375)
            skillslotreplace(0, 1013723, 101375)
            skillslotreplace(0, 1013731, 101375)
            skillslotreplace(0, 1013732, 101375)
            skillslotreplace(0, 1013733, 101375)
        elseif CheckBuff < 9 and (getbuff("Self","BurningWoundRienAlly","stack")) == 0 then
            skillslotreplace(0, 101375, 1013711)
        elseif CheckBuff == 9 and (getbuff("Self","BurningWoundRienAlly","stack")) == 1 then
            setldata("Self","StopGainingStackRienSpecialSkill",1)
            skillslotreplace(0, 1013711, 101376)
            skillslotreplace(0, 1013712, 101376)
            skillslotreplace(0, 1013713, 101376)
            skillslotreplace(0, 1013721, 101376)
            skillslotreplace(0, 1013722, 101376)
            skillslotreplace(0, 1013723, 101376)
            skillslotreplace(0, 1013731, 101376)
            skillslotreplace(0, 1013732, 101376)
            skillslotreplace(0, 1013733, 101376)
        elseif CheckBuff == 9 and (getbuff("Self","BlackNightmareRienAlly","stack")) == 1 then
            setldata("Self","StopGainingStackRienSpecialSkill",1)
            skillslotreplace(0, 1013711, 101377)
            skillslotreplace(0, 1013712, 101377)
            skillslotreplace(0, 1013713, 101377)
            skillslotreplace(0, 1013721, 101377)
            skillslotreplace(0, 1013722, 101377)
            skillslotreplace(0, 1013723, 101377)
            skillslotreplace(0, 1013731, 101377)
            skillslotreplace(0, 1013732, 101377)
            skillslotreplace(0, 1013733, 101377)
            skillslotreplace(0, 101375, 101377)
            skillslotreplace(0, 101376, 101377)
        elseif CheckBuff < 9 and (getbuff("Self","BlackNightmareRienAlly","stack")) == 1 then
            skillslotreplace(0, 101375, 1013711)
            skillslotreplace(0, 101376, 1013711)
            skillslotreplace(0, 101377, 1013711)
        end
    
    end

         
end

function FuriosoCountCheckCounterNEW(Timing)
    if Timing == "WhenUse" then


            local Skill11 = getldata("Self","CheckBuffIDRienWeapon01Hatchet") or 0
            local Skill12 = getldata("Self","CheckBuffIDRienWeapon02Stiletto") or 0
            local Skill13 = getldata("Self","CheckBuffIDRienWeapon03Greatsword") or 0
            local Skill21 = getldata("Self","CheckBuffIDRienWeapon04Rapier") or 0
            local Skill22 = getldata("Self","CheckBuffIDRienWeapon05Sledgehammer") or 0
            local Skill23 = getldata("Self","CheckBuffIDRienWeapon06Ultragreatsword") or 0
            local Skill31 = getldata("Self","CheckBuffIDRienWeapon07Lance") or 0
            local Skill32 = getldata("Self","CheckBuffIDRienWeapon08Chain") or 0
            local Skill33 = getldata("Self","CheckBuffIDRienWeapon09Scythe") or 0

            local StopChecking = getldata("Self","StopChecking") or 0

            local CheckUnlockStage1 = getbuff("Self","UnlockBuffAlly_1","stack") or 0
            local CheckUnlockStage2 = getbuff("Self","UnlockBuffAlly_2","stack") or 0
            local CheckUnlockStage3 = getbuff("Self","UnlockBuffAlly_3","stack") or 0
            local UnlockStage = 0
            local CombineUnlockStage
            local StopGaining = getldata("Self","StopGainingStackRienSpecialSkill") or 0
            local GainingCount = getldata("Self","GainingCount") or 0
            local GainingCountLimit = getldata("Self","GainingCountLimit") or 0

        if (getbuff("Self","BurningWoundRienAlly","stack")) == 1 then
            Skill11 = getldata("Self","CheckBuffIDRienWeapon01Hatchet2phase")
            Skill12 = getldata("Self","CheckBuffIDRienWeapon02Stiletto2phase")
            Skill13 = getldata("Self","CheckBuffIDRienWeapon03Greatsword2phase")
            Skill21 = getldata("Self","CheckBuffIDRienWeapon04Rapier2phase")
            Skill22 = getldata("Self","CheckBuffIDRienWeapon05Sledgehammer2phase")
            Skill23 = getldata("Self","CheckBuffIDRienWeapon06Ultragreatsword2phase")
            Skill31 = getldata("Self","CheckBuffIDRienWeapon07Lance2phase")
            Skill32 = getldata("Self","CheckBuffIDRienWeapon08Chain2phase")
            Skill33 = getldata("Self","CheckBuffIDRienWeapon09Scythe2phase")
        end

            if CheckUnlockStage1 == 1 then 
                UnlockStage = 1 
            end

            if CheckUnlockStage2 == 1 then 
                UnlockStage = 2 
            end

            if CheckUnlockStage3 == 1 then 
                UnlockStage = 3 
            end

            if GainingCount == 8 then
                if CheckUnlockStage2 == 0 then
                    if CheckUnlockStage3 == 0 then
                            StopGaining = 1
                    end
                end
            end

            CombineUnlockStage = 1 + UnlockStage

        if StopGaining == 0 and GainingCountLimit < CombineUnlockStage then

            if Skill11 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon01Hatchet",1)
                setldata("Self","CheckBuffIDRienWeapon01Hatchet2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if Skill12 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon02Stiletto",1)
                setldata("Self","CheckBuffIDRienWeapon02Stiletto2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if Skill13 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon03Greatsword",1)
                setldata("Self","CheckBuffIDRienWeapon03Greatsword2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if Skill21 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon04Rapier",1)
                setldata("Self","CheckBuffIDRienWeapon04Rapier2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if Skill22 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon05Sledgehammer",1)
                setldata("Self","CheckBuffIDRienWeapon05Sledgehammer2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if Skill23 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon06Ultragreatsword",1)
                setldata("Self","CheckBuffIDRienWeapon06Ultragreatsword2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if Skill31 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon07Lance",1)
                setldata("Self","CheckBuffIDRienWeapon07Lance2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if Skill32 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon08Chain",1)
                setldata("Self","CheckBuffIDRienWeapon08Chain2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end

            if Skill33 == 0 and StopChecking == 0 then

                setldata("Self","StopChecking",1)
                StopChecking = getldata("Self","StopChecking")
                setldata("Self","CheckBuffIDRienWeapon09Scythe",1)
                setldata("Self","CheckBuffIDRienWeapon09Scythe2phase",1)
                buff("Self","StackRienSpecialSkillAlly",1,0,0)
                GainingCountLimit = GainingCountLimit + 1
                GainingCount = GainingCount + 1
            end


            setldata("Self","GainingCount",GainingCount)
            setldata("Self","GainingCountLimit",GainingCountLimit)
        end
    elseif Timing == "StartBattle" then

        setldata("Self","CounterUse",1)
        setdata("Self","10137021",1)
    
    elseif Timing == "EndBattle" then
        local CheckBuff = getbuff("Self","UnlockBuffAlly_3","stack")
        local CheckBlessing = getbuff("Self","BlessingOfIndexPrescriptAlly","stack")
        local Blessing
        local GiveBlessing
        local GiveKarma
        local CounterCheck = getldata("Self","CounterUse")
        setldata("Self","StopChecking",0)

        if CheckBlessing < 3 then
            Blessing = 3
        elseif CheckBlessing >= 3 and CheckBlessing < 6 then
            Blessing = 6
        elseif CheckBlessing >= 6 and CheckBlessing < 9 then
            Blessing = 9
        end

        GiveBlessing = Blessing - CheckBlessing
        GiveKarma = GiveBlessing * 5

        if CheckBuff == 0 and CounterCheck == 1 then
            buff("Self","BlessingOfIndexPrescriptAlly",GiveBlessing,0,0)
            buff("Self","KarmaOfIndexAlly",GiveKarma,0,1)
        end
        
        setldata("Self","CounterUse",0)
        setdata("Self","10137021",0)
    end

end

function StackRienSpecialSkillCount()

    local VoiceLines = {"9SV-BAT17-10","9SV-BAT17-11","9SV-BAT17-12","9SV-BAT17-13","9SV-BAT17-14","9SV-BAT17-15","9SV-BAT17-16","9SV-BAT17-17","9SV-BAT17-18"}
    local CheckBuff = getbuff("Self","StackRienSpecialSkillAlly","stack") or 0
    local CheckBuffLastTurn = getdata("Self","101375001") or 0

    if CheckBuff ~= CheckBuffLastTurn then

        sound("voice",VoiceLines[CheckBuff])

        setdata("Self","101375001", CheckBuff)
    end

end

