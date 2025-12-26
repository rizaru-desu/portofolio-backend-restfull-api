import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

const plugins = [
  username({
    displayUsernameNormalization: (displayUsername) =>
      displayUsername.toLowerCase(),
    displayUsernameValidator: (displayUsername) => {
      // Allow only alphanumeric characters, underscores, and hyphens
      return /^[a-zA-Z0-9_-]+$/.test(displayUsername);
    },
    maxUsernameLength: 100,
    minUsernameLength: 5,
  }),
];

export const auth = betterAuth({
  database: drizzleAdapter(
    {},
    {
      provider: 'pg',
    },
  ),
  plugins,
});

export const authentication = (database: NodePgDatabase) =>
  betterAuth({
    database: drizzleAdapter(database, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url, token }, request) => {},
      onPasswordReset: async ({ user }, request) => {},
    },
    advanced: {
      cookiePrefix: 'my-project-app',
      useSecureCookies: false,
    },
    plugins,
  });
