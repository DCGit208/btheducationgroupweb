# 🎯 HEXAD PRICING & CROSS-PAGE INTEGRATION REFERENCE
## Master Technical Architecture & Implementation Guide

---

## **📊 CORRECTED PRICING STRUCTURE - MASTER REFERENCE**

### **PRICING CALCULATION FORMULA**
```
TOTAL LEVEL COST = (6 Dimensions × Per-Dimension Price) + Professional Development Certification Cost
```

### **LEVEL-BY-LEVEL BREAKDOWN**

#### **🎯 Level 1 (Foundation)**
- **6 Dimensions × $967.11** = $5,802.66
  - Personal Development: $967.11
  - Occupational Development: $967.11  
  - Financial Development: $967.11
  - Relationship Development: $967.11
  - Truth Education: $967.11
- **Professional Development**: $8,100.00 (max 3 certifications)
- **TOTAL LEVEL 1**: $13,902.66 ✅

#### **🎯 Level 2 (Associate)**
- **6 Dimensions × $1,450.67** = $8,704.02
- **Professional Development**: $12,000.00 (max 5 certifications)
- **TOTAL LEVEL 2**: $20,704.02 ✅

#### **🎯 Level 3 (Professional)**
- **6 Dimensions × $1,934.22** = $11,605.32
- **Professional Development**: $16,000.00 (max 7 certifications)
- **TOTAL LEVEL 3**: $27,605.32 ✅

#### **🎯 Level 4 (Expert)**
- **6 Dimensions × $2,417.78** = $14,506.68
- **Professional Development**: $20,000.00 (max 9 certifications)
- **TOTAL LEVEL 4**: $34,506.68 ✅

#### **🎯 Level 5 (Master)**
- **6 Dimensions × $2,901.33** = $17,407.98
- **Professional Development**: $26,865.00 (max 12 certifications)
- **TOTAL LEVEL 5**: $44,272.98 ✅

---

## **🔗 CROSS-PAGE SYNCHRONIZATION ARCHITECTURE**

### **USER JOURNEY FLOW**
```
HEXAD Page → Select Level → Professional Dev Card → Industry Page → Select Certs → Return to HEXAD → Checkout
```

### **TECHNICAL DATA FLOW**

#### **Phase 1: HEXAD to Industry Page**
**URL Structure:**
```
technology.html?level=2&source=hexad&return=true&sessionId=uuid-abc123&maxCerts=5&budget=12000
```

**localStorage Data:**
```javascript
const hexadSession = {
    sessionId: 'uuid-abc123',
    timestamp: Date.now(),
    level: 2,
    maxCertifications: 5,
    professionalDevBudget: 12000,
    otherDimensionsCost: 8704.02,
    totalLevelCost: 20704.02,
    sourceUrl: 'hexad-mastery.html',
    returnUrl: 'hexad-mastery.html?session=uuid-abc123'
}
```

#### **Phase 2: Industry Page Processing**
**Level Restrictions Applied:**
- Show only Level 2 appropriate certifications
- Enforce maximum 5 certification limit
- Display budget constraint ($12,000)
- Real-time cost validation

**User Selection Storage:**
```javascript
const certificationSelection = {
    sessionId: 'uuid-abc123',
    level: 2,
    industry: 'information-technology',
    selectedCertifications: [
        {
            vendor: 'CompTIA',
            certification: 'Network+',
            code: 'N10-008',
            cost: 370,
            level: 2
        },
        {
            vendor: 'CompTIA', 
            certification: 'Security+',
            code: 'SY0-601',
            cost: 370,
            level: 2
        },
        {
            vendor: 'Microsoft',
            certification: 'Azure Fundamentals',
            code: 'AZ-900',
            cost: 165,
            level: 2
        }
    ],
    totalCertificationCost: 905,
    remainingBudget: 11095,
    certificationCount: 3,
    remainingCerts: 2,
    completedAt: Date.now()
}
```

#### **Phase 3: Return to HEXAD**
**Return URL:**
```
hexad-mastery.html?session=uuid-abc123&selections=complete&industry=tech&certs=3&cost=905
```

**Professional Development Card Update:**
```javascript
// Update Professional Development display
professionalDevCard.innerHTML = `
    <h4>Professional Development</h4>
    <div class="selection-summary">
        <p><strong>Industry:</strong> Information Technology</p>
        <p><strong>Certifications:</strong> 3 selected (2 remaining)</p>
        <p><strong>Cost:</strong> $905 of $12,000 budget</p>
        <button class="modify-btn">Modify Selections</button>
    </div>
`;
```

#### **Phase 4: Checkout Integration**
**Complete Order Summary:**
```javascript
const checkoutData = {
    level: 2,
    totalInvestment: 20704.02,
    breakdown: {
        personalDevelopment: 1450.67,
        professionalDevelopment: {
            budget: 12000.00,
            selected: 905.00,
            certifications: ['CompTIA Network+', 'CompTIA Security+', 'Microsoft Azure Fundamentals']
        },
        occupationalDevelopment: 1450.67,
        financialDevelopment: 1450.67,
        relationshipDevelopment: 1450.67,
        truthEducation: 1450.67
    }
}
```

---

## **💻 TECHNICAL IMPLEMENTATION SPECIFICATIONS**

### **JavaScript Classes & Functions**

#### **HexadPricingManager Class**
```javascript
class HexadPricingManager {
    constructor() {
        this.levelPricing = {
            1: { 
                perDimension: 967.11,
                professionalDev: 8100.00,
                maxCerts: 3,
                total: 13902.66
            },
            2: { 
                perDimension: 1450.67,
                professionalDev: 12000.00,
                maxCerts: 5,
                total: 20704.02
            },
            3: { 
                perDimension: 1934.22,
                professionalDev: 16000.00,
                maxCerts: 7,
                total: 27605.32
            },
            4: { 
                perDimension: 2417.78,
                professionalDev: 20000.00,
                maxCerts: 9,
                total: 34506.68
            },
            5: { 
                perDimension: 2901.33,
                professionalDev: 26865.00,
                maxCerts: 12,
                total: 44272.98
            }
        };
    }

    calculateLevelTotal(level) {
        const pricing = this.levelPricing[level];
        return (pricing.perDimension * 5) + pricing.professionalDev;
    }

    validateCertificationLimit(level, selectedCount) {
        return selectedCount <= this.levelPricing[level].maxCerts;
    }

    getProfessionalDevBudget(level) {
        return this.levelPricing[level].professionalDev;
    }
}
```

#### **CrossPageSyncManager Class**
```javascript
class CrossPageSyncManager {
    constructor() {
        this.sessionKey = 'hexadSession';
        this.selectionKey = 'certificationSelection';
    }

    createSession(level) {
        const session = {
            sessionId: this.generateUUID(),
            timestamp: Date.now(),
            level: level,
            maxCertifications: hexadPricing.levelPricing[level].maxCerts,
            professionalDevBudget: hexadPricing.levelPricing[level].professionalDev,
            otherDimensionsCost: hexadPricing.levelPricing[level].perDimension * 5,
            totalLevelCost: hexadPricing.levelPricing[level].total,
            sourceUrl: window.location.href
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        return session;
    }

    getSession() {
        const sessionData = localStorage.getItem(this.sessionKey);
        return sessionData ? JSON.parse(sessionData) : null;
    }

    saveSelections(selections) {
        localStorage.setItem(this.selectionKey, JSON.stringify(selections));
        
        // Also save to sessionStorage for immediate access
        sessionStorage.setItem(this.selectionKey, JSON.stringify(selections));
    }

    getSelections() {
        const selections = localStorage.getItem(this.selectionKey);
        return selections ? JSON.parse(selections) : null;
    }

    generateUUID() {
        return 'hexad_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    redirectToIndustryPage(industry, level) {
        const session = this.createSession(level);
        const url = `programs/${industry}.html?level=${level}&source=hexad&return=true&sessionId=${session.sessionId}&maxCerts=${session.maxCertifications}&budget=${session.professionalDevBudget}`;
        window.location.href = url;
    }

    returnToHexad(selections) {
        this.saveSelections(selections);
        const session = this.getSession();
        const url = `hexad-mastery.html?session=${session.sessionId}&selections=complete&industry=${selections.industry}&certs=${selections.selectedCertifications.length}&cost=${selections.totalCertificationCost}`;
        window.location.href = url;
    }
}
```

### **URL Parameter Handling**
```javascript
class URLParameterManager {
    static getParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    static getAllParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        for (let [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }

    static updateURL(params, replaceState = true) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] !== null) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        
        if (replaceState) {
            window.history.replaceState({}, '', url);
        } else {
            window.history.pushState({}, '', url);
        }
    }
}
```

---

## **🎨 UI/UX INTEGRATION SPECIFICATIONS**

### **Professional Development Card Enhancement**
```html
<div class="hexad-dimension-section" id="professional-development">
    <div class="dimension-header" onclick="toggleDimension('professional-dev-content')">
        <h5><i class="fas fa-briefcase"></i> 2. PROFESSIONAL DEVELOPMENT</h5>
        <div class="dimension-price">$8,100 - $26,865</div>
        <i class="fas fa-chevron-down"></i>
    </div>
    <div class="dimension-content" id="professional-dev-content">
        
        <!-- Professional Certification Pathways Card -->
        <div class="professional-pathway-card" onclick="selectCertificationPathway()">
            <div class="pathway-header">
                <h6><i class="fas fa-certificate"></i> Professional Certification Pathways</h6>
                <div class="pathway-level-indicator">Level <span id="current-level">1</span></div>
            </div>
            
            <div class="pathway-content">
                <div class="pathway-summary" id="pathway-summary">
                    <p><strong>Available Budget:</strong> $<span id="available-budget">8,100</span></p>
                    <p><strong>Max Certifications:</strong> <span id="max-certs">3</span></p>
                    <p><strong>Industry Focus:</strong> <span id="industry-focus">Select Industry</span></p>
                </div>
                
                <div class="pathway-selections" id="pathway-selections" style="display: none;">
                    <h6>Selected Certifications:</h6>
                    <div class="selected-certs-list" id="selected-certs-list">
                        <!-- Dynamic content populated by JavaScript -->
                    </div>
                    <div class="pathway-actions">
                        <button class="modify-selections-btn" onclick="modifySelections()">
                            <i class="fas fa-edit"></i> Modify Selections
                        </button>
                        <button class="clear-selections-btn" onclick="clearSelections()">
                            <i class="fas fa-trash"></i> Clear All
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="pathway-cta">
                <button class="select-certifications-btn">
                    <i class="fas fa-arrow-right"></i> Select Certifications
                </button>
            </div>
        </div>
        
        <!-- Other Professional Development modules -->
        <div class="module-grid">
            <!-- Existing modules... -->
        </div>
    </div>
</div>
```

### **Level Switching Integration**
```javascript
function switchToLevel(newLevel) {
    const pricingManager = new HexadPricingManager();
    const pricing = pricingManager.levelPricing[newLevel];
    
    // Update all level-specific displays
    document.getElementById('current-level').textContent = newLevel;
    document.getElementById('available-budget').textContent = pricing.professionalDev.toLocaleString();
    document.getElementById('max-certs').textContent = pricing.maxCerts;
    
    // Update total cost displays
    document.getElementById(`level-${newLevel}-total`).textContent = `$${pricing.total.toLocaleString()}`;
    
    // Clear existing selections if level changed
    if (currentLevel !== newLevel) {
        clearCertificationSelections();
    }
    
    currentLevel = newLevel;
}
```

---

## **🔒 SECURITY & VALIDATION FRAMEWORK**

### **Data Validation Rules**
```javascript
class ValidationManager {
    static validateLevel(level) {
        return level >= 1 && level <= 5;
    }

    static validateCertificationCount(level, count) {
        const maxCerts = hexadPricing.levelPricing[level].maxCerts;
        return count <= maxCerts;
    }

    static validateBudget(level, totalCost) {
        const budget = hexadPricing.levelPricing[level].professionalDev;
        return totalCost <= budget;
    }

    static validateSession(sessionData) {
        if (!sessionData || !sessionData.sessionId || !sessionData.timestamp) {
            return false;
        }
        
        // Check if session is not older than 24 hours
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        return (Date.now() - sessionData.timestamp) < maxAge;
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.replace(/[<>\"'&]/g, '');
    }
}
```

### **Error Handling Framework**
```javascript
class ErrorHandler {
    static handleCrossPageError(error, context) {
        console.error('Cross-page synchronization error:', error, context);
        
        // Graceful fallback
        if (context === 'return_to_hexad') {
            // Redirect to HEXAD without parameters
            window.location.href = 'hexad-mastery.html';
        } else if (context === 'industry_page_load') {
            // Show error message and provide manual level selection
            this.showErrorModal('Session data not found. Please select your level manually.');
        }
    }

    static showErrorModal(message) {
        // Implementation for error modal display
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.innerHTML = `
            <div class="error-content">
                <h4>Session Error</h4>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}
```

---

## **📱 RESPONSIVE & ACCESSIBILITY CONSIDERATIONS**

### **Mobile-First Cross-Page Flow**
- Touch-optimized certification selection
- Simplified navigation for mobile users  
- Offline capability with localStorage persistence
- Progressive Web App (PWA) features for seamless experience

### **Accessibility Features**
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Voice control integration readiness

---

## **🧪 TESTING FRAMEWORK**

### **Cross-Page Integration Tests**
```javascript
describe('HEXAD Cross-Page Integration', () => {
    test('Level 2 selection creates proper session', () => {
        const syncManager = new CrossPageSyncManager();
        const session = syncManager.createSession(2);
        
        expect(session.level).toBe(2);
        expect(session.maxCertifications).toBe(5);
        expect(session.professionalDevBudget).toBe(12000);
        expect(session.totalLevelCost).toBe(20704.02);
    });

    test('Industry page enforces level restrictions', () => {
        // Test certification limit enforcement
        // Test budget constraint validation
        // Test return URL generation
    });

    test('Return to HEXAD updates professional development card', () => {
        // Test localStorage data retrieval
        // Test UI update with selections
        // Test pricing recalculation
    });
});
```

### **Performance Benchmarks**
- Page load time: < 2 seconds
- Cross-page navigation: < 1 second
- localStorage operations: < 100ms
- Real-time price calculations: < 50ms

---

## **🚀 DEPLOYMENT & MONITORING**

### **Implementation Checklist**
- [ ] Update hexad-mastery.html pricing structure
- [ ] Implement CrossPageSyncManager class
- [ ] Create industry page URL parameter handling
- [ ] Add Professional Development card enhancements
- [ ] Implement return navigation system
- [ ] Add error handling and validation
- [ ] Complete responsive design testing
- [ ] Accessibility compliance verification
- [ ] Performance optimization
- [ ] Security testing and validation

### **Monitoring & Analytics**
- Cross-page conversion rates
- Session completion statistics
- Error rate monitoring
- Performance metrics tracking
- User experience feedback collection

---

**STATUS: 📋 MASTER REFERENCE COMPLETE**  
**NEXT PHASE: Implementation of corrected pricing structure across all files**

This master reference provides the complete technical architecture for HEXAD pricing integration and cross-page synchronization, ensuring seamless user experience and accurate financial calculations across the entire BTH Education Group platform.