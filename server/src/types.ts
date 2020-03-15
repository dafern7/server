export interface BatteryData {
    deviceId?: number,
    deviceName?: number,
    powerIn: number,
    powerOut: number,
    voltage: number,
    current: number,
    marketPrice: number,
    SOC: number
}

export interface DataFeedToken {
    deviceId: number,
    passwordHash: string,
    createdAt: string,
    updatedAt: string,
    iat: number
  };

  export interface AuthToken {
    deviceName?: string,
    deviceId?: string,
    passwordHash: string,
    createdAt: string,
    updatedAt: string,
    iat: number
  };