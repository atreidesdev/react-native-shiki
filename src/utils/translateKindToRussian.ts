export const translateKindToRussian = (kind: string): string => {
    switch (kind) {
        case 'tv':
            return 'Сериал';
        case 'ova':
            return 'OVA';
        case 'movie':
            return 'Фильм';
        case 'ona':
            return 'ONA';
        default:
            return kind;
    }
};
