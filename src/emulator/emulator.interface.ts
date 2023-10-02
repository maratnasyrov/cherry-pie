export type CreateInput = {
  emulatorsCount: number;
  currency: string;
  game: string;
  balance: number;
};

export type InitializeInput = {
  game: string;
  playerId: string;
  balance: number;
  currency: string;
};

export type GameEmulationInput = {
  id: string;
  betIterations: number;
};

export type GameEmulationReturn = {
  id: string;
  iteration: number;
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

export interface EmulatorSettings {
  gamble?: SettingsGambleSelect | SettingsGambleRandom | null;
  bet: SettingsBetSelect | SettingsBetRandom;
}

export interface Emulator {
  id: string;
  game: string;
  token: string;
  clientId: string;

  settings: EmulatorSettings;
}
