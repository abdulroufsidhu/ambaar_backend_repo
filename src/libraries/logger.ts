import chalk from "chalk";

export class Logger {
  static s = (TAG: string, msg: any) =>
    console.log(
      chalk.greenBright(
        `s\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.greenBright(msg)
      )
    );
  static d = (TAG: string, msg: any) =>
    console.debug(
      chalk.whiteBright(
        `d\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.whiteBright(msg)
      )
    );
  static i = (TAG: string, msg: any) =>
    console.info(
      chalk.cyanBright(
        `i\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.cyanBright(msg)
      )
    );
  static w = (TAG: string, msg: any) =>
    console.warn(
      chalk.yellowBright(
        `w\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.yellowBright(msg)
      )
    );
  static e = (TAG: string, msg: any) =>
    console.error(
      chalk.redBright(
        `e\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.redBright(msg)
      )
    );
}
