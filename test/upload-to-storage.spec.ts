import { beforeAll, describe, expect, test } from "vitest";
import { join } from "path";
import { AttachmentService } from "../src/AttachmentService";
import { tenantConfig, TenantStorageConfig } from "../src/tenant-config";
import { S3Client } from "@aws-sdk/client-s3";
import {
    cleanupOldObjectsFromBucket,
    createTmpFile,
    deleteDir,
    fileExists,
    getLocalFileSize,
    getS3Client,
    objectExistsInBucket,
    objectSizeInBucket,
} from "./utils";

const STORAGE_DIRECTORY = join(__dirname, "../storage");

const JPEG_FILE = "test.jpg";
const PNG_FILE = "test.png";
const GIF_FILE = "test.gif";
const MP4_FILE = "test.mp4";

function createAttachmentService(
    tenantConfig: TenantStorageConfig,
    mimetype: string,
): AttachmentService {
    throw new Error("Implement setting up attachment service");
}

beforeAll(() => {
    deleteDir(STORAGE_DIRECTORY);
});

describe("AttachmentService.upload()", () => {
    describe("for tenantA", () => {
        test("a JPEG file can be uploaded to local disk storage in storage/tenant-a", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const attachmentService = createAttachmentService(
                tenantConfig.tenantA,
                "image/jpeg",
            );

            const { filePath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );

            expect(
                await fileExists(filePath, join(STORAGE_DIRECTORY, "tenant-a")),
            ).toBe(true);
        });

        test.skip("a JPEG file can be uploaded and optimized to local disk storage in storage/tenant-a", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const attachmentService = createAttachmentService(
                tenantConfig.tenantA,
                "image/jpeg",
            );

            const { filePath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );

            const uploadedFilePath = join(
                STORAGE_DIRECTORY,
                "tenant-a/",
                filePath,
            );

            const originalSize = getLocalFileSize(tmpFilePath);
            const newFileSize = getLocalFileSize(uploadedFilePath);

            expect(newFileSize).toBeLessThan(originalSize);
        });

        test.skip("a JPEG file will have a thumbnail generated and uploaded to local disk storage in storage/tenant-a", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const attachmentService = createAttachmentService(
                tenantConfig.tenantA,
                "image/jpeg",
            );

            const { thumbnailPath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );

            expect(
                await fileExists(
                    thumbnailPath,
                    join(STORAGE_DIRECTORY, "tenant-a"),
                ),
            ).toBe(true);
        });
    });

    describe("for tenantB", () => {
        test.skip("a JPEG file can be uploaded to s3 storage in bucket1", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const client = getS3Client(tenantConfig.tenantB);

            await cleanupOldObjectsFromBucket(
                client,
                tenantConfig.tenantB.config.bucket,
            );

            const attachmentService = createAttachmentService(
                tenantConfig.tenantB,
                "image/jpeg",
            );

            const { filePath, thumbnailPath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );

            const fileExists = await objectExistsInBucket(
                client,
                tenantConfig.tenantB.config.bucket,
                filePath,
            );
            expect(fileExists).toBe(true);
        });

        test.skip("a JPEG file can be uploaded and optimized to s3 storage in bucket1", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const client = getS3Client(tenantConfig.tenantB);

            await cleanupOldObjectsFromBucket(
                client,
                tenantConfig.tenantB.config.bucket,
            );

            const attachmentService = createAttachmentService(
                tenantConfig.tenantB,
                "image/jpeg",
            );

            const { filePath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );
            const originalSize = getLocalFileSize(tmpFilePath);
            const optimisedSize = await objectSizeInBucket(
                client,
                tenantConfig.tenantB.config.bucket,
                filePath,
            );

            expect(optimisedSize).toBeLessThan(originalSize);
        });

        test.skip("for tenantB a JPEG file thumbnail can be uploaded to s3 storage in bucket1", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const client = getS3Client(tenantConfig.tenantB);

            await cleanupOldObjectsFromBucket(
                client,
                tenantConfig.tenantB.config.bucket,
            );

            const attachmentService = createAttachmentService(
                tenantConfig.tenantB,
                "image/jpeg",
            );

            const { thumbnailPath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );
            const thumbnailFileExists = await objectExistsInBucket(
                client,
                tenantConfig.tenantB.config.bucket,
                thumbnailPath,
            );

            expect(thumbnailFileExists).toBe(true);
        });
    });

    describe("for tenantC", () => {
        test.skip("a JPEG file can be uploaded to local disk storage in storage/tenant-c", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const attachmentService = createAttachmentService(
                tenantConfig.tenantC,
                "image/jpeg",
            );

            const { filePath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );

            expect(
                await fileExists(filePath, join(STORAGE_DIRECTORY, "tenant-c")),
            ).toBe(true);
        });

        test.skip("a JPEG file can be uploaded and optimized to local disk storage in storage/tenant-c", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const attachmentService = createAttachmentService(
                tenantConfig.tenantC,
                "image/jpeg",
            );

            const { filePath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );

            const uploadedFilePath = join(
                STORAGE_DIRECTORY,
                "tenant-c/",
                filePath,
            );

            const originalSize = getLocalFileSize(tmpFilePath);
            const newFileSize = getLocalFileSize(uploadedFilePath);

            expect(newFileSize).toBeLessThan(originalSize);
        });

        test.skip("a JPEG file will have a thumbnail generated and uploaded to local disk storage in storage/tenant-c", async () => {
            const tmpFilePath = createTmpFile(JPEG_FILE);

            const attachmentService = createAttachmentService(
                tenantConfig.tenantC,
                "image/jpeg",
            );

            const { thumbnailPath } = await attachmentService.upload(
                tmpFilePath,
                "image/jpeg",
            );

            expect(
                await fileExists(
                    thumbnailPath,
                    join(STORAGE_DIRECTORY, "tenant-c"),
                ),
            ).toBe(true);
        });
    });
});

describe("File uploads", () => {
    test.skip("can upload a JPG image", async () => {
        const tmpFilePath = createTmpFile(JPEG_FILE);

        const attachmentService = createAttachmentService(
            {
                storage: "local",
                config: {
                    folder: "image-uploads",
                },
            },
            "image/jpeg",
        );

        const { filePath, thumbnailPath } = await attachmentService.upload(
            tmpFilePath,
            "image/jpeg",
        );

        expect(
            await fileExists(
                filePath,
                join(STORAGE_DIRECTORY, "image-uploads"),
            ),
        ).toBe(true);
        expect(
            await fileExists(
                thumbnailPath,
                join(STORAGE_DIRECTORY, "image-uploads"),
            ),
        ).toBe(true);
    });

    test.skip("can upload a PNG image", async () => {
        const tmpFilePath = createTmpFile(PNG_FILE);

        const attachmentService = createAttachmentService(
            {
                storage: "local",
                config: {
                    folder: "image-uploads",
                },
            },
            "image/png",
        );

        const { filePath, thumbnailPath } = await attachmentService.upload(
            tmpFilePath,
            "image/png",
        );

        expect(
            await fileExists(
                filePath,
                join(STORAGE_DIRECTORY, "image-uploads"),
            ),
        ).toBe(true);
        expect(
            await fileExists(
                thumbnailPath,
                join(STORAGE_DIRECTORY, "image-uploads"),
            ),
        ).toBe(true);
    });

    test.skip("can upload a GIF image", async () => {
        const tmpFilePath = createTmpFile(GIF_FILE);

        const attachmentService = createAttachmentService(
            {
                storage: "local",
                config: {
                    folder: "image-uploads",
                },
            },
            "image/gif",
        );

        const { filePath, thumbnailPath } = await attachmentService.upload(
            tmpFilePath,
            "image/gif",
        );

        expect(
            await fileExists(
                filePath,
                join(STORAGE_DIRECTORY, "image-uploads"),
            ),
        ).toBe(true);
        expect(
            await fileExists(
                thumbnailPath,
                join(STORAGE_DIRECTORY, "image-uploads"),
            ),
        ).toBe(true);
    });

    test.skip("can upload a mp4 video", async () => {
        const tmpFilePath = createTmpFile(MP4_FILE);

        const attachmentService = createAttachmentService(
            {
                storage: "local",
                config: {
                    folder: "video-uploads",
                },
            },
            "video/mp4",
        );

        const { filePath, thumbnailPath } = await attachmentService.upload(
            tmpFilePath,
            "video/mp4",
        );

        expect(
            await fileExists(
                filePath,
                join(STORAGE_DIRECTORY, "video-uploads"),
            ),
        ).toBe(true);
        expect(
            await fileExists(
                thumbnailPath,
                join(STORAGE_DIRECTORY, "video-uploads"),
            ),
        ).toBe(true);
    });
});
