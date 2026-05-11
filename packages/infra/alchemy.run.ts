import alchemy from "alchemy";
import { D1Database, EmailSender, TanStackStart } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const app = await alchemy("happy-tanstack-cf");

const db = await D1Database("database", {
	migrationsDir: "../../packages/db/src/migrations",
});

// 发送邮件配置
const emailSendConfig = EmailSender({
	allowedSenderAddresses: ["noreply@launly.com"],
	// dev: { remote: true }, // 如果你想在开发环境发送真实的邮件请打开它
});

export const web = await TanStackStart("web", {
	cwd: "../../apps/web",
	bindings: {
		DB: db,
		EMAIL: emailSendConfig,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
		BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
		BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
	},
	crons: ["* * * * *"], //["0 10 * * *"],
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
