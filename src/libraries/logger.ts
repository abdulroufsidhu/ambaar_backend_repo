import chalk from "chalk";

export class Logger {
  static s = (TAG: string, msg: any) =>
    console.log(
      chalk.greenBright(
        `s\t[${new Date().toTimeString()}]\t${TAG}: `,
        typeof msg === "string" ? chalk.greenBright(msg) : msg
      )
    );
  static d = (TAG: string, msg: any) =>
    console.debug(
      chalk.whiteBright(
        `d\t[${new Date().toTimeString()}]\t${TAG}: `,
        typeof msg === "string" ? chalk.whiteBright(msg) : msg
      )
    );
  static i = (TAG: string, msg: any) =>
    console.info(
      chalk.cyanBright(
        `i\t[${new Date().toTimeString()}]\t${TAG}: `,
        typeof msg === "string" ? chalk.cyanBright(msg) : msg
      )
    );
  static w = (TAG: string, msg: any) =>
    console.warn(
      chalk.yellowBright(
        `w\t[${new Date().toTimeString()}]\t${TAG}: `,
        typeof msg === "string" ? chalk.yellowBright(msg) : msg
      )
    );
  static e = (TAG: string, msg: any) =>
    console.error(
      chalk.redBright(
        `e\t[${new Date().toTimeString()}]\t${TAG}: `,
        typeof msg === "string" ? chalk.redBright(msg) : msg
      )
    );
}
