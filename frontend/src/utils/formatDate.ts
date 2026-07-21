export function formatDate(dateString: string | null | undefined, showTime: boolean = false): string {
    if (!dateString) {
        return 'No date';
    }
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };

    if (showTime) {
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };
        return `${date.toLocaleDateString('en-EN', dateOptions)}, ${date.toLocaleTimeString('en-EN', timeOptions)}`;
    }

    return date.toLocaleDateString('en-EN', dateOptions).replace(' y.', '');
}