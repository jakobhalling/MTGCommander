#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for output formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper function to print formatted messages
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  switch (type) {
    case 'success':
      console.log(`${colors.green}${colors.bright}✓ ${timestamp} - ${message}${colors.reset}`);
      break;
    case 'error':
      console.error(`${colors.red}${colors.bright}✗ ${timestamp} - ${message}${colors.reset}`);
      break;
    case 'warning':
      console.warn(`${colors.yellow}${colors.bright}⚠ ${timestamp} - ${message}${colors.reset}`);
      break;
    case 'header':
      console.log(`\n${colors.cyan}${colors.bright}=== ${message} ===${colors.reset}\n`);
      break;
    default:
      console.log(`${colors.blue}ℹ ${timestamp} - ${message}${colors.reset}`);
  }
}

// Helper function to execute commands and handle errors
function execute(command, workingDir = process.cwd()) {
  try {
    log(`Executing: ${command}`);
    const output = execSync(command, { 
      cwd: workingDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout?.toString() || '', 
      error: error.stderr?.toString() || error.message 
    };
  }
}

// Load environment variables from .env file if it exists
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const envContent = fs.readFileSync(filePath, 'utf8');
    const envVars = envContent.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
    
    envVars.forEach(line => {
      const [key, value] = line.split('=').map(part => part.trim());
      if (key && value) {
        process.env[key] = value.replace(/^["'](.*)["']$/, '$1'); // Remove quotes if present
      }
    });
    
    return true;
  }
  return false;
}

// Main verification function
async function runVerification() {
  const startTime = Date.now();
  const rootDir = process.cwd();
  let success = true;
  
  // Load environment variables
  const envLoaded = loadEnvFile(path.join(rootDir, '.env'));
  if (envLoaded) {
    log('Loaded environment variables from .env file');
  }
  
  log('MTG Commander Verification', 'header');
  
  // Check environment settings
  const isCI = process.env.CI === 'true';
  const isLocalDev = process.env.NODE_ENV === 'development' || process.env.LOCAL_DEV === 'true';
  const skipFrontendBuild = process.env.SKIP_FRONTEND_BUILD === 'true';
  
  log(`Running in ${isCI ? 'CI' : isLocalDev ? 'local development' : 'local'} environment`);
  if (skipFrontendBuild) {
    log('Frontend build will be skipped', 'warning');
  }
  
  // Backend verification
  log('Backend Verification', 'header');
  
  // Navigate to backend directory
  const backendDir = path.join(rootDir, 'backend');
  if (!fs.existsSync(backendDir)) {
    log('Backend directory not found', 'error');
    return false;
  }
  
  // Build backend
  log('Building backend solution...');
  const buildCommand = isLocalDev 
    ? 'dotnet build MTGCommander.sln' 
    : 'dotnet build MTGCommander.sln --configuration Release';
  const buildResult = execute(buildCommand, backendDir);
  
  if (!buildResult.success) {
    log('Backend build failed', 'error');
    log(buildResult.error || buildResult.output, 'error');
    success = false;
  } else {
    log('Backend build successful', 'success');
    
    // Run backend tests
    log('Running backend tests...');
    const testCommand = isLocalDev
      ? 'dotnet test MTGCommander.Tests/MTGCommander.Tests.csproj'
      : 'dotnet test MTGCommander.Tests/MTGCommander.Tests.csproj --configuration Release --no-build';
    const testResult = execute(testCommand, backendDir);
    
    if (!testResult.success) {
      log('Backend tests failed', 'error');
      log(testResult.error || testResult.output, 'error');
      success = false;
    } else {
      log('Backend tests passed', 'success');
    }
  }
  
  // Frontend verification
  log('Frontend Verification', 'header');
  
  // Navigate to frontend directory
  const frontendDir = path.join(rootDir, 'frontend');
  if (!fs.existsSync(frontendDir)) {
    log('Frontend directory not found', 'error');
    return false;
  }
  
  // Install dependencies (use npm install in local dev for better experience)
  log('Installing frontend dependencies...');
  const installCommand = isLocalDev ? 'npm install' : 'npm ci';
  const installResult = execute(installCommand, frontendDir);
  
  if (!installResult.success) {
    log('Frontend dependency installation failed', 'error');
    log(installResult.error || installResult.output, 'error');
    success = false;
  } else {
    log('Frontend dependencies installed', 'success');
    
    // Run frontend linting
    log('Running frontend linting...');
    const lintCommand = isLocalDev ? 'npm run lint:fix' : 'npm run lint';
    const lintResult = execute(lintCommand, frontendDir);
    
    if (!lintResult.success) {
      log('Frontend linting failed', 'error');
      log(lintResult.error || lintResult.output, 'error');
      success = false;
    } else {
      log('Frontend linting passed', 'success');
    }
    
    // Run frontend tests
    log('Running frontend tests...');
    const testCommand = isLocalDev && !isCI ? 'npm run test' : 'CI=true npm test';
    const frontendTestResult = execute(testCommand, frontendDir);
    
    if (!frontendTestResult.success) {
      log('Frontend tests failed', 'error');
      log(frontendTestResult.error || frontendTestResult.output, 'error');
      success = false;
    } else {
      log('Frontend tests passed', 'success');
    }
    
    // Build frontend (skip if configured to do so)
    if (!skipFrontendBuild) {
      log('Building frontend...');
      const buildCommand = isLocalDev ? 'npm run build' : 'CI=true npm run build';
      const frontendBuildResult = execute(buildCommand, frontendDir);
      
      if (!frontendBuildResult.success) {
        log('Frontend build failed', 'error');
        log(frontendBuildResult.error || frontendBuildResult.output, 'error');
        success = false;
      } else {
        log('Frontend build successful', 'success');
      }
    } else {
      log('Frontend build skipped as configured', 'warning');
    }
  }
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log('Verification Summary', 'header');
  
  if (success) {
    log(`All verification steps completed successfully in ${duration}s`, 'success');
  } else {
    log(`Verification failed after ${duration}s`, 'error');
  }
  
  return success;
}

// Run the verification
runVerification()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }); 