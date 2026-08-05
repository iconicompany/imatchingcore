import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type CvReviewDictionaryName = 'role' | 'work_industry';

/**
 * Словарь заказчика, принимающего кандидатов через Google-форму «Форма для рассмотрения CV
 * специалистов», и сопоставление наших справочников на него.
 *
 * Соответствие задано таблицей, а не подбором по близости слов: наш справочник специализаций
 * (277 значений) заметно богаче списка формы (51), и любой подбор по вхождению отправил бы
 * заказчику неверную роль молча — «JavaScript разработчик» содержит «Java», а «Backend
 * разработчик» делит слово «разработчик» с доброй половиной списка.
 *
 * В таблицах только однозначные соответствия. Специализации вроде «Backend разработчик» или
 * «Архитектор» отсутствуют намеренно: выбрать за них конкретный язык или вид архитектора — значит
 * сообщить заказчику факт о кандидате, которого мы не знаем. Незаполненное поле честнее подмены.
 */
export class CvReviewDictionaryService {
  private static instance: CvReviewDictionaryService;
  private readonly dataDir: string;
  private specializationToRole: Map<string, string> | null = null;
  private industryToWorkIndustry: Map<string, string> | null = null;

  private constructor() {
    this.dataDir = join(__dirname, '../../data/cvreview');
  }

  public static getInstance(): CvReviewDictionaryService {
    if (!CvReviewDictionaryService.instance) {
      CvReviewDictionaryService.instance = new CvReviewDictionaryService();
    }
    return CvReviewDictionaryService.instance;
  }

  private readRows(fileName: string): string[][] {
    const content = readFileSync(join(this.dataDir, fileName), 'utf-8');
    return content
      .split('\n')
      .slice(1)
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .map((line) => line.split(';').map((cell) => cell.trim()));
  }

  /** Значения ровно в том написании, в каком их предлагает форма. */
  public getDictionary(name: CvReviewDictionaryName): string[] {
    return this.readRows(`${name}.csv`)
      .map((row) => row[row.length - 1] ?? '')
      .filter(Boolean);
  }

  private loadMapping(fileName: string): Map<string, string> {
    const mapping = new Map<string, string>();
    for (const row of this.readRows(fileName)) {
      const [source, target] = row;
      if (source && target) mapping.set(source.toLowerCase(), target);
    }
    return mapping;
  }

  private getSpecializationMapping(): Map<string, string> {
    if (!this.specializationToRole) {
      this.specializationToRole = this.loadMapping('specialization-role.csv');
    }
    return this.specializationToRole;
  }

  private getIndustryMapping(): Map<string, string> {
    if (!this.industryToWorkIndustry) {
      this.industryToWorkIndustry = this.loadMapping('industry-work_industry.csv');
    }
    return this.industryToWorkIndustry;
  }

  /** Роль в словаре формы либо `undefined`, если однозначного соответствия нет. */
  public mapSpecialization(specializationName: string | null | undefined): string | undefined {
    if (!specializationName) return undefined;
    return this.getSpecializationMapping().get(specializationName.trim().toLowerCase());
  }

  /** Отрасль в словаре формы либо `undefined`, если однозначного соответствия нет. */
  public mapIndustry(industryName: string | null | undefined): string | undefined {
    if (!industryName) return undefined;
    return this.getIndustryMapping().get(industryName.trim().toLowerCase());
  }

  /** Наши специализации, для которых соответствие задано, — для проверок и отчётов о покрытии. */
  public getMappedSpecializations(): string[] {
    return this.readRows('specialization-role.csv')
      .map((row) => row[0] ?? '')
      .filter(Boolean);
  }

  /** Наши отрасли, для которых соответствие задано. */
  public getMappedIndustries(): string[] {
    return this.readRows('industry-work_industry.csv')
      .map((row) => row[0] ?? '')
      .filter(Boolean);
  }
}
