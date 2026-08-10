import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, test } from 'bun:test';

import { TanderDictionaryService } from './TanderDictionaryService';

const service = TanderDictionaryService.getInstance();

const canonicalSpecializations = new Set(
  readFileSync(join(import.meta.dir, '../../data/specializations.csv'), 'utf-8')
    .split('\n')
    .slice(1)
    .map((line) => (line.split(';')[0] ?? '').trim().replace(/^"(.*)"$/, '$1'))
    .filter(Boolean),
);

describe('TanderDictionaryService.mapPosition', () => {
  test('снимает грейд, продукт и формат работы — на специализацию они не влияют', () => {
    expect(service.mapPosition('Аналитик Bi middle (удаленно)')).toBe('Аналитик BI');
    expect(service.mapPosition('Аналитик Bi senior (удаленно)')).toBe('Аналитик BI');
    expect(service.mapPosition('Услуги разработки ПО, технология iOS, уровень средний (удаленно)')).toBe(
      'IOS разработчик',
    );
    expect(service.mapPosition('Услуги разработки ПО, технология iOS, уровень эксперт (удаленно)')).toBe(
      'IOS разработчик',
    );
  });

  test('читает роль из описания требований, а не из созвучия названия', () => {
    // «front end Java» — это верстка на JavaScript/HTML/CSS, а не Java-разработка.
    expect(service.mapPosition('Услуги разработки front end Java уровень эксперт (удаленно)')).toBe(
      'Frontend разработчик',
    );
    // «Backend/Fullstac» с требованиями PHP 5/PHP 7, ООП, MySQL.
    expect(service.mapPosition('Услуги разработки, Backend/Fullstac уровень эксперт (удаленно)')).toBe(
      'PHP разработчик',
    );
    // Tessa — платформа на .Net 8 / C#.
    expect(service.mapPosition('Услуги разработки Tessa (Тесса), уровень средний (удаленно)')).toBe(
      'C# разработчик',
    );
  });

  test('нечувствителен к регистру и лишним пробелам', () => {
    expect(service.mapPosition('  архитектор  ')).toBe('Архитектор');
    expect(service.mapPosition('УСЛУГИ DBA, УРОВЕНЬ ЭКСПЕРТ')).toBe('Администратор баз данных');
  });

  test('возвращает undefined вместо догадки, когда однозначного соответствия нет', () => {
    // Корпоративный архитектор (TOGAF, ArchiMate) — не архитектор решений.
    expect(service.mapPosition('Корпоративный архитектор')).toBeUndefined();
    // Администрирование SAP HANA — это SAP Basis, отдельной специализации у нас нет.
    expect(service.mapPosition('Администрированике продуктов SAP HANA (уровень эксперт)')).toBeUndefined();
    // Разработка на Hana Script и CDS — не ABAP, подставлять «Разработчик SAP ABAP» нельзя.
    expect(service.mapPosition('Услуги разработки, технология SAP HANA (уровень эксперт)')).toBeUndefined();
    expect(service.mapPosition('')).toBeUndefined();
    expect(service.mapPosition(null)).toBeUndefined();
    expect(service.mapPosition('позиции с таким названием не существует')).toBeUndefined();
  });

  // Название позиции в шаблоне подачи короче, чем в ТЗ: там, где шаблон пишет «См. в
  // спецификации подробные требования», настоящий текст лежит в «Требования к компетенциям
  // (ТЗ).xlsx». Разметка сделана по нему — иначе десять позиций остались бы без цены зря.
  test('роль взята из полного текста требований в ТЗ, а не из отсылки в шаблоне', () => {
    // «Mobile Senior»: в ТЗ — «Глубокое знание Android, отличий версий 4/5/6/7/8/9».
    expect(service.mapPosition('Mobile Senior')).toBe('Android разработчик');
    // «Архитектор MS OLAP»: многомерные кубы SSAS, MDX и XMLA.
    expect(service.mapPosition('Архитектор MS OLAP (удаленно)')).toBe('Разработчик BI');
    // Тестирование веба и мобильных, тест-дизайн, чек-листы — ручное.
    expect(service.mapPosition('Услуги разработки, QA   уровень средний (Удаленно)')).toBe('QA ручной');
    // А тимлид тестирования — уже управление командой.
    expect(service.mapPosition('Услуги разработки, TeamLead QA платформы Rubbles Planning Force')).toBe(
      'Тест-менеджер',
    );
  });

  test('никогда не отображает на специализацию, которой нет в нашем справочнике', () => {
    for (const specialization of service.getTargetSpecializations()) {
      expect(canonicalSpecializations).toContain(specialization);
    }
  });

  test('каждая размеченная позиция действительно разрешается', () => {
    const positions = service.getMappedPositions();
    expect(positions.length).toBeGreaterThan(100);
    for (const position of positions) {
      expect(service.mapPosition(position)).toBeDefined();
    }
  });
});

// Эти пары — те, на которых подбор по близости слов ошибается. Тест существует, чтобы
// возврат к подбору не прошёл незамеченным.
describe('TanderDictionaryService: случаи, где подбор по словам врёт', () => {
  test.each([
    ['UX/UI дизайнер Bi Sigla Vision/Fine Bi middle (удаленно)', 'UX/UI дизайнер'],
    ['Middle QA тестировщик Keycloak', 'QA ручной'],
    ['Product менеджер', 'Менеджер продукта'],
    ['Архитектор модели данных (DWH)', 'DWH разработчик'],
    ['Услуги анализа, технология 1С Битрикс, уровень средний', 'Аналитик Битрикс24'],
  ])('%s -> %s', (position, expected) => {
    expect(service.mapPosition(position)).toBe(expected);
  });
});
