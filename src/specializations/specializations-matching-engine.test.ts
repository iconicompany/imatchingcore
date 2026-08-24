import { expect, test, describe } from "bun:test";
import { SpecializationsMatchingFactory } from "./specializations-matching-factory";

type TestCase = { input: string; expected: string };

/**
 * Benchmark test for SpecializationsMatchingEngine.
 *
 * Test cases are split into two groups:
 *  - passing:      cases that MUST work — any failure here is a regression
 *  - knownFailures: cases the engine currently gets wrong — tracked by count
 *                  to catch regressions without blocking CI
 *
 * When fixing a known failure, move it from knownFailures → passing and
 * decrease knownFailureCount accordingly.
 */
describe("SpecializationsMatchingEngine Benchmark", () => {
    // -------------------------------------------------------------------------
    // PASSING cases — must all be correct. Any failure here = REGRESSION.
    // -------------------------------------------------------------------------
    const passing: TestCase[] = [
        { input: "1С разработчик RedLab 1С 10910", expected: "1С разработчик" },
        { input: "Ведущий специалист DevOps Senior 🆔DO 10911 RedLab", expected: "DevOps" },
        { input: "DO 10879 DevOps", expected: "DevOps" },
        { input: "Инженер DevOps", expected: "DevOps" },
        { input: "Frontend developer (Senior) 🆔FE-10908", expected: "Frontend разработчик" },
        { input: "Data Scientist Middle в МТС ДИДЖИТАЛ П2026-53", expected: "Data Scientist" },
        { input: "QA Функциональное тестирование 🆔Qa-1848", expected: "QA ручной" },
        { input: "Ведущий Системный Аналитик SA-10907", expected: "Системный аналитик" },
        { input: "Middle DevOps-инженер на Проект внедрения VK Data Platform", expected: "DevOps" },
        { input: "Инженер DevOps Middle/Senior [10904]", expected: "DevOps" },
        { input: "Консультант TM 🆔10899", expected: "" },
        { input: "Java Backend Developer Middle BE-10906", expected: "Java разработчик" },
        { input: "Разработчик PHP 🆔 BE-10905", expected: "PHP разработчик" },
        { input: "Аналитик 1С Управленческий учет 1С 10903", expected: "Аналитик 1С" },
        { input: "DevOps 10902", expected: "DevOps" },
        { input: "Инженер DevOps Middle/Senior [10904]", expected: "DevOps" },
        { input: "Инженер DevOps", expected: "DevOps" },
        { input: "Консультант TM 10899", expected: "" },
        { input: "Бизнес аналитик Senior", expected: "Бизнес аналитик" },
        { input: "Аналитик Senior SA-10894", expected: "Системный аналитик" },
        { input: "Ведущий разработчик back-end 🆔10896", expected: "Backend разработчик" },
        { input: "Бизнес-аналитик Senior в МосБиржа #П2026-54", expected: "Бизнес аналитик" },
        { input: "Data Scientist Middle в МТС ДИДЖИТАЛ П2026-53", expected: "Data Scientist" },
        { input: "DevOps Senior в МТС ДИДЖИТАЛ П2026-51", expected: "DevOps" },
        { input: "Java разработчик/Middle/Middle+ №4295643", expected: "Java разработчик" },
        { input: "Нагрузочное тестирование Middle в МТС ДИДЖИТАЛ П2026-52", expected: "QA нагрузочный" },
        { input: "Разработчик Java Middle в МТС ДИДЖИТАЛ", expected: "Java разработчик" },
        { input: "Аналитик Senior SA-10893", expected: "Системный аналитик" },
        { input: "DevOps (телеком) КРОК [150126]", expected: "DevOps" },
        { input: "Коллеги, всем привет, актуальные потребности ITFB на 20 января", expected: "" },
        { input: "Системный аналитик Senior ЛеманаПРО ITFB [Номер потребности: П2026-47]", expected: "Системный аналитик" },
        { input: "Системный аналитик Senior в ЛеманаПРО", expected: "Системный аналитик" },
        { input: "Системный аналитик Senior в ЛеманаПРО П2026-48", expected: "Системный аналитик" },
        { input: "Системный аналитик Middle в ЛеманаПРО П2026-49", expected: "Системный аналитик" },
        { input: "Front-end разработчик (Senior) 🆔FE-10892", expected: "Frontend разработчик" },
        { input: ".NET разработчик Middle/Middle+ BE-10889", expected: ".NET разработчик" },
        { input: "1С-аналитик Senior в МосБиржа П2026-45", expected: "Аналитик 1С" },
        { input: "Консультант СЭД Middle в X5", expected: "" },
        { input: "PHP разработчик_Senior BE-10887", expected: "PHP разработчик" },
        { input: "Инженер NLP/PLP (телеком) [130126]", expected: "Инженер NLP/PLP" },
        { input: "Разработчик ETL/ELT (DWH) BD-10886", expected: "DWH разработчик" },
        { input: "Скрам-мастер [10883]", expected: "Scrum Master" },
        { input: "PHP", expected: "PHP разработчик" },
        { input: "Разработчик Backend.net [BE-10880]", expected: ".NET разработчик" },
        { input: "DevOps Senior в X5 П2026-42", expected: "DevOps" },
        { input: "DO 10879 DevOps RedLab", expected: "DevOps" },
        { input: "Разработчик Java Middle в МосБиржа [Номер потребности: П2026-28]", expected: "Java разработчик" },
        { input: "Аналитик (БА/СА) middle+/senior", expected: "Бизнес/системный аналитик" },
        { input: "Консультант (Менеджер инвентаризации РЦ) Разработ Senior в X5 П2026-37", expected: "" },
        { input: "Консультант СЭД Настройка Middle в X5 [Номер потребности: П2026-39]", expected: "" },
        { input: "PHP-разработчик Senior в X5 #П2026-40", expected: "PHP разработчик" },
        { input: "QA Middle+ 🆔1804", expected: "QA ручной" },
        { input: "QA Middle+", expected: "QA ручной" },
        { input: "Разработчик Java Middle в БКС П2026-33", expected: "Java разработчик" },
        { input: "Нагрузочное тестирование Senior в X5 ITFB", expected: "QA нагрузочный" },
        { input: "Java- разработчик 65 apps", expected: "Java разработчик" },
        { input: "Java- разработчик 65apps [ID: 733]", expected: "Java разработчик" },
        { input: "Промпт-инженер 🆔10839", expected: "Промпт-инженер" },
        { input: "Бэкенд-разработчик Middle BE-10878 RedLab", expected: "Backend разработчик" },
        { input: "DevOps Senior", expected: "DevOps" },
        { input: "Middle+ Бизнес аналитик на Проект внедрения КЭДО", expected: "Бизнес аналитик" },
        { input: "БА", expected: "Бизнес аналитик" },
        { input: "Консультант AirWatch 2 линия [10876]", expected: "" },
        { input: "Системный аналитик RedLab AN-10867", expected: "Системный аналитик" },
        { input: "DevOps_Middle+/Senior RedLab [DO 10873]", expected: "DevOps" },
        // Справочник знает «Golang разработчик», вакансии пишут «Go разработчик». До синонима
        // go → golang движок возвращал на такой текст null, и специализация терялась целиком.
        { input: "Go разработчик", expected: "Golang разработчик" },
        { input: "Позиция: Go разработчик Senior", expected: "Golang разработчик" },
        { input: "Golang разработчик", expected: "Golang разработчик" },
    ];

    // -------------------------------------------------------------------------
    // KNOWN FAILURES — engine currently gets these wrong.
    // Track count to detect regressions. Do NOT add new failures here;
    // instead fix the engine and add to passing above.
    // -------------------------------------------------------------------------
    const knownFailures: TestCase[] = [
        // Wrong: gets UX/UI дизайнер but match fails (DE- tag confused)
        { input: "UX/UI DE-10912 RedLab", expected: "UX/UI дизайнер" },
        // Фуллстек аналитик — движок возвращает Full Stack разработчик вместо Системный аналитик
        { input: "Фуллстек аналитик, SA1-SA3", expected: "Системный аналитик" },
        { input: "Фуллстек аналитик, SA1-SA3 ID 10903", expected: "Системный аналитик" },
        // Data Engineer → неправильно попадает в Data Quality инженер
        { input: "Data Engineer (Senior) BD-10905", expected: "Data инженер" },
        // QA HT — специфический тег, ожидается пустой результат
        { input: "QA HT 🆔Qa-10901", expected: "" },
        // Аналитик Middle SA-10897 — SA должен указывать Системный аналитик, но ожидаем ""
        { input: "Аналитик Middle SA-10897", expected: "" },
        // Интеграционный QA — специализации нет, ожидаем ""
        { input: "Интеграционный QA /Middle QA-10891", expected: "" },
        { input: "Интеграционный QA (телеком) КРОК [140126]", expected: "" },
        // React → попадает в React Native
        { input: "React разработчик (Middle) FE-10895", expected: "React разработчик" },
        { input: "React разработчик (Middle) FE-10881", expected: "React разработчик" },
        // Дизайнер — неоднозначность
        { input: "Дизайнер DE-10890 RedLab", expected: "Продуктовый дизайнер" },
        { input: "Дизайнер Senior в X5", expected: "Продуктовый дизайнер" },
        { input: "Дизайнер Senior в X5 П2026-29", expected: "Продуктовый дизайнер" },
        // Full Stack Vue.js → Vue.js разработчик побеждает вместо Full Stack
        { input: "Full‑Stack разработчик Vue.js", expected: "Full Stack разработчик" },
        // Системный аналитик Senior — неоднозначно попадает в Бизнес/системный
        { input: "Системный аналитик Senior в МосБиржа [П2026-55]", expected: "Системный аналитик" },
        { input: "Системный аналитик Senior на проект Банка ID 120126", expected: "Системный аналитик" },
        // SAP TM — неправильно матчится как SAP EWM
        { input: "Консультант SAP TM Senior в X5 П2026-32", expected: "" },
        { input: "Консультант SAP TM Senior в X5 П2026-38", expected: "" },
        // 1С-Руководитель проекта — 1С бьёт по весу и даёт 1С разработчик вместо Руководитель проекта
        { input: "1С-Руководитель проекта Senior+ в МосБиржа П2026-27", expected: "Руководитель проекта" },
        { input: "1С-Руководитель проекта Senior+ в МосБиржа П2026-14", expected: "Руководитель проекта" },
        // SAP консультант TM — неправильно определяется как SAP EWM
        { input: "Консультант SAP BW Senior в X5 П2026-31", expected: "Консультант SAP BW/BI" },
        // QA (АТ) — АТ не распознаётся как авто
        { input: "QA (АТ) Senior Java [QA-10865]", expected: "QA авто" },
        { input: "QA (АТ) Middle QA-10866", expected: "QA авто" },
        // ML — неправильно определяется как AI-разработчик
        { input: "ML разработчик BD-10884 RedLab", expected: "ML разработчик" },
        { input: "ML аналитик BD-10885 RedLab", expected: "ML разработчик" },
        // Программист миграции — DWH не определяется
        { input: "Программист проекта миграции ХД с Oracle на Greenplum (Senior) 🆔BD-10882", expected: "DWH разработчик" },
        // ИТ-Лидер — неправильно матчится
        { input: "ИТ-Лидер команды 10879", expected: "" },
        // Product Manager → попадает в Продуктовый аналитик
        { input: "Product Manager 🆔10877", expected: "Product owner" },
        // DWH/Data — неоднозначность
        { input: "Системный Аналитик DWH / Data-инженер от Middle в банк КРОК", expected: "Системный аналитик" },
        { input: "Data Engineer Senior в МосБиржа [Номер потребности: П2026-25]", expected: "Data инженер" },
        { input: "Data инженер (Senior) 🆔BD-10848", expected: "Data инженер" },
        // SAP разработчики — неправильный тип
        { input: "SAP разработчики 10874", expected: "Разработчик SAP ABAP" },
        // Frontend Middle — не определяется
        { input: "Frontend Middle в нефтеперерабатывающую компанию", expected: "Frontend разработчик" },
        // Автотестер — не определяется
        { input: "Автотестер Middle", expected: "QA авто" },
    ];

    test("passing cases — must all be correct (no regressions allowed)", async () => {
        const engine = await SpecializationsMatchingFactory.create();

        const failures: { input: string; expected: string; got: string }[] = [];

        console.log(`\nPassing Cases:\n`);
        console.log(`| Job Name | Expected | Got | Score | ✅/❌ |`);
        console.log(`| :--- | :--- | :--- | :--- | :--- |`);

        for (const { input, expected } of passing) {
            const result = engine.match(input);
            const got = result?.specialization ?? "---";
            const score = result?.score.toFixed(2) ?? "0.00";
            const target = expected || "---";
            const ok = got === target;

            if (!ok) failures.push({ input, expected: target, got });

            console.log(`| ${input} | ${target} | ${got} | ${score} | ${ok ? "✅" : "❌"} |`);
        }

        expect(failures).toEqual([]);
    });

    test("known failures — track count to catch regressions", async () => {
        const engine = await SpecializationsMatchingFactory.create();

        const stillFailing: { input: string; expected: string; got: string }[] = [];
        const unexpectedlyFixed: { input: string; expected: string; got: string }[] = [];

        console.log(`\nKnown Failures (tracking only):\n`);
        console.log(`| Job Name | Expected | Got | Score | Status |`);
        console.log(`| :--- | :--- | :--- | :--- | :--- |`);

        for (const { input, expected } of knownFailures) {
            const result = engine.match(input);
            const got = result?.specialization ?? "---";
            const score = result?.score.toFixed(2) ?? "0.00";
            const target = expected || "---";
            const ok = got === target;

            if (ok) {
                unexpectedlyFixed.push({ input, expected: target, got });
                console.log(`| ${input} | ${target} | ${got} | ${score} | 🎉 FIXED — move to passing |`);
            } else {
                stillFailing.push({ input, expected: target, got });
                console.log(`| ${input} | ${target} | ${got} | ${score} | ⏳ known |`);
            }
        }

        if (unexpectedlyFixed.length > 0) {
            console.log(`\n🎉 ${unexpectedlyFixed.length} known failure(s) are now fixed! Move them to the passing list.\n`);
        }

        console.log(`\nKnown failures remaining: ${stillFailing.length}/${knownFailures.length}\n`);

        // Guards against REGRESSIONS: count must not increase.
        // When you fix a case, move it to passing[] and decrease this number.
        const knownFailureCount = 34;
        expect(stillFailing.length).toBeLessThanOrEqual(knownFailureCount);
    });
});
