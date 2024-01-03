# Upload Attachment Service - Coding challenge. 

This repository serves as a challenge on how to create an
effective upload attachment service.

## Using this repository

#### Prerequisites:

```shell
node: 18.18.*
docker
```

#### Install and run:

```shell
npm install # Before running any other commands install the dependencies
npm run start-services # Starts the containers: s3 and sftp containers
npm run test # To run the test suite
npm run stop-services # Stops the running containers
```

## Task
For a given tenant Implement an AttachmentService that uploads an attachment
to storage given a tenants configuration file. The code should be typed.

#### Attachment Flow:
1. Each file should be optimised.
2. Each file must have a thumbnail generated and stored on storage.
3. Each file must be uploaded to the tenant's chosen storage method.

#### Storage methods:
- Tenant A: LocalDisk
  - storage/ directory is relative to the project root
- Tenant B: S3 
   - Running inside a mock server inside the docker container
- Tenant C: SFTP 
   - Running inside a mock server inside the docker container

#### Suggested Workflow:

Run the test suite `npm run test` to see if the solution is working. Tests are skipped in `test/upload-to-storage.spec.ts` except for
the first one. Work from there and implement each case, testing and verifying on your way. Only the `createAttachmentService()` function
should be changed in the test file.

Start with images upload first, then optimize and after thumbnail generation. Lastly videos uploads, they are more difficult and can be skipped.

There is a `src/tenant-config.ts` that controls where the file needs to be uploaded and the configuration for the given
storage method (this file should not be changed but the types can be used in your files). The connection parameters for s3 and sftp are in this file for tenantB and tenantC.

You can create new files in `src/` as needed. Inside `src/AttachmentService.ts` the `upload()` method's signature cannot be changed. You can add private methods, constructor, fields to the `AttachmentService` class as you need.

**Work Flow:**

1. First for tenantA implement the local file upload. 
   - Files should be saved in the `storage/` direction 
   - You probably need to create this directory in code if it doesn't exist
2. Then for the second test: Optimise the image.
3. For the third test: Generate the image thumbnail.
4. Then implement the uploads for S3 and SFTP uploads.
5. Implement different image types, if not done already.
6. Implement video upload, optimisation and thumbnail generation.

**You can use the packages included in the package.json:**  

- @aws-sdk/client-s3: for connecting and uploading to s3
- sharp: for optimizing images
- ssh2-sftp-client: for connecting and uploading to sftp
- fluent-ffmpeg: for videos 


<details>
<summary><b>What this will hopefully teach you:</b></summary>
 
- How to swap implementations based on configuration.
- How to separate your code efficiently and easily modified it.
- How to easily test code and without integration with real services.
</details>


<details>
<summary><b>Hints:</b></summary>

- Dependency Injection
- Inversion of control (Dependency Inversion)
- Strategy Pattern
- Factories
</details>

