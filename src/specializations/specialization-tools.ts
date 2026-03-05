import * as fs from 'fs';
import * as path from 'path';

export class SpecializationTools {
    private static categoryMap: Map<string, string> | null = null;
    private static groupMap: Map<string, number> | null = null;

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

    private static initGroupMap() {
        if (this.groupMap) return;
        this.groupMap = new Map();

        try {
            const csvPath = path.join(__dirname, '../../data/categories.csv');
            if (fs.existsSync(csvPath)) {
                const csvContent = fs.readFileSync(csvPath, 'utf8');
                const lines = csvContent.split('\n').slice(1); // skip header
                for (const line of lines) {
                    const parts = line.split(';');
                    if (parts.length >= 2 && parts[0] && parts[1]) {
                        const categoryName = parts[0].trim().replace(/^"|"$/g, '');
                        const groupId = parseInt(parts[1].trim().replace(/^"|"$/g, ''), 10);
                        if (categoryName && !isNaN(groupId)) {
                            this.groupMap!.set(categoryName.toLowerCase(), groupId);
                        }
                    }
                }
            } else {
                console.warn(`SpecializationTools: CSV not found at ${csvPath}`);
            }
        } catch (e) {
            console.error("Failed to load categories.csv in SpecializationTools", e);
        }
    }

    static getCategory(specName: string): string {
        if (!specName) return "";
        this.initMap();
        return this.categoryMap?.get(specName.toLowerCase()) || "";
    }

    static getGroupId(specName: string): number {
        if (!specName) return 0;
        this.initGroupMap();
        const category = this.getCategory(specName);
        if (!category) return 0;
        return this.groupMap?.get(category.toLowerCase()) ?? 0;
    }

    static isSameCategory(spec1: string, spec2: string, useGroup?: boolean): boolean {
        const cat1 = this.getCategory(spec1);
        const cat2 = this.getCategory(spec2);
        if (!cat1 || !cat2) return false;
        if (cat1 === cat2) return true;
        if (useGroup) {
            const group1 = this.getGroupId(spec1);
            const group2 = this.getGroupId(spec2);
            if (group1 && group2 && group1 === group2) return true;
        }
        return false;
    }
}
