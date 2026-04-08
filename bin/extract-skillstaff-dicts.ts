import * as XLSX from 'xlsx';
import { writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { Command } from 'commander';

const program = new Command();

program
  .name('extract-skillstaff-dicts')
  .description('Extracts each sheet of a SkillStaff XLSX file into separate CSV files')
  .argument('<input>', 'path to the input .xlsx file')
  .option('-o, --output-dir <path>', 'directory to save CSV files', './dicts')
  .action(async (inputPath, options) => {
    await extractSheetsToCsv(inputPath, options.outputDir);
  });

program.parse();

async function extractSheetsToCsv(inputPath: string, outputDir: string) {
    try {
        // Read Excel file
        const workbook = XLSX.readFile(inputPath, { cellDates: true });

        // Ensure output directory exists
        await mkdir(outputDir, { recursive: true });

        console.log(`Extracting sheets from: ${inputPath}`);

        for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            
            if (!worksheet) {
                console.log(`Skipping missing sheet: ${sheetName}`);
                continue;
            }

            // Convert sheet to CSV
            // Using ';' as separator as in SkillStaff examples usually
            const csvData = XLSX.utils.sheet_to_csv(worksheet, { FS: ';', strip: true });

            if (!csvData || csvData.trim() === '') {
                console.log(`Skipping empty sheet: ${sheetName}`);
                continue;
            }

            // Create filename from sheet name (sanitized)
            const safeSheetName = sheetName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `${safeSheetName}.csv`;
            const outputPath = join(outputDir, fileName);

            await writeFile(outputPath, csvData);
            console.log(`Extracted: ${sheetName} -> ${outputPath}`);
        }

        console.log('Extraction complete!');
    } catch (error: any) {
        console.error('Error during extraction:', error.message);
        process.exit(1);
    }
}
