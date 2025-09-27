// 🧪 HEXAD NAVIGATION COMPREHENSIVE TEST SCRIPT
// Paste this into browser console (F12) on hexad-mastery.html

console.log('🚀 STARTING COMPREHENSIVE NAVIGATION TEST SUITE');
console.log('================================================');

// Test Results Storage
const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
};

function logTest(testName, status, message) {
    const timestamp = new Date().toLocaleTimeString();
    const result = {
        test: testName,
        status: status,
        message: message,
        timestamp: timestamp
    };
    
    testResults.details.push(result);
    
    if (status === 'PASS') {
        testResults.passed++;
        console.log(`✅ [${timestamp}] ${testName}: ${message}`);
    } else if (status === 'FAIL') {
        testResults.failed++;
        console.log(`❌ [${timestamp}] ${testName}: ${message}`);
    } else {
        testResults.warnings++;
        console.log(`⚠️ [${timestamp}] ${testName}: ${message}`);
    }
}

// Test 1: Check if all dimension elements exist
console.log('\n📋 TEST 1: DIMENSION ELEMENTS EXISTENCE');
console.log('----------------------------------------');

const dimensions = ['personal-dev', 'professional-dev', 'occupational-dev', 'financial-dev', 'relationship-dev', 'truth-education'];
const levels = [1, 2, 3, 4, 5];

let totalElements = 0;
let foundElements = 0;

dimensions.forEach(dim => {
    levels.forEach(level => {
        const elementId = `${dim}-l${level}`;
        const element = document.getElementById(elementId);
        totalElements++;
        
        if (element) {
            foundElements++;
            logTest(`Element Check`, 'PASS', `${elementId} found`);
        } else {
            logTest(`Element Check`, 'FAIL', `${elementId} NOT found`);
        }
    });
});

logTest('Element Summary', foundElements === totalElements ? 'PASS' : 'FAIL', 
    `Found ${foundElements}/${totalElements} dimension elements`);

// Test 2: Check initial states (all should be closed except maybe one)
console.log('\n🔒 TEST 2: INITIAL STATES');
console.log('-------------------------');

let activeCount = 0;
let closedCount = 0;

dimensions.forEach(dim => {
    levels.forEach(level => {
        const elementId = `${dim}-l${level}`;
        const element = document.getElementById(elementId);
        
        if (element) {
            const isActive = element.classList.contains('active');
            if (isActive) {
                activeCount++;
                logTest(`Initial State`, 'WARN', `${elementId} is open (expected closed)`);
            } else {
                closedCount++;
                logTest(`Initial State`, 'PASS', `${elementId} is closed`);
            }
        }
    });
});

logTest('Initial State Summary', activeCount <= 1 ? 'PASS' : 'WARN', 
    `${activeCount} open, ${closedCount} closed (max 1 open expected)`);

// Test 3: Check chevron states
console.log('\n🔽 TEST 3: CHEVRON STATES');
console.log('-------------------------');

let correctChevrons = 0;
let wrongChevrons = 0;

dimensions.forEach(dim => {
    levels.forEach(level => {
        const elementId = `${dim}-l${level}`;
        const element = document.getElementById(elementId);
        
        if (element) {
            const chevron = element.querySelector('.chevron-icon i');
            if (chevron) {
                const isActive = element.classList.contains('active');
                const hasUpChevron = chevron.classList.contains('fa-chevron-up');
                const hasDownChevron = chevron.classList.contains('fa-chevron-down');
                
                if ((isActive && hasUpChevron) || (!isActive && hasDownChevron)) {
                    correctChevrons++;
                    logTest(`Chevron State`, 'PASS', `${elementId} chevron correct`);
                } else {
                    wrongChevrons++;
                    logTest(`Chevron State`, 'FAIL', `${elementId} chevron wrong (active:${isActive}, up:${hasUpChevron}, down:${hasDownChevron})`);
                }
            } else {
                logTest(`Chevron State`, 'FAIL', `${elementId} no chevron found`);
                wrongChevrons++;
            }
        }
    });
});

logTest('Chevron Summary', wrongChevrons === 0 ? 'PASS' : 'FAIL', 
    `${correctChevrons} correct, ${wrongChevrons} wrong chevron states`);

// Test 4: Function availability
console.log('\n⚙️ TEST 4: FUNCTION AVAILABILITY');
console.log('--------------------------------');

if (typeof toggleDimension === 'function') {
    logTest('Function Check', 'PASS', 'toggleDimension function exists');
} else {
    logTest('Function Check', 'FAIL', 'toggleDimension function missing');
}

if (typeof showLevel === 'function') {
    logTest('Function Check', 'PASS', 'showLevel function exists');
} else {
    logTest('Function Check', 'FAIL', 'showLevel function missing');
}

if (typeof initializeNavigation === 'function') {
    logTest('Function Check', 'PASS', 'initializeNavigation function exists');
} else {
    logTest('Function Check', 'FAIL', 'initializeNavigation function missing');
}

// Test 5: Toggle functionality (automated test on Level 1)
console.log('\n🔧 TEST 5: TOGGLE FUNCTIONALITY');
console.log('-------------------------------');

async function testToggle(elementId, testName) {
    return new Promise((resolve) => {
        const element = document.getElementById(elementId);
        if (!element) {
            logTest('Toggle Test', 'FAIL', `${testName}: Element not found`);
            resolve();
            return;
        }
        
        const initialState = element.classList.contains('active');
        const initialChevron = element.querySelector('.chevron-icon i');
        const initialUp = initialChevron ? initialChevron.classList.contains('fa-chevron-up') : false;
        
        logTest('Toggle Test', 'INFO', `${testName}: Initial state - active:${initialState}, chevron-up:${initialUp}`);
        
        // Trigger toggle
        toggleDimension(elementId);
        
        // Check after delay
        setTimeout(() => {
            const newState = element.classList.contains('active');
            const newChevron = element.querySelector('.chevron-icon i');
            const newUp = newChevron ? newChevron.classList.contains('fa-chevron-up') : false;
            
            if (newState !== initialState) {
                logTest('Toggle Test', 'PASS', `${testName}: State changed (${initialState} → ${newState})`);
            } else {
                logTest('Toggle Test', 'FAIL', `${testName}: State did not change`);
            }
            
            if (newUp !== initialUp) {
                logTest('Toggle Test', 'PASS', `${testName}: Chevron changed (up:${initialUp} → up:${newUp})`);
            } else {
                logTest('Toggle Test', 'FAIL', `${testName}: Chevron did not change`);
            }
            
            resolve();
        }, 600);
    });
}

// Test Level 1 toggles sequentially
async function runToggleTests() {
    for (let i = 0; i < dimensions.length; i++) {
        const dim = dimensions[i];
        const elementId = `${dim}-l1`;
        await testToggle(elementId, `${dim} L1`);
        await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between tests
    }
    
    // Test 6: Level switching
    console.log('\n🎛️ TEST 6: LEVEL SWITCHING');
    console.log('--------------------------');
    
    levels.forEach(level => {
        try {
            showLevel(level);
            const activeLevel = document.querySelector('.level-content.active');
            if (activeLevel && activeLevel.dataset.level == level) {
                logTest('Level Switch', 'PASS', `Level ${level} activated correctly`);
            } else {
                logTest('Level Switch', 'FAIL', `Level ${level} not activated properly`);
            }
        } catch (error) {
            logTest('Level Switch', 'FAIL', `Level ${level} switch error: ${error.message}`);
        }
    });
    
    // Final Results
    console.log('\n📊 FINAL TEST RESULTS');
    console.log('=====================');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`⚠️ Warnings: ${testResults.warnings}`);
    console.log(`📋 Total Tests: ${testResults.details.length}`);
    
    const successRate = ((testResults.passed / testResults.details.length) * 100).toFixed(1);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (testResults.failed === 0) {
        console.log('🎉 ALL CRITICAL TESTS PASSED! Navigation system is working correctly.');
    } else {
        console.log('🔧 Some tests failed. Check the details above for specific issues.');
    }
    
    // Return results for external access
    window.hexadTestResults = testResults;
}

// Start toggle tests
runToggleTests();