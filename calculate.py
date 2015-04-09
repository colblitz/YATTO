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

    ### unconfirmed
    def get_upgrade_cost(self, level):
        return (self.base_cost if level < 1000 else self.base_cost*10) * pow(1.075, level)

    def get_bonuses(self, level, stype):
        bonus = 0
        for i in range(self.level_to_skills(level)):
            if self.skills[i][1] == stype:
                bonus += self.skills[i][0]
        return bonus

    ### unconfirmed
    def get_base_damage(self, level):
        if level < 1001:
            l = level - 1
            return self.pre_calc * (pow(1.075, l) - 1)* pow(0.9718, l)
        else:
            return self.e_pre_calc * pow(1.075, level - 1) * (pow(1.075, level - 1000) - 1) * pow(0.904, level - 1001)

    ### unconfirmed
    ### https://github.com/oLaudix/oLaudix.github.io/blob/master/TTcalc.html
    ### https://github.com/oLaudix/oLaudix.github.io/blob/master/common.js
    def get_base_damage_laudis(self, level):
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
        (0.50, STYPE_HERO_DPS), 
        (1.00, STYPE_HERO_DPS), 
        (0.10, STYPE_ALL_DAMAGE), 
        (0.10, STYPE_CRIT_DAMAGE), 
        (10.00, STYPE_HERO_DPS), 
        (0.25, STYPE_ALL_DAMAGE), 
        (100.00, STYPE_HERO_DPS)]),
    Hero("Contessa the Torch Wielder", 2, 175, [
        (0.05, STYPE_TAP_DAMAGE),
        (1.00, STYPE_HERO_DPS),
        (10.00, STYPE_HERO_DPS),
        (0.004, STYPE_PERCENT_DPS),
        (0.10, STYPE_ALL_DAMAGE),
        (0.10, STYPE_GOLD_DROPPED),
        (100.00, STYPE_HERO_DPS)]),
    Hero("Hornetta, Queen of the Valrunes", 3, 674, [
        (1.50, STYPE_HERO_DPS),
        (0.10, STYPE_GOLD_DROPPED),
        (0.10, STYPE_ALL_DAMAGE),
        (0.004, STYPE_PERCENT_DPS),
        (0.20, STYPE_CHEST_GOLD),
        (0.01, STYPE_CRIT_CHANCE),
        (0.30, STYPE_ALL_DAMAGE)]),
    Hero("Mila the Hammer Stomper", 4, 2850, [
        (1.00, STYPE_HERO_DPS),
        (8.00, STYPE_HERO_DPS),
        (0.06, STYPE_GOLD_DROPPED),
        (5.00, STYPE_HERO_DPS),
        (0.05, STYPE_CRIT_DAMAGE),
        (0.20, STYPE_ALL_DAMAGE),
        (0.20, STYPE_CHEST_GOLD)]),
    Hero("Terra the Land Scorcher", 5, 0, [
        (3.00, STYPE_HERO_DPS),
        (0.10, STYPE_GOLD_DROPPED),
        (0.004, STYPE_PERCENT_DPS),
        (0.15, STYPE_GOLD_DROPPED),
        (0.20, STYPE_CHEST_GOLD),
        (0.05, STYPE_TAP_DAMAGE),
        (100.00, STYPE_HERO_DPS)]),
    Hero("Inquisireaux the Terrible", 6, 0, [
        (2.00, STYPE_HERO_DPS),
        (7.00, STYPE_HERO_DPS),
        (0.10, STYPE_ALL_DAMAGE),
        (0.20, STYPE_ALL_DAMAGE),
        (0.05, STYPE_CRIT_DAMAGE),
        (0.02, STYPE_CRIT_CHANCE),
        (100.00, STYPE_HERO_DPS)]),
    Hero("Charlotte the Special", 7, 0, [
        (2.00, STYPE_HERO_DPS),
        (0.05, STYPE_BOSS_DAMAGE),
        (0.07, STYPE_BOSS_DAMAGE),
        (6.00, STYPE_HERO_DPS),
        (0.05, STYPE_TAP_DAMAGE),
        (0.20, STYPE_CHEST_GOLD),
        (0.30, STYPE_ALL_DAMAGE)]),
    Hero("Jordaan, Knight of Mini", 8, 0, [
        (2.00, STYPE_HERO_DPS),
        (0.10, STYPE_ALL_DAMAGE),
        (0.004, STYPE_PERCENT_DPS),
        (0.15, STYPE_GOLD_DROPPED),
        (0.20, STYPE_CHEST_GOLD),
        (19.00, STYPE_HERO_DPS),
        (0.20, STYPE_ALL_DAMAGE)]),
    Hero("Jukka, Master of Axes", 9, 0, [
        (1.50, STYPE_HERO_DPS),
        (0.05, STYPE_BOSS_DAMAGE),
        (0.30, STYPE_ALL_DAMAGE),
        (0.05, STYPE_CRIT_DAMAGE),
        (50.00, STYPE_HERO_DPS),
        (0.25, STYPE_ALL_DAMAGE),
        (100.00, STYPE_HERO_DPS)]),
    Hero("Milo and Clonk-Clonk", 10, 0, [
        (1.50, STYPE_HERO_DPS),
        (0.01, STYPE_CRIT_CHANCE),
        (0.05, STYPE_BOSS_DAMAGE),
        (0.15, STYPE_GOLD_DROPPED),
        (0.20, STYPE_CHEST_GOLD),
        (0.25, STYPE_CHEST_GOLD),
        (0.15, STYPE_ALL_DAMAGE)]),
    Hero("Macelord the Ruthless", 11, 0, [
        (2.00, STYPE_HERO_DPS),
        (8.50, STYPE_HERO_DPS),
        (0.05, STYPE_TAP_DAMAGE),
        (0.4, STYPE_PERCENT_DPS),
        (0.15, STYPE_GOLD_DROPPED),
        (0.05, STYPE_TAP_DAMAGE),
        (0.20, STYPE_GOLD_DROPPED)]),
    Hero("Gertrude the Goat Rider", 12, 0, [
        (2.50, STYPE_HERO_DPS),
        (13.00, STYPE_HERO_DPS),
        (0.07, STYPE_BOSS_DAMAGE),
        (0.05, STYPE_CRIT_DAMAGE),
        (0.4, STYPE_PERCENT_DPS),
        (0.05, STYPE_TAP_DAMAGE),
        (0.20, STYPE_GOLD_DROPPED)]),
    Hero("Twitterella the Tweeter", 13, 0, [
        (1.50, STYPE_HERO_DPS),
        (8.50, STYPE_HERO_DPS),
        (0.05, STYPE_TAP_DAMAGE),
        (0.20, STYPE_ALL_DAMAGE),
        (0.30, STYPE_ALL_DAMAGE),
        (0.05, STYPE_CRIT_DAMAGE),
        (120.00, STYPE_HERO_DPS)]),
    Hero("Master Hawk, Lord of Luft", 14, 0, [
        (2.00, STYPE_HERO_DPS),
        (11.00, STYPE_HERO_DPS),
        (0.004, STYPE_PERCENT_DPS),
        (4.00, STYPE_HERO_DPS),
        (0.10, STYPE_GOLD_DROPPED),
        (0.10, STYPE_CRIT_DAMAGE),
        (0.20, STYPE_GOLD_DROPPED)]),
    Hero("Elpha, Wielder of Gems", 15, 0, [
        (3.00, STYPE_HERO_DPS),
        (0.40, STYPE_ALL_DAMAGE),
        (0.05, STYPE_BOSS_DAMAGE),
        (0.02, STYPE_CRIT_CHANCE),
        (0.15, STYPE_CRIT_DAMAGE),
        (0.20, STYPE_CHEST_GOLD),
        (100.00, STYPE_HERO_DPS)]),
    Hero("Poppy, Daughter of Ceremony", 16, 0, [
        (3.50, STYPE_HERO_DPS),
        (0.25, STYPE_CHEST_GOLD),
        (0.20, STYPE_GOLD_DROPPED),
        (0.05, STYPE_BOSS_DAMAGE),
        (0.07, STYPE_BOSS_DAMAGE),
        (0.15, STYPE_ALL_DAMAGE),
        (0.20, STYPE_ALL_DAMAGE)]),
    Hero("Skulptor, Protector of Bridges", 17, 0, [
        (1.50, STYPE_HERO_DPS),
        (9.00, STYPE_HERO_DPS),
        (0.10, STYPE_GOLD_DROPPED),
        (0.10, STYPE_GOLD_DROPPED),
        (0.05, STYPE_TAP_DAMAGE),
        (0.10, STYPE_CRIT_DAMAGE),
        (0.25, STYPE_GOLD_DROPPED)]),
    Hero("Sterling the Enchantor", 18, 0, [
        (4.00, STYPE_HERO_DPS),
        (5.00, STYPE_HERO_DPS),
        (0.05, STYPE_BOSS_DAMAGE),
        (4.50, STYPE_HERO_DPS),
        (0.05, STYPE_TAP_DAMAGE),
        (0.20, STYPE_CHEST_GOLD),
        (0.15, STYPE_ALL_DAMAGE)]),
    Hero("Orba the Foreseer", 19, 0, [
        (2.00, STYPE_HERO_DPS),
        (10.00, STYPE_HERO_DPS),
        (0.005, STYPE_PERCENT_DPS),
        (0.05, STYPE_TAP_DAMAGE),
        (0.10, STYPE_ALL_DAMAGE),
        (0.10, STYPE_GOLD_DROPPED),
        (0.10, STYPE_ALL_DAMAGE)]),
    Hero("Remus the Noble Archer", 20, 0, [
        (2.50, STYPE_HERO_DPS),
        (6.00, STYPE_HERO_DPS),
        (0.20, STYPE_CRIT_DAMAGE),
        (4.50, STYPE_HERO_DPS),
        (0.004, STYPE_PERCENT_DPS),
        (0.10, STYPE_TAP_DAMAGE),
        (0.10, STYPE_GOLD_DROPPED)]),
    Hero("Mikey the Magician Apprentice", 21, 0, [
        (2.00, STYPE_HERO_DPS),
        (0.05, STYPE_TAP_DAMAGE),
        (0.30, STYPE_ALL_DAMAGE),
        (0.02, STYPE_CRIT_CHANCE),
        (0.10, STYPE_ALL_DAMAGE),
        (0.20, STYPE_CHEST_GOLD),
        (100.00, STYPE_HERO_DPS)]),
    Hero("Peter Pricker the Prickly Poker", 22, 0, [
        (2.50, STYPE_HERO_DPS),
        (7.50, STYPE_HERO_DPS),
        (0.10, STYPE_ALL_DAMAGE),
        (5.00, STYPE_HERO_DPS),
        (0.10, STYPE_ALL_DAMAGE),
        (0.30, STYPE_CRIT_DAMAGE),
        (0.20, STYPE_ALL_DAMAGE)]),
    Hero("Teeny Tom, Keeper of the Castle", 23, 0, [
        (3.00, STYPE_ALL_DAMAGE),
        (8.00, STYPE_ALL_DAMAGE),
        (0.004, STYPE_PERCENT_DPS),
        (0.20, STYPE_CRIT_DAMAGE),
        (0.10, STYPE_TAP_DAMAGE),
        (0.02, STYPE_CRIT_CHANCE),
        (100.00, STYPE_HERO_DPS)]),
    Hero("Deznis the Cleanser", 24, 0, [
        (2.00, STYPE_HERO_DPS),
        (5.00, STYPE_HERO_DPS),
        (12.00, STYPE_HERO_DPS),
        (0.15, STYPE_GOLD_DROPPED),
        (0.20, STYPE_CHEST_GOLD),
        (90.00, STYPE_HERO_DPS),
        (0.15, STYPE_ALL_DAMAGE)]),
    Hero("Hamlette, Painter of Skulls", 25, 0, [
        (0.05, STYPE_TAP_DAMAGE),
        (0.05, STYPE_TAP_DAMAGE),
        (0.004, STYPE_PERCENT_DPS),
        (0.10, STYPE_ALL_DAMAGE),
        (0.15, STYPE_GOLD_DROPPED),
        (0.02, STYPE_CRIT_CHANCE),
        (150.00, STYPE_HERO_DPS)]),
    Hero("Eistor the Banisher", 26, 0, [
        (3.50, STYPE_HERO_DPS),
        (6.50, STYPE_HERO_DPS),
        (0.004, STYPE_PERCENT_DPS),
        (0.05, STYPE_BOSS_DAMAGE),
        (0.10, STYPE_ALL_DAMAGE),
        (0.05, STYPE_BOSS_DAMAGE),
        (0.12, STYPE_GOLD_DROPPED)]),
    Hero("Flavius and Oinksbjorn", 27, 0, [
        (3.00, STYPE_HERO_DPS),
        (7.00, STYPE_HERO_DPS),
        (0.10, STYPE_ALL_DAMAGE),
        (0.05, STYPE_BOSS_DAMAGE),
        (0.02, STYPE_CRIT_CHANCE),
        (0.30, STYPE_CRIT_DAMAGE),
        (0.20, STYPE_CHEST_GOLD)]),
    Hero("Chester the Beast Tamer", 28, 0, [
        (3.50, STYPE_HERO_DPS),
        (0.01, STYPE_ALL_DAMAGE),
        (4.00, STYPE_HERO_DPS),
        (6.00, STYPE_HERO_DPS),
        (0.20, STYPE_CRIT_DAMAGE),
        (0.02, STYPE_CRIT_CHANCE),
        (0.15, STYPE_ALL_DAMAGE)]),
    Hero("Mohacas the Wind Warrior", 29, 0, [
        (3.30, STYPE_HERO_DPS),
        (5.50, STYPE_HERO_DPS),
        (0.10, STYPE_GOLD_DROPPED),
        (0.10, STYPE_TAP_DAMAGE),
        (0.20, STYPE_GOLD_DROPPED),
        (0.10, STYPE_ALL_DAMAGE),
        (0.30, STYPE_GOLD_DROPPED)]),
    Hero("Jaqulin the Unknown", 30, 0, [
        (10.00, STYPE_HERO_DPS),
        (0.10, STYPE_TAP_DAMAGE),
        (0.04, STYPE_PERCENT_DPS),
        (0.20, STYPE_GOLD_DROPPED),
        (0.10, STYPE_ALL_DAMAGE),
        (0.20, STYPE_ALL_DAMAGE),
        (0.30, STYPE_ALL_DAMAGE)]),
    Hero("Pixie the Rebel Fairy", 31, 0, [
        (9.00, STYPE_HERO_DPS),
        (20.00, STYPE_HERO_DPS),
        (0.01, STYPE_CRIT_CHANCE),
        (0.60, STYPE_TAP_DAMAGE),
        (0.25, STYPE_CHEST_GOLD),
        (0.10, STYPE_ALL_DAMAGE),
        (0.15, STYPE_GOLD_DROPPED)]),
    Hero("Jackalope the Fireballer", 32, 0, [
        (0.40, STYPE_HERO_DPS),
        (0.20, STYPE_HERO_DPS),
        (0.25, STYPE_GOLD_DROPPED),
        (0.60, STYPE_TAP_DAMAGE),
        (0.02, STYPE_CRIT_CHANCE),
        (0.30, STYPE_ALL_DAMAGE),
        (0.10, STYPE_BOSS_DAMAGE)]),
    Hero("Dark Lord, Punisher of All", 33, 0, [
        (20.00, STYPE_HERO_DPS),
        (0.20, STYPE_TAP_DAMAGE),
        (0.01, STYPE_PERCENT_DPS),
        (0.25, STYPE_GOLD_DROPPED),
        (0.20, STYPE_ALL_DAMAGE),
        (0.30, STYPE_ALL_DAMAGE),
        (0.40, STYPE_ALL_DAMAGE)])]


"""
Takeda the Blade Assassin
Contessa the Torch Wielder
Hornetta, Queen of the Valrunes
Mila the Hammer Stomper - 2.85k
Terra the Land Scorcher - 13.30k
Inquisireaux the Terrible - 68.10k
Charlotte the Special - 384.00k
Jordaan, Knight of Mini - 2.38M
Jukka, Master of Axes - 23.80M
Milo and Clonk-Clonk - 143.00M
Macelord the Ruthless - 943.00M
Gertrude the Goat Rider - 6.84B
Twitterella the Tweeter - 54.70B
Master Hawk, Lord of Luft - 820.00B
Elpha, Wielder of Gems - 8.20T
Poppy, Daughter of Ceremony - 164.00T
Skulptor, Protector of Bridges - 1.64aa
Sterling the Enchantor - 49.20aa
Orba the Foreseer - 2.46bb
Remus the Noble Archer - 73.80bb
Mikey the Magician Apprentice - 2.44cc
Peter Pricker the Prickly Poker - 244.00cc
Teeny Tom, Keeper of the Castle - 48.70dd
Deznis the Cleanser - 19.50ee
Hamlette, Painter of Skulls - 21.40ff
Eistor the Banisher - 2.36hh
Flavius and Oinksbjorn - 25.90kk
Chester the Beast Tamer - 28.50pp
Mohacas the Wind Warrior - 3.14ww
Jaqulin the Unknown - 3.14e96
Pixie the Rebel Fairy - 3.76e101
Jackalope the Fireballer - 4.14e121
Dark Lord, Punisher of All - 4.56e141
"""


"""
main hero upgrade cost
7 17
8 20
9 23
10 27
11 31
12 26
13 41
14 47
15 53
49 827
50 888
51 954
52 1.02k
53 1.10k
54 1.18k
55 1.26k
100 31.50k
101 33.83k
102 36.34k
103 39.02k
104 41.91k
300 50.02B
301 53.73B
302 57.70B
400 63.04T
500 79.44aa
600 100.11bb
"""


def total_relics(stage, heroes, level_ua):
    # relics = ((floor to nearest 15 of stage - 75) / 15)^1.7 * undead bonus
    stage_relics = pow(stage/15 - 5, 1.7)
    hero_relics = sum(heroes)/1000
    multiplier = 2.0+0.1*level_ua
    return int((stage_relics + hero_relics) * multiplier)

def cost_to_buy_next(artifacts):
    owned = len([x for x in artifacts if x != 0]) + 1
    return int(owned * pow(1.35, owned))

def gold_multiplier(artifacts, hero_gold, hero_chest_gold):
    # NEED TO ADD CUSTOMIZATIONS
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
    # c_gold = base * 10 * (1 + level_chest) * (1 + customization) * (1 + ff + customization gold dropped)

    n_chance = 1.0 - c_chance
    n_gold = (1.0 + 0.1 * level_amulet) 
    d_chance = 0.005 * level_chalice
    d_multiplier = 1.0-d_chance + 10.0*d_chance

    mob_gold = mobs * (c_chance * c_gold + n_chance * n_gold * d_multiplier)
    boss_gold = BOSS_CONSTANT * (1 + level_kshield)
    
    gold_multiplier = (mob_gold + boss_gold) / (mobs+1.0)
    # add gold_dropped customizations
    total_multiplier = (1.0 + hero_gold + 0.05*level_fortune) * (1.0 + 0.15*level_elixir)

    final_multiplier = total_multiplier * gold_multiplier
    return final_multiplier


"""
stage 81
3.94cc -> 4.17 -> 4.39
4.40 -> 4.62 -> 4.84 cc

220 bb
1.25
1.42

7703844707945242.0
7.7aa base, c gold = 10 * 34.42

2618aa 55.1375
144 bb 349.975 aa

chesterson gold

stage 100
14.62dd -> 15.97dd -> 17.33dd
17.37dd -> 18.73dd

140
1.36gg -> 1.48gg -> 1.60gg -> 1.72gg -> 1.84gg

145
13.99gg -> 15.16gg -> 16.32gg

149
70.20gg -> 77.43gg -> 84.65

150
130.73gg -> 142.14gg -> 153.54 gg -> 153.65 (normal) -> 165.06 -> 176.46

152
346.74gg -> 374.85
377.74gg -> 405.85 -> 433.96

155
1.53hh -> 1.64hh -> 1.75hh -> 1.85hh -> 1.96hh

156
2.88hh -> 3.05hh -> 3.22hh -> 3.39hh -> 3.56hh

157
5.03hh -> 5.23hh -> 5.43hh -> 5.63hh -> 5.83hh

158
6.96hh -> 7.19hh -> 7.42hh -> (7.43) --> 7.66 -> 7.89 -> 8.13

160
11.22 -> 11.55hh -> 11.87hh -> 12.19 -> 12.51 -> 12.83

170
54.81hh -> 56.35
56.37 -> 57.90 -> 59.44

300
31.78kk -> 32.91 -> 34.03 -> 35.16 -> 36.28 -> 37.41



"""


def stage_gold(stage):
    return stage_hp(stage) * (0.02 + (0.00045 * min(stage, 150)))

def stage_accumulated_gold(stage):
    pass

def stage_hp(stage):
    if stage <= 156:
        return 18.5*pow(1.57, stage)
    # 18.5*pow(1.57, 156) = 6.7222940277842625e+31        
    return 6.7222940277842625e+31*pow(1.17, stage-156)

def tap_damage(artifacts):
    # MAIN_LEVEL * pow(1.05, MAIN_LEVEL)

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

def get_total_bonus(heroes, stype):
    bonus = 0
    for i, level in enumerate(heroes):
        bonus += hero_info[i].get_bonuses(level, stype)
    return bonus

def sets(weapons):
    if 0 in weapons
        return 0
    return 1 + sets([n - 1 for n in weapons])

def set_bonus(weapons):
    sets = sets(weapons)
    if sets == 0:
        return 1.0
    else:
        return 10.0 * sets

def get_hero_dps(heroes, weapons, artifacts, customization_ad):
    dps = 0
    hero_all_damage = get_total_bonus(heroes, STYPE_ALL_DAMAGE)
    for i, level in enumerate(heroes):
        hero_dps = hero_info[i].get_base_damage(level)
        hero_dps *= (1.0 + hero_info[i].get_bonuses(level, STYPE_HERO_DPS) + hero_all_damage)
        hero_dps *= 0.01 * all_damage(artifacts)
        hero_dps *= (1.0 + 0.5*weapons[i])
        hero_dps *= 1.0 + customization_ad
        hero_dps *= set_bonus(weapons)
        dps += hero_dps
    return dps


##### figure out:
## boss hp
## hero leveling cost - http://dd.reddit.com/r/TapTitans/comments/2u7scp/hero_upgrade_cost_explained/
## stage gold
## crit multiplier = (10+hero) * (1 + t) * (1 + c)



my_heroes = [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800]
print "hero test"
print get_total_bonus(my_heroes, STYPE_CRIT_DAMAGE)


my_artifacts = [35, 100, 10, 165, 127, 165, 25, 25, 37, 151, 35, 150, 10, 100, 0, 108, 10, 10, 75, 62, 0, 10, 10, 25, 55, 142, 104, 10, 5]
print "ad test"
print all_damage(my_artifacts)
print "gold test"
print gold_multiplier(my_artifacts, 0, 0)

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
# 


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
