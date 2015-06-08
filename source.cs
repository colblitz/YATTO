// hero upgrade cost (level) -------------------------------------------------------------------------------------------------------
public double GetUpgradeCostByLevel(int iLevel) {
	double a = this.GetBaseUpgradeCostByLevel(iLevel) * (1.0 + PlayerModel.instance.GetStatBonus(BonusType.AllUpgradeCost));
	return Math.Ceiling(a);
}

private double GetBaseUpgradeCostByLevel(int iLevel) {
	return (this.GetHeroBaseCost(iLevel) * Math.Pow((double) ServerVarsModel.heroUpgradeBase, (double) iLevel));
}


private double GetHeroBaseCost(int iLevel = -1) {
	double purchaseCost = (double) this.purchaseCost;
	if (iLevel == -1) {
		iLevel = (int) this.heroLevel;
	}
	if (iLevel >= (ServerVarsModel.heroEvolveLevel - 1)) {
		purchaseCost *= ServerVarsModel.evolveCostMultiplier;
	}
	return purchaseCost;
}

// hero skill cost -------------------------------------------------------------------------------------------------------
public void UpdateNextToBeBoughtSkill() {
	this.nextToBeBoughtSkill = null;
	int num = 0;
	if (this.IsEvolved()) {
		num += ServerVarsModel.heroEvolveLevel - 1;
	}
	foreach (int num2 in this.heroSkills) {
		SkillInfo info = SkillModel.instance.allSkillInfo[num2];
		if ((info.isUnlocked == 0) && ((info.requiredLevel + num) <= this.heroLevel)) {
			this.nextToBeBoughtSkill = info;
			break;
		}
	}
	if (this.nextToBeBoughtSkill != null) {
		int requiredLevel = (int) this.nextToBeBoughtSkill.requiredLevel;
		if (this.IsEvolved()) {
			requiredLevel += ServerVarsModel.heroEvolveLevel - 1;
		}
		this.nextToBeBoughtSkillCost = (this.purchaseCost * Math.Pow((double) ServerVarsModel.heroUpgradeBase, (double) requiredLevel)) * ServerVarsModel.passiveSkillCostMultiplier;
	} else {
		this.nextToBeBoughtSkillCost = 0.0;
	}
}

// hero get dps -------------------------------------------------------------------------------------------------------
public double GetDPSByLevel(int iLevel) {
	double statBonus = PlayerModel.instance.GetStatBonus(BonusType.HeroAttackSpeedActive);
	double num3 = (HeroesModel.instance.currentFullWeaponSetBonus <= 0.0) ? 1.0 : ((double) HeroesModel.instance.currentFullWeaponSetBonus);
	double num4 = 0.0;
	if (this.IsEvolved(iLevel)) {
		num4 = Math.Pow((double) ServerVarsModel.levelIneffiency, (double) (iLevel - ServerVarsModel.heroEvolveLevel)) * Math.Pow((double) (1f - (ServerVarsModel.heroInefficiency * ServerVarsModel.heroInefficiencySlowDown)), (double) (this.heroID + 0x21));
	} else {
		num4 = Math.Pow((double) ServerVarsModel.levelIneffiency, (double) (iLevel - 1)) * Math.Pow((double) (1f - (ServerVarsModel.heroInefficiency * Math.Min((float) this.heroID, ServerVarsModel.heroInefficiencySlowDown))), (double) this.heroID);
	}
	if (num4 < 1E-308) {
		num4 = 1E-308;
	}
	double num5 = 0.0;
	if (this.IsEvolved(iLevel)) {
		num5 = (((num4 * ServerVarsModel.dMGScaleDown) * this.GetBaseUpgradeCostByLevel(iLevel - 1)) * (Math.Pow((double) ServerVarsModel.heroUpgradeBase, (double) (iLevel - (ServerVarsModel.heroEvolveLevel - 1))) - 1.0)) / ((double) (ServerVarsModel.heroUpgradeBase - 1f));
	} else {
		num5 = (((num4 * ServerVarsModel.dMGScaleDown) * this.GetBaseUpgradeCostByLevel(iLevel - 1)) * (Math.Pow((double) ServerVarsModel.heroUpgradeBase, (double) iLevel) - 1.0)) / ((double) (ServerVarsModel.heroUpgradeBase - 1f));
	}
	return ((((((num5 * ((1.0 + this.currentPassiveThisHeroDamage) + PlayerModel.instance.GetStatBonus(BonusType.AllDamage))) * (1.0 + ArtifactModel.instance.ArtifactDamageBonus)) * (1.0 + PlayerModel.instance.GetStatBonus(BonusType.AllDamageCustomization))) * (1.0 + statBonus)) * (1f + (((float) this.weaponUpgradeAmount) * ServerVarsModel.weaponUpgradeBonusDamage))) * num3);
}

// stage hp -------------------------------------------------------------------------------------------------------
public double GetStageBaseHP(int stage) {
	return ((ServerVarsModel.monsterHPMultiplier * Math.Pow((double) ServerVarsModel.monsterHPBase1, (double) Math.Min((float) stage, ServerVarsModel.monsterHPLevelOff))) * Math.Pow((double) ServerVarsModel.monsterHPBase2, (double) Math.Max((float) (stage - ServerVarsModel.monsterHPLevelOff), (float) 0f)));
}

// boss hp -------------------------------------------------------------------------------------------------------
public double GetBossHPGoldMultiplier() {
	return (double) ServerVarsModel.themeMultiplierSequence[this.StageInTheme];
}

// base stage gold -------------------------------------------------------------------------------------------------------
public double GetHPGoldMultiplier(int iStageInTheme) {
	return (double) ServerVarsModel.themeMultiplierSequence[iStageInTheme];
}

public double GetStageBaseGold(int stage) {
	double num2 = this.GetStageBaseHP(stage) * (ServerVarsModel.monsterGoldMultiplier + (ServerVarsModel.monsterGoldSlope * Math.Min((float) this.currentStage, ServerVarsModel.noMoreMonsterGoldSlope)));
	return (num2 * Math.Ceiling((double) (1.0 + PlayerModel.instance.GetStatBonus(BonusType.GoldAll))));
}

// relics from stage -------------------------------------------------------------------------------------------------------
public void DisplayStats() {
	LocalizationModel instance = LocalizationModel.instance;
	int heroLevelPrestigeRelics = (int) GameModel.instance.GetHeroLevelPrestigeRelics();
	int unlockedStagePrestigeRelics = (int) GameModel.instance.GetUnlockedStagePrestigeRelics();
	LocalizationModel.instance.SetFont(this.heroLevelsLabel, LocalizationModel.GHFont.OpenSansBoldWhite, false, false);
	LocalizationModel.instance.SetFont(this.stageCompleteLabel, LocalizationModel.GHFont.OpenSansBoldWhite, false, false);
	LocalizationModel.instance.SetFont(this.fullTeamLabel, LocalizationModel.GHFont.OpenSansBoldWhite, false, false);
	LocalizationModel.instance.SetFont(this.totalLabel, LocalizationModel.GHFont.OpenSansBoldWhite, false, false);
	LocalizationModel.instance.SetFont(this.fullTeamComplete, LocalizationModel.GHFont.OpenSansBoldWhite, false, false);
	this.heroLevelsLabel.Text = instance.GetLocalizedString("PRESTIGE_HERO_BONUS_LABEL") + ":";
	this.stageCompleteLabel.Text = instance.GetLocalizedString("PRESTIGE_STAGE_COMPLETE_LABEL") + ":";
	int num3 = heroLevelPrestigeRelics + unlockedStagePrestigeRelics;
	this.fullTeamLabel.Text = GHTool.ReplaceStringInString(instance.GetLocalizedString("PRESTIGE_FULL_TEAM_LABEL"), "[XXX]", "+" + num3.ToString()) + ":";
	this.totalLabel.Text = instance.GetLocalizedString("TOTAL").ToUpper() + ":";
	this.heroLevelsRelics.Text = heroLevelPrestigeRelics.ToString();
	this.stageCompleteRelics.Text = unlockedStagePrestigeRelics.ToString();
	if (GameModel.instance.GetHeroLevelAliveBonus()) {
		this.fullTeamComplete.Text = "+" + ((heroLevelPrestigeRelics + unlockedStagePrestigeRelics)).ToString();
	} else {
		this.fullTeamComplete.Text = LocalizationModel.instance.GetLocalizedString("INCOMPLETE");
	}
	this.totalRelics.Text = ((int) GameModel.instance.GetPrestigeRelicCount()).ToString();
}

public double GetHeroLevelPrestigeRelics() {
	double a = 0.0;
	int num2 = 0;
	foreach (HeroInfo info in HeroesModel.instance.allHeroInfo.Values) {
		if (info.IsUnlocked() && (info.isDead == 0)) {
			num2 += info.heroLevel;
		}
	}
	a = ((double) num2) / ((double) ServerVarsModel.RelicFromHeroLevel);
	a *= 1.0 + PlayerModel.instance.GetStatBonus(BonusType.PrestigeRelic);
	a = Math.Round(a);
	if (PlayerModel.instance.GetStatBonus(BonusType.PrestigeRelic) > 0.001) {
		a++;
	}
	return a;
}

public double GetUnlockedStagePrestigeRelics() {
	double a = 0.0;
	int unlockedStage = (int) StageController.instance.unlockedStage;
	a += Math.Pow((double) (Math.Max(0, unlockedStage - ServerVarsModel.RelicFromStageBaseline) / ServerVarsModel.RelicFromStageDivider), ServerVarsModel.RelicFromStagePower);
	a *= 1.0 + PlayerModel.instance.GetStatBonus(BonusType.PrestigeRelic);
	return Math.Ceiling(a);
}

// gold multiplier (chalice, amulet, stuff) ----------------------------------------------------------------------------------------------

private void RewardEnemyGold(EnemyInfo enemy) {
	double stageBaseGold = StageController.instance.GetStageBaseGold((int) StageController.instance.currentStage);
	if (enemy.IsBoss) {
		stageBaseGold *= StageController.instance.GetCurrentBossHPGoldMultiplier();
		stageBaseGold *= 1.0 + this.GetStatBonus(BonusType.GoldBoss);
		stageBaseGold *= ServerVarsModel.bossGoldMultiplier;
	} else if (enemy.IsChest) {
		stageBaseGold *= ServerVarsModel.treasureBoxGoldMultiplier;
		stageBaseGold *= 1.0 + this.GetStatBonus(BonusType.GoldTreasurePassive);
		stageBaseGold *= 1.0 + this.GetStatBonus(BonusType.GoldTreasureArtifact);
		stageBaseGold *= 1.0 + this.GetStatBonus(BonusType.GoldTreasureCustomization);
		TrophyModel.instance.AddToTrophy(TrophyID.ChestsOpened, 1.0);
	} else {
		if (enemy.IsDungeon) {
			int dungeonDay = StageController.instance.GetDungeonDay();
			PanelModel.instance.CreateDungeonWonPanel(dungeonDay);
			StageController.instance.AddDungeonCompleted();
			return;
		}
		stageBaseGold *= 1.0 + this.GetStatBonus(BonusType.GoldMinion);
		if (Random.value < this.GetStatBonus(BonusType.Gold10xChance)) {
			stageBaseGold *= 10.0;
		}
	}
	stageBaseGold *= 1.0 + this.GetStatBonus(BonusType.GoldOnline);
	int num3 = Random.Range(3, 6);
	if (enemy.IsChest) {
		num3 = 20;
	} else if (enemy.IsBoss) {
		num3 = 12;
	}
	bool flag = false;
	if (stageBaseGold <= 5.0) {
		num3 = (int) Math.Round(stageBaseGold);
		flag = true;
	}
	for (int i = 0; i < num3; i++) {
		if (flag) {
			CoinScript.ShowCoin(1.0, GHConst.DEFAULT_COIN_SPAWN_POS);
		} else {
			double num5 = stageBaseGold / ((double) num3);
			if (num5 < 1.0) {
				num5 = 1.0;
			}
			CoinScript.ShowCoin(num5, GHConst.DEFAULT_COIN_SPAWN_POS);
		}
	}
}

// tap damage -------------------------------------------------------------------------------------------------------

private double GetAttackDamageByLevel(int iLevel) {
	double num = iLevel * Math.Pow((double) ServerVarsModel.tapDamageBase, (double) iLevel);
	double statBonus = PlayerModel.instance.GetStatBonus(BonusType.AllDamage);
	double num3 = PlayerModel.instance.GetStatBonus(BonusType.TapDamagePassive);
	double num4 = PlayerModel.instance.GetStatBonus(BonusType.TapDamageFromDPS) * (HeroesModel.instance.currentAllHeroDPS / (1.0 + PlayerModel.instance.GetStatBonus(BonusType.HeroAttackSpeedActive)));
	double num5 = PlayerModel.instance.GetStatBonus(BonusType.TapDamageActive);
	double artifactDamageBonus = ArtifactModel.instance.ArtifactDamageBonus;
	double num7 = PlayerModel.instance.GetStatBonus(BonusType.TapDamageArtifact);
	double num8 = PlayerModel.instance.GetStatBonus(BonusType.AllDamageCustomization);
	double num9 = ((((((num * (1.0 + statBonus)) + num4) * (1.0 + num3)) * (1.0 + num5)) * (1.0 + artifactDamageBonus)) * (1.0 + num7)) * (1.0 + num8);
	if (num9 <= 1.0) {
		num9 = 1.0;
	}
	bool flag = false;
	if (flag && GameModel.isTestMode) {
		Debug.Log("aBaseDMG:" + num);
		Debug.Log("bPassiveAllDmg:" + statBonus);
		Debug.Log("cPassiveTapDmg:" + num3);
		Debug.Log("dTapDmgFromDPS:" + num4);
		Debug.Log("eActiveTapDmgIncrease:" + num5);
		Debug.Log("gArtifactAllDamge:" + artifactDamageBonus);
		Debug.Log("hArtifactTapDamage:" + num7);
		Debug.Log("===tapDamage:" + num9 + "===");
	}
	return num9;
}


// skill cooldown
public int GetEndCDDiamondCost() {
	float num = 0f;
	for (int i = 0x386; i <= 0x38b; i++) {
		ActiveSkillInfo info = (ActiveSkillInfo) this.allSkillInfo[i];
		if (info.coolDownTimer > 0.0) {
			float f = ((float) info.coolDownTimer) / 60f;
			num += Mathf.Log10(f) * ServerVarsModel.skillResetCostMultiplier;
		}
	}
	if (num <= 0f) {
		num = 0f;
	} else if (num < 1f) {
		num = 1f;
	}
	return (int) num;
}

// offline gold ----------------------------------------------------------------------------------------------------------
public double GetOfflineGoldByTime(double seconds, bool addGold = true) {
	double offlineCapInSeconds = seconds;
	if (offlineCapInSeconds > ServerVarsModel.offlineCapInSeconds) {
		offlineCapInSeconds = ServerVarsModel.offlineCapInSeconds;
	}
	double currentAllHeroDPS = (double) HeroesModel.instance.currentAllHeroDPS;
	double stageBaseHP = StageController.instance.GetStageBaseHP((int) StageController.instance.unlockedStage);
	double monsterDeathAnimationTime = ServerVarsModel.monsterDeathAnimationTime;
	double num5 = StageController.instance.GetStageBaseGold((int) StageController.instance.unlockedStage) * (1.0 + PlayerModel.instance.GetStatBonus(BonusType.GoldMinion));
	double num6 = 0.0;
	if (currentAllHeroDPS > 0.0) {
		num6 = (offlineCapInSeconds / ((stageBaseHP / currentAllHeroDPS) + monsterDeathAnimationTime)) * num5;
	}
	double num7 = 0.0;
	double goldAmount = (num6 * (1.0 + num7)) * (1.0 + PlayerModel.instance.GetStatBonus(BonusType.Gold10xChance));
	if (addGold) {
		PlayerModel.instance.AddGold(goldAmount);
	}
	return goldAmount;
}

// fairy gold --------------------------------------------------------------------------------------------------------
public double GetFairyGoldBonus(PowerUpInfo powerUpInfo) {
	if ((powerUpInfo.powerUpID != PowerUpID.FairyGold) && (powerUpInfo.powerUpID != PowerUpID.FairyGoldMonster)) {
		return 0.0;
	}
	double num = ((double) powerUpInfo.magnitude) * StageController.instance.GetStageBaseGold((int) StageController.instance.unlockedStage);
	num *= 1.0 + PlayerModel.instance.GetStatBonus(BonusType.GoldMinion);
	return (num * (1.0 + PlayerModel.instance.GetStatBonus(BonusType.GoldOnline)));
}

// make it rain --------------------------------------------------------------------------------------------------------
public double GetPerkBonusCashAmount() {
	return (ServerVarsModel.bonusCashMonsterCount * StageController.instance.GetStageBaseGold((int) StageController.instance.unlockedStage));
}

// chesterson -----------------------------------------------------------------------------------------------------------
public float GetTreasureSpawnChance() {
	return (ServerVarsModel.treasureBoxChance * (1f + Convert.ToSingle(PlayerModel.instance.GetStatBonus(BonusType.TreasureChance))));
}

// upgrade player cost -------------------------------------------------------------------------------------------
public double GetUpgradeCostByLevel(int iLevel) {
	double num = Math.Min(ServerVarsModel.tapCostSlowDownLevel, ServerVarsModel.initialPlayerCostOffset + iLevel) * Math.Pow((double) ServerVarsModel.playerUpgradeBase, (double) iLevel);
	double a = num * (1.0 + PlayerModel.instance.GetStatBonus(BonusType.AllUpgradeCost));
	return Math.Ceiling(a);
}

// crit multiplier ----------------------------------------------------------------------------------
public void UpdateCriticalDamageMultiplier() {
	this.criticalDamageMultiplier = (ObscuredDouble) ((float) (((ServerVarsModel.criticalDamageBaseMultiplier + PlayerModel.instance.GetStatBonus(BonusType.CritDamagePassive)) * (1.0 + PlayerModel.instance.GetStatBonus(BonusType.CritDamageArtifact))) * (1.0 + PlayerModel.instance.GetStatBonus(BonusType.CritDamageCustomization))));
}

// crit chance ---------------------------------------------------------------------------------------
public void UpdateCriticalChance() {
	this.criticalChance = (ObscuredDouble) (ServerVarsModel.criticalHitChanceBase + ((float) PlayerModel.instance.GetStatBonus(BonusType.CritChance)));
}

// buy artifact ------------------------------------------------------------------------------------------------------------
public bool BuyArtifact() {
	double nextArtifactCost = this.NextArtifactCost;
	if (PlayerModel.instance.relics < nextArtifactCost) {
		Debug.LogError("Not enough relic to buy artifact!");
		return false;
	}
	if (<>f__am$cache9 == null) {
		<>f__am$cache9 = x => x.Key;
	}
	ArtifactID[] tidArray = Enumerable.Select<KeyValuePair<ArtifactID, ArtifactInfo>, ArtifactID>(this.artifactInfos, <>f__am$cache9).ToArray<ArtifactID>();
	ArtifactID[] ownedArtifacts = this.OwnedArtifacts;
	Dictionary<ArtifactID, ArtifactID> dictionary = new Dictionary<ArtifactID, ArtifactID>();
	for (int i = 0; i < tidArray.Length; i++) {
		dictionary[tidArray[i]] = tidArray[i];
	}
	for (int j = 0; j < ownedArtifacts.Length; j++) {
		dictionary.Remove(ownedArtifacts[j]);
	}
	List<ArtifactID> list = new List<ArtifactID>();
	foreach (ArtifactID tid in dictionary.Keys) {
		list.Add(tid);
	}
	if (list.Count <= 0) {
		NotificationModel.instance.ShowText(LocalizationModel.instance.GetLocalizedString("NO_MORE_ARTIFACTS"));
		return false;
	}
	if (this.nextArtifactSeed > 0) {
		Random.seed = this.nextArtifactSeed;
	}
	ArtifactInfo artifactInfo = this.GetArtifactInfo(list[Random.Range(0, list.Count)]);
	this.nextArtifactSeed = Random.Range(1, 0x2710);
	Random.seed = Environment.TickCount;
	PlayerModel.instance.AddRelic(-nextArtifactCost, false);
	this.TrackArtifactRelicsSpent(artifactInfo.artifactID, nextArtifactCost);
	this.artifactLevels[artifactInfo.artifactID] = 1;
	this.AddBonus(artifactInfo.bonusType, artifactInfo.totalBonus);
	this.AddBonus(BonusType.AllDamageArtifact, artifactInfo.totalDamageBonusWithoutBoost);
	TrophyModel.instance.UpdateOwnedArtifactTrophy();
	HUD.instance.ArtifactLWF.gameObject.SetActive(true);
	HUD.instance.ArtifactLWF.PlayAnimation(artifactInfo.artifactID);
	SoundController.instance.PlaySound(SoundEnum.HeroLevelUp, SoundPool.None);
	AnalyticsModel.instance.LogArtifactPurchase(artifactInfo.artifactID, (int) nextArtifactCost);
	if (CloudSaveController.instance.CanSaveToCloud()) {
		CloudSaveController.instance.Save(false, false, false);
	}
	return true;
}

// salvage -------------------------------------------------------------------------------------------------------
public void Salvage(ArtifactID artifactID) {
	if (this.GetArtifactLevel(artifactID) == 0) {
		Debug.LogError("Attempt to salvage an artifact not owned!");
	}
	ArtifactInfo artifactInfo = this.GetArtifactInfo(artifactID);
	int salvageCost = artifactInfo.salvageCost;
	if (!PlayerModel.instance.CheckIfEnoughDiamond(salvageCost, "Salvage." + artifactID)) {
		Debug.LogError("Not enough diamonds to salvage artifact!");
	}
	else {
		PlayerModel.instance.AddDiamond(-salvageCost);
		PlayerModel.instance.AddRelic(this.GetArtifactRelicsSpent(artifactID), true);
		string localizedString = LocalizationModel.instance.GetLocalizedString("SALVAGE_MESSAGE1");
		string iOriginalString = LocalizationModel.instance.GetLocalizedString("SALVAGE_MESSAGE2");
		if (this.GetArtifactRelicsSpent(artifactID) > 1.0) {
			iOriginalString = LocalizationModel.instance.GetLocalizedString("SALVAGE_MESSAGE2s");
		}
		localizedString = GHTool.ReplaceStringInString(localizedString, "[XXX]", artifactInfo.GetArtifactLocalizedName());
		iOriginalString = GHTool.ReplaceStringInString(iOriginalString, "[YYY]", string.Empty + this.GetArtifactRelicsSpent(artifactID));
		NotificationModel.instance.ShowText(localizedString + "\n" + iOriginalString);
		this.artifactRelicsSpent[artifactID] = 0.0;
		this.RemoveBonus(artifactInfo.bonusType, artifactInfo.totalBonus);
		this.RemoveBonus(BonusType.AllDamageArtifact, artifactInfo.totalDamageBonusWithoutBoost);
		this.artifactLevels[artifactID] = 0;
		MenuSystem.instance.artifactPanel.LoadScrollList(true);
		AnalyticsModel.instance.LogSalvageArtifact(artifactID, salvageCost);
		SoundController.instance.PlaySound(SoundEnum.HeroLevelUp, SoundPool.None);
		MenuSystem.instance.RefreshArtifactScrollList();
		if (CloudSaveController.instance.CanSaveToCloud()) {
			CloudSaveController.instance.Save(false, false, false);
		}
	}
}


// salvage cost --------------------------------------------------------------------------------------------------
public int salvageCost {
	double a = (ArtifactModel.instance.NextArtifactCost + this.totalRelicsSpent) * ServerVarsModel.artifactSalvageCostBaseScale;
	return Convert.ToInt32((double) (Math.Pow((double) ServerVarsModel.artifactSalvagePowerBase, Math.Log(a, (double) ServerVarsModel.artifactSalvageLogBase)) + ServerVarsModel.minimumSalvageCost));
}


// get weapon -----------------------------------------
private HeroID GetHeroToWeaponUpgrade() {
	if (this.heroSeed == 0) {
		this.heroSeed = Random.Range(1, 0x7fffffff);
	}
	Random random = new Random((int) this.heroSeed);
	this.heroSeed = random.Next(1, 0x7fffffff);
	return (HeroID) random.Next(1, 0x22);
}

public void LoadServerVarsFromInfoDoc()
{
	secondsToResetGame = this.GetIntVar("secondsToResetGame", 60);
	minVersion = this.GetStringVar("minVersion", "3.0.0");
	needToVerifyIAP = this.GetBoolVar("needToVerifyIAP", true);
	iapRewards[0] = this.GetIntVar("iapRewards1", 180);
	iapRewards[1] = this.GetIntVar("iapRewards2", 500);
	iapRewards[2] = this.GetIntVar("iapRewards3", 0x4b0);
	iapRewards[3] = this.GetIntVar("iapRewards4", 0xc1c);
	iapRewards[4] = this.GetIntVar("iapRewards5", 0x1964);
	iapRewards[5] = this.GetIntVar("iapRewards6", 0x36b0);
	specialIAPRewards[0] = this.GetIntVar("specialIAPRewards1", 750);
	specialIAPRewards[1] = this.GetIntVar("specialIAPRewards2", 0x1f40);
	canShowIAP1 = this.GetBoolVar("canShowIAP1", true);
	reportFailedIAP = this.GetBoolVar("reportFailedIAP", true);
	cheatThresholdTime = TimeSpan.FromMinutes(this.GetDoubleVar("cheatThresholdTime", 9.0)).TotalSeconds;
	cheatThresholdTimeHard = TimeSpan.FromMinutes(this.GetDoubleVar("cheatThresholdTimeHard", 4320.0)).TotalSeconds;
	cheatThresholdCount = this.GetIntVar("cheatThresholdCount", 6);
	maxStage = this.GetIntVar("maxStage", 0xbb8);
	maxDiamonds = this.GetIntVar("maxDiamonds", 0xf4240);
	maxRelics = this.GetDoubleVar("maxRelics", 10000000.0);
	enableTournament = this.GetBoolVar("enableTournament", true);
	firstTimeSyncStageLimit = this.GetIntVar("firstTimeSyncStageLimit", 400);
	firstTimeSyncTimeLimit = this.GetIntVar("firstTimeSyncTimeLimit", 50);
	heroUpgradeBase = this.GetFloatVar("heroUpgradeBase", 1.075f);
	playerUpgradeBase = this.GetFloatVar("playerUpgradeBase", 1.074f);
	levelIneffiency = this.GetFloatVar("levelIneffiency", 0.904f);
	heroInefficiency = this.GetFloatVar("heroInefficiency", 0.019f);
	dMGScaleDown = this.GetFloatVar("dMGScaleDown", 0.1f);
	heroInefficiencySlowDown = this.GetFloatVar("heroInefficiencySlowDown", 15f);
	heroTransformationAdjustment = this.GetFloatVar("heroTransformationAdjustment", 200f);
	tapDamageBase = this.GetFloatVar("tapDamageBase", 1.05f);
	smallBossDieChance = this.GetFloatVar("smallBossDieChance", 0f);
	bigBossDieChance = this.GetFloatVar("bigBossDieChance", 0.4f);
	heroEvolveLevel = this.GetIntVar("heroEvolveLevel", 0x3e9);
	bonusCashMonsterCount = this.GetIntVar("bonusCashMonsterCount", 0x1388);
	powerHoldingHitCount = this.GetIntVar("powerHoldingHitCount", 30);
	doomMinTapCount = this.GetIntVar("doomMinTapCount", 500);
	doomMaxPercentage = this.GetFloatVar("doomMaxPercentage", 2f);
	doomCostMultiplier = this.GetFloatVar("doomCostMultiplier", 2f);
	initialPlayerCostOffset = this.GetIntVar("initialPlayerCostOffset", 3);
	tapCostSlowDownLevel = this.GetIntVar("tapCostSlowDownLevel", 0x19);
	evolveCostMultiplier = this.GetFloatVar("evolveCostMultiplier", 10f);
	activeSkillCostMultiplier = this.GetFloatVar("activeSkillCostMultiplier", 3f);
	passiveSkillCostMultiplier = this.GetFloatVar("passiveSkillCostMultiplier", 5f);
	skillResetCostMultiplier = this.GetFloatVar("skillResetCostMultiplier", 20f);
	unlockPrestigeLevel = this.GetIntVar("unlockPrestigeLevel", 600);
	criticalDamageBaseMultiplier = this.GetFloatVar("criticalDamageBaseMultiplier", 10f);
	criticalHitChanceBase = this.GetFloatVar("criticalHitChanceBase", 0.02f);
	reviveDiamondCostMultiplier = this.GetIntVar("reviveDiamondCostMultiplier", 12);
	maxFriendsTapCount = this.GetIntVar("maxFriendsTapCount", 0x5dc);
	needToReardDrunkenHammer = this.GetBoolVar("needToReardDrunkenHammer", false);
	drunkenHammerNerfDiamondsPerLevel = this.GetIntVar("drunkenHammerNerfDiamondsPerLevel", 30);
	needToShowBannedPanel = this.GetBoolVar("needToShowBannedPanel", true);
	monsterHPBase1 = this.GetFloatVar("monsterHPBase1", 1.57f);
	monsterHPBase2 = this.GetFloatVar("monsterHPBase2", 1.17f);
	monsterHPMultiplier = this.GetFloatVar("monsterHPMultiplier", 18.5f);
	monsterHPLevelOff = this.GetFloatVar("monsterHPLevelOff", 156f);
	monsterGoldMultiplier = this.GetFloatVar("monsterGoldMultiplier", 0.02f);
	monsterGoldSlope = this.GetFloatVar("monsterGoldSlope", 0.00045f);
	noMoreMonsterGoldSlope = this.GetFloatVar("noMoreMonsterGoldSlope", 150f);
	numberOfMonstersInWave = this.GetIntVar("numberOfMonstersInWave", 10);
	bossGoldMultiplier = this.GetFloatVar("bossGoldMultiplier", 1f);
	treasureBoxChance = this.GetFloatVar("treasureBoxChance", 0.02f);
	treasureBoxGoldMultiplier = this.GetFloatVar("treasureBoxGoldMultiplier", 10f);
	stageNumToShowTreasureBox = this.GetIntVar("stageNumToShowTreasureBox", 11);
	themeMultiplierSequence[0] = this.GetFloatVar("themeMultiplierSequence0", 2f);
	themeMultiplierSequence[1] = this.GetFloatVar("themeMultiplierSequence1", 4f);
	themeMultiplierSequence[2] = this.GetFloatVar("themeMultiplierSequence2", 6f);
	themeMultiplierSequence[3] = this.GetFloatVar("themeMultiplierSequence3", 7f);
	themeMultiplierSequence[4] = this.GetFloatVar("themeMultiplierSequence4", 10f);
	maxLeaderboardStage = this.GetIntVar("maxLeaderboardStage", 0xbb8);
	enablePermanentShadowClone = this.GetBoolVar("enablePermanentShadowClone", false);
	minFairySeconds = this.GetIntVar("minFairySeconds", 60);
	maxFairySeconds = this.GetIntVar("maxFairySeconds", 120);
	firstStageToShowFairy = this.GetIntVar("firstStageToShowFairy", 6);
	guardianShieldBaseStage = this.GetIntVar("guardianShieldBaseStage", 100);
	guardianShieldBaseSlope = this.GetFloatVar("guardianShieldBaseSlope", 1f);
	guardianShieldBaseCost = this.GetIntVar("guardianShieldBaseCost", 100);
	RelicFromStageBaseline = this.GetIntVar("RelicFromStageBaseline", 0x4b);
	RelicFromStageDivider = this.GetIntVar("RelicFromStageDivider", 15);
	RelicFromStagePower = this.GetDoubleVar("RelicFromStagePower", 1.7);
	RelicFromHeroLevel = this.GetIntVar("RelicFromHeroLevel", 0x3e8);
	firstStageToShowRelic = this.GetIntVar("firstStageToShowRelic", 80);
	baseEnemyScale = this.GetFloatVar("baseEnemyScale", 6f);
	baseSmallBossScale = this.GetFloatVar("baseSmallBossScale", 8f);
	baseBigBossScale = this.GetFloatVar("baseBigBossScale", 8.8f);
	offlineCapInSeconds = this.GetDoubleVar("offlineCapInSeconds", 345600.0);
	monsterDeathAnimationTime = this.GetFloatVar("monsterDeathAnimationTime", 0.5f);
	artifactCostBase = this.GetFloatVar("artifactCostBase", 1.35f);
	artifactSalvagePowerBase = this.GetFloatVar("artifactSalvagePowerBase", 5f);
	artifactSalvageLogBase = this.GetFloatVar("artifactSalvageLogBase", 10f);
	artifactSalvageCostBaseScale = this.GetFloatVar("artifactSalvageCostBaseScale", 1f);
	minimumSalvageCost = this.GetIntVar("monsterDeathAnimationTime", 0x23);
	charboostAdsChance = this.GetFloatVar("charboostAdsChance", 0.1f);
	unityAdsChance = this.GetFloatVar("unityAdsChance", 0.3f);
	tapjoyAdsChance = this.GetFloatVar("tapjoyAdsChance", 0.1f);
	appLovinAdsChance = this.GetFloatVar("appLovinAdsChance", 0.5f);
	vungleChance = this.GetFloatVar("vungleChance", 0f);
	vungleNoneIncentChance = this.GetFloatVar("vungleNoneIncentChance", 0.05f);
	forceFairyRewardDuration = this.GetFloatVar("forceFairyRewardDuration", 7f);
	chanceToShowIntAds = this.GetFloatVar("chanceToShowIntAds", 0.05f);
	firstStageToShowIntAds = this.GetIntVar("firstStageToShowIntAds", 50);
	firstStageToShowVideoAds = this.GetIntVar("firstStageToShowVideoAds", 30);
	firstStageToShowRateGame = this.GetIntVar("firstStageToShowRateGame", 30);
	gamehiveAdsDiamondAmount = this.GetIntVar("gamehiveAdsDiamondAmount", 0x19);
	kiipChance = this.GetFloatVar("kiipChance", 0f);
	nullRefNeedsToCrashGame = this.GetBoolVar("nullRefNeedsToCrashGame", true);
	autoTapNormal = this.GetIntVar("autoTapNormal", 5);
	autoTapBoss = this.GetIntVar("autoTapBoss", 10);
	mostPopularIAPItem = this.GetIntVar("mostPopularIAPItem", 3);
	bestValueIAPItem = this.GetIntVar("bestValueIAPItem", 5);
	weaponUpgradeBonusDamage = this.GetFloatVar("weaponUpgradeBonusDamage", 0.5f);
	messageID = this.GetStringVar("messageID", string.Empty);
	messageContent = this.GetStringVar("messageContent", string.Empty);
	bonusSaleDiamondAmount = this.GetIntVar("bonusSaleDiamondAmount", 0x3e8);
	bonusSaleWeaponAmount = this.GetIntVar("bonusSaleWeaponAmount", 10);
	hireFriendsPeriodHours = this.GetFloatVar("hireFriendsPeriodHours", 0.25f);
	syncClicksDelaySeconds = this.GetFloatVar("syncClicksDelaySeconds", 900f);
	friendDamageMult = this.GetFloatVar("friendDamageMult", 1f);
	friendDamageBossMult = this.GetFloatVar("friendDamageBossMult", 0.1f);
	friendDamageBossMult = this.GetFloatVar("friendDamageBossMult", 0.1f);
	makeItRainPartyMult = this.GetFloatVar("makeItRainPartyMult", 0.1f);
	socketIOServerUrl = this.GetStringVar("socketIOServerUrl", "http://107.22.185.22/socket.io/");
	multiplayerTimeoutDuration = this.GetFloatVar("multiplayerTimeoutDuration", 55f);
	needToHideMultiplayerButton = this.GetBoolVar("needToHideMultiplayerButton", false);
	maxMultiplayerFriends = this.GetIntVar("maxMultiplayerFriends", 50);
	enableChinaTransfer = this.GetBoolVar("enableChinaTransfer", false);
}


