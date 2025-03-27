import {normalizeValue} from './validation';

export const getObjectFromParams = (search: string) => {
    const result = {};

    if (!search) return result;

    const searchRow = search.startsWith('?') ? search.substring(1) : search;

    searchRow.split('&').forEach((keyValuePair) => {
        const [key, value] = keyValuePair.split('=');
        // @ts-ignore
        result[key] = normalizeValue(decodeURIComponent(value));
    });

    return result;
};
