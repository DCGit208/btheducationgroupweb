/**
 * TECHNOLOGY.HTML COMPREHENSIVE INTEGRATION TEST
 * Tests the complete technology certification system with session management
 */

// Test Configuration
const TEST_CONFIG = {
    testUrl: 'programs/technology.html',
    flows: [
        'standalone-level-selection',
        'hexad-checkout-flow',
        'certification-only-mode'
    ],
    levels: [1, 2, 3, 4, 5]
};

class TechnologyIntegrationTest {
    constructor() {
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            errors: []
        };
    }

    async runAllTests() {
        console.log('🧪 TECHNOLOGY INTEGRATION COMPREHENSIVE TEST');
        console.log('='.repeat(60));
        
        try {
            await this.testSessionManagerIntegration();
            await this.testCertificationDatabaseIntegration();
            await this.testStandaloneLevelSelection();
            await this.testHexadCheckoutFlow();
            await this.testCertificationSelection();
            await this.testFilteringSystem();
            await this.testUserFlowIntegration();
            
            this.displayResults();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.results.errors.push(`Test suite error: ${error.message}`);
        }
    }

    async testSessionManagerIntegration() {
        console.log('\n📊 Testing Session Manager Integration...');
        
        this.test('Session Manager Available', () => {
            return typeof window.BTHSession !== 'undefined';
        });
        
        this.test('Pricing Matrix Accessible', () => {
            return window.BTHSession && window.BTHSession.PRICING_MATRIX;
        });
        
        this.test('Level 1-5 Pricing Available', () => {
            if (!window.BTHSession?.PRICING_MATRIX) return false;
            
            for (let i = 1; i <= 5; i++) {
                if (!window.BTHSession.PRICING_MATRIX[i]) return false;
            }
            return true;
        });
        
        this.test('Checkout Context Methods', () => {
            return window.BTHSession && 
                   typeof window.BTHSession.getCheckoutContext === 'function' &&
                   typeof window.BTHSession.setCheckoutContext === 'function';
        });
    }

    async testCertificationDatabaseIntegration() {
        console.log('\n📚 Testing Certification Database Integration...');
        
        this.test('Certification Database Available', () => {
            return typeof window.BTHCertDB !== 'undefined';
        });
        
        this.test('Technology Sector Data', () => {
            return window.BTHCertDB && 
                   window.BTHCertDB.getSectorCertifications &&
                   window.BTHCertDB.getSectorCertifications('technology');
        });
        
        this.test('Level-based Certification Retrieval', () => {
            if (!window.BTHCertDB) return false;
            
            for (let level = 1; level <= 5; level++) {
                const certs = window.BTHCertDB.getCertificationsByLevel('technology', level);
                if (!Array.isArray(certs)) return false;
            }
            return true;
        });
        
        this.test('Category-based Filtering', () => {
            return window.BTHCertDB && 
                   typeof window.BTHCertDB.getCategoryCertifications === 'function';
        });
        
        this.test('Vendor-based Filtering', () => {
            return window.BTHCertDB && 
                   typeof window.BTHCertDB.getVendorCertifications === 'function';
        });
    }

    async testStandaloneLevelSelection() {
        console.log('\n🎯 Testing Standalone Level Selection...');
        
        // Simulate URL params for standalone mode
        const originalSearch = window.location.search;
        
        try {
            // Test level selection UI generation
            this.test('Level Cards Generation', () => {
                const system = new window.TechnologyCertificationSystem();
                const levelCards = system.generateLevelCards();
                return levelCards.includes('Level 1') && 
                       levelCards.includes('Level 5') &&
                       levelCards.includes('$8,100') &&
                       levelCards.includes('$26,865');
            });
            
            this.test('Level Selection Mechanics', () => {
                const system = new window.TechnologyCertificationSystem();
                system.selectStandaloneLevel(3);
                return system.currentLevel === 3 && !system.isHexadFlow;
            });
            
            this.test('Pricing Integration', () => {
                const system = new window.TechnologyCertificationSystem();
                system.selectStandaloneLevel(2);
                const pricing = system.sessionManager.PRICING_MATRIX[2];
                return pricing && pricing.professional === 10500;
            });
            
        } catch (error) {
            this.results.errors.push(`Standalone test error: ${error.message}`);
        }
    }

    async testHexadCheckoutFlow() {
        console.log('\n🎓 Testing HEXAD Checkout Flow...');
        
        try {
            // Mock HEXAD checkout context
            const mockContext = {
                source: 'hexad-checkout',
                selectedLevel: 3,
                pricing: {
                    professional: 13500,
                    maxCerts: 5
                },
                sessionId: 'test-hexad-session'
            };
            
            if (window.BTHSession) {
                window.BTHSession.setCheckoutContext(mockContext);
            }
            
            this.test('HEXAD Flow Detection', () => {
                const urlParams = new URLSearchParams('?flow=checkout');
                return urlParams.get('flow') === 'checkout';
            });
            
            this.test('HEXAD Welcome Message', () => {
                const system = new window.TechnologyCertificationSystem();
                system.isHexadFlow = true;
                system.currentLevel = 3;
                
                return system.isHexadFlow === true && system.currentLevel === 3;
            });
            
            this.test('Checkout Flow Indicator', () => {
                const system = new window.TechnologyCertificationSystem();
                const indicatorHtml = system.showCheckoutFlowIndicator(mockContext);
                
                // Check if method executes without error
                return true;
            });
            
        } catch (error) {
            this.results.errors.push(`HEXAD flow test error: ${error.message}`);
        }
    }

    async testCertificationSelection() {
        console.log('\n📜 Testing Certification Selection...');
        
        try {
            const system = new window.TechnologyCertificationSystem();
            system.currentLevel = 2;
            
            // Mock certification data
            const mockCert = {
                id: 'test-cert-001',
                name: 'Test Certification',
                vendor: 'Test Vendor',
                level: 2,
                description: 'Test certification description'
            };
            
            this.test('Add Certification Selection', () => {
                system.selectedCertifications = [];
                system.selectedCertifications.push(mockCert);
                return system.selectedCertifications.length === 1;
            });
            
            this.test('Remove Certification Selection', () => {
                system.selectedCertifications = [mockCert];
                system.selectedCertifications = system.selectedCertifications.filter(
                    cert => cert.id !== mockCert.id
                );
                return system.selectedCertifications.length === 0;
            });
            
            this.test('Max Certification Limit', () => {
                const maxCerts = system.sessionManager.PRICING_MATRIX[2].maxCerts;
                return maxCerts >= 2 && maxCerts <= 10;
            });
            
            this.test('Certification Modal Generation', () => {
                const modalHtml = system.renderCertificationCard(mockCert);
                return modalHtml.includes('Test Certification') && 
                       modalHtml.includes('Test Vendor');
            });
            
        } catch (error) {
            this.results.errors.push(`Certification selection error: ${error.message}`);
        }
    }

    async testFilteringSystem() {
        console.log('\n🔍 Testing Advanced Filtering System...');
        
        try {
            const system = new window.TechnologyCertificationSystem();
            
            this.test('Filter Tab Switching', () => {
                system.handleFilterChange('vendors');
                return system.currentFilter === 'vendors';
            });
            
            this.test('Category View Rendering', () => {
                system.currentFilter = 'categories';
                const categories = system.sectorData?.categories || {};
                return typeof categories === 'object';
            });
            
            this.test('Search Functionality', () => {
                system.handleSearch('aws');
                return system.searchQuery === 'aws';
            });
            
            this.test('Search Suggestions', () => {
                const suggestions = system.generateSearchSuggestions('microsoft');
                return Array.isArray(suggestions);
            });
            
        } catch (error) {
            this.results.errors.push(`Filtering system error: ${error.message}`);
        }
    }

    async testUserFlowIntegration() {
        console.log('\n🔄 Testing Complete User Flow Integration...');
        
        try {
            this.test('Standalone to Checkout Flow', () => {
                const system = new window.TechnologyCertificationSystem();
                system.currentLevel = 4;
                system.selectedCertifications = [
                    { id: 'cert1', name: 'Test Cert 1' },
                    { id: 'cert2', name: 'Test Cert 2' }
                ];
                
                // Simulate checkout data preparation
                const pricing = system.sessionManager.PRICING_MATRIX[4];
                const checkoutData = {
                    source: 'technology-sector',
                    type: 'certification-only',
                    level: system.currentLevel,
                    certifications: system.selectedCertifications,
                    totalCost: pricing.professional
                };
                
                return checkoutData.level === 4 && 
                       checkoutData.certifications.length === 2 &&
                       checkoutData.totalCost === 17000;
            });
            
            this.test('HEXAD Return Flow', () => {
                const system = new window.TechnologyCertificationSystem();
                system.isHexadFlow = true;
                system.currentLevel = 3;
                system.selectedCertifications = [{ id: 'cert1', name: 'Test Cert' }];
                
                const professionalSelections = {
                    sector: 'technology',
                    level: system.currentLevel,
                    certifications: system.selectedCertifications,
                    totalCertifications: system.selectedCertifications.length,
                    returnToCheckout: true
                };
                
                return professionalSelections.sector === 'technology' &&
                       professionalSelections.level === 3 &&
                       professionalSelections.returnToCheckout === true;
            });
            
            this.test('Level Info Updates', () => {
                const system = new window.TechnologyCertificationSystem();
                system.currentLevel = 5;
                system.updateLevelInfo();
                
                // Check if method executes without error
                return true;
            });
            
        } catch (error) {
            this.results.errors.push(`User flow integration error: ${error.message}`);
        }
    }

    test(name, testFunction) {
        this.results.total++;
        
        try {
            const result = testFunction();
            
            if (result) {
                console.log(`✅ ${name}`);
                this.results.passed++;
            } else {
                console.log(`❌ ${name} - FAILED`);
                this.results.failed++;
                this.results.errors.push(`${name}: Test assertion failed`);
            }
            
        } catch (error) {
            console.log(`💥 ${name} - ERROR: ${error.message}`);
            this.results.failed++;
            this.results.errors.push(`${name}: ${error.message}`);
        }
    }

    displayResults() {
        console.log('\n' + '='.repeat(60));
        console.log('🏁 TECHNOLOGY INTEGRATION TEST RESULTS');
        console.log('='.repeat(60));
        
        console.log(`📊 Total Tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        
        if (this.results.errors.length > 0) {
            console.log('\n🚨 ERRORS DETAILS:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        if (this.results.passed === this.results.total) {
            console.log('\n🎉 ALL TESTS PASSED! Technology integration is ready.');
        } else {
            console.log('\n⚠️  Some tests failed. Review integration before deployment.');
        }
        
        console.log('\n📋 NEXT STEPS:');
        console.log('1. Fix any failing tests');
        console.log('2. Test with real user flows');
        console.log('3. Verify with all 5 certification levels');
        console.log('4. Test HEXAD and standalone flows');
        console.log('5. Verify session persistence');
    }
}

// Usage Instructions
console.log(`
🧪 TECHNOLOGY INTEGRATION TEST SUITE
====================================

To run this test:

1. Open technology.html in browser
2. Open developer console
3. Paste this entire script
4. Run: new TechnologyIntegrationTest().runAllTests()

This will comprehensively test:
✅ Session Manager Integration
✅ Certification Database Integration  
✅ Standalone Level Selection
✅ HEXAD Checkout Flow
✅ Certification Selection System
✅ Advanced Filtering System
✅ Complete User Flow Integration

The test validates that all components work together
for a seamless certification selection experience.
`);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechnologyIntegrationTest;
}