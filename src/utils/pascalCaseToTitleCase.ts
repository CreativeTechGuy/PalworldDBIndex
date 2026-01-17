export function pascalCaseToTitleCase(str: string): string {
    return str.replace(/[a-z][A-Z]/g, (match) => {
        return `${match[0]} ${match[1]}`;
    });
}
