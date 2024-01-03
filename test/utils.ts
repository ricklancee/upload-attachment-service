import { join } from "path";
import { copyFileSync, existsSync, readdir, rmSync, statSync } from "fs";
import {
    DeleteObjectCommand,
    ListObjectsCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { S3StorageConfig } from "../src/tenant-config";

export const TEST_FILES_DIRECTORY = join(__dirname, "/test-files");

export function deleteDir(directory: string) {
    if (existsSync(directory)) {
        rmSync(directory, { recursive: true });
    }
}

export async function fileExists(
    filename: string,
    directory: string,
): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        readdir(directory, async (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            const exists = files.find((file) => {
                return file === filename;
            });

            resolve(!!exists);
        });
    });
}

export function createTmpFile(JPEG_FILE: string) {
    const testFilePath = join(TEST_FILES_DIRECTORY, JPEG_FILE);
    const tmpFilePath = `/tmp/${JPEG_FILE}`;

    // Copy file to tmp to simulate a more real world scenario
    copyFileSync(testFilePath, tmpFilePath);

    return tmpFilePath;
}

export const getLocalFileSize = (path: string) => {
    const stat = statSync(path);
    return stat.size;
};

export async function cleanupOldObjectsFromBucket(
    client: S3Client,
    bucket: string,
) {
    const objects = await client.send(
        new ListObjectsCommand({
            Bucket: bucket,
        }),
    );

    if (objects.Contents) {
        for (const object of objects.Contents) {
            if (!object.Key) continue;

            await client.send(
                new DeleteObjectCommand({
                    Key: object.Key,
                    Bucket: bucket,
                }),
            );
        }
    }
}

export function getS3Client(tenantConfig: S3StorageConfig) {
    return new S3Client({
        region: tenantConfig.config.region,
        endpoint: tenantConfig.config.endpoint,
        credentials: {
            accessKeyId: tenantConfig.config.accessKeyId,
            secretAccessKey: tenantConfig.config.secretAccessKey,
        },
    });
}

export async function objectSizeInBucket(
    client: S3Client,
    bucket: string,
    fileName: string,
): Promise<number> {
    const response = await client.send(
        new ListObjectsCommand({
            Bucket: bucket,
        }),
    );

    const file = response?.Contents?.find((file) => file?.Key === fileName);

    if (!file || !file.Size) {
        throw new Error(`File: ${fileName} not found in bucket: ${bucket}`);
    }

    return file.Size;
}

export async function objectExistsInBucket(
    client: S3Client,
    bucket: string,
    fileName: string,
): Promise<boolean> {
    const response = await client.send(
        new ListObjectsCommand({
            Bucket: bucket,
        }),
    );

    return !!response?.Contents?.find((file) => file?.Key === fileName);
}
