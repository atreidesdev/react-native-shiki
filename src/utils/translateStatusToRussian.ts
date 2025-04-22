export const translateStatusToRussian = (status: string) => {
    switch (status) {
        case 'on_hold':
            return 'Отложено';
        case 'dropped':
            return 'Брошено';
        case 'planned':
            return 'Запланировано';
        case 'watching':
            return 'Смотрю';
        case 'completed':
            return 'Просмотрено';
        default:
            return status;
    }
};
