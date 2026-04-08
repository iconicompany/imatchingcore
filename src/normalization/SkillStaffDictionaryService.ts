import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class SkillStaffDictionaryService {
  private static instance: SkillStaffDictionaryService;
  private dataDir: string;

  private constructor() {
    // Relative to src/normalization/SkillStaffDictionaryService.ts
    // data is at the root of the project
    this.dataDir = join(__dirname, '../../data/skillstaff');
  }

  public static getInstance(): SkillStaffDictionaryService {
    if (!SkillStaffDictionaryService.instance) {
      SkillStaffDictionaryService.instance = new SkillStaffDictionaryService();
    }
    return SkillStaffDictionaryService.instance;
  }

  /**
   * Loads a list of values from a SkillStaff CSV file.
   * Assumes the CSV has a header and uses ';' as separator.
   * Returns values from the last column.
   */
  public getDictionary(name: 'city' | 'country' | 'citizenship' | 'specialization' | 'key_skill' | 'work_industry' | 'language' | 'category'): string[] {
    try {
      const filePath = join(this.dataDir, `${name}.csv`);
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // Skip header
      const dataLines = lines.slice(1);
      
      return dataLines.map(line => {
        const parts = line.split(';');
        return parts[parts.length - 1]?.trim() || '';
      }).filter(Boolean);
    } catch (e) {
      console.error(`Failed to load SkillStaff dictionary: ${name}`, e);
      return [];
    }
  }
}
