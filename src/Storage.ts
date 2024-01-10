export interface Storage {
    upload(path: string): Promise<string>;
}
