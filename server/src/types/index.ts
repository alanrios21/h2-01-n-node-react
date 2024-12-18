export enum USER_ROLE {
  USER = 'User',
  PREMIUM = 'Premium',
  ADMIN = 'Admin',
}

export enum USER_RANK {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
}

export enum PREDICTION_STATUS {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
}

export interface NotificationToSave {
  userId: number;
  message: string;
  fixtureId?: number;
  predictionId?: number;
  aggregatePredictionId?: number;
}
