# Kinga

📖 **Kinga** is a CLI tool that processes manga scan directories, merges chapters into a single volume, and prepares them for Kindle Comic Converter. It simplifies the organization of manga scans into a format optimized for Kindle devices.

## Features

- 📂 **Batch Manga Processing** – Convert multiple manga at once.
- 🔍 **Automatic Directory Scanning** – Detects manga directories and chapters.
- 🖼️ **Image Renaming & Ordering** – Ensures correct page sequencing.
- 📚 **Kindle Ready Output** – Compatible with Kindle Comic Converter (KCC).
- 🚀 **Simple CLI Workflow** – Interactive prompts for easy selection.

## Installation

Ensure you have **Node.js (>=18)** installed, then clone the repository:

```sh
git clone https://github.com/sorbrex/Kinga.git
cd Kinga
npm install
```

## Usage

### Running the Tool

To start Kinga, run:

```sh
npm run index.ts
```

### Workflow

1. **Select Base Directory** – Choose a folder containing manga directories.
2. **Manga Detection** – The tool identifies available manga and their chapters.
3. **User Selection** – Pick one, multiple, or all detected manga.
4. **Processing** – Images are sequentially renamed and stored in a new directory.
5. **Kindle Comic Converter (KCC) Preparation** – The output can be converted to EPUB/MOBI using [Kindle Comic Converter](https://kcc.iosphe.re/).

## Example Directory Structure

```
📂 MangaLibrary
 ┣ 📂 OnePiece
 ┃ ┣ 📂 Chapter_001
 ┃ ┃ ┣ 🖼️ 01.jpg
 ┃ ┃ ┣ 🖼️ 02.jpg
 ┃ ┗ 📜 chapter1.zip
 ┣ 📂 AttackOnTitan
 ┃ ┣ 📂 Chapter_001
 ┃ ┣ 📂 Chapter_002
 ┃ ┗ 📜 chapter2.rar
```

After processing, output will be:

```
📂 KingaOutput
 ┣ 📂 OnePiece
 ┃ ┣ 🖼️ 0001.jpg
 ┃ ┣ 🖼️ 0002.jpg
 ┃ ┣ ...
 ┃ ┗ 🖼️ 0500.jpg
```

## Converting with KCC

Once processing is complete, import the `KingaOutput` directory into [Kindle Comic Converter (KCC)](https://kcc.iosphe.re/) to generate Kindle-compatible files.

## TODO
- [ ] NPM Package for global usage
- [ ] UI (Electron or Tauri)
- [ ] Parallel Parsing
- [ ] Implementation of some API to check the Manga-Chapter correct count to make the right Volumes Numbers

## License

📜 MIT License - Free to use and modify.
