export interface NormalizationOptions {
  /**
   * Minimum similarity threshold for fuzzy matching (0 to 1)
   * @default 0.8
   */
  threshold?: number;
}

export class NormalizationService {
  /**
   * Normalizes a value against a list of reference values.
   * 
   * Example: "Королев (Московская область)" -> "Королев"
   * 
   * @param value The value to normalize
   * @param references List of valid reference values
   * @param options Normalization options
   * @returns The matched reference value or the original value if no match found
   */
  public normalize(value: string, references: string[], options: NormalizationOptions = {}): string {
    if (!value) return '';
    if (!references || references.length === 0) return value;

    const trimmedValue = value.trim();
    const lowerValue = trimmedValue.toLowerCase();

    // 1. Direct match (case-insensitive)
    const directMatch = references.find(ref => ref.toLowerCase() === lowerValue);
    if (directMatch) return directMatch;

    // 2. Clean value (remove content in parentheses)
    const cleanedValue = this.cleanValue(trimmedValue);
    const cleanedLowerValue = cleanedValue.toLowerCase();
    
    if (cleanedLowerValue && cleanedLowerValue !== lowerValue) {
      const cleanedMatch = references.find(ref => ref.toLowerCase() === cleanedLowerValue);
      if (cleanedMatch) return cleanedMatch;
    }

    // 3. Check if any reference is contained within the cleaned value (or vice versa)
    // This handles "Королев (Московская область)" if reference is "Королев"
    const partialMatch = references.find(ref => {
        const refLower = ref.toLowerCase();
        return cleanedLowerValue.includes(refLower) || refLower.includes(cleanedLowerValue);
    });
    if (partialMatch) return partialMatch;

    // 4. Fallback to original value
    return value;
  }

  /**
   * Removes text in parentheses and trims.
   * "Королев (Московская область)" -> "Королев"
   */
  private cleanValue(value: string): string {
    return value.replace(/\s*\(.*?\)\s*/g, '').trim();
  }
}
