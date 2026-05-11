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
		} else if (event.cron === "0 20 * * *") {
			// 创建队列任务
			await env.EXAMPLE_QUEUE.send({ id: 123 });
		}
	},
	async queue(batch: MessageBatch<{ id: string }>, _env: Env): Promise<void> {
		batch.messages.map(async (msg) => {
			console.log("执行一些异步处理任务", msg.body.id);
			msg.ack(); // 告诉队列执行完成
		});
	},
};
