export interface ThumbnailGenerator {
    /** Creates a thumbnail and uploads it to storage */
    createThumbnail(path: string): Promise<string>;
}
