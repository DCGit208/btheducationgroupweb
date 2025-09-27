// 🧪 LEVEL 1 SCROLL POSITION TEST
// Test to verify that clicking arrows doesn't jump to top of page

console.log('🧪 TESTING: No Auto-Scroll Jump Issue');
console.log('=====================================');

// Function to test scroll behavior
function testScrollBehavior() {
    console.log('📍 Step 1: Recording current scroll position...');
    const initialScrollY = window.scrollY;
    console.log(`Initial scroll position: ${initialScrollY}px`);
    
    // Scroll down a bit to simulate user being in middle of page
    if (initialScrollY < 500) {
        console.log('📍 Step 2: Scrolling down to simulate user position...');
        window.scrollTo(0, 800);
        
        setTimeout(() => {
            const testScrollY = window.scrollY;
            console.log(`Test scroll position: ${testScrollY}px`);
            
            console.log('📍 Step 3: Testing dimension toggle...');
            toggleDimension('personal-dev-l1');
            
            setTimeout(() => {
                const afterToggleScrollY = window.scrollY;
                console.log(`After toggle scroll position: ${afterToggleScrollY}px`);
                
                const scrollDifference = Math.abs(afterToggleScrollY - testScrollY);
                
                if (scrollDifference < 50) {
                    console.log('✅ SUCCESS: Page stayed at current position!');
                    console.log(`Scroll difference: ${scrollDifference}px (minimal)`);
                } else {
                    console.log('❌ ISSUE: Page jumped significantly');
                    console.log(`Scroll difference: ${scrollDifference}px (too much)`);
                }
                
                // Test closing too
                console.log('📍 Step 4: Testing close toggle...');
                setTimeout(() => {
                    const beforeCloseScrollY = window.scrollY;
                    toggleDimension('personal-dev-l1');
                    
                    setTimeout(() => {
                        const afterCloseScrollY = window.scrollY;
                        const closeDifference = Math.abs(afterCloseScrollY - beforeCloseScrollY);
                        
                        if (closeDifference < 50) {
                            console.log('✅ SUCCESS: Close also keeps position!');
                            console.log(`Close scroll difference: ${closeDifference}px`);
                        } else {
                            console.log('❌ ISSUE: Close causes scroll jump');
                            console.log(`Close scroll difference: ${closeDifference}px`);
                        }
                        
                        console.log('\n🎯 MANUAL TEST:');
                        console.log('1. Scroll to any Level 1 dimension');
                        console.log('2. Click the arrow to expand');
                        console.log('3. Verify you stay at the same position');
                        console.log('4. Click again to close');
                        console.log('5. Verify no scroll jumping occurs');
                        
                    }, 600);
                }, 1000);
            }, 600);
        }, 500);
    } else {
        // User is already scrolled down
        console.log('📍 Step 2: User already scrolled down, testing directly...');
        console.log('📍 Step 3: Testing dimension toggle...');
        toggleDimension('financial-dev-l1');
        
        setTimeout(() => {
            const afterToggleScrollY = window.scrollY;
            console.log(`After toggle scroll position: ${afterToggleScrollY}px`);
            
            const scrollDifference = Math.abs(afterToggleScrollY - initialScrollY);
            
            if (scrollDifference < 50) {
                console.log('✅ SUCCESS: Page stayed at current position!');
            } else {
                console.log('❌ ISSUE: Page jumped significantly');
            }
        }, 600);
    }
}

// Start the test
testScrollBehavior();