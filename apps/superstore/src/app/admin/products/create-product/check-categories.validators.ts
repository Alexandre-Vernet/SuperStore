import { ValidatorFn } from '@angular/forms';

export const checkCategoriesValidators = (): ValidatorFn => {
    return (control) => {
        const category = control.value;
        if (!category) {
            return null;
        }

        // Check if category is valid (only letters, numbers, comma and space)
        const categoryRegex = /^[a-zA-Z0-9, ]*$/;
        if (!categoryRegex.test(category)) {
            return { invalidCharacters: true };
        }

        // Detect duplicate categories
        const categories = category.split(',').map((c: string) => c.trim().toLowerCase());
        const categorieSet = new Set<string>;
        for (const c of categories) {
            if (categorieSet.has(c)) {
                return { duplicateCategories: true };
            }
            categorieSet.add(c);
        }

        return null;
    };
};