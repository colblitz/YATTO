import math
import sys

"""
Things to check:
 - boss health formula
 - stage gold
 - check if boss gold is actually BOSS_CONSTANT
 - check hero ids
 - find hero base costs

"""

"""
Assumptions:
 - ignoring hero boss damage skills --> less boss life

"""

# (2 + 4*1.14 + 6*1.14**2 + 8*1.14**3 + 10*1.14**4)/(1 + 1.14 + 1.14**2 + 1.14**3 + 1.14**4)
BOSS_CONSTANT = 6.520253320788821
MAIN_LEVEL = 600

class Artifact:
    def __init__(self, name, ad0, adpl, levelcap, cost):
        self.name = name
        self.ad0 = ad0
        self.adpl = adpl
        self.levelcap = levelcap if levelcap != 0 else sys.maxint
        self.cost = cost

    def getAD(self, cl):
        if (cl == 0):
            return 0
        return int(self.ad0 + self.adpl * (cl-1))

    def costToLevel(self, cl):
        if cl >= self.levelcap or cl == 0:
            return sys.maxint
        return int(round(self.cost(cl+1.0)))

    def info(self, cl):
        return self.name + "(" + str(cl) + "): " + "%5d" % (self.getAD(cl)) + "\%all dmg, cost to level: " + str(self.costToLevel(cl))

artifact_info = [
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
    Artifact("Drunken Hammer",           60,  30,  0, lambda x: 0.6*pow(x, 1.7)), #  9 tap damage
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

STYPE_HERO_DPS, STYPE_ALL_DAMAGE, STYPE_CRIT_DAMAGE, STYPE_TAP_DAMAGE, STYPE_PERCENT_DPS, STYPE_CHEST_GOLD, STYPE_GOLD_DROPPED, STYPE_BOSS_DAMAGE, STYPE_CRIT_CHANCE = range(9)

class Hero:
    def __init__(self, name, hid, base_cost, skills):
        self.name = name
        self.hid = hid
        self.base_cost = base_cost
        self.skills = skills

    def level_to_skills(level):
        if level > 1000:
            level -= 1000
        if level < 10:
            return 0
        elif level < 25:
            return 1
        elif level < 50:
            return 2
        elif level < 100:
            return 3
        elif level < 200:
            return 4
        elif level < 400:
            return 5
        elif level < 800:
            return 6
        return 7

hero_info = [
    Hero("Takeda the Blade Assassin", 1, 0, [
        (50, STYPE_HERO_DPS), 
        (100, STYPE_HERO_DPS), 
        (10, STYPE_ALL_DAMAGE), 
        (10, STYPE_CRIT_DAMAGE), 
        (1000, STYPE_HERO_DPS), 
        (25, STYPE_ALL_DAMAGE), 
        (10000, STYPE_HERO_DPS)]),
    Hero("Contessa the Torch Wielder", 2, 0, [
        (5, STYPE_TAP_DAMAGE),
        (100, STYPE_HERO_DPS),
        (1000, STYPE_HERO_DPS),
        (0.4, STYPE_PERCENT_DPS),
        (10, STYPE_ALL_DAMAGE),
        (10, STYPE_GOLD_DROPPED),
        (10000, STYPE_HERO_DPS)]),
    Hero("Hornetta, Queen of the Valrunes", 3, 0, [
        (150, STYPE_HERO_DPS),
        (10, STYPE_GOLD_DROPPED),
        (10, STYPE_ALL_DAMAGE),
        (0.4, STYPE_PERCENT_DPS),
        (20, STYPE_CHEST_GOLD),
        (1, STYPE_CRIT_CHANCE),
        (30, STYPE_ALL_DAMAGE)]),
    Hero("Mila the Hammer Stomper", 4, 0, [
        (100, STYPE_HERO_DPS),
        (800, STYPE_HERO_DPS),
        (6, STYPE_GOLD_DROPPED),
        (500, STYPE_HERO_DPS),
        (5, STYPE_CRIT_DAMAGE),
        (20, STYPE_ALL_DAMAGE),
        (20, STYPE_CHEST_GOLD)]),
    Hero("Terra the Land Scorcher", 5, 0, [
        (300, STYPE_HERO_DPS),
        (10, STYPE_GOLD_DROPPED),
        (0.4, STYPE_PERCENT_DPS),
        (15, STYPE_GOLD_DROPPED),
        (20, STYPE_CHEST_GOLD),
        (5, STYPE_TAP_DAMAGE),
        (10000, STYPE_HERO_DPS)]),
    Hero("Inquisireaux the Terrible", 6, 0, [
        (200, STYPE_HERO_DPS),
        (700, STYPE_HERO_DPS),
        (10, STYPE_ALL_DAMAGE),
        (20, STYPE_ALL_DAMAGE),
        (5, STYPE_CRIT_DAMAGE),
        (2, STYPE_CRIT_CHANCE),
        (10000, STYPE_HERO_DPS)]),
    Hero("Charlotte the Special", 7, 0, [
        (200, STYPE_HERO_DPS),
        (5, STYPE_BOSS_DAMAGE),
        (7, STYPE_BOSS_DAMAGE),
        (600, STYPE_HERO_DPS),
        (5, STYPE_TAP_DAMAGE),
        (20, STYPE_CHEST_GOLD),
        (30, STYPE_ALL_DAMAGE)]),
    Hero("Jordaan, Knight of Mini", 8, 0, [
        (200, STYPE_HERO_DPS),
        (10, STYPE_ALL_DAMAGE),
        (0.4, STYPE_PERCENT_DPS),
        (15, STYPE_GOLD_DROPPED),
        (20, STYPE_CHEST_GOLD),
        (1900, STYPE_HERO_DPS),
        (20, STYPE_ALL_DAMAGE)]),
    Hero("Jukka, Master of Axes", 9, 0, [
        (150, STYPE_HERO_DPS),
        (5, STYPE_BOSS_DAMAGE),
        (30, STYPE_ALL_DAMAGE),
        (5, STYPE_CRIT_DAMAGE),
        (5000, STYPE_HERO_DPS),
        (25, STYPE_ALL_DAMAGE),
        (10000, STYPE_HERO_DPS)]),
    Hero("Milo and Clonk-Clonk", 10, 0, [
        (150, STYPE_HERO_DPS),
        (1, STYPE_CRIT_CHANCE),
        (5, STYPE_BOSS_DAMAGE),
        (15, STYPE_GOLD_DROPPED),
        (20, STYPE_CHEST_GOLD),
        (25, STYPE_CHEST_GOLD),
        (15, STYPE_ALL_DAMAGE)]),
    Hero("Macelord the Ruthless", 11, 0, [
        (200, STYPE_HERO_DPS),
        (850, STYPE_HERO_DPS),
        (5, STYPE_TAP_DAMAGE),
        (0.4, STYPE_PERCENT_DPS),
        (15, STYPE_GOLD_DROPPED),
        (5, STYPE_TAP_DAMAGE),
        (20, STYPE_GOLD_DROPPED)]),
    Hero("Gertrude the Goat Rider", 12, 0, [
        (250, STYPE_HERO_DPS),
        (1300, STYPE_HERO_DPS),
        (7, STYPE_BOSS_DAMAGE),
        (5, STYPE_CRIT_DAMAGE),
        (0.4, STYPE_PERCENT_DPS),
        (5, STYPE_TAP_DAMAGE),
        (20, STYPE_GOLD_DROPPED)]),
    Hero("Twitterella the Tweeter", 13, 0, [
        (150, STYPE_HERO_DPS),
        (850, STYPE_HERO_DPS),
        (5, STYPE_TAP_DAMAGE),
        (20, STYPE_ALL_DAMAGE),
        (30, STYPE_ALL_DAMAGE),
        (5, STYPE_CRIT_DAMAGE),
        (12000, STYPE_HERO_DPS)]),
    Hero("Master Hawk, Lord of Luft", 14, 0, [
        (200, STYPE_HERO_DPS),
        (1100, STYPE_HERO_DPS),
        (0.4, STYPE_PERCENT_DPS),
        (400, STYPE_HERO_DPS),
        (10, STYPE_GOLD_DROPPED),
        (10, STYPE_CRIT_DAMAGE),
        (20, STYPE_GOLD_DROPPED)]),
    Hero("Elpha, Wielder of Gems", 15, 0, [
        (300, STYPE_HERO_DPS),
        (40, STYPE_ALL_DAMAGE),
        (5, STYPE_BOSS_DAMAGE),
        (2, STYPE_CRIT_CHANCE),
        (15, STYPE_CRIT_DAMAGE),
        (20, STYPE_CHEST_GOLD),
        (10000, STYPE_HERO_DPS)]),
    Hero("Poppy, Daughter of Ceremony", 16, 0, [
        (350, STYPE_HERO_DPS),
        (25, STYPE_CHEST_GOLD),
        (20, STYPE_GOLD_DROPPED),
        (5, STYPE_BOSS_DAMAGE),
        (7, STYPE_BOSS_DAMAGE),
        (15, STYPE_ALL_DAMAGE),
        (20, STYPE_ALL_DAMAGE)]),
    Hero("Skulptor, Protector of Bridges", 17, 0, [
        (150, STYPE_HERO_DPS),
        (900, STYPE_HERO_DPS),
        (10, STYPE_GOLD_DROPPED),
        (10, STYPE_GOLD_DROPPED),
        (5, STYPE_TAP_DAMAGE),
        (10, STYPE_CRIT_DAMAGE),
        (25, STYPE_GOLD_DROPPED)]),
    Hero("Sterling the Enchantor", 18, 0, [
        (400, STYPE_HERO_DPS),
        (500, STYPE_HERO_DPS),
        (5, STYPE_BOSS_DAMAGE),
        (450, STYPE_HERO_DPS),
        (5, STYPE_TAP_DAMAGE),
        (20, STYPE_CHEST_GOLD),
        (15, STYPE_ALL_DAMAGE)]),
    Hero("Orba the Foreseer", 19, 0, [
        (200, STYPE_HERO_DPS),
        (1000, STYPE_HERO_DPS),
        (0.5, STYPE_PERCENT_DPS),
        (5, STYPE_TAP_DAMAGE),
        (10, STYPE_ALL_DAMAGE),
        (10, STYPE_GOLD_DROPPED),
        (10, STYPE_ALL_DAMAGE)]),
    Hero("Remus the Noble Archer", 20, 0, [
        (250, STYPE_HERO_DPS),
        (600, STYPE_HERO_DPS),
        (20, STYPE_CRIT_DAMAGE),
        (450, STYPE_HERO_DPS),
        (0.4, STYPE_PERCENT_DPS),
        (10, STYPE_TAP_DAMAGE),
        (10, STYPE_GOLD_DROPPED)]),
    Hero("Mikey the Magician Apprentice", 21, 0, [
        (200, STYPE_HERO_DPS),
        (5, STYPE_TAP_DAMAGE),
        (30, STYPE_ALL_DAMAGE),
        (2, STYPE_CRIT_CHANCE),
        (10, STYPE_ALL_DAMAGE),
        (20, STYPE_CHEST_GOLD),
        (10000, STYPE_HERO_DPS)]),
    Hero("Peter Pricker the Prickly Poker", 22, 0, [
        (250, STYPE_HERO_DPS),
        (750, STYPE_HERO_DPS),
        (10, STYPE_ALL_DAMAGE),
        (500, STYPE_HERO_DPS),
        (10, STYPE_ALL_DAMAGE),
        (30, STYPE_CRIT_DAMAGE),
        (20, STYPE_ALL_DAMAGE)]),
    Hero("Teeny Tom, Keeper of the Castle", 23, 0, [
        (300, STYPE_ALL_DAMAGE),
        (800, STYPE_ALL_DAMAGE),
        (0.4, STYPE_PERCENT_DPS),
        (20, STYPE_CRIT_DAMAGE),
        (10, STYPE_TAP_DAMAGE),
        (2, STYPE_CRIT_CHANCE),
        (10000, STYPE_HERO_DPS)]),
    Hero("Deznis the Cleanser", 24, 0, [
        (200, STYPE_HERO_DPS),
        (500, STYPE_HERO_DPS),
        (1200, STYPE_HERO_DPS),
        (15, STYPE_GOLD_DROPPED),
        (20, STYPE_CHEST_GOLD),
        (9000, STYPE_HERO_DPS),
        (15, STYPE_ALL_DAMAGE)]),
    Hero("Hamlette, Painter of Skulls", 25, 0, [
        (5, STYPE_TAP_DAMAGE),
        (5, STYPE_TAP_DAMAGE),
        (0.4, STYPE_PERCENT_DPS),
        (10, STYPE_ALL_DAMAGE),
        (15, STYPE_GOLD_DROPPED),
        (2, STYPE_CRIT_CHANCE),
        (15000, STYPE_HERO_DPS)]),
    Hero("Eistor the Banisher", 26, 0, [
        (350, STYPE_HERO_DPS),
        (650, STYPE_HERO_DPS),
        (0.4, STYPE_PERCENT_DPS),
        (5, STYPE_BOSS_DAMAGE),
        (10, STYPE_ALL_DAMAGE),
        (5, STYPE_BOSS_DAMAGE),
        (12, STYPE_GOLD_DROPPED)]),
    Hero("Flavius and Oinksbjorn", 27, 0, [
        (300, STYPE_HERO_DPS),
        (700, STYPE_HERO_DPS),
        (10, STYPE_ALL_DAMAGE),
        (5, STYPE_BOSS_DAMAGE),
        (2, STYPE_CRIT_CHANCE),
        (30, STYPE_CRIT_DAMAGE),
        (20, STYPE_CHEST_GOLD)]),
    Hero("Chester the Beast Tamer", 28, 0, [
        (350, STYPE_HERO_DPS),
        (1, STYPE_ALL_DAMAGE),
        (400, STYPE_HERO_DPS),
        (600, STYPE_HERO_DPS),
        (20, STYPE_CRIT_DAMAGE),
        (2, STYPE_CRIT_CHANCE),
        (15, STYPE_ALL_DAMAGE)]),
    Hero("Mohacas the Wind Warrior", 29, 0, [
        (330, STYPE_HERO_DPS),
        (550, STYPE_HERO_DPS),
        (10, STYPE_GOLD_DROPPED),
        (10, STYPE_TAP_DAMAGE),
        (20, STYPE_GOLD_DROPPED),
        (10, STYPE_ALL_DAMAGE),
        (30, STYPE_GOLD_DROPPED)]),
    Hero("Jaqulin the Unknown", 30, 0, [
        (1000, STYPE_HERO_DPS),
        (10, STYPE_TAP_DAMAGE),
        (4, STYPE_PERCENT_DPS),
        (20, STYPE_GOLD_DROPPED),
        (10, STYPE_ALL_DAMAGE),
        (20, STYPE_ALL_DAMAGE),
        (30, STYPE_ALL_DAMAGE)]),
    Hero("Pixie the Rebel Fairy", 31, 0, [
        (900, STYPE_HERO_DPS),
        (2000, STYPE_HERO_DPS),
        (1, STYPE_CRIT_CHANCE),
        (60, STYPE_TAP_DAMAGE),
        (25, STYPE_CHEST_GOLD),
        (10, STYPE_ALL_DAMAGE),
        (15, STYPE_GOLD_DROPPED)]),
    Hero("Jackalope the Fireballer", 32, 0, [
        (40, STYPE_HERO_DPS),
        (20, STYPE_HERO_DPS),
        (25, STYPE_GOLD_DROPPED),
        (60, STYPE_TAP_DAMAGE),
        (2, STYPE_CRIT_CHANCE),
        (30, STYPE_ALL_DAMAGE),
        (10, STYPE_BOSS_DAMAGE)]),
    Hero("Dark Lord, Punisher of All", 33, 0, [
        (2000, STYPE_HERO_DPS),
        (20, STYPE_TAP_DAMAGE),
        (1, STYPE_PERCENT_DPS),
        (25, STYPE_GOLD_DROPPED),
        (20, STYPE_ALL_DAMAGE),
        (30, STYPE_ALL_DAMAGE),
        (40, STYPE_ALL_DAMAGE)])]

def relics(stage, ua):
    # relics = ((floor to nearest 15 of stage - 75) / 15)^1.7 * undead bonus * 2
    return int(pow(stage/15-5, 1.7) * (2+ua*0.1))

def cost_to_buy_next(artifacts):
    owned = len([x for x in artifacts if x != 0]) + 1
    return int(owned * pow(1.35, owned))

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
    boss_gold = BOSS_CONSTANT * (1 + level_kshield)
    
    gold_multiplier = (mob_gold + boss_gold) / (mobs+1.0)
    total_multiplier = (1.0 + hero_gold + level_fortune*0.05) * (1.0 + level_elixier * 0.15)

    final_multiplier = total_multiplier * gold_multiplier
    return final_multiplier

def stage_gold(stage):
    return stage * (0.02 + (0.00045 * min(stage, 150)))

def stage_accumulated_gold(stage):
    pass

def stage_hp(stage):
    if stage <= 156:
        return 18.5*pow(1.57, stage)
    # 18.5*pow(1.57, 156) = 6.7222940277842625e+31        
    return 6.7222940277842625e+31*pow(1.17, stage-156)

def tap_damage(artifacts):
    # MAIN_LEVEL * pow(1.05, MAIN_LEVEL)

    # (Your Level*(1.05^(Your Level)))*(1+All Damage Bonus from Heroes)+
    # (Tap Damage % to DPS from Heroes*Total Hero DPS)*(1+Tap Damage Bonus from Heroes+
        # Tap Damage Bonus from Customizations)*(1+Artifacts All Damage)*(1+Drunken Hammer Bonus)*
#(1+All Damage from Customizations)


    # Tap Damage: (Your Level*(1.05^(Your Level)))*(1+All Damage Bonus from Heroes)+
    # (Tap Damage % to DPS from Heroes*Total Hero DPS)*(1+Tap Damage Bonus from Heroes+
        # Tap Damage Bonus from Customizations)*(1+Artifacts All Damage)*(1+Drunken Hammer Bonus)*
#(1+All Damage from Customizations)
    pass

def all_damage(artifacts):
    total_ad = 0
    for i, level in enumerate(artifacts):
        total_ad += artifact_info[i].getAD(level)
    total_ad *= (1 + 0.05 * artifacts[24])
    return int(round(total_ad))

def crit_multiplier(hero_thrust_level, customization_bonus, hero_bonus):
    return (10 + hero_bonus) * (1 + 0.2*hero_thrust_level) * (1 + customization_bonus)

def hero_damage(level):
    pass

############
##### Heroes

def get_ad_bonus(heroes):
    pass

def get_crit_bonus(heroes):
    pass

def get_crit_chance(heroes):
    pass

def get_tap_bonus(heroes):
    pass

def get_tap_percent(heroes):
    pass

def get_chest_bonus(heroes):
    pass

def get_gold_bonus(heroes):
    pass

def get_boss_bonus(heroes):
    pass





##### figure out:
## boss hp
## hero leveling cost - http://dd.reddit.com/r/TapTitans/comments/2u7scp/hero_upgrade_cost_explained/
## stage gold
## crit multiplier = (10+hero) * (1 + t) * (1 + c)


my_artifacts = [35, 100, 10, 165, 127, 165, 25, 25, 37, 151, 35, 150, 10, 100, 0, 108, 10, 10, 75, 62, 0, 10, 10, 25, 55, 142, 104, 10, 5]
print "ad test"
print all_damage(my_artifacts)

"""
Notes

# tap dmg * (1- crit chance) + tap dmg * (crit chance) * 0.65 * crit multiplier

# tap damage * ((1-crit chance )+ (crit chance * 0.65 * crit multiplier))

gold
# =5/6*egg*(1+hero+ff)*10*(1+hero chest)*(1+0.2*chest)*(1+0.15*elixir))
# 5/6*(normal*(chalice)*(1+hero gold+ff)*(1+amulet)*(1+0.15*elixir))
# 1/6*(1+hero gold+ff)*6*(1+ks)*(1+0.15*elixir)))/(1-AB9*0.02)
# (10-world)*(MIN((0.02+0.004*egg),1)*10*(1+0.2*chest+hero chest bonus)+MAX(0,(1+0.1*amulet)*(0.98-0.004*egg)*(MAX(0,1-0.005*chalice)+MIN(10,0.05*chalice))))+$O$3*(1+kshield

stage gold
    # olaudix - var num2 = GetStageBaseHP($("#stage").val()) * (0.02 + (0.00045 * Math.min(stage, 150.0)));

"""

"""
boss hp

stage 1 - 29 hp, boss = 29hp
419 -> 633 -> 848 -> 1.06k -> 10.68k
stage 2 - 45 hp, boss = 91 hp
10.68k -> 11.02k
641 -> 985
158 -> 502 -> 846 -> 1.19k -> 32.06k
stage 3 = 71 hp, boss = 214 hp
32.06k -> 32.62 (550)
1.26k -> 1.81 k (548) -> 7.32k -> 12.84k -> 13.39k -> 87.68k
stage 4 = 112 hp, boss = 393 hp
87.68k -> 88.56k (448) -> 97.41k -> 106.25k -> 107.13k -> 108.02k -> 246.96k
stage 5 = 176 hp, boss = 882 hp
246.96k -> 248.37k -> 262.54k -> 276.71k -> 290.89k -> 292.30k -> 610.35k
stage 6 = 277 hp, boss = 
610.35k, 612.62, 635.32, 



http://www.reddit.com/r/TapTitans/comments/2uszs5/dps_formula/
http://www.reddit.com/r/TapTitans/wiki/faq
http://dd.reddit.com/r/TapTitans/comments/317usc/new_damage_and_gold_formulas/
https://github.com/oLaudix/oLaudix.github.io/blob/master/common.js
https://github.com/oLaudix/oLaudix.github.io/blob/master/TTcalc.html
http://dd.reddit.com/r/TapTitans/comments/2u7scp/hero_upgrade_cost_explained/
http://dd.reddit.com/r/TapTitans/comments/2slhl1/increase_critical_damage_by_x/
http://dd.reddit.com/r/TapTitans/comments/2vbwe5/useful_linksdata/

"""


# Hero DPS (non-evolved): (((Base Cost*(1.075^(Level-1))*((1.075^(Level))-1))/0.075)*((0.904^(Level-1))*(((1-(0.019*(Minimum of either: Hero ID or 15))^(Hero ID)))*0.1)*(1+Hero Damage Bonus+All Damage Bonus from Heroes)*(1+Artifacts All Damage)*(1+(Number of Weapon Upgrades for Hero*0.5))*(1+All Damage Bonus from Customizations))*(Full Weapon Set Bonus, Where 0 Sets = 1, 1 Sets = 10, 2 Sets = 20, etc.)

# Hero DPS (non-evolved): 


# (
#  ((Base Cost*(1.075^(Level-1))*((1.075^(Level))-1)) / 0.075)
#  *
#  (
#   (0.904^(Level-1))
#   *
#   (((1-(0.019*(Minimum of either: Hero ID or 15))^(Hero ID)))*0.1)
#   *
#   (1+Hero Damage Bonus+All Damage Bonus from Heroes)
#   *
#   (1+Artifacts All Damage)
#   *
#   (1+(Number of Weapon Upgrades for Hero*0.5))
#   *
#   (1+All Damage Bonus from Customizations)
#  )
#  *
#  (Full Weapon Set Bonus, Where 0 Sets = 1, 1 Sets = 10, 2 Sets = 20, etc.)
# )

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

"""

"""
With the new update for iOS brings customization bonuses that acutally work! Through math and spreadsheets and actually matching it up with what I see in game, I'm here to provide updated calculations. Warning, may seem really mathy.
Hero DPS (non-evolved): (((Base Cost*(1.075^(Level-1))*((1.075^(Level))-1))/0.075)*((0.904^(Level-1))*(((1-(0.019*(Minimum of either: Hero ID or 15))^(Hero ID)))*0.1)*(1+Hero Damage Bonus+All Damage Bonus from Heroes)*(1+Artifacts All Damage)*(1+(Number of Weapon Upgrades for Hero*0.5))*(1+All Damage Bonus from Customizations))*(Full Weapon Set Bonus, Where 0 Sets = 1, 1 Sets = 10, 2 Sets = 20, etc.)
Hero DPS (evolved): ((((Base Cost)*10*(1.075^(Level-1))*((1.075^(Level-1000))-1))/0.075)*((0.904^(Level-1001))*((1-(0.019*15))^(Hero ID+30))*0.1)*(1+Hero Damage Bonus+All Damage Bonus from Heroes)*(1+Artifacts All Damage)*(1+(Number of Weapon Upgrades for Hero*0.5))*(1+All Damage Bonus from Customizations))*(Full Weapon Set Bonus, Where 0 Sets = 1, 1 Sets = 10, 2 Sets = 20, etc.)
Tap Damage: (Your Level*(1.05^(Your Level)))*(1+All Damage Bonus from Heroes)+(Tap Damage % to DPS from Heroes*Total Hero DPS)*(1+Tap Damage Bonus from Heroes+Tap Damage Bonus from Customizations)*(1+Artifacts All Damage)*(1+Drunken Hammer Bonus)*(1+All Damage from Customizations)
Chesterson Gold Calculation: Stage Base Gold*ROUNDUP(1+All Gold Bonus from Heroes+All Gold Bonus from Customizations+Future's Fortune Bonus)*10*(1+Treasure Gold from Heroes Bonus)*(1+Bonus from Crafter's Elixir)*(1+Bonus from Chest of Contentment)*(1+Chest Gold Bonus from Customizations)
2 interesting things I've discovered using these formulas:
The All Damage Bonus from Customizations is way too powerful in regards to Tap Damage and will most likely be nerfed.
Dark Lord's DPS calculations are off after he evolves. The only way I could get my numbers to match what I see in game are by changing the Base Cost of him from 4.56E+141 to 1.66E+141. This is only after he evolves and only effects his DPS calculation; his leveling up costs are still based on 4.56E+141.
Feel free to experiment and see if I made any mistakes with this.
"""
