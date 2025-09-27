// 🧪 PASTE THIS INTO BROWSER CONSOLE TO TEST NAVIGATION
// Open http://localhost:8007/hexad-mastery.html in your browser
// Press F12 to open console, then paste this entire script

console.log('🚀 STARTING HEXAD NAVIGATION VERIFICATION TEST');
console.log('============================================');

// Test Results
let testsPassed = 0;
let testsFailed = 0;

function testLog(message, status) {
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${emoji} ${message}`);
    if (status === 'PASS') testsPassed++;
    if (status === 'FAIL') testsFailed++;
}

// Test 1: Check if Personal Development L1 exists and works
console.log('\n📋 Test 1: Personal Development L1');
const personalDevL1 = document.getElementById('personal-dev-l1');
if (personalDevL1) {
    testLog('Personal Dev L1 element found', 'PASS');
    
    // Check initial state
    const initialActive = personalDevL1.classList.contains('active');
    testLog(`Initial state - Active: ${initialActive}`, 'INFO');
    
    // Try clicking it
    console.log('🔧 Attempting to toggle Personal Dev L1...');
    if (typeof toggleDimension === 'function') {
        testLog('toggleDimension function exists', 'PASS');
        
        // Call the function
        toggleDimension('personal-dev-l1');
        
        // Check after a delay
        setTimeout(() => {
            const newState = personalDevL1.classList.contains('active');
            if (newState !== initialActive) {
                testLog(`State changed successfully: ${initialActive} → ${newState}`, 'PASS');
            } else {
                testLog(`State did NOT change: ${initialActive} → ${newState}`, 'FAIL');
            }
            
            // Visual check
            const computedStyle = window.getComputedStyle(personalDevL1);
            const maxHeight = computedStyle.maxHeight;
            const opacity = computedStyle.opacity;
            testLog(`CSS values - maxHeight: ${maxHeight}, opacity: ${opacity}`, 'INFO');
            
            // Test 2: Try clicking again to close
            console.log('\n📋 Test 2: Toggle Back (Close)');
            setTimeout(() => {
                toggleDimension('personal-dev-l1');
                setTimeout(() => {
                    const finalState = personalDevL1.classList.contains('active');
                    if (finalState === initialActive) {
                        testLog(`Successfully toggled back to initial state: ${finalState}`, 'PASS');
                    } else {
                        testLog(`Failed to toggle back: expected ${initialActive}, got ${finalState}`, 'FAIL');
                    }
                    
                    // Test 3: Test another dimension
                    console.log('\n📋 Test 3: Professional Development L1');
                    const professionalDev = document.getElementById('professional-dev-l1');
                    if (professionalDev) {
                        testLog('Professional Dev L1 element found', 'PASS');
                        toggleDimension('professional-dev-l1');
                        
                        setTimeout(() => {
                            const profState = professionalDev.classList.contains('active');
                            testLog(`Professional Dev L1 toggled - Active: ${profState}`, profState ? 'PASS' : 'FAIL');
                            
                            // Final summary
                            console.log('\n📊 FINAL TEST RESULTS');
                            console.log('=====================');
                            console.log(`✅ Tests Passed: ${testsPassed}`);
                            console.log(`❌ Tests Failed: ${testsFailed}`);
                            console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
                            
                            if (testsFailed === 0) {
                                console.log('🎉 ALL TESTS PASSED! Navigation is working!');
                            } else {
                                console.log('🔧 Some tests failed. Check the details above.');
                            }
                            
                        }, 600);
                    } else {
                        testLog('Professional Dev L1 element not found', 'FAIL');
                    }
                }, 600);
            }, 600);
        }, 600);
        
    } else {
        testLog('toggleDimension function NOT found', 'FAIL');
    }
} else {
    testLog('Personal Dev L1 element NOT found', 'FAIL');
}

// Quick element count
const allDimensions = document.querySelectorAll('[id$="-l1"], [id$="-l2"], [id$="-l3"], [id$="-l4"], [id$="-l5"]');
console.log(`\n📊 Found ${allDimensions.length} total dimension elements`);

// Check for onclick handlers
const onclickElements = document.querySelectorAll('[onclick*="toggleDimension"]');
console.log(`🔗 Found ${onclickElements.length} elements with toggleDimension onclick handlers`);

console.log('\n💡 INSTRUCTIONS:');
console.log('1. Watch the console output above');
console.log('2. If tests pass, try clicking dimension headers manually');
console.log('3. Check if content expands/collapses smoothly');
console.log('4. Verify chevrons change from ▼ to ▲ and back');