import { authentication } from './auth';

export const BETTER_AUTH_CLIENT = 'BETTER_AUTH_CLIENT';

// Magic di sini: Kita ambil tipe return dari fungsi betterAuth
export type BetterAuthInstance = ReturnType<typeof authentication>;
