// types

export type AlertStyleKeys = 'info' | 'success' | 'failure';

export type AlertType = {
  status: boolean;
  type: AlertStyleKeys | null;
  message: string;
};

export type Player = {
  playerName: string;
  playerAddress: string;
  playerMana: number;
  playerHealth: number;
  inBattle: boolean;
  attack?: number;
  defense?: number;
};

export type Battle = {
  battleStatus: number;
  name: string;
  players: Player[];
  winner: string;

  battleHash: string;
};

export type Battles = Battle[];

export type GameData = {
  players: Player[];
  pendingBattles: Battle[];
  activeBattle: Battle;
};

export type ErrorMessage = {
  reason: string;
  from: string;
  to: string;
  check: string;
  data: string;
  methhod: string;
};

export type Choice = 1 | 2;
