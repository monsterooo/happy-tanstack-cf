const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function sendMail() {
	// TODO: 模拟发送电子邮件
	await sleep(1000);
	console.log("电子邮件已发送");
}
