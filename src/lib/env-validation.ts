type EnvVar = {
  name: string;
  description: string;
};

const REQUIRED_SERVER_VARS: EnvVar[] = [
  { name: "DATABASE_URL", description: "PostgreSQL connection string" },
  { name: "PAYU_KEY", description: "PayU merchant key for payments" },
  { name: "PAYU_SALT", description: "PayU salt for hash generation" },
  { name: "TWO_FACTOR_API_KEY", description: "2Factor.in API key for OTP" },
];

const REQUIRED_PUBLIC_VARS: EnvVar[] = [];

export function validateEnv(): void {
  const missing: string[] = [];

  for (const v of REQUIRED_SERVER_VARS) {
    if (!process.env[v.name]) {
      missing.push(`${v.name} (${v.description})`);
    }
  }

  if (missing.length > 0) {
    const envFile = process.env.NODE_ENV === "development" ? ".env.local" : "Vercel environment variables";
    throw new Error(
      `\n❌ Missing required environment variables:\n${missing.map((v) => `   - ${v}`).join("\n")}\n\nAdd these to your ${envFile} file before starting the server.\n`
    );
  }
}

// Run validation on module load
validateEnv();

export type { EnvVar };