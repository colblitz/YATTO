import math
import sys
import numpy as np
import scipy

"""
TODO:
 - factor in Ring of Wondrous Charm
 - check boss health formula
 - check boss gold formula
 - factor in hero boss damage -> less boss life
 - is future's fortune still roundup
 - check skill/evolve costs
 - dp for search
 - walls? evolve heroes?

NOTES:
 - FateRiddle's uses different formulas for different things, which is weird...?
 - gxgx55/bsedmonds doesn't take into account weapons/customizations - only does alldmg, not tapping (crits?)
 - http://ianhinsdale.com/code/2013/12/08/communicating-between-nodejs-and-python/
"""

# (2 + 4*1.14 + 6*1.14**2 + 8*1.14**3 + 10*1.14**4)/(1 + 1.14 + 1.14**2 + 1.14**3 + 1.14**4)
BOSS_CONSTANT = 6.520253320788821
MAIN_LEVEL = 600
INFINITY = float("inf")

class Artifact:
    def __init__(self, name, ad0, adpl, levelcap, cost):
        self.name = name
        self.ad0 = ad0
        self.adpl = adpl
        self.levelcap = levelcap if levelcap != 0 else INFINITY
        self.cost = cost

    def getAD(self, cl):
        if (cl == 0):
            return 0
        return int(self.ad0 + self.adpl * (cl-1))

    def costToLevel(self, cl):
        if cl >= self.levelcap or cl == 0:
            return INFINITY
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
    Artifact("Otherworldly Armor",       70,  35, 10, lambda x:     pow(x, 2.2)), # 16 hero death chance
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

SKILL_TYPES = [STYPE_HERO_DPS, 
 STYPE_ALL_DAMAGE, 
 STYPE_CRIT_DAMAGE, 
 STYPE_TAP_DAMAGE, 
 STYPE_PERCENT_DPS,
 STYPE_CHEST_GOLD, 
 STYPE_GOLD_DROPPED, 
 STYPE_BOSS_DAMAGE, 
 STYPE_CRIT_CHANCE]

SKILL_LEVELS = [10, 25, 50, 100, 200, 400, 800, 1010, 1025, 1050, 1100, 1200, 1400, 1800]

class Hero:
    def __init__(self, name, hid, base_cost, skills):
        self.name = name
        self.hid = hid
        self.base_cost = base_cost
        self.skills = skills
        self.pre_calc = self.base_cost * (1-pow(0.019*min(self.hid, 15), self.hid)) / 0.75
        self.e_pre_calc = self.base_cost * pow(0.715, hid+30) / 0.075
        self.calculate_upgrade_costs()
        self.evolve_cost = 10.75 * self.get_upgrade_cost(999)
        self.precompute_next_skill()

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
    def calculate_upgrade_costs(self):
        self.costs = range(2000)
        for i in xrange(2000):
            self.costs[i] = (self.base_cost if i < 1000 else self.base_cost*10) * pow(1.075, i)

    def get_upgrade_cost(self, level):
        if level < 2000:
            return self.costs[level]
        return (self.base_cost if level < 1000 else self.base_cost*10) * pow(1.075, level)

    def cost_to_level(self, level, next_level):
        if next_level == level + 1:
            return self.get_upgrade_cost(level)
        if next_level <= 1000:
            return self.base_cost * (pow(1.075, next_level) - pow(1.075, level)) / 0.075
        elif level >= 1000:
            return 10* self.base_cost * (pow(1.075, next_level) - pow(1.075, level)) / 0.075
        else:
            return self.cost_to_level(level, 1000) + self.cost_to_evolve() + self.cost_to_level(1000, next_level)

    def next_skill(self, level):
        for l in SKILL_LEVELS:
            if level < l:
                return l
        return INFINITY

    def cost_to_buy_skill(self, level):
        if level < 1000:
            return 5 * self.get_upgrade_cost(level + 1)
        return 0.5 * self.get_upgrade_cost(level + 1)

    def precompute_next_skill(self):
        self.cost_to_next_s = range(2000)
        for i in xrange(2000):
            for l in SKILL_LEVELS:
                if i < l:
                    self.cost_to_next_s[i] = self.cost_to_level(i, l)
                    break

    def cost_to_next_skill(self, level):
        # print "level: ", level
        for l in SKILL_LEVELS:
            if level < l:
                # return l, self.cost_to_level(level, l)
                return l, self.cost_to_next_s[level]
        return 0, INFINITY

    def cost_to_evolve(self):
        return self.evolve_cost
        #return 10.75 * self.get_upgrade_cost(999)

    def get_bonuses(self, level, stype):
        bonus = 0
        for i in xrange(self.level_to_skills(level)):
            if self.skills[i][1] == stype:
                bonus += self.skills[i][0]
        return bonus

    def get_base_damage(self, level):
        n3 = 0
        if level >= 1001:
            n3 = pow(0.904, level - 1001) * pow(0.715, self.hid + 30.0)
        else:
            n3 = pow(0.904, level - 1) * pow(1-(0.019 * min(self.hid, 15.0)), self.hid)
        n4 = 0
        if level >= 1001:
            n4 = ((self.get_upgrade_cost(level - 1) * (pow(1.075, level - 1000) - 1) / 1.075) - 1) * n3 * 0.1
        else:
            n4 = self.get_upgrade_cost(level - 1) * (pow(1.075, level) - 1) / 0.0075 * n3
        return n4

    def get_damage_increase(self, level):
        return self.get_base_damage(level + 1) - self.get_base_damage(level)

    def get_efficiency(self, level):
        return self.get_damage_increase(level) / self.get_upgrade_cost(level)

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

#### Helper
def all_damage(artifacts):
    total_ad = 0
    for i, level in enumerate(artifacts):
        total_ad += artifact_info[i].getAD(level)
    total_ad *= (1 + 0.05 * artifacts[24])
    return int(round(total_ad))

def cost_to_buy_next(artifacts):
    owned = len([x for x in artifacts if x != 0]) + 1
    return int(owned * pow(1.35, owned))

def get_hero_weapon_bonuses(weapons):
    return [1.0 + 0.5*x for x in weapons]

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

def next_boss_stage(stage):
    return int(math.ceil(stage / 5.0)) * 5

def stage_hp(stage):
    if stage <= 156:
        return 18.5*pow(1.57, stage)
    # 18.5*pow(1.57, 156) = 6.7222940277842625e+31        
    return 6.7222940277842625e+31*pow(1.17, stage-156)

def boss_multiplier(stage):
    s = stage % 10
    if s == 0 or s == 5:
        return 10
    if s == 1 or s == 6:
        return 2
    if s == 2 or s == 7:
        return 4
    if s == 3 or s == 8:
        return 6
    if s == 4 or s == 9:
        return 8

def health_to_stage(health):
    if health > stage_hp(156):
        return int(round(math.log(health / 6.7222940277842625e+31, 1.17) + 156))
    else:
        return int(round(math.log(health / 18.5, 1.57)))

def base_stage_mob_gold(stage):
    return stage_hp(stage) * (0.02 + (0.00045 * min(stage, 150)))

class GameState:
    def __init__(self, artifacts, weapons, customizations):
        self.artifacts = artifacts
        self.a_ad = 0.01 * all_damage(artifacts)
        self.l_amulet = artifacts[0]
        self.l_chest = artifacts[3]
        self.l_elixir = artifacts[4]
        self.l_egg = artifacts[5]
        self.l_dseeker = artifacts[7]
        self.l_chalice = artifacts[8]
        self.l_hammer = artifacts[9]
        self.l_fortune = artifacts[10]
        self.l_hthrust = artifacts[11]
        self.l_kshield = artifacts[13]
        self.l_charm = artifacts[20]
        self.l_ua = artifacts[25]
        self.l_world = artifacts[28]
        
        self.weapons = weapons
        self.w_bh = get_hero_weapon_bonuses(weapons)
        self.w_sb = set_bonus(weapons)

        self.customizations = customizations
        self.c_ad = customizations[0]
        self.c_cd = customizations[1]
        self.c_gd = customizations[2]
        self.c_cg = customizations[3]
        self.c_cc = customizations[4]
        self.c_td = customizations[5]

        self.c_chance = min(1.0, 0.02 + 0.004 * self.l_egg)

        self.n_chance = 1.0 - self.c_chance
        self.n_gold = 1.0 + 0.1 * self.l_amulet
        self.d_chance = min(1.0, 0.005 * self.l_chalice)
        self.d_multiplier = 1.0-self.d_chance + 10.0*self.d_chance
        self.mob_multipliers = self.n_chance * self.n_gold * self.d_multiplier
        self.boss_gold = BOSS_CONSTANT * (1 + self.l_kshield)

        self.other_total = (1.0 + self.c_gd) * (1.0 + 0.15*self.l_elixir) * (1.0 / (1.0 - self.l_charm * 0.02))

        self.new_run()

    def new_run(self):
        self.heroes = [0 for h in hero_info]
        self.hero_skills = [0 for h in hero_info]
        self.skill_bonuses = [0 for t in SKILL_TYPES]
        self.current_stage = 1
        self.current_gold = 0
        self.time = 0

    def add_skill(self, hero, skill):
        s = hero_info[hero].skills[skill]
        self.skill_bonuses[s[1]] += s[0]

    def get_all_skills(self):
        heroes_after = self.heroes[:]
        for i in xrange(len(heroes_after)):
            level = heroes_after[i]
            next_skill_level, c = hero_info[i].cost_to_next_skill(level)
            while level < 800:
                heroes_after[i] = next_skill_level
                self.add_skill(i, self.hero_skills[i])
                self.hero_skills[i] += 1
                level = next_skill_level
                next_skill_level, c = hero_info[i].cost_to_next_skill(level)
        self.heroes = heroes_after

    def total_relics(self):
        # relics = ((floor to nearest 15 of stage - 75) / 15)^1.7 * undead bonus
        stage_relics = pow(self.current_stage/15 - 5, 1.7)
        hero_relics = sum(self.heroes)/1000
        multiplier = 2.0+0.1*self.l_ua
        return int((stage_relics + hero_relics) * multiplier)

    def get_total_bonus(self, stype):
        return self.skill_bonuses[stype]

    def gold_multiplier(self):
        mobs = 10 - self.l_world
        
        h_cg = self.get_total_bonus(STYPE_CHEST_GOLD)
        h_gd = self.get_total_bonus(STYPE_GOLD_DROPPED)

        c_gold = 10.0 * (1.0 + 0.2 * self.l_chest) * (1 + self.c_cg) * (1 + h_cg)

        mob_gold = mobs * (self.c_chance * c_gold + self.mob_multipliers)
        gold_multiplier = (mob_gold + self.boss_gold) / (mobs+1.0)
        total_multiplier = math.ceil(1.0 + 0.05*self.l_fortune + h_gd) * self.other_total

        final_multiplier = total_multiplier * gold_multiplier
        return final_multiplier

    def mob_multiplier(self):
        h_cg = self.get_total_bonus(STYPE_CHEST_GOLD)
        h_gd = self.get_total_bonus(STYPE_GOLD_DROPPED)

        c_gold = 10.0 * (1.0 + 0.2 * self.l_chest) * (1 + self.c_cg) * (1 + h_cg)
        mob_m = self.c_chance * c_gold + self.mob_multipliers
        total_multiplier = math.ceil(1.0 + 0.05*self.l_fortune + h_gd) * self.other_total
        return total_multiplier * mob_m

    def gold_for_stage(self, stage):
        mobs = 10 - self.l_world + 1
        base = base_stage_mob_gold(stage)
        multiplier = self.gold_multiplier()
        return mobs * base * multiplier

    def gold_between_stages(self, start_stage, end_stage):
        total = 0.0
        for s in xrange(start_stage, end_stage):
            total += self.gold_for_stage(s)
        return total

    def get_crit_multiplier(self):
        h_cd = self.get_total_bonus(STYPE_CRIT_DAMAGE)
        return (10 + h_cd) * (1 + 0.2*self.l_hthrust) * (1 + self.c_cd)

    def get_crit_chance(self):
        h_cc = self.get_total_bonus(STYPE_CRIT_CHANCE)
        return 0.02 + 0.02 * self.l_dseeker + self.c_cc + h_cc

    def get_hero_dps(self):
        dps = 0
        h_ad = self.get_total_bonus(STYPE_ALL_DAMAGE)
        for i, level in enumerate(self.heroes):
            if level == 0:
                continue

            hero_dps = hero_info[i].get_base_damage(level)
            
            m_hero = 1.0 + hero_info[i].get_bonuses(level, STYPE_HERO_DPS) + h_ad
            m_artifact = 1.0 + self.a_ad
            m_weapon = self.w_bh[i]
            m_customization = 1.0 + self.c_ad
            m_set = self.w_sb

            hero_dps = hero_dps * m_hero * m_artifact * m_weapon * m_customization * m_set
            dps += hero_dps
        return dps

    def tap_damage(self):
        h_ad = self.get_total_bonus(STYPE_ALL_DAMAGE)
        h_td = self.get_total_bonus(STYPE_TAP_DAMAGE)
        h_pd = self.get_total_bonus(STYPE_PERCENT_DPS)
        h_cd = self.get_total_bonus(STYPE_CRIT_DAMAGE)
        h_cc = self.get_total_bonus(STYPE_CRIT_CHANCE)

        hero_total_dps = self.get_hero_dps()
        #from_main = MAIN_LEVEL * pow(1.05, MAIN_LEVEL) * (1 + h_ad)
        
        from_main = 3102635035739283.5 * (1 + h_ad)
        from_hero = (h_pd * hero_total_dps) * (1 + h_td + self.c_td) * (1 + self.a_ad) * (1 + 0.02 * self.l_hammer) * (1 + self.c_ad)
        total_tap = from_main + from_hero

        crit_multiplier = self.get_crit_multiplier()
        crit_chance = self.get_crit_chance()

        overall_crit_multiplier = ((1 - crit_chance) + (crit_chance * 0.65 * crit_multiplier))
        total_tapping = total_tap * overall_crit_multiplier
        return total_tap, total_tapping

    def level_heroes(self):
        ## buy all the heroes that you can buy
        heroes_after = [l for l in self.heroes]
        for i, level in enumerate(heroes_after):
            if level == 0 and hero_info[i].base_cost < self.current_gold:
                heroes_after[i] += 1
                self.current_gold -= hero_info[i].base_cost

        # level your last hero as much as you can
        owned_heroes = [x for x in heroes_after if x != 0]
        last_owned = len(owned_heroes) - 1
        l_last = heroes_after[last_owned]

        for i in [100, 10, 1]:
            c = hero_info[last_owned].cost_to_level(l_last, l_last + i)
            while c < self.current_gold:
                heroes_after[last_owned] += i
                l_last = heroes_after[last_owned]            
                self.current_gold -= c
                c = hero_info[last_owned].cost_to_level(l_last, l_last + i)

        # print "self.current gold: ", self.current_gold
        # buy all the skills that you can
        for i in xrange(len(heroes_after)):
            if heroes_after[i] == 0:
                continue
            level = heroes_after[i]
            next_skill_level, c = hero_info[i].cost_to_next_skill(level)
            c += hero_info[i].cost_to_buy_skill(l)
            # print "cost to buy: ", hero_info[i].cost_to_buy_skill(l)
            # print "hero ", i, " next_skill_level: ", next_skill_level, " cost: ", c
            while c < self.current_gold and level < 800:
                heroes_after[i] = next_skill_level
                self.add_skill(i, self.hero_skills[i])
                self.hero_skills[i] += 1
                level = next_skill_level
                self.current_gold -= c
                next_skill_level, c = hero_info[i].cost_to_next_skill(level)
                c += hero_info[i].cost_to_buy_skill(next_skill_level)
        self.heroes = heroes_after

    def evolve_heroes(self):
        heroes_after = [l for l in self.heroes]
        for i, level in enumerate(heroes_after):
            if level == 1000 and hero_info[i].cost_to_evolve() < self.current_gold:
                heroes_after[i] += 1
                self.current_gold -= hero_info[i].cost_to_evolve()

        self.heroes = heroes_after

    #############
    def relics_per_second(self, verbose = False):
        TAPS_PER_SECOND = 10
        self.new_run()

        done = False
        grind = None
        end_game = False
        while not done:
            tap, tapping = self.tap_damage()
            ohko_stage = health_to_stage(tap)
            if ohko_stage > self.current_stage:
                mode = "ohko"
                self.current_gold += self.gold_between_stages(self.current_stage, ohko_stage + 1)
                self.level_heroes()
                self.time += 4.5 * (ohko_stage - self.current_stage)
                self.current_stage = ohko_stage + 1
                if verbose: print "%4d - %15s - " % (self.current_stage, mode), self.heroes
                continue

            # cannot ohko anymore, start tapping
            ohko_tapping_stage = health_to_stage(tapping)
            if ohko_tapping_stage > self.current_stage:
                mode = "ohko tap"
                self.current_gold += self.gold_between_stages(self.current_stage, ohko_tapping_stage + 1)
                self.level_heroes()
                self.time += 5.0 * (ohko_tapping_stage - self.current_stage)
                self.current_stage = ohko_tapping_stage + 1
                if verbose: print "%4d - %15s - " % (self.current_stage, mode), self.heroes
                continue

            # cannot ohko anymore, 5 seconds of tapping per boss
            five_seconds = tapping * TAPS_PER_SECOND * 5
            next_boss = next_boss_stage(self.current_stage)
            if five_seconds > stage_hp(next_boss) * 10:
                mode = "tapping for 5"
                self.current_gold += self.gold_between_stages(self.current_stage, next_boss + 1)
                self.level_heroes()
                dps = tapping * TAPS_PER_SECOND
                self.time += (next_boss - self.current_stage) * (4.5 + stage_hp(next_boss) * 12 / dps)
                self.current_stage = next_boss + 1
                if verbose: print "%4d - %15s - " % (self.current_stage, mode), self.heroes
                continue

            if end_game:
                oneohfive_seconds = tapping * TAPS_PER_SECOND * 105
                next_boss = next_boss_stage(self.current_stage)
                if oneohfive_seconds > stage_hp(next_boss) * 10:
                    mode = "105 tapping"
                    self.current_gold += self.gold_between_stages(self.current_stage, next_boss + 1)
                    self.level_heroes()
                    dps = tapping * TAPS_PER_SECOND
                    self.time += (next_boss - self.current_stage) * (4.5 + stage_hp(next_boss) * 12 / dps)
                    self.current_stage = next_boss + 1
                    if verbose: print "%4d - %15s - " % (self.current_stage, mode), self.heroes
                    continue
                else:
                    if verbose: print "done"
                    done = True
                    continue

            # cannot kill boss in 5 seconds, see if we want to grind
            owned_heroes = [x for x in self.heroes if x != 0]
            next_hero = len(owned_heroes)
            if next_hero == 33 and self.heroes[32] < 1001:
                grind_target = hero_info[32].cost_to_evolve()
                grind = "evolve"
            elif next_hero == 33:
                end_game = True
                continue
            else:
                grind_target = hero_info[next_hero].base_cost
                grind = "next hero"
            gold_needed = grind_target - self.current_gold
            # check if we can already get whatever we were grinding for
            if gold_needed < 0:
                if grind == "evolve":
                    self.evolve_heroes()
                if grind == "next hero":
                    self.level_heroes()
                continue

            # otherwise, how long do we want to grind for
            mob_gold = self.mob_multiplier() * base_stage_mob_gold(self.current_stage)
            if gold_needed < 200 * mob_gold:
                mode = "grinding"
                num_mobs = grind_target / mob_gold
                mob_hp = stage_hp(self.current_stage)
                self.current_gold += num_mobs * mob_gold
                self.time += (mob_hp / (tapping * TAPS_PER_SECOND) + 4.5/6.0) * num_mobs
                if verbose: print "%4d - %15s - " % (self.current_stage, mode), self.heroes
                continue
            else:
                end_game = True
        return self.current_stage, self.time, float(self.total_relics()) / self.time

GOLD, ALL_DAMAGE, TAP_DAMAGE, K, RELICS_PER_SECOND, STAGES_PER_SECOND = range(6)

def get_value(game_state, method):
    global GOLD, ALL_DAMAGE, TAP_DAMAGE, K, RELICS_PER_SECOND, STAGES_PER_SECOND
    if method == RELICS_PER_SECOND:
        stage, time, value = game_state.relics_per_second()
    elif method == GOLD:
        value = game_state.gold_multiplier()
    elif method == ALL_DAMAGE:
        value = game_state.a_ad
    elif method == TAP_DAMAGE:
        tap, value = game_state.tap_damage()
    elif method == K:
        value = (game_state.gold_multiplier(), game_state.a_ad * 100)
    elif method == STAGES_PER_SECOND:
        stage, time, RELICS_PER_SECOND = game_state.relics_per_second()
        value = (stage, time)
    else:
        pass
        # herp a derp
    return value

def index_max(values):
    return max(xrange(len(values)),key=values.__getitem__)

def is_greater(s1, s2):
    if s1[0] > s2[0]:
        return True
    elif s1[0] < s2[0]:
        return False
    else:
        return s1[1] > s2[1]

def get_best(artifacts, weapons, customizations, relics, nsteps, method, greedy = True):
    global GOLD, ALL_DAMAGE, TAP_DAMAGE, K, RELICS_PER_SECOND, STAGES_PER_SECOND
    if greedy:
        relics_left = relics
        current_artifacts = artifacts[:]
        steps = []
        cumulative = 0
        while relics_left > 0 or len(steps) < nsteps:
            g = GameState(current_artifacts, weapons, customizations)
            if method not in (RELICS_PER_SECOND, STAGES_PER_SECOND):
                g.get_all_skills()
            base = get_value(g, method)
            efficiency = [0 for a in artifact_info]
            efficiencies= [0 for a in artifact_info]
            increase = [0 for a in artifact_info]
            new_values = [0 for a in artifact_info]
            costs = efficiency[:]
            for index, level in enumerate(current_artifacts):
                relic_cost = artifact_info[index].costToLevel(level)
                costs[index] = relic_cost
                if level == 0 or level == artifact_info[index].levelcap or relic_cost > sys.maxint:
                    increase[index] = (artifact_info[index].name, "MAX")
                    efficiencies[index] = (artifact_info[index].name, 0.0)
                    continue
                artifacts_copy = current_artifacts[:]
                artifacts_copy[index] += 1
                new_g = GameState(artifacts_copy, weapons, customizations)
                if method not in (RELICS_PER_SECOND, STAGES_PER_SECOND):
                    new_g.get_all_skills()
                new_value = get_value(new_g, method)
                new_values[index] = (artifact_info[index].name, new_value)
                if method == STAGES_PER_SECOND:
                    increase[index] = (artifact_info[index].name, (new_value[0] - base[0], base[1] - new_value[1]))
                    e = ((new_value[0] - base[0]) / relic_cost, (base[1] - new_value[1]) / relic_cost)
                    efficiency[index] = e
                    efficiencies[index] = (artifact_info[index].name, e)
                elif method == K:
                    e = (new_value[0] * new_value[1] / (base[0] * base[1]) - 1.0) / relic_cost
                    efficiency[index] = e
                    efficiencies[index] = (artifact_info[index].name, e)
                else:
                    increase[index] = (artifact_info[index].name, new_value - base)
                    efficiency[index] = (new_value - base) / relic_cost
                    efficiencies[index] = (artifact_info[index].name, (new_value - base) / relic_cost)
            # filtered = [x for x in increase if x[1] != 0.0 and x[1] != "MAX"]
            # print filtered
            # filtered = [x for x in efficiencies if x[1] != 0.0 and x[1] != "MAX"]
            # print filtered
            # print efficiency
            if method != STAGES_PER_SECOND:
                best_index = index_max(efficiency)
            else:
                best_index = None
                best_e = (-1, -sys.maxint)
                for index, e in enumerate(efficiency):
                    if e == 0:
                        continue
                    if is_greater(e, best_e):
                        best_index = index
                        best_e = e

            relics_left -= costs[best_index]
            # print current_artifacts
            current_artifacts[best_index] += 1
            cumulative += costs[best_index]
            #print (artifact_info[best_index].name, current_artifacts[best_index], cumulative, costs[best_index])

            # print "############################################################################################################################"
            steps.append((artifact_info[best_index].name, current_artifacts[best_index], cumulative, costs[best_index]))
        for s in steps:
            pass#print s
        return steps
    else:
        pass
        # dp this







