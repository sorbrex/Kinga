import path from 'path';
import standardFs from 'fs'
import fs from 'fs/promises';
import figlet from 'figlet';
import chalk from 'chalk';
import ora from 'ora';
import { askForMangaToParse, extractAndReadCbzFile, getOrderedFiles, retrieveMangaDirectory } from './src/Utils';
import { Logger } from './src/Logger';

// Funzione principale per gestire il processo
const Kinga = async () => {

  const spinner = ora()

  const MANGA_DIR: string = await retrieveMangaDirectory();

  try {

    spinner.start('Scanning the manga directory...');

    const mangaList = (await fs.readdir(MANGA_DIR)).filter((manga) => {
      return !standardFs.readdirSync(path.join(MANGA_DIR, manga)).includes('.parsed')
    })

    spinner.stop()


    const listOfMangaToParse = await askForMangaToParse(mangaList);

    for (const manga of listOfMangaToParse) {
      spinner.start(`Parsing ${manga}...`)

      const chaptersList = (await fs.readdir(path.join(MANGA_DIR, manga)))

      if (!chaptersList || chaptersList.length === 0) {
        Logger.error('No chapters found. Skipping...')
        continue
      }


      // Retrieve the Folder Name and if there is an extension.
      const folderName = chaptersList[0].split(' ')[0]
      const extension = chaptersList[0].split('.').pop() //Can be the full name if no extension

      Logger.debug(`Folder Name: ${folderName}`)
      Logger.debug(`Extension: ${extension}\n\n`)

      spinner.succeed(`Parsing ${manga}...`)
    }
    // const cbzFiles: string[] = await getOrderedFiles(CHAPTERS_DIR, ".cbz");
    // console.log('File .cbz ordinati:', cbzFiles);

    // for (const file of cbzFiles) {
    //   const filePath: string = path.join(CHAPTERS_DIR, file);
    //   await extractAndReadCbzFile(filePath);
    // }
  } catch (err) {
    console.error('Errore durante il processo principale:', err);
  }
};

// Esecuzione della funzione principale

const main = async () => {

  console.log(
    chalk.green(chalk.bold(
      figlet.textSync("Kinga", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    )))

  await Kinga();

}
main();