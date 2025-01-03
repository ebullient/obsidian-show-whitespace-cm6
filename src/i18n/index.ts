
import { en } from './en';
import { zh } from './zh';
import { zhTW } from './zhTW';

export const allTranslate = {
    en,
    zh,
    "zh-TW": zhTW,
};

export const getTranslate = (lang: string) =>
    lang in allTranslate? allTranslate[lang as keyof typeof allTranslate]: allTranslate.en;
