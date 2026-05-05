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

    describe("getGroupId", () => {
        test("should return group id for a known specialization", () => {
            // Front-end разработка belongs to group 5 (Web + Front-end)
            expect(SpecializationTools.getGroupId("React разработчик")).toBe(5);
            // Web-разработка also belongs to group 5
            expect(SpecializationTools.getGroupId("Web разработчик")).toBe(5);
            // Back-end разработка belongs to group 7 (separate from frontend)
            expect(SpecializationTools.getGroupId("Java разработчик")).toBe(7);
            // Devops belongs to group 15
            expect(SpecializationTools.getGroupId("DevOps")).toBe(15);
            // QA ручной → Ручное тестирование → group 13
            expect(SpecializationTools.getGroupId("QA ручной")).toBe(13);
            // QA авто → Автоматизированное тестирование → group 13
            expect(SpecializationTools.getGroupId("QA авто")).toBe(13);
        });

        test("should return 0 for unknown specialization", () => {
            expect(SpecializationTools.getGroupId("Неизвестная специализация")).toBe(0);
            expect(SpecializationTools.getGroupId("")).toBe(0);
        });
    });

    describe("isSameCategory", () => {
        test("should return true for specializations in the same category", () => {
            // Both are "Back-end разработка"
            expect(SpecializationTools.isSameCategory("Java разработчик", "Python разработчик")).toBe(true);

            // Both are "Front-end разработка"
            expect(SpecializationTools.isSameCategory("React разработчик", "Vue.js разработчик")).toBe(true);
        });

        test("should return false for specializations in different categories (no group)", () => {
            // Back-end vs Front-end
            expect(SpecializationTools.isSameCategory("Backend разработчик", "Frontend разработчик")).toBe(false);
        });

        test("should return false if either specialization is unknown", () => {
            expect(SpecializationTools.isSameCategory("Java разработчик", "Unknown")).toBe(false);
            expect(SpecializationTools.isSameCategory("Unknown", "React разработчик")).toBe(false);
            expect(SpecializationTools.isSameCategory("Unknown", "Unknown")).toBe(false);
        });

        test("should return true for adjacent categories when useGroup=true", () => {
            // Web разработчик (Web-разработка, group 5) and Frontend разработчик (Front-end разработка, group 5)
            expect(SpecializationTools.isSameCategory("Web разработчик", "Frontend разработчик", true)).toBe(true);
            // QA ручной (Ручное тестирование) and QA авто (Автоматизированное тестирование) — group 13
            expect(SpecializationTools.isSameCategory("QA ручной", "QA авто", true)).toBe(true);
        });

        test("should return false for different stacks even when useGroup=true", () => {
            // Back-end (group 7) vs Front-end (group 5) — different groups
            expect(SpecializationTools.isSameCategory("Java разработчик", "React разработчик", true)).toBe(false);
            // Development vs Testing
            expect(SpecializationTools.isSameCategory("Java разработчик", "QA ручной", true)).toBe(false);
        });

        test("should behave the same as without useGroup for same-category specs", () => {
            expect(SpecializationTools.isSameCategory("Java разработчик", "Python разработчик", true)).toBe(true);
        });

        test("should return false if either specialization is unknown even with useGroup=true", () => {
            expect(SpecializationTools.isSameCategory("Java разработчик", "Unknown", true)).toBe(false);
        });
    });

    describe("getSameCategorySpecializations", () => {
        test("should return all specializations in the same category", () => {
            const javaSpecs = SpecializationTools.getSameCategorySpecializations("Java разработчик");
            expect(javaSpecs).toContain("Java разработчик");
            expect(javaSpecs).toContain("Python разработчик");
            expect(javaSpecs).toContain("Golang разработчик");
            // Should not contain specs from other categories
            expect(javaSpecs).not.toContain("React разработчик");
        });

        test("should return all specializations in the same group when useGroup=true", () => {
            // Frontend and Web development are in the same group (5)
            const frontendSpecs = SpecializationTools.getSameCategorySpecializations("Frontend разработчик", true);
            expect(frontendSpecs).toContain("Frontend разработчик");
            expect(frontendSpecs).toContain("Web разработчик");
            expect(frontendSpecs).toContain("React разработчик");
            expect(frontendSpecs).toContain("Vue.js разработчик");
            
            // QA ручной (Ручное тестирование) and QA авто (Автоматизированное тестирование) and Тестировщик 1С (Тестирование) are in group 13
            const qaSpecs = SpecializationTools.getSameCategorySpecializations("QA ручной", true);
            expect(qaSpecs).toContain("QA ручной");
            expect(qaSpecs).toContain("QA авто");
            expect(qaSpecs).toContain("Тестировщик 1С");
        });

        test("should return empty array for unknown specialization", () => {
            expect(SpecializationTools.getSameCategorySpecializations("Unknown")).toEqual([]);
            expect(SpecializationTools.getSameCategorySpecializations("")).toEqual([]);
        });

        test("should be case-insensitive", () => {
            const javaSpecs = SpecializationTools.getSameCategorySpecializations("JAVA РАЗРАБОТЧИК");
            expect(javaSpecs).toContain("Java разработчик");
        });
    });
});
