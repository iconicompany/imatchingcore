export interface WordSynonym {
    src: string;
    dst: string | null;
}

export interface WordWeight {
    word: string;
    weight: number;
}

export class SpecializationsMatchingEngine {
    private synonyms: Map<string, string | null>;
    private weights: Map<string, number>;
    private normalizedSpecs: { original: string; words: string[] }[];
    private stopWords: Set<string>;

    constructor(
        specializationNames: string[],
        synonyms: WordSynonym[],
        weights: WordWeight[],
        stopWords: string[]
    ) {
        this.synonyms = new Map();
        for (const s of synonyms) {
            this.synonyms.set(this.replaceHomoglyphs(s.src.toLowerCase()), s.dst ? s.dst.toLowerCase() : null);
        }

        // 1. Initialize weights
        this.weights = new Map();
        for (const w of weights) {
            const words = this.normalize(w.word).split(/\s+/).filter(tk => tk.length > 0);
            for (const token of words) {
                this.weights.set(token, w.weight);
            }
        }

        // 2. Initialize stopwords
        this.stopWords = new Set(stopWords.map(w => this.replaceHomoglyphs(w.toLowerCase())));

        // 3. Pre-normalize specializations
        this.normalizedSpecs = specializationNames.map(name => {
            const normalized = this.normalize(name);
            return {
                original: name,
                words: normalized.split(/\s+/).filter(w => !this.stopWords.has(w) && w.length >= 2)
            };
        });
    }

    public normalize(text: string): string {
        let result = text.toLowerCase();

        // MUST be before homoglyph replacement
        result = result.replace(/front[-\s]+end/g, 'frontend');
        result = result.replace(/back[-\s]+end/g, 'backend');
        result = result.replace(/full[-\s]+stack/g, 'fullstack');
        result = result.replace(/ux[-\s]*ui/g, 'uxui');
        result = result.replace(/ui[-\s]*ux/g, 'uxui');

        result = this.replaceHomoglyphs(result);
        result = result.replace(/дwh/g, 'dwh');

        result = result.replace(/[^a-zа-я0-9]/gi, ' ');

        const words = result.split(/\s+/).filter(w => w.length > 0);

        const normalizedWords = words.map(w => {
            let current = w;

            // Global synonym
            if (this.synonyms && this.synonyms.has(current)) {
                current = this.synonyms.get(current) || '';
            }

            return current;
        }).filter(w => w.length > 0);

        return normalizedWords.join(' ').trim();
    }

    private replaceHomoglyphs(text: string): string {
        const map: Record<string, string> = {
            'a': 'а', 'c': 'с', 'e': 'е', 'o': 'о', 'p': 'р', 'x': 'х', 'y': 'у'
        };
        return text.replace(/[aceopxy]/g, m => map[m]!);
    }

    public weightedCoverageRatio(specWords: string[], textWords: string[]): number {
        if (specWords.length === 0 || textWords.length === 0) return 0;

        let specTotalWeight = 0;
        let textTotalWeight = 0;
        let matchedWeight = 0;

        const specSet = new Set(specWords);
        const textSet = new Set(textWords);

        const isMarker = (w: string) => /^\d+$/.test(w) || /^п\d+$/i.test(w) || (w.length > 5 && /\d/.test(w));

        const getWeight = (word: string) => {
            const lookup = this.replaceHomoglyphs(word.toLowerCase());
            return this.weights.get(lookup) || 1.0;
        };

        for (const word of specSet) {
            if (this.stopWords.has(word) || isMarker(word) || word.length < 2) continue;
            const weight = getWeight(word);
            specTotalWeight += weight;
            if (textSet.has(word)) matchedWeight += weight;
        }

        for (const word of textSet) {
            if (this.stopWords.has(word) || isMarker(word) || word.length < 2) continue;
            textTotalWeight += getWeight(word);
        }

        if (specTotalWeight === 0) return 0;
        return matchedWeight / Math.max(specTotalWeight, textTotalWeight);
    }

    public match(text: string): { specialization: string; score: number } | null {
        const normalizedText = this.normalize(text);
        const textWords = normalizedText.split(/\s+/).filter(w => w.length > 0);
        const filteredTextWords = textWords.filter(w => !this.stopWords.has(w) && w.length >= 2);

        let bestMatch: { specialization: string; score: number } | null = null;

        for (const spec of this.normalizedSpecs) {
            const score = this.weightedCoverageRatio(spec.words, filteredTextWords);

            if (score >= 0.25 && (!bestMatch || score > bestMatch.score)) {
                bestMatch = { specialization: spec.original, score };
            }
        }

        return bestMatch;
    }
}
