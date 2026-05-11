import { env } from "@happy-tanstack-cf/env/server";

export async function sendMail(to: string) {
	await env.EMAIL.send({
		to,
		from: "noreply@example.com",
		subject: "测试邮件",
		html: "<h1>测试邮件内容</h1>",
	});
}
