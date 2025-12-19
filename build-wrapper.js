const { execSync } = require('child_process');

console.log('Build script started...');

// Check if we are running inside the @cloudflare/next-on-pages invocation
// The goal is to detect if this is the "recursive" call from vercel build
// We use a custom environment variable IS_NEXT_ON_PAGES_RECURSIVE to track this.

if (process.env.IS_NEXT_ON_PAGES_RECURSIVE === '1') {
  console.log('Detected recursive call. Running core Next.js build...');
  try {
    execSync('next build', { stdio: 'inherit' });
  } catch (error) {
    console.error('Core Next.js build failed:', error);
    process.exit(1);
  }
} else {
  console.log('Top-level build detected. Launching @cloudflare/next-on-pages...');
  try {
    // We run next-on-pages, but we inject the flag so that when it calls back into
    // "npm run build", we take the other branch.
    execSync('npx @cloudflare/next-on-pages', { 
      stdio: 'inherit', 
      env: { ...process.env, IS_NEXT_ON_PAGES_RECURSIVE: '1' } 
    });
  } catch (error) {
    console.error('Cloudflare adapter build failed:', error);
    process.exit(1);
  }
}
