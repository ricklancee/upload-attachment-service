export type StorageType = "local" | "s3" | "sftp";

export type LocalStorageConfig = {
    storage: "local";
    config: {
        folder: string;
    };
};

export type S3StorageConfig = {
    storage: "s3";
    config: {
        region: string;
        endpoint: string;
        accessKeyId: string;
        secretAccessKey: string;
        bucket: string;
    };
};

export type SFTPStorageConfig = {
    storage: "sftp";
    config: {
        host: string;
        port: string;
        username: string;
        password: string;
        folder: string;
    };
};

export type TenantStorageConfig =
    | LocalStorageConfig
    | S3StorageConfig
    | SFTPStorageConfig;

export type TenantConfig = Record<string, TenantStorageConfig>;

export const tenantConfig = {
    tenantA: {
        storage: "local",
        config: {
            folder: "tenant-a",
        },
    },
    tenantB: {
        storage: "s3",
        config: {
            region: "REGION",
            endpoint: "http://127.0.0.1:9090",
            accessKeyId: "XXXX",
            secretAccessKey: "XXXX",
            bucket: "bucket1",
        },
    },
    tenantC: {
        storage: "sftp",
        config: {
            host: "127.0.0.1",
            port: "2222",
            username: "foo",
            password: "pass",
            folder: "/upload/tenant-d",
        },
    },
} satisfies TenantConfig;
