import { api } from './client';

export type LogData = {
  id: string;
  userId: string;
  date: string;
  mood?: number;
  anxiety?: number;
  sleepHours?: number;
  sleepQuality?: number;
  activityType?: string;
  activityMins?: number;
  socialCount?: number;
  stress?: number;
  symptoms?: string;
  notes?: string;
  createdAt: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    pictureUrl?: string;
    googleSub: string;
    createdAt: string;
  };
};

export async function getLogs(): Promise<LogData[]> {
  const { data } = await api.get('/logs');
  return data;
}

export async function createLog(payload: Partial<LogData>) {
  const { data } = await api.post('/logs', payload);
  return data as LogData;
}

export type CheckTodaysLogResponse = {
  hasLog: boolean;
  log?: LogData;
};

export async function checkTodaysLog(date: string): Promise<CheckTodaysLogResponse> {
  const { data } = await api.get(`/logs/today?date=${date}`);
  return data as CheckTodaysLogResponse;
}
