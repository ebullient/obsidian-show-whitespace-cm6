import { en } from "./en";

export const allTranslate = {
    en,
};

export const getTranslate = (lang: string) =>
    lang in allTranslate
        ? allTranslate[lang as keyof typeof allTranslate]
        : allTranslate.en;
