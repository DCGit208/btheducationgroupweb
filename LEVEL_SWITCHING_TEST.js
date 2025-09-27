// 🧪 LEVEL SWITCHING TEST
// Test to verify level tab navigation works properly

console.log('🎛️ TESTING LEVEL SWITCHING FUNCTIONALITY');
console.log('========================================');

const levels = [1, 2, 3, 4, 5];
let levelTestResults = { passed: 0, failed: 0, details: [] };

function testLevelSwitch(level, index) {
    console.log(`\n🔧 Testing Level ${level} switch...`);
    
    // Check if showLevel function exists
    if (typeof showLevel !== 'function') {
        console.log('❌ showLevel function not available');
        levelTestResults.failed++;
        return;
    }
    
    // Call showLevel
    showLevel(level);
    
    setTimeout(() => {
        // Check if correct level content is active
        const levelContent = document.querySelector(`.level-content[data-level="${level}"]`);
        const levelTab = document.querySelector(`.level-tab[data-level="${level}"]`);
        
        if (levelContent && levelContent.classList.contains('active')) {
            console.log(`✅ Level ${level} content activated`);
            levelTestResults.passed++;
        } else {
            console.log(`❌ Level ${level} content not activated`);
            levelTestResults.failed++;
            levelTestResults.details.push(`Level ${level} content issue`);
        }
        
        if (levelTab && levelTab.classList.contains('active')) {
            console.log(`✅ Level ${level} tab activated`);
            levelTestResults.passed++;
        } else {
            console.log(`❌ Level ${level} tab not activated`);
            levelTestResults.failed++;
            levelTestResults.details.push(`Level ${level} tab issue`);
        }
        
        // Test if we can see dimensions in this level
        const dimensionsInLevel = document.querySelectorAll(`.level-content[data-level="${level}"] .dimension-content`);
        console.log(`📊 Found ${dimensionsInLevel.length} dimensions in Level ${level}`);
        
        if (dimensionsInLevel.length > 0) {
            console.log(`✅ Level ${level} has dimensions`);
            levelTestResults.passed++;
        } else {
            console.log(`❌ Level ${level} has no dimensions`);
            levelTestResults.failed++;
            levelTestResults.details.push(`Level ${level} missing dimensions`);
        }
        
        // Continue to next level or show results
        if (index < levels.length - 1) {
            setTimeout(() => {
                testLevelSwitch(levels[index + 1], index + 1);
            }, 500);
        } else {
            // Show final results
            console.log('\n📊 LEVEL SWITCHING RESULTS');
            console.log('==========================');
            console.log(`✅ Passed: ${levelTestResults.passed}`);
            console.log(`❌ Failed: ${levelTestResults.failed}`);
            
            if (levelTestResults.failed === 0) {
                console.log('🎉 ALL LEVEL SWITCHING WORKING!');
                
                // Now test combined functionality
                console.log('\n🎯 COMBINED TEST: Level Switch + Dimension Toggle');
                console.log('================================================');
                
                // Switch to Level 2 and test a dimension
                showLevel(2);
                setTimeout(() => {
                    console.log('🔧 Testing dimension toggle in Level 2...');
                    toggleDimension('professional-dev-l2');
                    
                    setTimeout(() => {
                        const l2Dimension = document.getElementById('professional-dev-l2');
                        if (l2Dimension && l2Dimension.classList.contains('active')) {
                            console.log('✅ PERFECT! Level switching + dimension toggle working together');
                        } else {
                            console.log('❌ Issue with combined functionality');
                        }
                    }, 600);
                }, 500);
                
            } else {
                console.log('🔧 ISSUES FOUND:');
                levelTestResults.details.forEach(detail => console.log(`- ${detail}`));
            }
        }
    }, 500);
}

// Start level switching test
console.log('🚀 Starting level switching test...');
testLevelSwitch(levels[0], 0);

console.log('\n💡 MANUAL TEST INSTRUCTIONS:');
console.log('1. Click Level 1 tab - should show Level 1 content');
console.log('2. Click Level 2 tab - should show Level 2 content');
console.log('3. Try toggling dimensions in each level');
console.log('4. Verify each level has working navigation');