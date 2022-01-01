export type Log = {
  _id?: string;
  description: string;
  message: string;
  code: string;
  type: number;
  identifier: string;
  callstack: string[];
  deviceInfo: DeviceInfo;
  timestamp?: number;
}

export type DeviceInfo = {
  browser: string;
  os: string;
  device: string;
  userAgent: string;
  os_version: string;
}
