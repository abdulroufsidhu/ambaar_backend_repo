import chalk from "chalk";

export class Logger {
	static s = (TAG: string, msg: any) =>
		console.log(
			chalk.greenBright(`s\t[${new Date().toTimeString()}]\t${TAG}: `),
			typeof msg === "string" ? chalk.greenBright(msg) : msg
		);
	static d = (TAG: string, ...params: any[]) =>
		console.debug(
			chalk.whiteBright(`d\t[${new Date().toTimeString()}]\t${TAG}: `),
			...params.map((p) => (typeof p === "string" ? chalk.whiteBright(p) : p))
		);
	static i = (TAG: string, ...params: any[]) =>
		console.info(
			chalk.cyanBright(`i\t[${new Date().toTimeString()}]\t${TAG}: `),
			...params.map((p) => (typeof p === "string" ? chalk.cyanBright(p) : p))
		);
	static w = (TAG: string, ...params: any[]) =>
		console.warn(
			chalk.yellowBright(`w\t[${new Date().toTimeString()}]\t${TAG}: `),
			...params.map(p=>typeof p === "string" ? chalk.yellowBright(p): p)
		);
	static e = (TAG: string, ...params: any[]) =>
		console.error(
			chalk.redBright(`e\t[${new Date().toTimeString()}]\t${TAG}: `),
			...params.map((p) => (typeof p === "string" ? chalk.redBright(p) : p))
		);
}
