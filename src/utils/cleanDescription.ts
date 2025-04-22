export const cleanDescription = (description: string | undefined): string => {
    if (!description) return '';
    let cleaned = description.replace(/\[[^\]]+\]/g, '');
    cleaned = cleaned.replace(/\[([a-z]+)\](.*?)\[\/\1\]/g, '$2');
    return cleaned;
};
