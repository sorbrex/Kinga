import fs from 'fs/promises';
import unzipper from 'unzipper';
import path from 'path';
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

// Funzione per ottenere e ordinare i file .cbz
export const getOrderedFiles = async (dirPath: string, extension?: string): Promise<string[]> => {
  try {
    const files: string[] = await fs.readdir(dirPath);

    // Filtra e ordina i file .cbz numericamente
    return files
      .filter(file => extension ? file.endsWith(extension) : !file.includes('.'))
      .sort((a, b) => sortByName(a, b, extension));
  } catch (err) {
    console.error('Errore nella lettura della directory:', err);
    throw err;
  }
};

// Sort Function
export const sortByName = (a: string, b: string, extension?: string) => {
  const numA: number = extension ? parseInt(a.replace('Capitolo ', '').replace(extension, '')) : parseInt(a.replace('Capitolo ', ''));
  const numB: number = extension ? parseInt(b.replace('Capitolo ', '').replace(extension, '')) : parseInt(a.replace('Capitolo ', ''));
  return numA - numB;
}


// Funzione per estrarre e leggere il contenuto di un file .cbz
export const extractAndReadCbzFile = async (filePath: string): Promise<void> => {
  try {
    console.log(`Estrazione del file: ${filePath}`);
    const directory = await unzipper.Open.file(filePath);

    for (const file of directory.files) {
      if (file.type === 'File') {
        const fileName = file.path;
        const size = file.uncompressedSize;
        console.log(`Contenuto di ${path.basename(filePath)}:`, fileName, `(${size} bytes)`);
      }
    }
  } catch (err) {
    console.error('Errore durante l\'estrazione:', err);
  }
};
