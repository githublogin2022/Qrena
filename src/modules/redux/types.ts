import store from './store';

export type Platform = 'Ios' | 'Android';
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export interface ApiError {
  name: string;
  message: string;
  response?: {
    data?: {
      message: string;
      statusCode: string;
    };
  };
}
