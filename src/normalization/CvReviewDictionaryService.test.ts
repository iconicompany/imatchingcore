import { describe, expect, test } from 'bun:test';

import { CvReviewDictionaryService } from './CvReviewDictionaryService';

const service = CvReviewDictionaryService.getInstance();

describe('CvReviewDictionaryService dictionaries', () => {
  test('exposes the vocabulary the customer form actually offers', () => {
    const roles = service.getDictionary('role');
    expect(roles).toContain('React');
    expect(roles).toContain('QA manual');
    expect(roles).toContain('1С разработчик');

    const industries = service.getDictionary('work_industry');
    expect(industries).toContain('FinTech');
    expect(industries).toContain('Промышленность');
  });
});

describe('CvReviewDictionaryService.mapSpecialization', () => {
  test('maps our canonical specialization onto the form role', () => {
    expect(service.mapSpecialization('React разработчик')).toBe('React');
    expect(service.mapSpecialization('Системный аналитик')).toBe('Системный аналитик');
    expect(service.mapSpecialization('QA ручной')).toBe('QA manual');
    expect(service.mapSpecialization('Golang разработчик')).toBe('Go');
    expect(service.mapSpecialization('NodeJS разработчик')).toBe('Node.js');
  });

  test('is case- and space-insensitive about our own spelling', () => {
    expect(service.mapSpecialization('  react РАЗРАБОТЧИК ')).toBe('React');
  });

  test('returns undefined instead of guessing when nothing corresponds', () => {
    // The form lists neither "Backend" nor a generic "Архитектор"; choosing a language or an
    // architect flavour for the candidate would be an invention the customer reads as our answer.
    expect(service.mapSpecialization('Backend разработчик')).toBeUndefined();
    expect(service.mapSpecialization('Frontend разработчик')).toBeUndefined();
    expect(service.mapSpecialization('Архитектор')).toBeUndefined();
    expect(service.mapSpecialization('')).toBeUndefined();
  });

  test('never maps onto a role the form does not offer', () => {
    const roles = new Set(service.getDictionary('role'));
    for (const specialization of service.getMappedSpecializations()) {
      expect(roles).toContain(service.mapSpecialization(specialization)!);
    }
  });
});

describe('CvReviewDictionaryService.mapIndustry', () => {
  test('maps our industry names onto the form vocabulary', () => {
    expect(service.mapIndustry('FinTech & Banking')).toBe('FinTech');
    expect(service.mapIndustry('Manufacturing')).toBe('Промышленность');
    expect(service.mapIndustry('Government & Public Sector')).toBe('Гос');
    expect(service.mapIndustry('Telecom')).toBe('Telecom');
  });

  test('leaves industries without a clear counterpart unmapped', () => {
    // "BioTech, Pharma, Health care & Sports" spans the form's MedTech and SportTech at once.
    expect(service.mapIndustry('BioTech, Pharma, Health care & Sports')).toBeUndefined();
    expect(service.mapIndustry('GameDev')).toBeUndefined();
  });

  test('never maps onto an industry the form does not offer', () => {
    const industries = new Set(service.getDictionary('work_industry'));
    for (const industry of service.getMappedIndustries()) {
      expect(industries).toContain(service.mapIndustry(industry)!);
    }
  });
});
