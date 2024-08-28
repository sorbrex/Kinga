import chalk from "chalk"

export class Logger {

  static info(message: string) {
    console.info(chalk.blue(message))
  }

  static error(message: string) {
    console.error(chalk.red(message))
  }

  static success(message: string) {
    console.log(chalk.green(message))
  }

  static warning(message: string) {
    console.warn(chalk.yellow(message))
  }

  static debug(message: string) {
    console.debug(chalk.magenta(message))
  }

  static print(message: string) {
    console.log(message)
  }

  static clear() {
    console.clear()
  }

}
