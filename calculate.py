import math
import sys

"""
TODO:
 - factor in Ring of Wondrous Charm
 - check boss health formula
 - check boss gold formula
 - factor in hero boss damage -> less boss life
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

(STYPE_HERO_DPS, 
 STYPE_ALL_DAMAGE, 
 STYPE_CRIT_DAMAGE, 
 STYPE_TAP_DAMAGE, 
 STYPE_PERCENT_DPS,
 STYPE_CHEST_GOLD, 
 STYPE_GOLD_DROPPED, 
 STYPE_BOSS_DAMAGE, 
 STYPE_CRIT_CHANCE) = range(9)

class Hero:
    def __init__(self, name, hid, base_cost, skills):
        self.name = name
        self.hid = hid
        self.base_cost = base_cost
        self.skills = skills
        self.pre_calc = self.base_cost * (1-pow(0.019*min(self.hid, 15), self.hid)) / 0.75
        self.e_pre_calc = self.base_cost * pow(0.715, hid+30) / 0.075

    def level_to_skills(self, level):
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

    ### unconfirmed?
    def get_upgrade_cost(self, level):
        return (self.base_cost if level < 1000 else self.base_cost*10) * pow(1.075, level)

    def get_bonuses(self, level, stype):
        bonus = 0
        for i in range(self.level_to_skills(level)):
            if self.skills[i][1] == stype:
                bonus += self.skills[i][0]
        return bonus

    ### clean this up
    ### https://github.com/oLaudix/oLaudix.github.io/blob/master/TTcalc.html
    ### https://github.com/oLaudix/oLaudix.github.io/blob/master/common.js
    def get_base_damage(self, level):
        levelIneffiency = 0.904
        heroInefficiency = 0.019
        heroInefficiencySlowDown = 15.0
        heroUpgradeBase = 1.075
        n3 = 0
        if level >= 1001:
            n3 = pow(levelIneffiency, level - 1001) * pow(1-(heroInefficiency * heroInefficiencySlowDown), self.hid + 30.0)
        else:
            n3 = pow(levelIneffiency, level - 1) * pow(1-(heroInefficiency * min(self.hid, heroInefficiencySlowDown)), self.hid)
        n4 = 0
        if level >= 1001:
            n4 = ((self.get_upgrade_cost(level - 1) * (pow(heroUpgradeBase, level - 1000) - 1) / heroUpgradeBase) - 1) * n3 * 0.1
        else:
            n4 = self.get_upgrade_cost(level - 1) * (pow(heroUpgradeBase, level) - 1) / (heroUpgradeBase - 1) * n3 * 0.1
        return n4

hero_info = [
    Hero("Takeda the Blade Assassin", 1, 50, [
        (0.50, STYPE_HERO_DPS), (1.00, STYPE_HERO_DPS), (0.10, STYPE_ALL_DAMAGE), (0.10, STYPE_CRIT_DAMAGE), 
        (10.00, STYPE_HERO_DPS), (0.25, STYPE_ALL_DAMAGE), (100.00, STYPE_HERO_DPS)]),
    Hero("Contessa the Torch Wielder", 2, 175, [
        (0.05, STYPE_TAP_DAMAGE), (1.00, STYPE_HERO_DPS), (10.00, STYPE_HERO_DPS), (0.004, STYPE_PERCENT_DPS),
        (0.10, STYPE_ALL_DAMAGE), (0.10, STYPE_GOLD_DROPPED), (100.00, STYPE_HERO_DPS)]),
    Hero("Hornetta, Queen of the Valrunes", 3, 674, [
        (1.50, STYPE_HERO_DPS), (0.10, STYPE_GOLD_DROPPED), (0.10, STYPE_ALL_DAMAGE), (0.004, STYPE_PERCENT_DPS), 
        (0.20, STYPE_CHEST_GOLD), (0.01, STYPE_CRIT_CHANCE), (0.30, STYPE_ALL_DAMAGE)]),
    Hero("Mila the Hammer Stomper", 4, 2.85e3, [
        (1.00, STYPE_HERO_DPS), (8.00, STYPE_HERO_DPS), (0.06, STYPE_GOLD_DROPPED), (5.00, STYPE_HERO_DPS), 
        (0.05, STYPE_CRIT_DAMAGE), (0.20, STYPE_ALL_DAMAGE), (0.20, STYPE_CHEST_GOLD)]),
    Hero("Terra the Land Scorcher", 5, 13.30e3, [
        (3.00, STYPE_HERO_DPS), (0.10, STYPE_GOLD_DROPPED), (0.004, STYPE_PERCENT_DPS), (0.15, STYPE_GOLD_DROPPED), 
        (0.20, STYPE_CHEST_GOLD), (0.05, STYPE_TAP_DAMAGE), (100.00, STYPE_HERO_DPS)]),
    Hero("Inquisireaux the Terrible", 6, 68.10e3, [
        (2.00, STYPE_HERO_DPS), (7.00, STYPE_HERO_DPS), (0.10, STYPE_ALL_DAMAGE), (0.20, STYPE_ALL_DAMAGE), 
        (0.05, STYPE_CRIT_DAMAGE), (0.02, STYPE_CRIT_CHANCE), (100.00, STYPE_HERO_DPS)]),
    Hero("Charlotte the Special", 7, 384.00e3, [
        (2.00, STYPE_HERO_DPS), (0.05, STYPE_BOSS_DAMAGE), (0.07, STYPE_BOSS_DAMAGE), (6.00, STYPE_HERO_DPS), 
        (0.05, STYPE_TAP_DAMAGE), (0.20, STYPE_CHEST_GOLD), (0.30, STYPE_ALL_DAMAGE)]),
    Hero("Jordaan, Knight of Mini", 8, 2.38e6, [
        (2.00, STYPE_HERO_DPS), (0.10, STYPE_ALL_DAMAGE), (0.004, STYPE_PERCENT_DPS), (0.15, STYPE_GOLD_DROPPED), 
        (0.20, STYPE_CHEST_GOLD), (19.00, STYPE_HERO_DPS), (0.20, STYPE_ALL_DAMAGE)]),
    Hero("Jukka, Master of Axes", 9, 23.80e6, [
        (1.50, STYPE_HERO_DPS), (0.05, STYPE_BOSS_DAMAGE), (0.30, STYPE_ALL_DAMAGE), (0.05, STYPE_CRIT_DAMAGE), 
        (50.00, STYPE_HERO_DPS), (0.25, STYPE_ALL_DAMAGE), (100.00, STYPE_HERO_DPS)]),
    Hero("Milo and Clonk-Clonk", 10, 143.00e6, [
        (1.50, STYPE_HERO_DPS), (0.01, STYPE_CRIT_CHANCE), (0.05, STYPE_BOSS_DAMAGE), (0.15, STYPE_GOLD_DROPPED), 
        (0.20, STYPE_CHEST_GOLD), (0.25, STYPE_CHEST_GOLD), (0.15, STYPE_ALL_DAMAGE)]),
    Hero("Macelord the Ruthless", 11, 943.00e6, [
        (2.00, STYPE_HERO_DPS), (8.50, STYPE_HERO_DPS), (0.05, STYPE_TAP_DAMAGE), (0.004, STYPE_PERCENT_DPS), 
        (0.15, STYPE_GOLD_DROPPED), (0.05, STYPE_TAP_DAMAGE), (0.20, STYPE_GOLD_DROPPED)]),
    Hero("Gertrude the Goat Rider", 12, 6.84e9, [
        (2.50, STYPE_HERO_DPS), (13.00, STYPE_HERO_DPS), (0.07, STYPE_BOSS_DAMAGE), (0.05, STYPE_CRIT_DAMAGE), 
        (0.004, STYPE_PERCENT_DPS), (0.05, STYPE_TAP_DAMAGE), (0.20, STYPE_GOLD_DROPPED)]),
    Hero("Twitterella the Tweeter", 13, 54.70e9, [
        (1.50, STYPE_HERO_DPS), (8.50, STYPE_HERO_DPS), (0.05, STYPE_TAP_DAMAGE), (0.20, STYPE_ALL_DAMAGE), 
        (0.30, STYPE_ALL_DAMAGE), (0.05, STYPE_CRIT_DAMAGE), (120.00, STYPE_HERO_DPS)]),
    Hero("Master Hawk, Lord of Luft", 14, 820.00e9, [
        (2.00, STYPE_HERO_DPS), (11.00, STYPE_HERO_DPS), (0.004, STYPE_PERCENT_DPS), (4.00, STYPE_HERO_DPS), 
        (0.10, STYPE_GOLD_DROPPED), (0.10, STYPE_CRIT_DAMAGE), (0.20, STYPE_GOLD_DROPPED)]),
    Hero("Elpha, Wielder of Gems", 15, 8.20e12, [
        (3.00, STYPE_HERO_DPS), (0.40, STYPE_ALL_DAMAGE), (0.05, STYPE_BOSS_DAMAGE), (0.02, STYPE_CRIT_CHANCE), 
        (0.15, STYPE_CRIT_DAMAGE), (0.20, STYPE_CHEST_GOLD), (100.00, STYPE_HERO_DPS)]),
    Hero("Poppy, Daughter of Ceremony", 16, 164.00e12, [
        (3.50, STYPE_HERO_DPS), (0.25, STYPE_CHEST_GOLD), (0.20, STYPE_GOLD_DROPPED), (0.05, STYPE_BOSS_DAMAGE), 
        (0.07, STYPE_BOSS_DAMAGE), (0.15, STYPE_ALL_DAMAGE), (0.20, STYPE_ALL_DAMAGE)]),
    Hero("Skulptor, Protector of Bridges", 17, 1.64e15, [
        (1.50, STYPE_HERO_DPS), (9.00, STYPE_HERO_DPS), (0.10, STYPE_GOLD_DROPPED), (0.10, STYPE_GOLD_DROPPED), 
        (0.05, STYPE_TAP_DAMAGE), (0.10, STYPE_CRIT_DAMAGE), (0.25, STYPE_GOLD_DROPPED)]),
    Hero("Sterling the Enchantor", 18, 49.20e15, [
        (4.00, STYPE_HERO_DPS), (5.00, STYPE_HERO_DPS), (0.05, STYPE_BOSS_DAMAGE), (4.50, STYPE_HERO_DPS), 
        (0.05, STYPE_TAP_DAMAGE), (0.20, STYPE_CHEST_GOLD), (0.15, STYPE_ALL_DAMAGE)]),
    Hero("Orba the Foreseer", 19, 2.46e18, [
        (2.00, STYPE_HERO_DPS), (10.00, STYPE_HERO_DPS), (0.005, STYPE_PERCENT_DPS), (0.05, STYPE_TAP_DAMAGE), 
        (0.10, STYPE_ALL_DAMAGE), (0.10, STYPE_GOLD_DROPPED), (0.10, STYPE_ALL_DAMAGE)]),
    Hero("Remus the Noble Archer", 20, 73.80e18, [
        (2.50, STYPE_HERO_DPS), (6.00, STYPE_HERO_DPS), (0.20, STYPE_CRIT_DAMAGE), (4.50, STYPE_HERO_DPS), 
        (0.004, STYPE_PERCENT_DPS), (0.10, STYPE_TAP_DAMAGE), (0.10, STYPE_GOLD_DROPPED)]),
    Hero("Mikey the Magician Apprentice", 21, 2.44e21, [
        (2.00, STYPE_HERO_DPS), (0.05, STYPE_TAP_DAMAGE), (0.30, STYPE_ALL_DAMAGE), (0.02, STYPE_CRIT_CHANCE), 
        (0.10, STYPE_ALL_DAMAGE), (0.20, STYPE_CHEST_GOLD), (100.00, STYPE_HERO_DPS)]),
    Hero("Peter Pricker the Prickly Poker", 22, 244.00e21, [
        (2.50, STYPE_HERO_DPS), (7.50, STYPE_HERO_DPS), (0.10, STYPE_ALL_DAMAGE), (5.00, STYPE_HERO_DPS), 
        (0.10, STYPE_ALL_DAMAGE), (0.30, STYPE_CRIT_DAMAGE), (0.20, STYPE_ALL_DAMAGE)]),
    Hero("Teeny Tom, Keeper of the Castle", 23, 48.70e24, [
        (3.00, STYPE_HERO_DPS), (8.00, STYPE_HERO_DPS), (0.004, STYPE_PERCENT_DPS), (0.20, STYPE_CRIT_DAMAGE), 
        (0.10, STYPE_TAP_DAMAGE), (0.02, STYPE_CRIT_CHANCE), (100.00, STYPE_HERO_DPS)]),
    Hero("Deznis the Cleanser", 24, 19.50e27, [
        (2.00, STYPE_HERO_DPS), (5.00, STYPE_HERO_DPS), (12.00, STYPE_HERO_DPS), (0.15, STYPE_GOLD_DROPPED), 
        (0.20, STYPE_CHEST_GOLD), (90.00, STYPE_HERO_DPS), (0.15, STYPE_ALL_DAMAGE)]),
    Hero("Hamlette, Painter of Skulls", 25, 21.40e30, [
        (0.05, STYPE_TAP_DAMAGE), (0.05, STYPE_TAP_DAMAGE), (0.004, STYPE_PERCENT_DPS), (0.10, STYPE_ALL_DAMAGE), 
        (0.15, STYPE_GOLD_DROPPED), (0.02, STYPE_CRIT_CHANCE), (150.00, STYPE_HERO_DPS)]),
    Hero("Eistor the Banisher", 26, 2.36e36, [
        (3.50, STYPE_HERO_DPS), (6.50, STYPE_HERO_DPS), (0.004, STYPE_PERCENT_DPS), (0.05, STYPE_BOSS_DAMAGE), 
        (0.10, STYPE_ALL_DAMAGE), (0.05, STYPE_BOSS_DAMAGE), (0.12, STYPE_GOLD_DROPPED)]),
    Hero("Flavius and Oinksbjorn", 27, 25.90e45, [
        (3.00, STYPE_HERO_DPS), (7.00, STYPE_HERO_DPS), (0.10, STYPE_ALL_DAMAGE), (0.05, STYPE_BOSS_DAMAGE), 
        (0.02, STYPE_CRIT_CHANCE), (0.30, STYPE_CRIT_DAMAGE), (0.20, STYPE_CHEST_GOLD)]),
    Hero("Chester the Beast Tamer", 28, 28.50e60, [
        (3.50, STYPE_HERO_DPS), (0.01, STYPE_ALL_DAMAGE), (4.00, STYPE_HERO_DPS), (6.00, STYPE_HERO_DPS), 
        (0.20, STYPE_CRIT_DAMAGE), (0.02, STYPE_CRIT_CHANCE), (0.15, STYPE_ALL_DAMAGE)]),
    Hero("Mohacas the Wind Warrior", 29, 3.14e81, [
        (3.30, STYPE_HERO_DPS), (5.50, STYPE_HERO_DPS), (0.10, STYPE_GOLD_DROPPED), (0.10, STYPE_TAP_DAMAGE), 
        (0.20, STYPE_GOLD_DROPPED), (0.10, STYPE_ALL_DAMAGE), (0.30, STYPE_GOLD_DROPPED)]),
    Hero("Jaqulin the Unknown", 30, 3.14e96, [
        (10.00, STYPE_HERO_DPS), (0.10, STYPE_TAP_DAMAGE), (0.04, STYPE_PERCENT_DPS), (0.20, STYPE_GOLD_DROPPED), 
        (0.10, STYPE_ALL_DAMAGE), (0.20, STYPE_ALL_DAMAGE), (0.30, STYPE_ALL_DAMAGE)]),
    Hero("Pixie the Rebel Fairy", 31, 3.76e101, [
        (9.00, STYPE_HERO_DPS), (20.00, STYPE_HERO_DPS), (0.01, STYPE_CRIT_CHANCE), (0.60, STYPE_TAP_DAMAGE), 
        (0.25, STYPE_CHEST_GOLD), (0.10, STYPE_ALL_DAMAGE), (0.15, STYPE_GOLD_DROPPED)]),
    Hero("Jackalope the Fireballer", 32, 4.14e121, [
        (0.40, STYPE_HERO_DPS), (0.20, STYPE_HERO_DPS), (0.25, STYPE_GOLD_DROPPED), (0.60, STYPE_TAP_DAMAGE), 
        (0.02, STYPE_CRIT_CHANCE), (0.30, STYPE_ALL_DAMAGE), (0.10, STYPE_BOSS_DAMAGE)]),
    Hero("Dark Lord, Punisher of All", 33, 4.56e141, [
        (20.00, STYPE_HERO_DPS), (0.20, STYPE_TAP_DAMAGE), (0.01, STYPE_PERCENT_DPS), (0.25, STYPE_GOLD_DROPPED), 
        (0.20, STYPE_ALL_DAMAGE), (0.30, STYPE_ALL_DAMAGE), (0.40, STYPE_ALL_DAMAGE)])]

class Stats:
    def __init__(self, artifacts, heroes, customizations, weapons):
        self.artifacts = artifacts
        self.heroes = heroes
        self.customizations = customizations
        self.weapons = weapons
        self.update()

    def update(self):
        # calculate total hero damage
        # calculate tap damage

        # calculate gold multiplier
        hero_gold_dropped = get_total_bonus(self.heroes, STYPE_GOLD_DROPPED)
        hero_chest_gold = get_total_bonus(self.heroes, STYPE_CHEST_GOLD)
        c_gold_dropped = self.customizations[2]
        c_chest_gold = self.customizations[3]

        self.gold_multiplier = gold_multiplier(self.artifacts, hero_gold_dropped, hero_chest_gold, c_gold_dropped, c_chest_gold)

# need to do final verifications
def gold_multiplier(artifacts, hero_gold_dropped, hero_chest_gold, c_gold_dropped, c_chest_gold):
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
    c_gold = 10.0 * (1.0 + 0.2 * level_chest) * (1 + c_chest_gold) * (1 + hero_chest_gold)

    n_chance = 1.0 - c_chance
    n_gold = (1.0 + 0.1 * level_amulet) 
    d_chance = 0.005 * level_chalice
    d_multiplier = 1.0-d_chance + 10.0*d_chance

    mob_gold = mobs * (c_chance * c_gold + n_chance * n_gold * d_multiplier)
    # 6.520253320788821
    boss_gold = BOSS_CONSTANT * (1 + level_kshield)
    
    gold_multiplier = (mob_gold + boss_gold) / (mobs+1.0)
    total_multiplier = (1.0 + 0.05*level_fortune + hero_gold_dropped) * (1.0 + c_gold_dropped) * (1.0 + 0.15*level_elixir)

    final_multiplier = total_multiplier * gold_multiplier
    return final_multiplier

def all_damage(artifacts):
    total_ad = 0
    for i, level in enumerate(artifacts):
        total_ad += artifact_info[i].getAD(level)
    total_ad *= (1 + 0.05 * artifacts[24])
    return int(round(total_ad))

def cost_to_buy_next(artifacts):
    owned = len([x for x in artifacts if x != 0]) + 1
    return int(owned * pow(1.35, owned))

# Stage information
def total_relics(stage, heroes, level_ua):
    # relics = ((floor to nearest 15 of stage - 75) / 15)^1.7 * undead bonus
    stage_relics = pow(stage/15 - 5, 1.7)
    hero_relics = sum(heroes)/1000
    multiplier = 2.0+0.1*level_ua
    return int((stage_relics + hero_relics) * multiplier)

def stage_hp(stage):
    if stage <= 156:
        return 18.5*pow(1.57, stage)
    # 18.5*pow(1.57, 156) = 6.7222940277842625e+31        
    return 6.7222940277842625e+31*pow(1.17, stage-156)

def base_stage_mob_gold(stage):
    return stage_hp(stage) * (0.02 + (0.00045 * min(stage, 150)))

def gold_for_stage(stage, artifacts, heroes, customizations):
    base = base_stage_mob_gold(stage)
    
    hero_gold_dropped = get_total_bonus(heroes, STYPE_GOLD_DROPPED)
    hero_chest_gold = get_total_bonus(heroes, STYPE_CHEST_GOLD)
    c_gold_dropped = customizations[2]
    c_chest_gold = customizations[3]

    multiplier = gold_multiplier(artifacts, hero_gold_dropped, hero_chest_gold, c_gold_dropped, c_chest_gold)
    mobs = 10 - artifacts[28] + 1

    return mobs * base * multiplier

def gold_between_stages(start_stage, end_stage, artifacts, heroes, customizations):
    total = 0.0
    for s in xrange(start_stage, end_stage):
        total += gold_for_stage(s, artifacts, heroes, customizations)
    return total

############
##### Heroes

def get_total_bonus(heroes, stype):
    bonus = 0
    for i, level in enumerate(heroes):
        bonus += hero_info[i].get_bonuses(level, stype)
    return bonus

def number_of_sets(weapons):
    if 0 in weapons:
        return 0
    return 1 + number_of_sets([n - 1 for n in weapons])

def set_bonus(weapons):
    nsets = number_of_sets(weapons)
    if nsets == 0:
        return 1.0
    else:
        return 10.0 * nsets

def get_hero_dps(heroes, weapons, artifacts, customization_ad, hero_expected = None):
    dps = 0
    hero_all_damage = get_total_bonus(heroes, STYPE_ALL_DAMAGE)
    for i, level in enumerate(heroes):
        if level == 0:
            continue
        
        hero_dps = hero_info[i].get_base_damage(level)

        bonus_hero = (1.0 + hero_info[i].get_bonuses(level, STYPE_HERO_DPS) + hero_all_damage)
        bonus_artifact = (1.0 + 0.01 * all_damage(artifacts))
        bonus_weapon = (1.0 + 0.5*weapons[i])
        bonus_customization = 1.0 + customization_ad
        bonus_set = set_bonus(weapons)

        hero_dps = hero_dps * bonus_hero * bonus_artifact * bonus_weapon * bonus_customization * bonus_set
        dps += hero_dps

        if (hero_expected is not None):
            print hero_info[i].name + " " + str(level) + " -------------------------------------"
            print "         base: ", hero_dps
            print "   hero bonus: ", bonus_hero
            print "         from all: ", hero_all_damage
            print "        from hero: ", hero_info[i].get_bonuses(level, STYPE_HERO_DPS)
            print "  artifact ad: ", bonus_artifact
            print " weapon bonus: ", bonus_weapon
            print "   cust bonus: ", bonus_customization
            print "    set bonus: ", bonus_set
            print "####### total: " + str(hero_dps)
            print "#### expected: " + hero_expected[i]

    return dps

def get_crit_multiplier(hero_thrust_level, customization_bonus, hero_bonus):
    return (10 + hero_bonus) * (1 + 0.2*hero_thrust_level) * (1 + customization_bonus)

def get_crit_chance(death_seeker_level, customization_bonus, hero_bonus):
    return 0.02 + 0.02 * death_seeker_level + customization_bonus + hero_bonus

### this seems iffy
def tap_damage(artifacts, heroes, customizations, weapons, hero_expected = None):
    customization_ad = customizations[0]
    customization_crit_dmg = customizations[1]
    customization_crit_chance = customizations[4]
    customization_tap = customizations[5]

    hero_ad_bonus = get_total_bonus(heroes, STYPE_ALL_DAMAGE)
    hero_tap_bonus = get_total_bonus(heroes, STYPE_TAP_DAMAGE)
    hero_percent_bonus = get_total_bonus(heroes, STYPE_PERCENT_DPS)
    hero_crit_damage = get_total_bonus(heroes, STYPE_CRIT_DAMAGE)
    hero_crit_chance = get_total_bonus(heroes, STYPE_CRIT_CHANCE)
    hero_total_dps = get_hero_dps(heroes, weapons, artifacts, customization_ad, hero_expected)
    
    from_main = MAIN_LEVEL * pow(1.05, MAIN_LEVEL) * (1 + hero_ad_bonus)

    artifact_ad = all_damage(artifacts)
    from_hero = (hero_percent_bonus * hero_total_dps) * (1 + hero_tap_bonus + customization_tap) * (1 + 0.01* artifact_ad) * (1 + 0.02 * artifacts[9]) * (1 + customization_ad)
    total_tap = from_main + from_hero
    
    death_seeker_level = artifacts[7]
    hero_thrust_level = artifacts[11]
    crit_multiplier = get_crit_multiplier(hero_thrust_level, customization_crit_dmg, hero_crit_damage)
    crit_chance = get_crit_chance(death_seeker_level, customization_crit_chance, hero_crit_chance)
    
    overall_crit_multiplier = ((1 - crit_chance) + (crit_chance * 0.65 * crit_multiplier))
    total_tapping = total_tap * overall_crit_multiplier
    return total_tap, total_tapping

