import { describe, expect, it } from "bun:test";
import { NormalizationService } from "./NormalizationService";

describe("NormalizationService", () => {
  const service = new NormalizationService();
  const cityReferences = ["Москва", "Королев", "Санкт-Петербург", "Екатеринбург"];
  const countryReferences = ["Россия", "Казахстан", "Армения"];

  it("should return exact match", () => {
    expect(service.normalize("Москва", cityReferences)).toBe("Москва");
    expect(service.normalize("Россия", countryReferences)).toBe("Россия");
  });

  it("should return case-insensitive match", () => {
    expect(service.normalize("москва", cityReferences)).toBe("Москва");
    expect(service.normalize("армения", countryReferences)).toBe("Армения");
  });

  it("should normalize value with parentheses", () => {
    // The specific case requested by the user
    expect(service.normalize("Королев (Московская область)", cityReferences)).toBe("Королев");
    expect(service.normalize("Королев (Московкая область)", cityReferences)).toBe("Королев");
  });

  it("should handle partial matches within cleanup", () => {
    expect(service.normalize("Город Королев", cityReferences)).toBe("Королев");
  });

  it("should return original value if no match found", () => {
    expect(service.normalize("НеизвестныйГород", cityReferences)).toBe("НеизвестныйГород");
  });

  it("should return empty string for empty input", () => {
    expect(service.normalize("", cityReferences)).toBe("");
  });
});
