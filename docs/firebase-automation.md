# Firebase deployment automation

This repository deploys to the Firebase project `bth-gwix-operator-network`.

## What is automated

- Pull requests to `main` create a temporary Firebase Hosting preview channel.
- Pushes to `main` deploy changed Firebase resources:
  - Hosting
  - Cloud Functions
  - Firestore rules and indexes
- Manual production deploys can be run from the `Deploy to Firebase` workflow.

The workflows use the repository secret `FIREBASE_SERVICE_ACCOUNT` for non-interactive authentication.

## One-time GitHub secret setup

Create a deploy service account in Google Cloud/Firebase, download a JSON key, and add the entire JSON contents as this GitHub repository secret:

```text
FIREBASE_SERVICE_ACCOUNT
```

Repository:

```text
DCGit208/btheducationgroupweb
```

Recommended service account name:

```text
firebase-github-deployer
```

## Required permissions

The service account must be able to deploy Firebase Hosting, Cloud Functions, and Firestore rules/indexes for `bth-gwix-operator-network`.

Use the narrowest roles that work for the project. A practical starting set is:

- Firebase Hosting Admin
- Firebase Rules Admin
- Cloud Datastore Index Admin
- Cloud Functions Admin
- Cloud Build Editor
- Artifact Registry Administrator
- Service Account User

If the workflow only needs Hosting previews, Firebase Hosting Admin is the key role. Production deploys need the broader set above because this repo can deploy functions and Firestore configuration.

## Workflow behavior

### Pull request previews

Workflow file:

```text
.github/workflows/firebase-preview.yml
```

For each pull request that changes hosted site files, GitHub Actions deploys a preview channel named:

```text
pr-<pull-request-number>
```

Preview channels expire after 14 days.

### Production deploy

Workflow file:

```text
.github/workflows/firebase-deploy.yml
```

On pushes to `main`, the workflow detects changed areas and deploys only the needed Firebase resources where possible. Manual runs deploy all configured Firebase resources.

## Do not commit credentials

Never commit service account JSON files or local Firebase credential files. Store deploy credentials only in GitHub Secrets or a managed workload identity setup.
