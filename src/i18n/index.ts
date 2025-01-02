
import { en } from './en';
import { zh } from './zh';

export const allTranslate = {
    en,
    zh,
};

export const getTranslate = (lang: string) =>
    lang in allTranslate? allTranslate[lang as keyof typeof allTranslate]: allTranslate.en;
