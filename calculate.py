import math
import sys

class Artifact:
    def __init__(self, name, ad0, adpl, levelcap, cost):
        self.name = name
        self.ad0 = ad0
        self.adpl = adpl
        self.levelcap = levelcap if levelcap != 0 else sys.maxint
        self.cost = cost

    def getAD(self, cl):
        return self.ad0 + self.adpl * (cl-1)

    def costToLevel(self, cl):
        if cl >= self.levelcap or cl == 0:
            return sys.maxint
        return int(round(self.cost(cl+1.0)))

    def info(self, cl):
        return self.name + "(" + str(cl) + "): " + "%5d" % (self.getAD(cl)) + "\%all dmg, cost to level: " + str(self.costToLevel(cl))

artifacts = [
    #        Name                       ad0, adpl, levelcap, relic cost function = cost to get to level x
    Artifact("Amulet of the Valrunes",   50,  25,  0, lambda x: 0.7*pow(x, 2.0)), #  0 monster gold
    Artifact("Axe of Resolution",        70,  35,  0, lambda x: 0.5*pow(x, 1.7)), #  1 BR duration
    Artifact("Barbarian's Mettle",       70,  35, 10, lambda x: 0.4*pow(x, 1.5)), #  2 BR CDR
    Artifact("Chest of Contentment",     40,  20,  0, lambda x:     pow(x, 1.5)), #  3 chesterson gold
    Artifact("Crafter's Elixir",         40,  20,  0, lambda x: 0.5*pow(x, 1.8)), #  4 increase gold (multiplicative)
    Artifact("Crown Egg",                40,  20,  0, lambda x:     pow(x, 1.5)), #  5 chesterson chance
    Artifact("Dark Cloak of Life",       30,  15, 25, lambda x: 0.5*pow(x, 2.0)), #  6 boss life
    Artifact("Death Seeker",             30,  15, 25, lambda x: 0.8*pow(x, 2.5)), #  7 crit chance
    Artifact("Divine Chalice",           30,  15,  0, lambda x: 0.7*pow(x, 1.7)), #  8 chance for 10x gold
    Artifact("Drunken Hammer",           30,  15,  0, lambda x: 0.6*pow(x, 1.7)), #  9 tap damage
    Artifact("Future's Fortune",         30,  15,  0, lambda x: 0.7*pow(x, 2.0)), # 10 increase gold (additive)
    Artifact("Hero's Thrust",            30,  15,  0, lambda x: 0.7*pow(x, 1.7)), # 11 crit damage
    Artifact("Hunter's Ointment",       120,  60, 10, lambda x: 0.4*pow(x, 1.5)), # 12 WC CDR
    Artifact("Knight's Shield",          60,  30,  0, lambda x: 0.7*pow(x, 1.5)), # 13 boss gold
    Artifact("Laborer's Pendant",        70,  35, 10, lambda x: 0.7*pow(x, 1.5)), # 14 HoM CDR
    Artifact("Ogre's Gauntlet",          70,  35,  0, lambda x: 0.5*pow(x, 1.7)), # 15 SC duration
    Artifact("Otherworldly Armor",       70,  35,  0, lambda x:     pow(x, 2.2)), # 16 hero death chance
    Artifact("Overseer's Lotion",        70,  35, 10, lambda x: 0.4*pow(x, 1.5)), # 17 SC CDR
    Artifact("Parchment of Importance",  70,  35,  0, lambda x: 0.5*pow(x, 1.7)), # 18 CS duration
    Artifact("Ring of Opulence",         70,  35,  0, lambda x: 0.7*pow(x, 1.7)), # 19 HoM duration
    Artifact("Ring of Wondrous Charm",   30,  15, 25, lambda x: 0.5*pow(x, 1.7)), # 20 upgrade cost
    Artifact("Sacred Scroll",            70,  35, 10, lambda x: 0.4*pow(x, 1.5)), # 21 CS CDR
    Artifact("Saintly Shield",           70,  35, 10, lambda x: 0.3*pow(x, 1.5)), # 22 HS CDR
    Artifact("Savior Shield",            30,  15, 25, lambda x: 0.5*pow(x, 1.7)), # 23 boss time
    Artifact("Tincture of the Maker",    10,   5,  0, lambda x: 0.6*pow(x, 2.5)), # 24 all damage
    Artifact("Undead Aura",              30,  15,  0, lambda x: 0.7*pow(x, 2.0)), # 25 bonus relics
    Artifact("Universal Fissure",       120,  60,  0, lambda x: 0.5*pow(x, 1.7)), # 26 WR duration
    Artifact("Warrior's Revival",        70,  35, 10, lambda x:     pow(x, 2.2)), # 27 revive time
    Artifact("Worldly Illuminator",     300, 150,  5, lambda x: 0.6*pow(x, 3.0))] # 28 number of mobs

def relics(stage, ua):
    # relics = ((floor to nearest 15 of stage - 75) / 15)^1.7 * undead bonus * 2
    return int(pow(stage/15-5, 1.7) * (2+ua*0.1))

def gold_multiplier(artifacts, hero_gold, hero_chest_gold):
    level_amulet = artifacts[0]
    level_chest = artifacts[3]
    level_elixir = artifacts[4]
    level_egg = artifacts[5]
    level_chalice = artifacts[8]
    level_fortune = artifacts[10]
    level_kshield = artifacts[13]
    level_world = artifacts[28]

    mobs = 10 - level_world
    
    c_chance = 0.02 + 0.004 * level_egg
    c_gold = 10.0 * (1.0 + 0.2 * level_chest + hero_chest_gold)
    n_chance = 1.0 - c_chance
    n_gold = (1.0 + 0.1 * level_amulet) 
    d_chance = 0.005 * level_chalice
    d_multiplier = 1.0-d_chance + 10.0*d_chance
    mob_gold = mobs * (c_chance * c_gold + n_chance * n_gold * d_multiplier)

    # (2 + 4*1.14 + 6*1.14**2 + 8*1.14**3 + 10*1.14**4)/(1 + 1.14 + 1.14**2 + 1.14**3 + 1.14**4) = 6.520253320788821
    boss_gold = 6.52 * (1 + level_kshield)
    
    gold_multiplier = (mob_gold + boss_gold) / (mobs+1.0)
    total_multiplier = (1.0 + hero_gold + level_fortune*0.05) * (1.0 + level_elixier * 0.15)

    final_multiplier = total_multiplier * gold_multiplier

# =5/6*egg*(1+hero+ff)*10*(1+hero chest)*(1+0.2*chest)*(1+0.15*elixir))
# 5/6*(normal*(chalice)*(1+hero gold+ff)*(1+amulet)*(1+0.15*elixir))
# 1/6*(1+hero gold+ff)*6*(1+ks)*(1+0.15*elixir)))/(1-AB9*0.02)
# (10-world)*(MIN((0.02+0.004*egg),1)*10*(1+0.2*chest+hero chest bonus)+MAX(0,(1+0.1*amulet)*(0.98-0.004*egg)*(MAX(0,1-0.005*chalice)+MIN(10,0.05*chalice))))+$O$3*(1+kshield

def stage_gold(stage):
    pass

def stage_accumulated_gold(stage):
    pass

def stage_hp(stage):
    if stage <= 156:
        return 18.5*pow(1.57, stage)
    # 18.5*pow(1.57, 156) = 6.7222940277842625e+31        
    return 6.7222940277842625e+31*pow(1.17, stage-156)


# Hero DPS (non-evolved): (((Base Cost*(1.075^(Level-1))*((1.075^(Level))-1))/0.075)*((0.904^(Level-1))*(((1-(0.019*(Minimum of either: Hero ID or 15))^(Hero ID)))*0.1)*(1+Hero Damage Bonus+All Damage Bonus from Heroes)*(1+Artifacts All Damage)*(1+(Number of Weapon Upgrades for Hero*0.5))*(1+All Damage Bonus from Customizations))*(Full Weapon Set Bonus, Where 0 Sets = 1, 1 Sets = 10, 2 Sets = 20, etc.)
# Hero DPS (evolved): ((((Base Cost)*10*(1.075^(Level-1))*((1.075^(Level-1000))-1))/0.075)*((0.904^(Level-1001))*((1-(0.019*15))^(Hero ID+30))*0.1)*(1+Hero Damage Bonus+All Damage Bonus from Heroes)*(1+Artifacts All Damage)*(1+(Number of Weapon Upgrades for Hero*0.5))*(1+All Damage Bonus from Customizations))*(Full Weapon Set Bonus, Where 0 Sets = 1, 1 Sets = 10, 2 Sets = 20, etc.)
# Tap Damage: (Your Level*(1.05^(Your Level)))*(1+All Damage Bonus from Heroes)+(Tap Damage % to DPS from Heroes*Total Hero DPS)*(1+Tap Damage Bonus from Heroes+Tap Damage Bonus from Customizations)*(1+Artifacts All Damage)*(1+Drunken Hammer Bonus)*(1+All Damage from Customizations)

"""
given: level of artifacts, average taps/sec
get: all damage, gold multiplier, crit chance, crit damage

given: all damage, crit chance, crit damage, taps/sec
get: level that you can get to, time to get there

given: level of wall, time to get there
get: relics/time


gold != get you there faster
thought experiment - million x gold, could you get to 2500 faster than someone with 1000 x gold?
no, one shot everything = limit

gold increases period of one shotting - ????

gold defines max damage, all damage is a multiplier ***
mob health grows faster than gold

one shot everything
tap
berserkers
6.82
10.7
16.8
26.4
41.4
65.1
102.2
160.5


682 = 8


682 - 8
1.07k - 9 3.75k
10 - 1.68k, 8.41k
11 - 2.64k, 2.64k
12 - 4.14k, 8.29k
13 - 6.51k, 19.54k
14 - 10.22k, 35.79k
15 - 16.05k, 80.28k
1064 - 5.5e93
1073 - 2.26e94
1074 - 2.64e94
1075 - 3.09e94
1076 - 3.62e94
1077 - 4.23e94
1078 - 4.95e94
1079 - 5.79e94
1080 - 5.79e94
1081 - 7.93e94
1082 - 9.28e94
1083 - 1.09e95
1084 - 1.27e95
1085 - 1.49e95
1086 - 1.74e95

1163 - 3.1e100
1164 - 
1165 - 4.24e100
1166 - 4.96e100
1167 - 5.8e100
1168 - 6.79e100
1169 - 7.94e100
1170 - 9.29e100
1171 - 1.09e101
1172 - 1.27e101
1173 - 1.49e101
1174 - 1.74e101
1175 - 2.04e101
1176 - 2.38e101
1177 - 2.79e101
1178 - 3.26e101
1179 - 3.82e101
1171
Valrunes1171

"""
