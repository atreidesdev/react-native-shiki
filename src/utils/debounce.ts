export function debounce(func: () => void, delay: number): { (): void; cancel: () => void } {
    let timer: NodeJS.Timeout | null = null;

    const debouncedFunction = function (...args: any[]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };

    debouncedFunction.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return debouncedFunction;
}
