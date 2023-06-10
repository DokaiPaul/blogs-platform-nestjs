export type ActiveSessionModel = {
  ip: string;
  title: string;
  lastActivateDate: string;
  deviceId: string;
  userId: string;
  tokenExpirationDate?: string;
};
