// 🧪 LEVEL 1 PROFESSIONAL SCROLL TEST
// Copy and paste this into browser console at http://localhost:8007/hexad-mastery.html

console.log('🚀 LEVEL 1 PROFESSIONAL SCROLL TEST');
console.log('=====================================');

// Test Level 1 dimensions with professional features
const level1Dimensions = [
    'personal-dev-l1',
    'professional-dev-l1', 
    'occupational-dev-l1',
    'financial-dev-l1',
    'relationship-dev-l1',
    'truth-education-l1'
];

let testResults = { passed: 0, failed: 0 };

function testProfessionalFeatures(dimensionId, index) {
    console.log(`\n📋 Testing ${dimensionId}...`);
    
    const content = document.getElementById(dimensionId);
    if (!content) {
        console.log(`❌ ${dimensionId} not found`);
        testResults.failed++;
        return;
    }
    
    // Test 1: Basic toggle
    console.log('🔧 Testing toggle...');
    toggleDimension(dimensionId);
    
    setTimeout(() => {
        const isActive = content.classList.contains('active');
        if (isActive) {
            console.log(`✅ ${dimensionId} opened successfully`);
            testResults.passed++;
            
            // Test 2: Check CSS properties
            const computedStyle = window.getComputedStyle(content);
            const maxHeight = computedStyle.maxHeight;
            const overflowY = computedStyle.overflowY;
            
            console.log(`📏 Max height: ${maxHeight}`);
            console.log(`📜 Overflow Y: ${overflowY}`);
            
            if (maxHeight.includes('vh')) {
                console.log('✅ Professional viewport-based height detected');
                testResults.passed++;
            } else {
                console.log('❌ Not using viewport-based height');
                testResults.failed++;
            }
            
            if (overflowY === 'auto') {
                console.log('✅ Professional scroll enabled');
                testResults.passed++;
            } else {
                console.log('❌ Scroll not properly configured');
                testResults.failed++;
            }
            
            // Test 3: Check scroll detection
            setTimeout(() => {
                const hasScrollClass = content.classList.contains('has-scroll');
                const actuallyScrollable = content.scrollHeight > content.clientHeight;
                
                console.log(`📊 Content height: ${content.scrollHeight}px, Visible: ${content.clientHeight}px`);
                console.log(`📜 Has scroll class: ${hasScrollClass}`);
                console.log(`📜 Actually scrollable: ${actuallyScrollable}`);
                
                if (actuallyScrollable === hasScrollClass) {
                    console.log('✅ Scroll detection working correctly');
                    testResults.passed++;
                } else {
                    console.log('⚠️ Scroll detection mismatch (may be timing issue)');
                    testResults.failed++;
                }
                
                // Test next dimension or show results
                if (index < level1Dimensions.length - 1) {
                    setTimeout(() => {
                        toggleDimension(dimensionId); // Close current
                        setTimeout(() => {
                            testProfessionalFeatures(level1Dimensions[index + 1], index + 1);
                        }, 300);
                    }, 500);
                } else {
                    // Show final results
                    setTimeout(() => {
                        console.log('\n📊 FINAL LEVEL 1 TEST RESULTS');
                        console.log('==============================');
                        console.log(`✅ Tests Passed: ${testResults.passed}`);
                        console.log(`❌ Tests Failed: ${testResults.failed}`);
                        console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
                        
                        if (testResults.failed === 0) {
                            console.log('🎉 ALL LEVEL 1 PROFESSIONAL FEATURES WORKING!');
                        } else if (testResults.passed > testResults.failed) {
                            console.log('✅ MOSTLY WORKING - Minor issues detected');
                        } else {
                            console.log('🔧 NEEDS MORE WORK - Several issues detected');
                        }
                        
                        console.log('\n💡 MANUAL TEST INSTRUCTIONS:');
                        console.log('1. Click each Level 1 dimension header');
                        console.log('2. Check that content expands to reasonable height');
                        console.log('3. For large content, verify smooth scrolling works');
                        console.log('4. Check for professional scroll indicators');
                        console.log('5. Verify smooth animations and transitions');
                    }, 1000);
                }
            }, 600); // Wait for scroll detection
            
        } else {
            console.log(`❌ ${dimensionId} failed to open`);
            testResults.failed++;
        }
    }, 600); // Wait for animation
}

// Start testing
testProfessionalFeatures(level1Dimensions[0], 0);

console.log('\n🎯 WHAT TO EXPECT:');
console.log('- Smooth opening animations');
console.log('- Content limited to 80% of viewport height');
console.log('- Professional scrollbars for large content');
console.log('- Smooth scroll to opened dimension');
console.log('- Fade indicators for scrollable content');
console.log('- Animated content loading effects');