export type InitializeInput = {
  game: string;
  playerId: string;
  balance: number;
  currency: string;
};

type SettingsGambleBase<
  TType extends 'select' | 'random',
  TSettings extends Record<string, unknown>,
> = { type: TType; count: number } & TSettings;
type SettingsGambleSelect = SettingsGambleBase<'select', { gambleId: string }>;
type SettingsGambleRandom = SettingsGambleBase<'random', {}>;

type SettingsBetBase<
  TType extends 'select' | 'random',
  TSettings extends Record<string, unknown>,
> = { type: TType } & TSettings;
type SettingsBetSelect = SettingsBetBase<'select', { value: number }>;
type SettingsBetRandom = SettingsBetBase<'random', { range: Array<number> }>;

export type GameEmulationSettings = {
  gamble?: SettingsGambleSelect | SettingsGambleRandom | null;
  bet: SettingsBetSelect | SettingsBetRandom;
};

export type GameEmulationInput = {
  id: string;
  game: string;
  token: string;
  clientId: string;
  betCount: number;

  settings: GameEmulationSettings;
};
