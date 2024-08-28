import path from 'path';
import extraFs from 'fs-extra';
import standardFs from 'fs'
import fs from 'fs/promises';
import figlet from 'figlet';
import chalk from 'chalk';
import ora from 'ora';
import { Logger } from './src/Logger';
import { Extractor } from './src/Extractor';
import { Sorter } from './src/Sorter';
import { askForMangaToParse, retrieveMangaDirectory } from './src/UserInteraction';

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
      const singleMangaPath = path.join(MANGA_DIR, manga)

      const chaptersList = (await fs.readdir(singleMangaPath))

      if (!chaptersList || chaptersList.length === 0) {
        Logger.error('No chapters found. Skipping...')
        continue
      }


      // Retrieve the Folder Name and if there is an extension.
      const folderName = chaptersList[0].split(' ')[0]
      const hasExtension = chaptersList[0].includes('.') && chaptersList[0].split('.').length > 1 && !parseFloat(chaptersList[0].split('.').pop() || '') // Even if chapter number is 123.1.cbz it will return .cbz
      const extension = hasExtension ? '.' + chaptersList[0].split('.').pop() : undefined
      const outputPath = path.join(MANGA_DIR, manga, manga)
      let chapters: string[]

      try {
        chapters = await Sorter.getOrderedChapters({
          dirPath: singleMangaPath,
          name: folderName,
          extension: extension
        })
      } catch (err) {
        Logger.error(`Error while getting the ordered chapters: ${err}`);
        spinner.fail(`Error while getting the ordered chapters: ${err}`)
        throw err;
      }

      if (!chapters || chapters.length === 0) {
        Logger.error('Unable to parse. Skipping...')
        spinner.fail(`Unable to parse. Skipping...`)
        continue
      }

      Logger.info(`${manga} has ${chapters.length} chapters`)

      if (extraFs.pathExistsSync(outputPath)) {
        extraFs.rmSync(outputPath, { recursive: true, force: true });
      }

      extraFs.mkdirSync(outputPath)

      if (extension) { // If there is an extension it will likely be an archive like .cbz
        await Extractor.extractAndRewriteChapters({
          basePath: singleMangaPath,
          chaptersList: chapters,
          outputPath: outputPath
        })
      } else {
        await Extractor.rewriteChapters({
          basePath: singleMangaPath,
          chaptersList: chapters,
          outputPath: outputPath
        })
      }

      spinner.succeed(`${manga} parsed!`)

      extraFs.createFileSync(path.join(singleMangaPath, '.parsed'))
    }

  } catch (err) {
    Logger.error(`Errore durante il processo principale: ${err}`);
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