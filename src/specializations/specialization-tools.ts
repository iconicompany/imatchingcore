import * as fs from 'fs';
import * as path from 'path';

export class SpecializationTools {
    private static categoryMap: Map<string, string> | null = null;

    private static initMap() {
        if (this.categoryMap) return;
        this.categoryMap = new Map();

        try {
            // Find specializations.csv relative to this file
            const csvPath = path.join(__dirname, '../../data/specializations.csv');
            if (fs.existsSync(csvPath)) {
                const csvContent = fs.readFileSync(csvPath, 'utf8');
                const lines = csvContent.split('\n').slice(1); // skip header
                for (const line of lines) {
                    const parts = line.split(';');
                    if (parts.length >= 2 && parts[0] && parts[1]) {
                        const spec = parts[0].trim().replace(/^"|"$/g, '');
                        const cat = parts[1].trim().replace(/^"|"$/g, '');
                        if (spec) {
                            this.categoryMap!.set(spec.toLowerCase(), cat);
                        }
                    }
                }
            } else {
                console.warn(`SpecializationTools: CSV not found at ${csvPath}`);
            }
        } catch (e) {
            console.error("Failed to load specializations.csv in SpecializationTools", e);
        }
    }

    static getCategory(specName: string): string {
        if (!specName) return "";
        this.initMap();
        return this.categoryMap?.get(specName.toLowerCase()) || "";
    }

    static isSameCategory(spec1: string, spec2: string): boolean {
        const cat1 = this.getCategory(spec1);
        const cat2 = this.getCategory(spec2);
        if (!cat1 || !cat2) return false;
        return cat1 === cat2;
    }
}
