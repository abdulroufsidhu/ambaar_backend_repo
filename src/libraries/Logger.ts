import chalk from "chalk";

export class Logger {
  static s = (TAG: string, msg: any) =>
    console.log(
      chalk.greenBright(
        `d\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.greenBright(msg)
      )
    );
  static d = (TAG: string, msg: any) =>
    console.log(
      chalk.whiteBright(
        `d\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.whiteBright(msg)
      )
    );
  static i = (TAG: string, msg: any) =>
    console.log(
      chalk.cyanBright(
        `d\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.cyanBright(msg)
      )
    );
  static w = (TAG: string, msg: any) =>
    console.log(
      chalk.yellowBright(
        `d\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.yellowBright(msg)
      )
    );
  static e = (TAG: string, msg: any) =>
    console.log(
      chalk.redBright(
        `d\t[${new Date().toTimeString()}]\t${TAG}: `,
        chalk.redBright(msg)
      )
    );
}
