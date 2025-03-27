export const normalizeValue = (value?: string) => {
    if (!value) return;

    if (value === 'false' || value === 'true') {
        return value === 'false' ? false : true;
    }

    return value;
};

export const isDigit = (value: string) => {
  return /^\d+$/.test(value);
}

export const isDigitOrEmpty = (value: string) => {
  return isDigit(value) || value === "";
}
