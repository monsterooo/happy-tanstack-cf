import handler from "@tanstack/react-start/server-entry";
import { sendMail } from "./functions/send-mail";

export default {
	fetch(request: Request) {
		return handler.fetch(request);
	},
	async scheduled(
		event: ScheduledEvent,
		env: Env,
		_ctx: ExecutionContext,
	): Promise<void> {
		console.log("event", event.cron);
		if (event.cron === "0 10 * * *") {
			console.log("开始发送电子邮件");
			await sendMail("example.com@gmail.com");
		}
	},
};
