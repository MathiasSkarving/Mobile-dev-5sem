export interface DateRange {
    startDate: Date | undefined;
    endDate: Date | undefined;
}

export function toDbDate(d: Date | undefined): string {
    if (d) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    } else {
        return "";
    }
};

export function formatDateRange(range: DateRange): string {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    return formatter.format(range.startDate) + " - " + formatter.format(range.endDate);
}

export function formatDate(date: Date): string {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    return formatter.format(date);
}