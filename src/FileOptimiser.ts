export interface FileOptimiser {
    optimise(path: string, mimetype: string): Promise<string>;
}
