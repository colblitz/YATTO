from calculate import *
import time
import cProfile



# tap_test2_artifacts = [35, 105, 10, 180, 137, 180, 25, 25, 39, 158, 37, 157, 10, 101, 0, 109, 10, 10, 78, 64, 0, 10, 10, 25, 58, 154, 108, 10, 5]
# tap_test2_heroes = [401, 401, 801, 801, 401, 401, 801, 801, 401, 801, 401, 801, 401, 801, 401, 801, 801, 801, 801, 801, 401, 801, 402, 801, 401, 800, 800, 800, 400, 8, 2, 0, 0]
# tap_test2_weapons =  [5, 4, 1, 2, 2, 1, 3, 4, 6, 4, 2, 4, 2, 2, 1, 2, 2, 0, 3, 3, 3, 1, 2, 0, 1, 3, 2, 3, 0, 4, 1, 2, 3]
# tap_test2_customizations = [0.59, 0.81, 0.25, 0.42, 0.015, 0.38]
# print "1200: ", gold_between_stages(1127, 1200, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)
# print "1250: ", gold_between_stages(1127, 1250, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)
# print "1300: ", gold_between_stages(1127, 1300, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)
# print "1350: ", gold_between_stages(1127, 1350, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)
# print "1400: ", gold_between_stages(1127, 1400, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)
# print "1450: ", gold_between_stages(1127, 1450, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)
# print "1500: ", gold_between_stages(1127, 1500, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)
# print "1550: ", gold_between_stages(1127, 1550, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)
# print "1600: ", gold_between_stages(1127, 1600, tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations)

# # from 1127 to x:
#       predicted
# 1200:  6.62272478583e+108    5.21e108
# 1250:  1.69955164643e+112    1.62e112
# 1300:  4.36141542957e+115    4.31e115
# 1350:  1.11923309369e+119    1.26e119
# 1400:  2.87219307184e+122    2.81e122
# 1450:  7.37066576066e+125
# 1500:  1.89147151311e+129
# 1550:  4.85392310694e+132
# 1600:  1.24562116663e+136

# c0 = 0
# for i in range(1, 20):
# 	c0 += hero_info[0].get_upgrade_cost(i)
# 	print i, hero_info[0].get_upgrade_cost(i), c0

# c1 = 0
# for i in range(1, 20):
# 	c1 += hero_info[1].get_upgrade_cost(i)
# 	print i, hero_info[1].get_upgrade_cost(i), c1

# print "------------------------"

# TRB4 - ohko until 2380, ohko tap until 2560, ohko br 2605, 105 seconds capped 2665
test1_a = [40, 114, 10, 260, 203, 245, 25, 25, 57, 229, 60, 230, 10, 272, 10, 114, 10, 10, 114, 94, 25, 10, 10, 25, 76, 217, 157, 10, 5]
test1_w = [2, 3, 4, 3, 4, 6, 7, 5, 3, 5, 5, 3, 6, 5, 5, 5, 2, 6, 3, 1, 1, 6, 6, 1, 4, 5, 3, 4, 2, 7, 2, 7, 1]
test1_c = [0.80, 0.81, 0.66, 1.67, 0.105, 0.44]
# g = GameState(test1_a, test1_w, test1_c)
# base_rps = g.relics_per_second3()
# print "TRB4 - ohko until 2380, ohko tap until 2560, ohko br 2605, 105 seconds capped 2665"
# print "------------------------"

# LeonProfessional - ohko until 2075, br to evolve dl, ohko to 2400, 150 second cap at around 2600-2610
test2_a = [35, 110, 10, 165, 125, 165, 25, 25, 60, 180, 35, 180, 10, 120, 10, 90, 10, 10, 90, 75, 25, 0, 10, 25, 61, 150, 125, 10, 5]
test2_w = [3, 2, 1, 2, 3, 5, 4, 2, 5, 8, 6, 2, 5, 5, 5, 3, 3, 4, 6, 3, 1, 3, 8, 3, 6, 3, 2, 3, 1, 3, 2, 6, 2]
test2_c = [0.72, 0.81, 0.66, 1.67, 0.095, 0.38]
# g = GameState(test2_a, test2_w, test2_c)
# base_rps = g.relics_per_second3()
# print "LeonProfessional - ohko until 2075, br to evolve dl, ohko to 2400, 150 second cap at around 2600-2610"
# print "------------------------"

# Iottie - walled at jackalope, prestiges around 1400
test3_a = [14, 0, 0, 25, 30, 0, 0, 14, 17, 0, 15, 0, 10, 0, 10, 31, 0, 10, 23, 24, 25, 10, 10, 15, 20, 50, 32, 0, 5]
test3_w = [3, 0, 1, 1, 1, 2, 1, 1, 0, 1, 2, 0, 0, 0, 1, 0, 1, 2, 2, 4, 0, 2, 1, 2, 0, 1, 0, 2, 0, 2, 0, 5, 1]
test3_c = [0.23, 0.25, 0.25, 0.32, 0.010, 0.08]
# g = GameState(test3_a, test3_w, test3_c)
# base_rps = g.relics_per_second3()
# print "Iottie - walled at jackalope, prestiges around 1400"
# print "------------------------"

# Badeky - walled with sc/br at around 2505
test4_a = [40, 94, 10, 102, 71, 150, 25, 25, 44, 220, 21, 108, 10, 0, 10, 90, 10, 10, 58, 60, 25, 10, 0, 0, 53, 144, 77, 10, 5]
test4_w = [3, 6, 4, 2, 3, 4, 5, 2, 1, 5, 5, 3, 2, 4, 3, 1, 3, 4, 2, 6, 5, 3, 2, 1, 2, 4, 3, 4, 10, 4, 0, 2, 5]
test4_c = [0.60, 0.25, 0.25, 0.42, 0.020, 0.32]
# g = GameState(test4_a, test4_w, test4_c)
# base_rps = g.relics_per_second3()
# print "Badeky - walled with sc/br at around 2505"
# print "------------------------"

# rajnod - walled at 2025, dl lvl 650-700
test5_a = [0, 0, 0, 46, 49, 46, 25, 17, 11, 41, 15, 51, 10, 74, 10, 90, 10, 10, 0, 14, 25, 0, 0, 0, 19, 40, 0, 0, 5]
test5_w = [1, 2, 4, 0, 0, 0, 0, 0, 1, 2, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 2]
test5_c = [0.14, 0.25, 0.25, 0.42, 0.010, 0.04]
# g = GameState(test5_a, test5_w, test5_c)
# base_rps = g.relics_per_second3()
# print "rajnod - walled at 2025, dl lvl 650-700"
# print "------------------------"

# superliro - one hit to 1990, after dl again to 2290, wall around 2475-2500 
test6_a = [0, 67, 10, 115, 87, 115, 25, 25, 29, 113, 18, 114, 0, 0, 10, 110, 10, 10, 59, 48, 25, 10, 10, 25, 44, 108, 81, 10, 5]
test6_w = [1, 4, 1, 2, 3, 5, 2, 5, 2, 2, 2, 1, 1, 0, 3, 2, 2, 1, 0, 3, 4, 0, 0, 1, 2, 4, 4, 3, 2, 0, 1, 0, 1]
test6_c = [0.35, 0.40, 0.30, 0.42, 0.025, 0.22]
# g = GameState(test6_a, test6_w, test6_c)
# base_rps = g.relics_per_second3()
# print "superliro - one hit to 1990, after dl again to 2290, wall around 2475-2500 "
# print "------------------------"

# snakeMGL - 2583, dl to 1927
test7_a = [100, 150, 10, 250, 200, 250, 25, 25, 150, 220, 100, 210, 10, 300, 10, 238, 10, 10, 150, 130, 25, 10, 10, 25, 80, 200, 150, 10, 5]
test7_w = [4, 2, 4, 3, 2, 6, 6, 8, 8, 7, 2, 6, 6, 3, 8, 2, 7, 5, 0, 5, 5, 3, 5, 3, 2, 5, 6, 3, 6, 2, 1, 5, 5]
test7_c = [0.80, 0.81, 0.66, 1.67, 0.045, 0.44]
# g = GameState(test7_a, test7_w, test7_c)
# base_rps = g.relics_per_second3()
# print "snakeMGL - 2583, dl to 1927"
# print "------------------------"

test1_c = [0, 0, 0, 0, 0, 0]

# print "------------------------------------------------------------------------------"
# g = GameState([40, 115, 10, 260, 203, 245, 25, 25, 57, 235, 60, 233, 10, 272, 10, 115, 10, 10, 115, 94, 25, 10, 10, 25, 77, 217, 158, 10, 5], test1_w, test1_c)
# g.relics_per_second3()
# print "------------------------------------------------------------------------------"
# g = GameState([40, 115, 10, 260, 203, 245, 25, 25, 57, 235, 60, 234, 10, 272, 10, 115, 10, 10, 115, 94, 25, 10, 10, 25, 77, 217, 158, 10, 5], test1_w, test1_c)
# g.relics_per_second3()


test1_a = [35, 115, 10, 195, 146, 195, 25, 25, 42, 173, 37, 170, 10, 112, 0, 121, 10, 10, 85, 70, 0, 10, 10, 25, 62, 170, 117, 10, 5]
test1_a = [35, 100, 10, 165, 127, 165, 25, 25, 37, 151, 35, 150, 10, 100, 0, 108, 10, 10, 75, 62, 0, 10, 10, 25, 55, 142, 104, 10, 5]
get_best(test1_a, test1_w, test1_c, 500000, None, RPS, True)


# hero_test_artifacts = [35, 105, 10, 180, 137, 180, 25, 25, 37, 151, 37, 150, 10, 100, 0, 109, 10, 10, 75, 62, 0, 10, 10, 25, 55, 154, 104, 10, 5]
# # hero_test_heroes =  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
# hero_test_weapons = [5, 4, 1, 2, 2, 1, 3, 4, 6, 4, 2, 4, 2, 2, 1, 2, 2, 0, 3, 3, 3, 1, 2, 0, 1, 3, 2, 3, 0, 4, 1, 2, 3]
# hero_test_customizations = [0.59, 0.81, 0.25, 0.42, 0.015, 0.38]

# relics_per_second(hero_test_artifacts, hero_test_customizations, hero_test_weapons)

# stage_relics = pow(1500/15 - 5, 1.7)
# hero_relics = 71000/1000
# multiplier = 2.0+0.1*100
# print int((stage_relics + hero_relics) * multiplier)

# stage_relics = pow(1515/15 - 5, 1.7)
# hero_relics = 71000/1000
# multiplier = 2.0+0.1*100
# print int((stage_relics + hero_relics) * multiplier)

# stage_relics = pow(1530/15 - 5, 1.7)
# hero_relics = 71000/1000
# multiplier = 2.0+0.1*100
# print int((stage_relics + hero_relics) * multiplier)

# stage_relics = pow(1545/15 - 5, 1.7)
# hero_relics = 71000/1000
# multiplier = 2.0+0.1*100
# print int((stage_relics + hero_relics) * multiplier)


# for i in xrange(5):
#   print hero_test_artifacts
#   g = GameState(hero_test_artifacts, hero_test_customizations, hero_test_weapons)
#   base_rps = g.relics_per_second2()
#   print base_rps
#   relic_costs = [0 for h in hero_test_artifacts]
#   difference = [0 for h in hero_test_artifacts]
#   efficiency = [0 for h in hero_test_artifacts]
#   for ai, a in enumerate(hero_test_artifacts):
#     relic_cost = artifact_info[ai].costToLevel(a)
#     if a == 0 or relic_cost > sys.maxint:
#       continue
#     new_a = [h for h in hero_test_artifacts]
#     new_a[ai] += 1
#     relic_costs[ai] = relic_cost
#     new_g = GameState(new_a, hero_test_customizations, hero_test_weapons)
#     new_rps = new_g.relics_per_second2()
#     difference[ai] = new_rps - base_rps
#     efficiency[ai] = (new_rps - base_rps) / relic_cost * 100000

#   best_o = 0
#   best_e = 0
#   print "----------------------------------------------------------------------------------------"
#   for i in range(len(efficiency)):
#     print "%2d - %5d - %1.7f - %2.6f - %s" % (i, relic_costs[i], difference[i], efficiency[i], artifact_info[i].name)
#     if efficiency[i] > best_e:
#       best_o = i
#       best_e = efficiency[i]
#   print "upgrading: ", best_o
#   hero_test_artifacts[best_o] += 1  



# for i in xrange(100):
#   print i, next_boss_stage(i)

# g = GameState(hero_test_artifacts, hero_test_customizations, hero_test_weapons)
# # g.relics_per_second2()  
# print "alkjsdlfkjsf"
# start = time.time()
# for i in xrange(10000):
#   if i % 1000 == 0:
#     print "."
#   g.relics_per_second2()  
# end = time.time()
# print (end - start) / 100.0

# gold = 100
# for k in range(200):
# 	print "i: ", k, " gold: ", gold
# 	skills_first = level_heroes(hero_test_heroes, gold, get_hero_weapon_bonuses(hero_test_weapons), set_bonus(hero_test_weapons), all_damage(hero_test_artifacts), hero_test_customizations[0])
# 	levels_first = level_heroes2(hero_test_heroes, gold, get_hero_weapon_bonuses(hero_test_weapons), set_bonus(hero_test_weapons), all_damage(hero_test_artifacts), hero_test_customizations[0])
# 	sf_dps = get_hero_dps(skills_first, get_hero_weapon_bonuses(hero_test_weapons), set_bonus(hero_test_weapons), all_damage(hero_test_artifacts), hero_test_customizations[0])
# 	lf_dps = get_hero_dps(levels_first, get_hero_weapon_bonuses(hero_test_weapons), set_bonus(hero_test_weapons), all_damage(hero_test_artifacts), hero_test_customizations[0])
# 	print skills_first
# 	print levels_first
# 	print sf_dps
# 	print lf_dps
# 	print "------------------------------------------------------------------------"
# 	gold *= 10


#print level_heroes(hero_test_heroes, 50000, get_hero_weapon_bonuses(hero_test_weapons), set_bonus(hero_test_weapons), all_damage(hero_test_artifacts), hero_test_customizations[0])


# tap_test_artifacts = [35, 105, 10, 180, 137, 180, 25, 25, 37, 151, 37, 150, 10, 100, 0, 109, 10, 10, 75, 62, 0, 10, 10, 25, 55, 154, 104, 10, 5]
# tap_test_heroes = [402, 401, 801, 801, 401, 401, 802, 801, 401, 801, 401, 801, 401, 801, 401, 801, 801, 801, 801, 801, 401, 801, 401, 801, 401, 800, 800, 800, 800, 800, 800, 800, 389]
# tap_test_weapons = [5, 4, 1, 2, 2, 1, 3, 4, 6, 4, 2, 4, 2, 2, 1, 2, 2, 0, 3, 3, 3, 1, 2, 0, 1, 3, 2, 3, 0, 4, 1, 2, 3]
# tap_test_customizations = [0.59, 0.81, 0.25, 0.42, 0.015, 0.38]

# (tap_damage, tapping) = tap_damage(tap_test_artifacts, tap_test_heroes, tap_test_customizations, tap_test_weapons)
# print "tap: ", tap_damage
# print "tapping: ", tapping
# print "------------------------------------------"
# print "2.05e153 tap damage"
# print "4.76e149 hero dps"
# print "180994 all dmg"
# print "0.73 crit chance"
# print "667 crit multiplier"



# tap_test2_artifacts = [35, 105, 10, 180, 137, 180, 25, 25, 37, 151, 37, 150, 10, 100, 0, 109, 10, 10, 75, 62, 0, 10, 10, 25, 55, 154, 104, 10, 5]
# tap_test2_heroes = [101, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
# tap_test2_weapons =  [5, 4, 1, 2, 2, 1, 3, 4, 6, 4, 2, 4, 2, 2, 1, 2, 2, 0, 3, 3, 3, 1, 2, 0, 1, 3, 2, 3, 0, 4, 1, 2, 3]
# tap_test2_customizations = [0.59, 0.81, 0.25, 0.42, 0.015, 0.38]
# tap_damage(tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations, tap_test2_weapons, ["145.73M", "153.88K", "268.42K", "1.31M", "5.11M", "15.65M"])
# print "------------------------------------------"
# print "takeda: 145.73M"
# print "contessa: 153.88K"
# print "hornetta: 268.42K"
# print "mila: 1.31M"
# print "terra: 5.11M"
# print "inq: 15.65M"
# print "total: 168.24M"


# tap_test2_artifacts = [35, 105, 10, 180, 137, 180, 25, 25, 39, 158, 37, 157, 10, 101, 0, 109, 10, 10, 78, 64, 0, 10, 10, 25, 58, 154, 108, 10, 5]
# tap_test2_heroes = [401, 401, 801, 801, 401, 401, 801, 801, 401, 801, 401, 801, 401, 801, 401, 801, 801, 801, 801, 801, 401, 801, 402, 801, 401, 800, 800, 800, 400, 8, 2, 0, 0]
# tap_test2_weapons =  [5, 4, 1, 2, 2, 1, 3, 4, 6, 4, 2, 4, 2, 2, 1, 2, 2, 0, 3, 3, 3, 1, 2, 0, 1, 3, 2, 3, 0, 4, 1, 2, 3]
# tap_test2_customizations = [0.59, 0.81, 0.25, 0.42, 0.015, 0.38]
# hero_expected = ["537.29T", "1.47aa", "47.12cc", "580.70cc", "27.01aa", "133.47aa", "35.12dd", "356.81dd", "175.79bb", "2.90ee", "423.18bb", "137.80ee", "7.86cc", "3.45ff", "134.26cc", "105.70ff", "1.27gg", "16.00gg", "1.32hh", "29.92hh", "7.98ff", "33.42ii", "138.04gg", "4.84kk", "8.47ii", "103.81mm", "651.69pp", "774.76uu", "477.35yy", "7.06e96", "3.53e100", "0", "0"]
# tap_damage(tap_test2_artifacts, tap_test2_heroes, tap_test2_customizations, tap_test2_weapons, hero_expected)
# print "-------------------------------------------------"



# hero_all_damage:  0.1
# Takeda the Blade Assassin 101 -------------------------------------
# base:  5561.98628465
# hero bonus:  2.5
# artifact ad:  1810.94
# weapon bonus:  3.6
# cust bonus:  1.59
# set bonus:  1.0
# total: 145737894.787
# Contessa the Torch Wielder 1 -------------------------------------
# base:  16.19527
# hero bonus:  1.0
# artifact ad:  1810.94
# weapon bonus:  3.1
# cust bonus:  1.59
# set bonus:  1.0
# total: 153887.490846
# Hornetta, Queen of the Valrunes 1 -------------------------------------
# base:  56.5190657918
# hero bonus:  1.0
# artifact ad:  1810.94
# weapon bonus:  1.6
# cust bonus:  1.59
# set bonus:  1.0
# total: 268522.143183
# Mila the Hammer Stomper 1 -------------------------------------
# base:  207.74603558
# hero bonus:  1.0
# artifact ad:  1810.94
# weapon bonus:  2.1
# cust bonus:  1.59
# set bonus:  1.0
# total: 1316002.18865
# Terra the Land Scorcher 1 -------------------------------------
# base:  807.41076787
# hero bonus:  1.0
# artifact ad:  1810.94
# weapon bonus:  2.1
# cust bonus:  1.59
# set bonus:  1.0
# total: 5114679.25097
# Inquisireaux the Terrible 1 -------------------------------------
# base:  3294.1960586
# hero bonus:  1.0
# artifact ad:  1810.94
# weapon bonus:  1.6
# cust bonus:  1.59
# set bonus:  1.0
# total: 15650729.0651
# -------------------------------------------------
# hero total dps:  168241714.926
# artifact ad:  180994
# total_tap:  3.41289853931e+15
# crit multiplier:  566.711
# crit chance:  0.535
# overall_crit_multiplier:  197.53875025
# total_tapping:  6.74179712186e+17
# ------------------------------------------
# takeda: 145.73M
# contessa: 153.88K
# hornetta: 268.42K
# mila: 1.31M
# terra: 5.11M
# inq: 15.65M
# total: 168.24M
##### figure out:
## boss hp
## hero leveling cost - http://dd.reddit.com/r/TapTitans/comments/2u7scp/hero_upgrade_cost_explained/
## stage gold
## crit multiplier = (10+hero) * (1 + t) * (1 + c)

"""

my_heroes = [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800]
print "hero test"
print get_total_bonus(my_heroes, STYPE_CRIT_DAMAGE)


my_artifacts = [35, 100, 10, 165, 127, 165, 25, 25, 37, 151, 35, 150, 10, 100, 0, 108, 10, 10, 75, 62, 0, 10, 10, 25, 55, 142, 104, 10, 5]
print "ad test"
print all_damage(my_artifacts)
print "gold test"
print gold_multiplier(my_artifacts, 0, 0)

player = Hero("Player", 0, 10.25, [])
level = [7, 8, 9, 10, 11, 13, 14, 15, 49, 50, 51, 52, 53, 54, 55, 100, 101, 102, 103, 104, 300, 301, 302, 400, 500, 600]
expected = [17, 20, 23, 27, 31, 41, 47, 53, 827, 888, 954, 1020, 1100, 1180, 1260, 31500, 33830, 36340, 39020, 41910, 50020000000, 53730000000, 5.77, 6.304, 7.944, 1.0011]
for i, level in enumerate(level):
    print level, player.get_upgrade_cost(level), expected[i]

print "801", hero_info[2].get_upgrade_cost(801), "9.69"

level = [100, 140, 149, 150, 152, 155, 156, 157, 158, 160, 170, 300]
expected = [1.36, 0.12, 7.23, 11.41, 28.11, 0.11, 0.17, 0.20, 0.23, 0.32, 1.53, 1.13]
for i, level in enumerate(level):
    cgold = base_stage_mob_gold(level) * 10 * (1 + 33) * (1 + 0.42) * (1 + 1.75 + 0.25) * (1.0 + 0.15*127)
    print level, cgold, expected[i]

"""

"""
main hero upgrade cost
7 17
8 20
9 23
10 27
11 31
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
400 63.04 000000000000
500 79.44aa
600 100.11bb
"""

# 7 17
# 8 20
# 9 23
# 10 27
# 11 31
# 12 26
# 13 41
# 14 47
# 15 53
# 49 827
# 50 888
# 51 954
# 52 1020
# 53 1100
# 54 1180
# 55 1260
# 100 31500
# 101 33830
# 102 36340
# 103 39020
# 104 41910
# 300 50020000000
# 301 53730000000
# 302 57700000000
# 400 63040000000000
# 500 79440000000000000
# 600 100110000000000000000

# {7, 17}, {8, 20}, {9, 23}, {10, 27}, {11, 31}, {12, 26}, {13, 41}, {14, 47}, {15, 53}, {49, 827}, {50, 888}, {51, 954}, {52, 1020}, {53, 1100}, {54, 1180}, {55, 1260}, {100, 31500}, {101, 33830}, {102, 36340}, {103, 39020}, {104, 41910}, {300, 50020000000}, {301, 53730000000}, {302, 57700000000}, {400, 63040000000000}, {500, 79440000000000000}, {600, 100110000000000000000}



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

my_artifacts = [35, 100, 10, 165, 127, 165, 25, 25, 37, 151, 35, 150, 10, 100, 0, 108, 10, 10, 75, 62, 0, 10, 10, 25, 55, 142, 104, 10, 5]

stage
100 - 1.36 dd
140 - 0.12 gg
149 - 7.23 gg
150 - 11.41 gg
152 - 28.11 gg
155 - 0.11 hh
156 - 0.17 hh
157 - 0.20 hh
158 - 0.23 hh
160 - 0.32 hh
170 - 1.53 hh
300 - 1.13 kk



stage 100 - 1.36dd
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