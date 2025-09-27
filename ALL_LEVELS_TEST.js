// 🧪 ALL LEVELS NAVIGATION TEST
// Test to verify that Level 1 fixes work across all levels

console.log('🚀 TESTING ALL LEVELS NAVIGATION');
console.log('================================');

// All dimensions across all levels
const allDimensions = [
    // Level 1
    'personal-dev-l1', 'professional-dev-l1', 'occupational-dev-l1', 
    'financial-dev-l1', 'relationship-dev-l1', 'truth-education-l1',
    
    // Level 2
    'personal-dev-l2', 'professional-dev-l2', 'occupational-dev-l2',
    'financial-dev-l2', 'relationship-dev-l2', 'truth-education-l2',
    
    // Level 3
    'personal-dev-l3', 'professional-dev-l3', 'occupational-dev-l3',
    'financial-dev-l3', 'relationship-dev-l3', 'truth-education-l3',
    
    // Level 4
    'personal-dev-l4', 'professional-dev-l4', 'occupational-dev-l4',
    'financial-dev-l4', 'relationship-dev-l4', 'truth-education-l4',
    
    // Level 5
    'personal-dev-l5', 'professional-dev-l5', 'occupational-dev-l5',
    'financial-dev-l5', 'relationship-dev-l5', 'truth-education-l5'
];

let testResults = { 
    found: 0, 
    missing: 0, 
    working: 0, 
    broken: 0,
    details: []
};

console.log(`🔍 Testing ${allDimensions.length} total dimensions...`);

// Test 1: Check if all elements exist
console.log('\n📋 STEP 1: Element Existence Check');
allDimensions.forEach(dimId => {
    const element = document.getElementById(dimId);
    if (element) {
        testResults.found++;
        console.log(`✅ ${dimId} - FOUND`);
    } else {
        testResults.missing++;
        console.log(`❌ ${dimId} - MISSING`);
        testResults.details.push(`Missing element: ${dimId}`);
    }
});

console.log(`\n📊 Element Summary: ${testResults.found} found, ${testResults.missing} missing`);

// Test 2: Check CSS classes
console.log('\n📋 STEP 2: CSS Class Verification');
const foundElements = allDimensions.filter(id => document.getElementById(id));
foundElements.forEach(dimId => {
    const element = document.getElementById(dimId);
    const hasCorrectClass = element.classList.contains('dimension-content');
    if (hasCorrectClass) {
        console.log(`✅ ${dimId} - Has correct CSS class`);
    } else {
        console.log(`❌ ${dimId} - Missing dimension-content class`);
        testResults.details.push(`CSS issue: ${dimId}`);
    }
});

// Test 3: Quick toggle test on one dimension per level
console.log('\n📋 STEP 3: Quick Toggle Test (One Per Level)');
const testDimensions = [
    'personal-dev-l1', 'personal-dev-l2', 'personal-dev-l3', 
    'personal-dev-l4', 'personal-dev-l5'
];

function testLevelToggle(dimId, index) {
    if (index >= testDimensions.length) {
        // Show final results
        console.log('\n📊 FINAL RESULTS');
        console.log('================');
        console.log(`📋 Elements Found: ${testResults.found}/${allDimensions.length}`);
        console.log(`✅ Toggle Tests: ${testResults.working}`);
        console.log(`❌ Toggle Failures: ${testResults.broken}`);
        
        if (testResults.missing === 0 && testResults.broken === 0) {
            console.log('🎉 ALL LEVELS WORKING PERFECTLY!');
        } else if (testResults.working > testResults.broken) {
            console.log('✅ MOSTLY WORKING - Minor issues detected');
        } else {
            console.log('🔧 NEEDS WORK - Multiple issues found');
        }
        
        if (testResults.details.length > 0) {
            console.log('\n🔍 Issues Found:');
            testResults.details.forEach(detail => console.log(`- ${detail}`));
        }
        
        console.log('\n💡 Next Steps:');
        console.log('1. Fix any missing elements or CSS issues');
        console.log('2. Test manual clicking on each level');
        console.log('3. Verify professional scroll behavior');
        return;
    }
    
    const dimId = testDimensions[index];
    const element = document.getElementById(dimId);
    
    if (!element) {
        console.log(`❌ ${dimId.toUpperCase()} - Element not found`);
        testResults.broken++;
        testResults.details.push(`Missing for toggle test: ${dimId}`);
        setTimeout(() => testLevelToggle(dimId, index + 1), 100);
        return;
    }
    
    console.log(`🔧 Testing ${dimId.toUpperCase()}...`);
    const initialState = element.classList.contains('active');
    
    // Try toggle
    if (typeof toggleDimension === 'function') {
        toggleDimension(dimId);
        
        setTimeout(() => {
            const newState = element.classList.contains('active');
            if (newState !== initialState) {
                console.log(`✅ ${dimId.toUpperCase()} - Toggle WORKING`);
                testResults.working++;
                
                // Close it
                setTimeout(() => {
                    toggleDimension(dimId);
                    setTimeout(() => testLevelToggle(dimId, index + 1), 300);
                }, 300);
            } else {
                console.log(`❌ ${dimId.toUpperCase()} - Toggle FAILED`);
                testResults.broken++;
                testResults.details.push(`Toggle failed: ${dimId}`);
                setTimeout(() => testLevelToggle(dimId, index + 1), 300);
            }
        }, 600);
    } else {
        console.log(`❌ toggleDimension function not available`);
        testResults.broken++;
        setTimeout(() => testLevelToggle(dimId, index + 1), 100);
    }
}

// Start level testing
setTimeout(() => {
    testLevelToggle(testDimensions[0], 0);
}, 1000);

console.log('\n🎯 WHAT THIS TEST DOES:');
console.log('- Checks if all 30 dimension elements exist');
console.log('- Verifies CSS classes are correct');
console.log('- Tests toggle functionality on each level');
console.log('- Reports any issues found');
console.log('- Confirms if Level 1 fixes work on all levels');