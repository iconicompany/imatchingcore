import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Словарь заказчика АО «ТАНДЕР» (розничные сети «Магнит» и «Дикси») и сопоставление его позиций
 * на наш справочник специализаций.
 *
 * Заказчик закупает аутстафф прайс-листом: сотни позиций, у каждой название, потолок цены за
 * человеко-час и абзац требований к компетенции. Названия устроены как «роль + продукт + грейд +
 * формат»: «Middle QA тестировщик Keycloak», «UX/UI дизайнер Bi Sigla Vision/Fine Bi senior
 * (удаленно)». Наш справочник плоский: «QA ручной», «UX/UI дизайнер».
 *
 * Соответствие задано таблицей, а не подбором по близости слов, — как и в
 * `CvReviewDictionaryService`, и по той же причине. Замерено на процедуре 4529328:
 * `SpecializationsMatchingEngine` уверенно (score >= 0.6) отвечает на 11 позиций из 177, а ниже
 * порога выдаёт прямой мусор — «UX/UI дизайнер Bi Sigla Vision/Fine Bi» превращается в
 * «AI-разработчик» со score 0.29. Движок годится, чтобы отсортировать список перед разметкой,
 * но не чтобы отвечать за цену.
 *
 * В таблице только однозначные пары. 17 позиций из 177 в неё не попали намеренно: «Mobile
 * Senior» без описания требований — это и iOS, и Android, и Flutter; «Корпоративный архитектор»
 * (TOGAF, ArchiMate) — не то же, что архитектор решений; «Услуги тестирования» без требований —
 * не отличить ручное от автоматизации. Незаполненное поле честнее подмены: по такой позиции
 * ставка не подставляется, а выносится владельцу на решение.
 *
 * Грейд, продукт и формат работы в ключ не входят по смыслу: «middle», «senior», «(удаленно)»,
 * «Keycloak» влияют на ставку, а не на то, кто этот человек. Ключом остаётся полное название
 * позиции, потому что оно и приходит в шаблоне подачи.
 */
export class TanderDictionaryService {
  private static instance: TanderDictionaryService;
  private readonly dataDir: string;
  private positionToSpecialization: Map<string, string> | null = null;

  private constructor() {
    this.dataDir = join(__dirname, '../../data/tander');
  }

  public static getInstance(): TanderDictionaryService {
    if (!TanderDictionaryService.instance) {
      TanderDictionaryService.instance = new TanderDictionaryService();
    }
    return TanderDictionaryService.instance;
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

  private getMapping(): Map<string, string> {
    if (!this.positionToSpecialization) {
      const mapping = new Map<string, string>();
      for (const [position, specialization] of this.readRows('position-specialization.csv')) {
        if (position && specialization) mapping.set(this.normalizeKey(position), specialization);
      }
      this.positionToSpecialization = mapping;
    }
    return this.positionToSpecialization;
  }

  /**
   * Ключ поиска. Заказчик пишет названия людьми: двойные пробелы, неразрывный пробел, разный
   * регистр — всё это встречается в одном файле, и на точное сравнение строк полагаться нельзя.
   */
  private normalizeKey(position: string): string {
    return position.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  /** Наша специализация либо `undefined`, если однозначного соответствия нет. */
  public mapPosition(position: string | null | undefined): string | undefined {
    if (!position) return undefined;
    return this.getMapping().get(this.normalizeKey(position));
  }

  /** Позиции заказчика, для которых соответствие задано, — для проверок и отчётов о покрытии. */
  public getMappedPositions(): string[] {
    return this.readRows('position-specialization.csv')
      .map((row) => row[0] ?? '')
      .filter(Boolean);
  }

  /** Наши специализации, встречающиеся в таблице. */
  public getTargetSpecializations(): string[] {
    return [...new Set(this.readRows('position-specialization.csv').map((row) => row[1] ?? ''))].filter(
      Boolean,
    );
  }
}
