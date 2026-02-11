// This helper prints selected environment variables.
// Do not call dotenv.config() here — dotenv is loaded centrally in app.js.
console.log('Loaded environment variables (from process.env):');
console.log({
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS ? '***' : undefined,
  FROM_EMAIL: process.env.FROM_EMAIL
});
