
/**
 * Script to deploy Supabase Edge Functions
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Supabase project reference
const projectRef = 'yzrovzblelpnftlegczx';

// Functions directory
const functionsDir = path.join(__dirname, '../functions');

function deployFunctions() {
  try {
    console.log('Deploying Supabase Edge Functions...');
    
    // Check if Supabase CLI is installed
    try {
      execSync('supabase --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('Supabase CLI not found. Please install it with "npm install -g supabase"');
      process.exit(1);
    }
    
    // Read function directories
    const functionDirs = fs.readdirSync(functionsDir)
      .filter(dir => 
        fs.statSync(path.join(functionsDir, dir)).isDirectory() &&
        fs.existsSync(path.join(functionsDir, dir, 'index.ts'))
      );
    
    console.log(`Found ${functionDirs.length} functions to deploy`);
    
    // Deploy each function
    for (const funcName of functionDirs) {
      console.log(`Deploying function: ${funcName}`);
      
      const funcPath = path.join(functionsDir, funcName);
      
      // Execute deployment
      execSync(
        `supabase functions deploy ${funcName} --project-ref ${projectRef}`,
        { 
          cwd: functionsDir,
          stdio: 'inherit' 
        }
      );
      
      console.log(`Successfully deployed function: ${funcName}`);
    }
    
    console.log('All functions deployed successfully');
  } catch (error) {
    console.error('Error during function deployment:', error);
    process.exit(1);
  }
}

deployFunctions();
