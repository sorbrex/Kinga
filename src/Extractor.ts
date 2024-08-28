import unzipper from 'unzipper';
import path from 'path';
import extraFs from 'fs-extra';
import { Logger } from './Logger';
import { Sorter } from './Sorter';

export class Extractor {

  // Funzione per estrarre e leggere il contenuto di un file .cbz
  public static async extractAndRewriteChapters(args: { basePath: string, chaptersList: string[], outputPath: string }): Promise<void> {

    const { basePath, chaptersList, outputPath } = args;

    let pageCount = 0;

    for (const chapterArchive of chaptersList) {
      try {

        const scanList = (await unzipper.Open.file(path.join(basePath, chapterArchive))).files.filter(file => file.type === 'File' && !file.path.startsWith('.'));
        const orderedScans = await Sorter.getOrderedScans(scanList);

        for (const singlePageScan of orderedScans) {
          const buffer = await singlePageScan.buffer();

          extraFs.writeFileSync(
            path.join(
              outputPath,
              "page_" + pageCount.toString().padStart(6, "0") + ".jpg"
            ),
            buffer
          );

          pageCount++;
        }
      } catch (err) {
        Logger.error(`Error while extracting ${chapterArchive}: ${err}`);
        throw err;
      }
    }
  };


  public static async rewriteChapters(args: { basePath: string, chaptersList: string[], outputPath: string }): Promise<void> {

    const { basePath, chaptersList, outputPath } = args;
    let pageCount = 0;

    for (const chapterDirectory of chaptersList) {
      try {

        const scanList = extraFs.readdirSync(path.join(basePath, chapterDirectory)).filter(file => !file.startsWith('.'));

        for (const scan of scanList) {
          const fileBuffer = extraFs.readFileSync(
            path.join(basePath, chapterDirectory, scan)
          );

          extraFs.writeFileSync(
            path.join(
              outputPath,
              "page_" + pageCount.toString().padStart(6, "0") + ".jpg"
            ),
            fileBuffer
          );

          pageCount++;
        }

      } catch (err) {
        Logger.error(`Error while extracting ${chapterDirectory}: ${err}`);
        throw err;
      }
    }
  }

}