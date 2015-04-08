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
    # olaudix - var num2 = GetStageBaseHP($("#stage").val()) * (0.02 + (0.00045 * Math.min(stage, 150.0)));

def stage_accumulated_gold(stage):
    pass

def stage_hp(stage):
    if stage <= 156:
        return 18.5*pow(1.57, stage)
    # 18.5*pow(1.57, 156) = 6.7222940277842625e+31        
    return 6.7222940277842625e+31*pow(1.17, stage-156)

##### figure out:
## boss hp
## hero leveling cost - http://dd.reddit.com/r/TapTitans/comments/2u7scp/hero_upgrade_cost_explained/
## stage gold
## crit multiplier = (10+hero) * (1 + t) * (1 + c)


tap dmg * (1- crit chance) + tap dmg * (crit chance) * 0.65 * crit multiplier

tap damage * ((1-crit chance )+ (crit chance * 0.65 * crit multiplier))

def crit(t, c, hero):

    # return 10 * (1 + t) * (1 + c) * (1 + hero)
    # return 10 * (1 + t + hero) * (1 + c)
    # return 10 * (1 + t) * (1 + c + hero)
    return (10+hero) * (1 + t) * (1 + c)

print "689 ", crit(31, 0.81, 1.90)
print "603 ", crit(27, 0.81, 1.90)
print "598 ", crit(27, 0.81, 1.80)
print "595 ", crit(27, 0.81, 1.75)
print "592 ", crit(27, 0.81, 1.70)
print "590 ", crit(27, 0.81, 1.65)
print "587 ", crit(27, 0.81, 1.60)
print "585 ", crit(27, 0.81, 1.55)
print "580 ", crit(27, 0.81, 1.45)
print "572 ", crit(27, 0.81, 1.30)
print "567 ", crit(27, 0.81, 1.20)
print "557 ", crit(27, 0.81, 1.00)
print "542 ", crit(27, 0.81, 0.70)
print "532 ", crit(27, 0.81, 0.50)
print "516 ", crit(27, 0.81, 0.20)
print "506 ", crit(27, 0.81, 0)
print "117 ", crit(8.4, 0.25, 0)
"""

crit = 10 * (1 + hero thrust) * (1 + customizations)

crit = 506.8

603 with 2700 and 190
598 with 2700 and 180
595 with 2700 and 175
592 with 2700 and 170
590 with 2700 and 165
587 with 2700 and 160
585 with 2700 and 155
580 with 2700 and 145
572 with 2700 and 130
567 with 2700 and 120
557 with 2700 and 100
542 with 2700 and 70
532 with 2700 and 50
516 with 2700 and 20
506 with 2700 and 0

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

"""
crit multiplier
3000 561
2980 557
2960 553
2940 550
2920 546
2800 524
2780 521
2760 517
2740 514
2720 510
2700 506
1020 156
840 117
"""



