
import standardFs from 'fs'
import chalk from 'chalk';
import { input } from '@inquirer/prompts';
import { checkbox, confirm } from '@inquirer/prompts';

export const retrieveMangaDirectory = async (): Promise<string> => {
  try {
    let exists = false
    let answer = ''

    while (!exists) {
      answer = await input({ message: 'Insert the full path of the manga directory:' });
      exists = standardFs.existsSync(answer)
      if (!exists) {
        console.log(chalk.red('Directory not found, please insert the correct path.\n'))
      } else {
        // If exists but is empty
        if (standardFs.readdirSync(answer).length === 0) {
          console.log(chalk.red('Directory is empty, please insert a valid path.\n'))
          exists = false
        }
      }
    }

    return answer

  } catch (err) {
    console.error(chalk.red('Error while retrieving the manga directory:'), err);
    return ''
  }
}


export const askForMangaToParse = async (mangaList: string[]): Promise<string[]> => {
  try {
    let answer: string[] = []
    let confirmation = false

    do {
      answer = await checkbox({
        message: 'Select the manga you want to parse:',
        choices: [
          ...mangaList.map((manga) => {
            return {
              name: manga,
              value: manga
            }
          }),
          {
            name: 'All',
            value: 'All'
          }
        ]
      });

      if (answer.includes('All')) answer = mangaList

      confirmation = await confirm({ message: 'This is your manga list:\n' + answer.join('\n') + '\n\nDo you want to continue? (y/n)', default: false });
    } while (!confirmation);

    return answer

  } catch (err) {
    console.error(chalk.red('Error while asking for manga to parse:'), err);
    return [];
  }
}
