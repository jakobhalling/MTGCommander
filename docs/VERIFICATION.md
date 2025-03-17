# MTG Commander Verification Scripts

This repository contains scripts to verify the build and test status of both the frontend and backend components of the MTG Commander project.

## Prerequisites

- .NET SDK (for backend)
- Node.js and npm (for frontend)
- Bash shell (available on Linux/macOS and through WSL on Windows)

## Available Verification Scripts

### Bash Script

```bash
# Make the script executable
chmod +x verify.sh

# Run the verification script
./verify.sh
```

### Node.js Script (Enhanced Reporting)

```bash
# Make the script executable
chmod +x verify.js

# Run the verification script
./verify.js

# Alternatively, use node directly
node verify.js
```

## What the Scripts Do

The verification scripts perform the following actions:

1. **Backend Verification**
   - Build the .NET solution
   - Run all backend unit tests

2. **Frontend Verification**
   - Install frontend dependencies
   - Build the frontend application
   - Run all frontend unit tests

## Script Differences

- **verify.sh**: Basic bash script with simple output
- **verify.js**: Enhanced Node.js script with:
  - Colored and formatted output
  - Detailed error reporting
  - Execution time tracking
  - Better error handling

## Exit Codes

- **0**: All builds and tests passed successfully
- **Non-zero**: An error occurred during the verification process

## Troubleshooting

If you encounter any issues:

1. Ensure all prerequisites are installed
2. Check that you're running the script from the root directory of the project
3. Verify that you have the necessary permissions to execute the script
4. Check the error messages for specific issues

## Integration with CI/CD

These scripts can be integrated into CI/CD pipelines to automate verification:

- GitHub Actions
- Azure DevOps
- Jenkins
- GitLab CI
- etc.

## Adding Custom Verification Steps

To add custom verification steps, edit the scripts and add your commands in the appropriate sections. 