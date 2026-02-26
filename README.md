# File Output System of Record Extension App Reference Implementation
## Introduction
This reference implementation simulates an external service that writes files from [Maestro workflows](https://support.docusign.com/s/document-item?bundleId=yff1696971835267&topicId=dnx1696972415150.html) to a system of record. It stores files locally or with the cloud provider of choice (AWS, Azure, or GCP). This reference implementation is useful for:

- Reviewing the format of requests to and responses from an external service that implements the file output system of record extension
- Seeing how the extension functions when invoked from a Maestro workflow

## Documentation
For documentation about the file output system of record extension, see:
- [File output system of record extension overview](https://developers.docusign.com/extension-apps/extension-apps-101/supported-extensions/file-output-system-of-record/)
- [File output system of record extension contract reference](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/file-output-system-of-record/)
- [File output system of record test: An event triggers the workflow](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/file-output-system-of-record-event-triggers-workflow/)
- [File output system of record test: Workflow step creates envelopes](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/file-output-system-of-record-workflow-step-creates-envelopes/)

## Authentication
This reference implementation supports two [authentication](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/) flows:
* [Authorization Code Grant](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/#authorization-code-grant): Can be used with both [public and private extension apps](https://developers.docusign.com/extension-apps/extension-apps-101/choosing-private-distribution/) and in all [supported regions](https://developers.docusign.com/extension-apps/extension-apps-101/globalization/)
* [Client Credentials Grant](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/#client-credentials-grant): Available only with private extension apps that are based in the US

## Hosted version (no setup required)
You can use the hosted version of this reference implementation by directly uploading the appropriate manifest file located in the [manifests/hosted/](manifests/hosted) folder to the Docusign Developer Console. See [Upload your manifest and create the extension app](#3-upload-your-manifest-and-create-the-extension-app).

**Note:** The provided manifests include `clientId` and `clientSecret` values used in the sample authentication connection. These do not authenticate to a real system, but the hosted reference implementation requires these exact values.

## Manifest files
This reference implementation provides different versions of the manifest file that support each method for identifying the destination record for the write file operation.
- `FileOutputOnlyManifest`: Use this version to test the scenario where a [workflow variable](https://developers.docusign.com/extension-apps/extension-apps-101/supported-extensions/file-output-system-of-record/extensions-and-actions/#extensions-and-actions-record-identifier-is-a-workflow-variable) is used to identify the destination record.
- `FileOutputWithDataInputManifest`: Use this version to test the scenario where a query returns the [ID of the record](https://developers.docusign.com/extension-apps/extension-apps-101/supported-extensions/file-output-system-of-record/extensions-and-actions/#extensions-and-actions-record-id-is-from-a-data-read-step) to write a file to.

After choosing one of the options listed above, select the appropriate manifest version for your the authentication method. If you will run the hosted version, select one of the manifests from the `hosted` folder. All manifest versions are listed below.

```bash
manifests/
  ├── authorizationCode/
  │   ├── FileOutputOnlyManifest.json
  │   └── FileOutputWithDataInputManifest.json
  ├── clientCredentials/
  │   ├── FileOutputOnlyManifest.json
  │   └── FileOutputWithDataInputManifest.json
  └── hosted/
      ├── authorizationCode.FileOutputOnlyManifest.json
      └── authorizationCode.FileOutputWithDataInputManifest.json
      └── clientCredentials.FileOutputOnlyManifest.json
      └── clientCredentials.FileOutputWithDataInputManifest.json
```

## Choose your setup: local or cloud deployment
If you want to run the app locally using Node.js and ngrok, follow the [Local setup instructions](#local-setup-instructions) below.

If you want to deploy the app to the cloud using Docker and Terraform, see [Deploying an extension app to the cloud with Terraform](terraform/README.md). This includes cloud-specific setup instructions for the following cloud providers:
- [Amazon Web Services](https://aws.amazon.com/)
- [Microsoft Azure](https://azure.microsoft.com/)
- [Google Cloud Platform](https://cloud.google.com/)

## Local setup instructions

### Video Walkthrough
[![Reference implementation videos](https://img.youtube.com/vi/_4p7GWK5aoA/0.jpg)](https://youtube.com/playlist?list=PLXpRTgmbu4orBQrYWPAXa4EBXv0IGGzID&feature=shared)

### 1. Clone the repository
Run the following command to clone the repository: 
```bash
git clone https://github.com/docusign/extension-app-file-output-system-of-record-reference-implementation.git
```

### 2. Generate secret values
If you already have values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`, you may skip this step.

The easiest way to generate a secret value is to run the following command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
```

You will need values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`.

### 3. Set the environment variables for the cloned repository
- If you're running this in a development environment, create a copy of `example.development.env` and save it as `development.env`.
- If you're running this in a production environment, create a copy of `example.production.env` and save it as `production.env`.
- Replace `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE` in `development.env` or `production.env` with your generated values. These values will be used to configure the sample proxy's mock authentication server. 
- Set the `clientId` value in the manifest file to the same value as `OAUTH_CLIENT_ID`.
- Set the `clientSecret` value in the manifest file to the same value as `OAUTH_CLIENT_SECRET`.
### 4. [Install and configure Node.js and npm on your machine](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
### 5. Install dependencies
Run the following command to install the necessary dependencies:
```bash
npm install
```
### 6. Run the proxy server
#### Development mode:
Start the proxy server in development mode by running the command:
```bash
npm run dev
```

This will create a local server on the port in the `development.env` file (port 3000 by default) that listens for local changes that trigger a rebuild.

#### Production mode:
Start the proxy server in production mode by running the following commands:
```bash
npm run build
npm run start
```

This will start a production build on the port in the `production.env` file (port 3000 by default). 
## Set up ngrok
### 1. [Install and configure ngrok for your machine](https://ngrok.com/docs/getting-started/)
### 2. Start ngrok
Run the following command to create a publicly accessible tunnel to your localhost:

```bash
ngrok http <PORT>
```

Replace `<PORT>` with the port number in the `development.env` or `production.env` file.

### 3. Save the forwarding address
Copy the `Forwarding` address from the response. You’ll need this address in your manifest file.

```bash
ngrok                                                    

Send your ngrok traffic logs to Datadog: https://ngrok.com/blog-post/datadog-log

Session Status                online
Account                       email@domain.com (Plan: Free)
Update                        update available (version 3.3.1, Ctrl-U to update)
Version                       3.3.0
Region                        United States (us)
Latency                       60ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://bbd7-12-202-171-35.ngrok-free.app -> http:

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

In this example, the `Forwarding` address to copy is `https://bbd7-12-202-171-35.ngrok-free.app`.
## Create an extension app
### 1. Prepare your app manifest
Choose a manifest from the [manifests](manifests/) folder based on the appropriate [authentication](#authentication) use case. Replace `<PROXY_BASE_URL>` in your manifest file with the ngrok forwarding address in the following sections:
- `connections.params.customConfig.tokenUrl`
- `connections.params.customConfig.authorizationUrl`
- `actions.params.uri` Replace this value for all of the actions.

### 2. Navigate to the [Developer Console](https://devconsole.docusign.com/apps)
Log in with your Docusign developer credentials. You can sign up for a free developer account [here](https://www.docusign.com/developers/sandbox).

### 3. Upload your manifest and create the extension app
To [create your extension app](https://developers.docusign.com/extension-apps/build-an-extension-app/create/), select **Create App > By editing the manifest**. In the app manifest editor that opens, upload your manifest file or paste into the editor itself; then select **Validate**. Once the editor validates your manifest, select **Create App.**

### 4. Test the extension app
This reference implementation simulates an external system of record using the sample data in [fileDB.ts](src/db/fileDB.ts). After you have created an extension app in the Developer Console that connects to the reference implementation, you can run tests that send requests to it. Requests from the calling application are saved to the [logs](logs/) folder. The reference implementation sends responses to the calling application.

If you are testing the scenario where a [workflow variable](https://developers.docusign.com/extension-apps/extension-apps-101/supported-extensions/file-output-system-of-record/extensions-and-actions/#extensions-and-actions-record-identifier-is-a-workflow-variable) is used to identify the destination record, the actions are invoked as follows:
- [Get Type Names](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/file-output-system-of-record/#get-type-names): Returns a list of objects used in the sample data.
- [Write File](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/file-output-system-of-record/#write-file): Writes files to the data file [FinancialAccount.json](src/db/FinancialAccount.json).


If you are testing the scenario where a query returns the [ID of the record](https://developers.docusign.com/extension-apps/extension-apps-101/supported-extensions/file-output-system-of-record/extensions-and-actions/#extensions-and-actions-record-id-is-from-a-data-read-step) to write a file to, the actions are invoked as follows:
- [Get Type Names](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/data-io/#dataio-version6-get-type-names): Returns a list of objects used in the sample data.
- [Get Type Definitions](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/data-io/#dataio-version6-get-type-definitions): Returns the definitions of the objects used in the sample data.
- [Search Records](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/data-io/#dataio-version6-search-records): Returns the ID of a record to write files to.
- [Write File](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/file-output-system-of-record/#write-file): Writes files to the data file [FinancialAccount.json](src/db/FinancialAccount.json).

#### [Integration tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/integration-tests/)
You can run these tests from the Developer Console to test each supported action and capability for the extension. These tests allow you to construct the request body and see the response.

**Note:** The values in the sample requests apply only if you use the [mock data](src/db/fileDB.ts) in the reference implementation. If you use your own database, you’ll need to construct your requests based on your own schema. 


#### Write File integration test
Use this sample request to execute a Write File integration test from the Developer Console:

```json
{
    "files": [
        {
            "basename": "Test file.pdf",
            "path": "",
            "pathTemplateValues": [
            ],
            "contents": "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CjE1IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL0ZvbnREZXNjcmlwdG9yIDE0IDAgUgovQmFzZUZvbnQgL0FBQUFBQStBcmlhbE1UCi9TdWJ0eXBlIC9DSURGb250VHlwZTIKL0NJRFRvR0lETWFwIC9JZGVudGl0eQovQ0lEU3lzdGVtSW5mbyA8PC9SZWdpc3RyeSAoQWRvYmUpCi9PcmRlcmluZyAoSWRlbnRpdHkpCi9TdXBwbGVtZW50IDA+PgovVyBbMCBbNzUwIDAgMCAyNzcuODMyMDNdIDU1IFs2MTAuODM5ODRdIDcyIFs1NTYuMTUyMzQgMjc3LjgzMjAzXSA3NiA3OSAyMjIuMTY3OTcgODcgWzI3Ny44MzIwM11dCi9EVyA1MDA+PgplbmRvYmoKMTYgMCBvYmoKPDwvRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDI3ND4+IHN0cmVhbQp4nF2Ry2rEIBSG9z7FWc4sBp1cZjoQAsUhkEUvNJ0HMHqSCo0RYxZ5+xJNU+hC4cP//89Fyut7bbQH+u5G2aCHThvlcBpnJxFa7LUh5wSUln6jcMtBWEJ5fW+WyeNQm24kRQFAP7DXk3cLHJ7V2OKR0Den0GnTw+HBmyOhzWztNw5oPDBSlqCwI5S/CPsqBgQabKdaofHaL6cHb/4Un4tFSAKfYzdyVDhZIdEJ0yMpGGOshKKqqqokaNS/9yy62k5+CRfUaQkFYwkrV0qvgfIsUMYDXW6Rqkg85G4JyW/eXj57CrLsFtV58OaXmBvjr+kWEU1rl+s29xXI2Tk0Pqw8jL0OrA3uv2JHu7rW8wO3a4kDCmVuZHN0cmVhbQplbmRvYmoKNCAwIG9iago8PC9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMAovQmFzZUZvbnQgL0FBQUFBQStBcmlhbE1UCi9FbmNvZGluZyAvSWRlbnRpdHktSAovRGVzY2VuZGFudEZvbnRzIFsxNSAwIFJdCi9Ub1VuaWNvZGUgMTYgMCBSPj4KZW5kb2JqCnhyZWYKMCAxNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDQ1NiAwMDAwMCBuIAowMDAwMDAwMTAwIDAwMDAwIG4gCjAwMDAwMTE0NTEgMDAwMDAgbiAKMDAwMDAwMDEzNyAwMDAwMCBuIAowMDAwMDAwNjczIDAwMDAwIG4gCjAwMDAwMDA5NDIgMDAwMDAgbiAKMDAwMDAwMDc5NSAwMDAwMCBuIAowMDAwMDAwNzI4IDAwMDAwIG4gCjAwMDAwMDA4NjMgMDAwMDAgbiAKMDAwMDAwMDg4NyAwMDAwMCBuIAowMDAwMDAxMDMyIDAwMDAwIG4gCjAwMDAwMDEyMjYgMDAwMDAgbiAKMDAwMDAxMDU2NSAwMDAwMCBuIAowMDAwMDEwODAxIDAwMDAwIG4gCjAwMDAwMTExMDYgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDE3Ci9Sb290IDEyIDAgUgovSW5mbyAxIDAgUj4+CnN0YXJ0eHJlZgoxMTU5MAolJUVPRgo=",
            "parentId": "111222333"
        }
    ],
    "rootId": "FinancialAccount"
}
```

#### Search Records integration test
Use this sample request to execute a Search Records integration test from the Developer Console. Queries for Search Records requests are built using [IQuery](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/custom-query-language/) structure.

```json
{
  "query": {
    "$class": "com.docusign.connected.data.queries@1.0.0.Query",
    "attributesToSelect": [
      "Id"
    ],
    "from": "FinancialAccount",
    "queryFilter": {
      "$class": "com.docusign.connected.data.queries@1.0.0.QueryFilter",
      "operation": {
        "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
        "leftOperand": {
          "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
          "name": "accountNumber",
          "type": "STRING",
          "isLiteral": false
        },
        "operator": "EQUALS",
        "rightOperand": {
          "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
          "name": "111222333",
          "type": "STRING",
          "isLiteral": true
        }
      }
    }
  },
  "pagination": {
    "skip": 0,
    "limit": 5
  }
}
```
#### [Functional tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/)
This type of test shows how the extension functions when invoked from an [extension point](https://developers.docusign.com/extension-apps/extension-apps-101/concepts/extensions-and-extension-points/#extension-points). For file output system of record, the extension point is [Maestro](https://support.docusign.com/s/document-item?bundleId=yff1696971835267&topicId=dnx1696972415150.html).

These procedures explain how to run functional tests from Maestro:
- [File output system of record test: Workflow step creates envelopes](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/file-output-system-of-record-workflow-step-creates-envelopes/)
- [File output system of record test: An event triggers the workflow](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/file-output-system-of-record-event-triggers-workflow/)










