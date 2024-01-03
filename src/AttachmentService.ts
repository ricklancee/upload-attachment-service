export class AttachmentService {
    public constructor() {}

    /** The signature of this function cannot be changed */
    public async upload(
        path: string,
        mimetype: string,
    ): Promise<{
        filePath: string;
        thumbnailPath: string;
    }> {
        throw new Error("Implement upload method");
    }
}
