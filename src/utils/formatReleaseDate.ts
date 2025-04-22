export const formatReleaseDate = (airedOn: string | null): string => {
    if (!airedOn) return 'Неизвестно';
    const date = new Date(airedOn);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const seasons = ['Зима', 'Весна', 'Лето', 'Осень'];
    const seasonIndex = Math.floor((month - 1) / 3);
    const season = seasons[seasonIndex];
    return `${season} ${year}`;
};
