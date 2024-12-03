# BitBucket Package Update Script

A Node.js script that automatically updates package versions in package.json files and creates pull requests in BitBucket repositories.

## Prerequisites

- Node.js v18 or higher
- npm
- BitBucket account with API access

## Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your BitBucket credentials:
```env
BITBUCKET_USERNAME=your-username
BITBUCKET_APP_PASSWORD=your-app-password
# Optional: BITBUCKET_API_URL=custom-bitbucket-url
```

## Building the Project

Compile TypeScript to JavaScript:
```bash
npm run build
```

## Usage

Run the script with the following arguments:
```bash
npm start <package-name> <new-version> <workspace> <repo> <branch>
```

Example:
```bash
npm start axios 1.7.9 your-workspace your-repo main
```

### Arguments

- `package-name`: The name of the npm package to update
- `new-version`: The new version to set
- `workspace`: Your BitBucket workspace name
- `repo`: The repository name
- `branch`: The base branch name to compare against

## BitBucket Setup

1. Go to BitBucket Settings → App passwords
2. Create a new app password with the following permissions:
    - Repositories: Read, Write
    - Pull requests: Read, Write
