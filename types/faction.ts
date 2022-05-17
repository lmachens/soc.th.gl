export interface Commander {
  id: number;
  faction: number;
  class: number;
  race: number;
  selectableInTheLevelEditor: number;
  usageType: number;
  cost: Cost;
  stats: Stats;
  skillPool: number;
  skills: Skill[];
  specializations: Specialization[];
  battleOnlyStats: BattleOnlyStats;
  battleOnlySkills: BattleOnlySkill[];
  units: Unit[];
  actionProviders: ActionProvider[];
  portrait: Portrait;
  portraitPivotOffset: PortraitPivotOffset;
  icon: Icon2;
  fullBodySketch: any;
  prefab: any;
  spawnEffect: number;
  deathEffect: number;
  type: string;
}

export interface Cost {
  costEntries: CostEntry[];
}

export interface CostEntry {
  type: number;
  amount: number;
}

export interface Stats {
  spellsPerRound: number;
  experience: number;
  defense: number;
  offense: number;
  movement: number;
  viewRadius: number;
  xpMultiplier: number;
  essenceLeech: number;
  diplomacyBonus: number;
  tutorPercent: number;
  essenceStats: EssenceStats;
  command: number;
  statuses: number;
  spellDamagePowerPercent: number;
  pillageBonusPercent: number;
  woodcutterRadius: number;
  townPortalLevel: number;
  customValues: any[];
}

export interface EssenceStats {
  order: number;
  creation: number;
  chaos: number;
  arcana: number;
  destruction: number;
}

export interface Skill {
  skill: number;
  level: number;
}

export interface Specialization {
  bacteriaType: number;
  duration: Duration;
}

export interface Duration {
  type: number;
  duration: number;
}

export interface BattleOnlyStats {
  spellsPerRound: number;
  experience: number;
  defense: number;
  offense: number;
  movement: number;
  viewRadius: number;
  xpMultiplier: number;
  essenceLeech: number;
  diplomacyBonus: number;
  tutorPercent: number;
  essenceStats: EssenceStats2;
  command: number;
  statuses: any;
  spellDamagePowerPercent: number;
  pillageBonusPercent: number;
  woodcutterRadius: number;
  townPortalLevel: number;
  customValues: any[];
}

export interface EssenceStats2 {
  order: number;
  creation: number;
  chaos: number;
  arcana: number;
  destruction: number;
}

export interface BattleOnlySkill {
  skill: number;
  level: number;
}

export interface Unit {
  factionIndex: number;
  unitIndex: number;
  size: number;
  upgradeType: number;
}

export interface ActionProvider {
  allowedForStates: number;
  actionSettings: ActionSetting[];
}

export interface ActionSetting {
  actionType: number;
  icon: Icon;
  soundKey?: string;
  actionHudPosition: number;
  highlightEvent: number;
  isToggleButton: number;
  contentProfile: number;
  requiresConfirmation: number;
  confirmHeaderKey?: string;
  confirmDescriptionKey?: string;
  allowedWhenPillaged: number;
}

export interface Icon {
  fileId: number;
  guid: string;
  type: number;
}

export interface Portrait {
  name: string;
  spriteSheet: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PortraitPivotOffset {
  x: number;
  y: number;
}

export interface Icon2 {
  name: string;
  spriteSheet: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Unit2 {
  vanilla: Vanilla;
  upgraded: Upgraded;
  superUpgraded: SuperUpgraded;
}

export interface Vanilla {
  fileId: number;
  guid: string;
  type: number;
}

export interface Upgraded {
  fileId: number;
  guid?: string;
  type?: number;
}

export interface SuperUpgraded {
  fileId: number;
}

export interface BallistaReference {
  factionIndex: number;
  unitIndex: number;
  size: number;
  upgradeType: number;
}

export interface AiScheme {
  entries: Entry[];
}

export interface Entry {
  phase: number;
  planSuggestions: PlanSuggestion[];
}

export interface PlanSuggestion {
  fileId: number;
  guid: string;
  type: number;
}

export interface BannerSprite {
  name: string;
  spriteSheet: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SymbolSprite {
  name: string;
  spriteSheet: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
