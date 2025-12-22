---
description: How to setup and run the n8n Firestore to Google Sheets sync workflow
---

# n8n Firestore to Google Sheets Workflow

This workflow automatically pulls booking data from your Firestore database and appends it to a Google Sheet.

## Prerequisites

1.  **n8n Instance**: You need a running instance of n8n (local or cloud).
2.  **Firebase Project**: Access to your Firebase project console.
3.  **Google Sheet**: A target Google Sheet created to receive the data.

## Setup Steps

### 1. Import the Workflow

1.  Open your n8n dashboard.
2.  Click **Workflows** > **Add Workflow**.
3.  Click the **...** menu in the top right and select **Import from File**.
4.  Select the `Data_n8n_Pull.json` file generated in the root of your project.

### 2. Configure Credentials

You will see two nodes with warnings indicating missing credentials:

**Firestore Node:**

1.  Double-click the **Firestore** node.
2.  Select **Get many documents** from the list of actions.
3.  Under **Credential to connect with**, select **Create New**.
4.  Choose **Firebase Certificate**.
5.  Paste the contents of your Firebase Service Account JSON (you can generate this in Firebase Console > Project Settings > Service accounts).
6.  **Important:** Ensure you enable the **Cloud Firestore API** in your Google Cloud Console project.
7.  Click **Save**.

**Google Sheets Node:**

1.  Double-click the **Google Sheets** node.
2.  Under **Credential to connect with**, select **Create New**.
3.  Choose **Google Sheets OAuth2 API**.
4.  Follow the instructions in n8n to set up OAuth2 with Google Cloud Console.
5.  **Important:** Ensure you enable the **Google Sheets API** in your Google Cloud Console project.
6.  Click **Save**.

### 3. Configure Node Settings

**Google Sheets Node:**

1.  In the **Sheet ID** field, paste the ID of your target Google Sheet (found in the URL: `docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`).
2.  Ensure the **Range** matches your sheet structure (defaults to `A:Z` to append rows).

### 4. Activate

1.  Click **Execute Workflow** to test it once.
2.  Toggle the **Active** switch to `On` to enable the Schedule Trigger (default: every hour).

## Troubleshooting

- **Permission Denied**: Ensure your Firebase Service Account has "Firebase Admin SDK" or "Cloud Datastore User" roles.
- **Sheet Not Found**: Verify the Sheet ID and ensure the Google account used for OAuth has edit access to the sheet.
