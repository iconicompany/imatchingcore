import { expect, test, describe } from "bun:test";
import { SpecializationTools } from "./specialization-tools";

describe("SpecializationTools", () => {
    describe("getCategory", () => {
        test("should return correct category from CSV", () => {
            expect(SpecializationTools.getCategory("Java разработчик")).toBe("Back-end разработка");
            expect(SpecializationTools.getCategory("React разработчик")).toBe("Front-end разработка");
            expect(SpecializationTools.getCategory("DevOps")).toBe("Devops");
            expect(SpecializationTools.getCategory("Data Scientist")).toBe("Аналитика данных");
        });

        test("should be case-insensitive", () => {
            expect(SpecializationTools.getCategory("JAVA РАЗРАБОТЧИК")).toBe("Back-end разработка");
            expect(SpecializationTools.getCategory("devops")).toBe("Devops");
        });

        test("should return empty string for unknown specialization", () => {
            expect(SpecializationTools.getCategory("Неизвестная специализация")).toBe("");
            expect(SpecializationTools.getCategory("")).toBe("");
        });
    });

    describe("isSameCategory", () => {
        test("should return true for specializations in the same category", () => {
            // Both are "Back-end разработка"
            expect(SpecializationTools.isSameCategory("Java разработчик", "Python разработчик")).toBe(true);

            // Both are "Front-end разработка"
            expect(SpecializationTools.isSameCategory("React разработчик", "Vue.js разработчик")).toBe(true);
        });

        test("should return false for specializations in different categories", () => {
            // Back-end vs Front-end
            expect(SpecializationTools.isSameCategory("Backend разработчик", "Frontend разработчик")).toBe(false);
        });

        test("should return false if either specialization is unknown", () => {
            expect(SpecializationTools.isSameCategory("Java разработчик", "Unknown")).toBe(false);
            expect(SpecializationTools.isSameCategory("Unknown", "React разработчик")).toBe(false);
            expect(SpecializationTools.isSameCategory("Unknown", "Unknown")).toBe(false);
        });
    });
});
