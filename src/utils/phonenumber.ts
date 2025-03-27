export const formatPhoneNumber = (phoneNumber: string) => {
    let result = '';
    let phone = phoneNumber;
    if (phone.startsWith("+")) {
        phone = phone.slice(1);
    }

    if (phone.length > 0) {
        result += `+${phone[0]}`;
    }
    if (phone.length > 1) {
        result += ` (${phone.slice(1, 4)}`;
    }
    if (phone.length > 4) {
        result += `) ${phone.slice(4, 7)}`;
    }
    if (phone.length > 7) {
        result += `-${phone.slice(7, 9)}`;
    }
    if (phone.length > 9) {
        result += `-${phone.slice(9, 11)}`;
    }

    return result;
};

export const clearFormattedPhoneNumber = (formattedPhoneNumber: string) => {
    return formattedPhoneNumber
        .replaceAll('+', '')
        .replaceAll(' ', '')
        .replaceAll(')', '')
        .replaceAll('(', '')
        .replaceAll('-', '');
};
