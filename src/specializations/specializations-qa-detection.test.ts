import { expect, test, describe } from "bun:test";
import { SpecializationsMatchingFactory } from "./specializations-matching-factory";

/**
 * Test suite for QA/Тестировщик specialization detection.
 *
 * Background: Jobs reported as not matching any specialization:
 *   - https://iconicompany.com/ru/dashboard/jobs/6a229bd81463942ca1a28b1f  ("QA-engineer 879")
 *   - https://iconicompany.com/ru/dashboard/jobs/6a22aabb63ababbb571fea6a  ("Тестировщик 326012")
 *
 * Root cause: The weight for 'тестировщик' was being overwritten in the weights map.
 * Since 'qa' is a synonym for 'тестировщик', the weight entry { word: 'qa', weight: 2.0 }
 * normalized to 'тестировщик' and set its weight to 2.0 — but then the explicit entry
 * { word: 'тестировщик', weight: 0.3 } overwrote it, making QA-based matching too weak
 * to reach the 0.25 threshold when secondary spec words (e.g. 'ручной') are present.
 */
describe("QA / Тестировщик specialization detection", () => {
    test("should detect QA specialization from user-reported failing jobs", async () => {
        const engine = await SpecializationsMatchingFactory.create();

        const cases: { input: string; expectedSpecialization: string }[] = [
            // Reported by user as not detected (job IDs: 6a229bd81463942ca1a28b1f, 6a22aabb63ababbb571fea6a)
            { input: "QA-engineer 879", expectedSpecialization: "QA ручной" },
            { input: "Тестировщик 326012", expectedSpecialization: "QA ручной" },

            // Additional similar cases from production (last 3 months) also not being detected
            { input: "QA Engineer 320166", expectedSpecialization: "QA ручной" },
            { input: "QA engineer ID 3810", expectedSpecialization: "QA ручной" },
            { input: "Тестировщик 312429", expectedSpecialization: "QA ручной" },
            { input: "QA engineer #873", expectedSpecialization: "QA ручной" },
            { input: "QA-инженер #846", expectedSpecialization: "QA ручной" },
            { input: "QA engineer ID 3748", expectedSpecialization: "QA ручной" },
            { input: "Senior QA тестировщик 4078", expectedSpecialization: "QA ручной" },
            { input: "QA тестировщик Middle/Senior (МТС Диджитал) 2480", expectedSpecialization: "QA ручной" },
            { input: "QA Middle+/Senior 409", expectedSpecialization: "QA ручной" },
            { input: "QA middle+/senior #17856", expectedSpecialization: "QA ручной" },
            { input: "QA Engineer, Middle/Senior ВЗ-0358", expectedSpecialization: "QA ручной" },

            // Load testing (нагрузочный)
            { input: "QA НТ тестировщик Senior 2896", expectedSpecialization: "QA нагрузочный" },

            // Automation QA (авто) — AQA prefix
            { input: "AQA (Python) Middle+/Senior id313", expectedSpecialization: "QA авто" },
            { input: "QA auto engineer (SDET) #216131", expectedSpecialization: "QA авто" },
            { input: "AQA Python (Tele2) ID2322", expectedSpecialization: "QA авто" },
            { input: "Senior AQA (Python) # МТС", expectedSpecialization: "QA авто" },
        ];

        const failures: { input: string; expected: string; got: string }[] = [];

        for (const { input, expectedSpecialization } of cases) {
            const result = engine.match(input);
            const got = result?.specialization ?? "---";
            if (got !== expectedSpecialization) {
                failures.push({ input, expected: expectedSpecialization, got });
            }
        }

        if (failures.length > 0) {
            console.log("\nFailed cases:");
            for (const f of failures) {
                console.log(`  input: "${f.input}"`);
                console.log(`  expected: "${f.expected}", got: "${f.got}"`);
            }
        }

        expect(failures).toEqual([]);
    });
});
