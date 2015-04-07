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
    Artifact("Amulet of the Valrunes",   50,  25,  0, lambda x: 0.7*pow(x, 2.0)),
    Artifact("Axe of Resolution",        70,  35,  0, lambda x: 0.5*pow(x, 1.7)),
    Artifact("Barbarian's Mettle",       70,  35, 10, lambda x: 0.4*pow(x, 1.5)),
    Artifact("Chest of Contentment",     40,  20,  0, lambda x:     pow(x, 1.5)),
    Artifact("Crafter's Elixir",         40,  20,  0, lambda x: 0.5*pow(x, 1.8)),
    Artifact("Crown Egg",                40,  20,  0, lambda x:     pow(x, 1.5)),
    Artifact("Dark Cloak of Life",       30,  15, 25, lambda x: 0.5*pow(x, 2.0)),
    Artifact("Death Seeker",             30,  15, 25, lambda x: 0.8*pow(x, 2.5)),
    Artifact("Divine Chalice",           30,  15,  0, lambda x: 0.7*pow(x, 1.7)),
    Artifact("Drunken Hammer",           30,  15,  0, lambda x: 0.6*pow(x, 1.7)),
    Artifact("Future's Fortune",         30,  15,  0, lambda x: 0.7*pow(x, 2.0)),
    Artifact("Hero's Thrust",            30,  15,  0, lambda x: 0.7*pow(x, 1.7)),
    Artifact("Hunter's Ointment",       120,  60, 10, lambda x: 0.4*pow(x, 1.5)),
    Artifact("Knight's Shield",          60,  30,  0, lambda x: 0.7*pow(x, 1.5)),
    Artifact("Laborer's Pendant",        70,  35, 10, lambda x: 0.7*pow(x, 1.5)),
    Artifact("Ogre's Gauntlet",          70,  35,  0, lambda x: 0.5*pow(x, 1.7)),
    Artifact("Otherworldly Armor",       70,  35,  0, lambda x:     pow(x, 2.2)),
    Artifact("Overseer's Lotion",        70,  35, 10, lambda x: 0.4*pow(x, 1.5)),
    Artifact("Parchment of Importance",  70,  35,  0, lambda x: 0.5*pow(x, 1.7)),
    Artifact("Ring of Opulence",         70,  35,  0, lambda x: 0.7*pow(x, 1.7)),
    Artifact("Ring of Wondrous Charm",   30,  15, 25, lambda x: 0.5*pow(x, 1.7)),
    Artifact("Sacred Scroll",            70,  35, 10, lambda x: 0.4*pow(x, 1.5)),
    Artifact("Saintly Shield",           70,  35, 10, lambda x: 0.3*pow(x, 1.5)),
    Artifact("Savior Shield",            30,  15, 25, lambda x: 0.5*pow(x, 1.7)),
    Artifact("Tincture of the Maker",    10,   5,  0, lambda x: 0.6*pow(x, 2.5)),
    Artifact("Undead Aura",              30,  15,  0, lambda x: 0.7*pow(x, 2.0)),
    Artifact("Universal Fissure",       120,  60,  0, lambda x: 0.5*pow(x, 1.7)),
    Artifact("Warrior's Revival",        70,  35, 10, lambda x:     pow(x, 2.2)),
    Artifact("Worldly Illuminator",     300, 150,  5, lambda x: 0.6*pow(x, 3.0))]

print artifacts[0].info(35)
print artifacts[1].info(95)
print artifacts[2].info(10)
print artifacts[3].info(150)






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

682 - 8
1.07k - 9 3.75k
10 - 1.68k, 8.41k
11 - 2.64k, 2.64k
12 - 4.14k, 8.29k
13 - 6.51k, 19.54k
14 - 10.22k, 35.79k
15 - 16.05k, 80.28k




"""

given:
