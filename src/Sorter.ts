import fs from 'fs/promises';
import { Logger } from './Logger';
import type { File } from 'unzipper';

export class Sorter {
  public static async getOrderedChapters(args: { dirPath: string, name: string, extension?: string }): Promise<string[]> {
    try {
      const { dirPath, name, extension } = args;
      const files: string[] = await fs.readdir(dirPath);

      return files
        .filter(file => extension ? file.endsWith(extension) : file.startsWith(`${name} `))
        .sort((a, b) => this.sortChapters(a, b, name, extension));
    } catch (err) {
      Logger.error(`Error while getting the ordered chapters: ${err}`);
      throw err;
    }
  };

  private static sortChapters(a: string, b: string, name: string, extension?: string) {
    const normalizedA = parseFloat(extension ? a.replace(`${name} `, '').replace(extension, '') : a.replace(`${name} `, ''));
    const normalizedB = parseFloat(extension ? b.replace(`${name} `, '').replace(extension, '') : b.replace(`${name} `, ''));
    return normalizedA - normalizedB;
  }

  public static async getOrderedScans(fileList: Array<File>) {
    if (!fileList || fileList.length === 0) {
      return [];
    }

    return fileList.sort((a, b) => this.sortScans(a, b));
  }

  private static sortScans(a: File, b: File) {
    const normalizedA = parseFloat(a.path.split('.')[0]);
    const normalizedB = parseFloat(b.path.split('.')[0]);
    return normalizedA - normalizedB;
  }
}