const { chromium } = require('playwright');

(async () => {
  console.log('📸 Taking focused footer screenshots...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Desktop - just footer
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer');
    await footer.screenshot({ path: 'screenshots/footer-only-desktop.png' });
    console.log('✅ Desktop footer screenshot saved');

    // Get footer dimensions
    const desktopBox = await footer.boundingBox();
    console.log(`   Desktop footer: ${desktopBox.width}px x ${desktopBox.height}px`);

    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);
    await footer.screenshot({ path: 'screenshots/footer-only-mobile.png' });
    console.log('✅ Mobile footer screenshot saved');
    
    const mobileBox = await footer.boundingBox();
    console.log(`   Mobile footer: ${mobileBox.width}px x ${mobileBox.height}px`);

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    await footer.screenshot({ path: 'screenshots/footer-only-tablet.png' });
    console.log('✅ Tablet footer screenshot saved');
    
    const tabletBox = await footer.boundingBox();
    console.log(`   Tablet footer: ${tabletBox.width}px x ${tabletBox.height}px`);

    console.log('\n🎉 Footer audit complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
