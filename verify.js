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

// Main verification function
async function runVerification() {
  const startTime = Date.now();
  const rootDir = process.cwd();
  let success = true;
  
  log('MTG Commander Verification', 'header');
  
  // Check if running in CI environment
  const isCI = process.env.CI === 'true';
  log(`Running in ${isCI ? 'CI' : 'local'} environment`);
  
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
  const buildResult = execute('dotnet build MTGCommander.sln --configuration Release', backendDir);
  
  if (!buildResult.success) {
    log('Backend build failed', 'error');
    log(buildResult.error || buildResult.output, 'error');
    success = false;
  } else {
    log('Backend build successful', 'success');
    
    // Run backend tests
    log('Running backend tests...');
    const testResult = execute('dotnet test MTGCommander.Tests/MTGCommander.Tests.csproj --configuration Release --no-build', backendDir);
    
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
  
  // Install dependencies
  log('Installing frontend dependencies...');
  const installResult = execute('npm ci', frontendDir);
  
  if (!installResult.success) {
    log('Frontend dependency installation failed', 'error');
    log(installResult.error || installResult.output, 'error');
    success = false;
  } else {
    log('Frontend dependencies installed', 'success');
    
    // Build frontend
    log('Building frontend...');
    const frontendBuildResult = execute('npm run build', frontendDir);
    
    if (!frontendBuildResult.success) {
      log('Frontend build failed', 'error');
      log(frontendBuildResult.error || frontendBuildResult.output, 'error');
      success = false;
    } else {
      log('Frontend build successful', 'success');
      
      // Run frontend tests
      log('Running frontend tests...');
      const frontendTestResult = execute('CI=true npm test', frontendDir);
      
      if (!frontendTestResult.success) {
        log('Frontend tests failed', 'error');
        log(frontendTestResult.error || frontendTestResult.output, 'error');
        success = false;
      } else {
        log('Frontend tests passed', 'success');
      }
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