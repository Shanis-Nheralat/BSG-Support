const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting E2E Test for Careers Flow...\n');
  
  const browser = await chromium.launch({ 
    headless: false,  // Show browser window
    slowMo: 500       // Slow down actions for visibility
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Careers Page
    console.log('📄 Test 1: Navigating to Careers Page...');
    await page.goto('http://localhost:3001/careers');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/01-careers-page.png', fullPage: true });
    console.log('✅ Screenshot saved: 01-careers-page.png');
    
    // Check for job listings
    const jobCards = await page.locator('.rounded-xl.border.bg-white').count();
    console.log(`   Found ${jobCards} job card(s) on careers page\n`);

    // Test 2: Login Page
    console.log('📄 Test 2: Navigating to Admin Login...');
    await page.goto('http://localhost:3001/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/02-login-page.png' });
    console.log('✅ Screenshot saved: 02-login-page.png');

    // Try to login - Input component uses type="text" for email field
    console.log('   Attempting login...');
    await page.locator('input[type="text"]').first().fill('Shanis@backsureglobalsupport.com');
    await page.locator('input[type="password"]').fill('Safiya@123');
    await page.screenshot({ path: 'screenshots/03-login-filled.png' });
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/04-after-login.png' });
    console.log('✅ Screenshot saved: 04-after-login.png\n');

    // Test 3: Admin Jobs Page
    console.log('📄 Test 3: Navigating to Admin Jobs...');
    await page.goto('http://localhost:3001/admin/jobs');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/05-admin-jobs.png', fullPage: true });
    console.log('✅ Screenshot saved: 05-admin-jobs.png');
    
    // Check for New Job button
    const newJobBtn = await page.locator('text=New Job').count();
    console.log(`   "New Job" button found: ${newJobBtn > 0 ? 'Yes' : 'No'}\n`);

    // Test 4: Admin Candidates Page
    console.log('📄 Test 4: Navigating to Admin Candidates...');
    await page.goto('http://localhost:3001/admin/candidates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/06-admin-candidates.png', fullPage: true });
    console.log('✅ Screenshot saved: 06-admin-candidates.png');

    // Check for Job Posting column
    const jobPostingColumn = await page.locator('th:has-text("Job Posting")').count();
    console.log(`   "Job Posting" column found: ${jobPostingColumn > 0 ? 'Yes' : 'No'}`);
    
    // Check for job filter dropdown
    const jobFilter = await page.locator('select option:has-text("All Jobs")').count();
    console.log(`   Job filter dropdown found: ${jobFilter > 0 ? 'Yes' : 'No'}\n`);

    console.log('🎉 E2E Test Complete! Check screenshots folder for results.');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    await page.screenshot({ path: 'screenshots/error.png' });
  } finally {
    await browser.close();
  }
})();
