import alchemy from "alchemy";
import {
	D1Database,
	EmailSender,
	Queue,
	TanStackStart,
} from "alchemy/cloudflare";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const stage = process.env.STAGE ?? "dev";
const app = await alchemy("happy-tanstack-cf", {
	stage,
	stateStore:
		stage !== "dev"
			? (scope) =>
					new CloudflareStateStore(scope, {
						scriptName: `launly-app-state-${stage}`,
					})
			: undefined,
});
const queueName = `example-queue-${stage}`;

// 处理消息队列配置;
const exampleQueue = await Queue(queueName, {
	name: queueName,
});
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
		EXAMPLE_QUEUE: exampleQueue,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
		BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
		BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
	},
	crons: ["0 10 * * *"],
	eventSources: [
		{
			name: queueName,
			queue: exampleQueue,
			settings: {
				batchSize: 4,
				maxConcurrency: 3,
				maxRetries: 5,
				maxWaitTimeMs: 2000,
				retryDelay: 30,
			},
		},
	],
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
