/**
 * BTH Education Group - Global Session Management System
 * Handles context preservation across HEXAD checkout, program selection, and sector certification flows
 */

class BTHSessionManager {
    constructor() {
        this.SESSION_KEYS = {
            CHECKOUT_CONTEXT: 'bth_checkout_context',
            SECTOR_CONTEXT: 'bth_sector_context', 
            CERTIFICATION_SELECTIONS: 'bth_cert_selections',
            USER_FLOW: 'bth_user_flow'
        };
        
        this.FLOW_TYPES = {
            HEXAD: 'hexad_professional',
            STANDALONE: 'certification_only',
            HYBRID: 'hybrid_upgrade'
        };
        
        this.PRICING_MATRIX = {
            1: { perDimension: 967.11, professional: 8100, maxCerts: 2, duration: '12-24 months' },
            2: { perDimension: 1302.33, professional: 10500, maxCerts: 3, duration: '24-36 months' },
            3: { perDimension: 1928.35, professional: 13500, maxCerts: 5, duration: '36 months' },
            4: { perDimension: 2408.15, professional: 17000, maxCerts: 7, duration: '36-48 months' },
            5: { perDimension: 3101.94, professional: 26865, maxCerts: 10, duration: '60 months' }
        };
        
        this.init();
    }
    
    init() {
        // Initialize session management
        this.cleanupExpiredSessions();
        this.bindPageUnloadHandler();
        console.log('🚀 BTH Session Manager Initialized');
    }
    
    // HEXAD Checkout Context Management
    setCheckoutContext(context) {
        const enrichedContext = {
            ...context,
            timestamp: Date.now(),
            sessionId: this.generateSessionId(),
            pricing: this.PRICING_MATRIX[context.selectedLevel],
            flow: this.FLOW_TYPES.HEXAD
        };
        
        sessionStorage.setItem(this.SESSION_KEYS.CHECKOUT_CONTEXT, JSON.stringify(enrichedContext));
        console.log('💾 Checkout context saved:', enrichedContext);
        return enrichedContext;
    }
    
    getCheckoutContext() {
        const stored = sessionStorage.getItem(this.SESSION_KEYS.CHECKOUT_CONTEXT);
        return stored ? JSON.parse(stored) : null;
    }
    
    // Sector Selection Context
    setSectorContext(sectorName, parentContext = null) {
        const context = {
            sectorName,
            parentContext,
            timestamp: Date.now(),
            sessionId: this.generateSessionId()
        };
        
        sessionStorage.setItem(this.SESSION_KEYS.SECTOR_CONTEXT, JSON.stringify(context));
        return context;
    }
    
    getSectorContext() {
        const stored = sessionStorage.getItem(this.SESSION_KEYS.SECTOR_CONTEXT);
        return stored ? JSON.parse(stored) : null;
    }
    
    // Certification Selections Management
    addCertificationSelection(certification) {
        let selections = this.getCertificationSelections();
        
        // Check if already selected
        const exists = selections.find(cert => cert.id === certification.id);
        if (exists) return selections;
        
        // Check level limits
        const checkoutContext = this.getCheckoutContext();
        if (checkoutContext) {
            const maxCerts = this.PRICING_MATRIX[checkoutContext.selectedLevel].maxCerts;
            if (selections.length >= maxCerts) {
                throw new Error(`Maximum ${maxCerts} certifications allowed for Level ${checkoutContext.selectedLevel}`);
            }
        }
        
        selections.push({
            ...certification,
            selectedAt: Date.now(),
            level: checkoutContext?.selectedLevel || 1
        });
        
        sessionStorage.setItem(this.SESSION_KEYS.CERTIFICATION_SELECTIONS, JSON.stringify(selections));
        console.log('📝 Certification added:', certification.name);
        return selections;
    }
    
    removeCertificationSelection(certificationId) {
        let selections = this.getCertificationSelections();
        selections = selections.filter(cert => cert.id !== certificationId);
        
        sessionStorage.setItem(this.SESSION_KEYS.CERTIFICATION_SELECTIONS, JSON.stringify(selections));
        console.log('🗑️ Certification removed:', certificationId);
        return selections;
    }
    
    getCertificationSelections() {
        const stored = sessionStorage.getItem(this.SESSION_KEYS.CERTIFICATION_SELECTIONS);
        return stored ? JSON.parse(stored) : [];
    }
    
    clearCertificationSelections() {
        sessionStorage.removeItem(this.SESSION_KEYS.CERTIFICATION_SELECTIONS);
    }
    
    // Flow Management
    setUserFlow(flowType, metadata = {}) {
        const flow = {
            type: flowType,
            metadata,
            timestamp: Date.now(),
            sessionId: this.generateSessionId()
        };
        
        sessionStorage.setItem(this.SESSION_KEYS.USER_FLOW, JSON.stringify(flow));
        return flow;
    }
    
    getUserFlow() {
        const stored = sessionStorage.getItem(this.SESSION_KEYS.USER_FLOW);
        return stored ? JSON.parse(stored) : null;
    }
    
    // Navigation Helpers
    navigateToSector(sectorName, context = null) {
        const checkoutContext = this.getCheckoutContext();
        
        if (checkoutContext && checkoutContext.source === 'hexad-checkout') {
            // HEXAD Professional Development Flow
            this.setSectorContext(sectorName, checkoutContext);
            const params = new URLSearchParams({
                flow: 'checkout',
                level: checkoutContext.selectedLevel,
                source: 'hexad',
                session: checkoutContext.sessionId
            });
            window.location.href = `programs/${sectorName}.html?${params.toString()}`;
        } else {
            // Standalone or Hybrid Flow
            this.offerHexadChoice(sectorName);
        }
    }
    
    offerHexadChoice(sectorName) {
        const choice = confirm(
            `🎓 HEXAD Professional Development Framework\n\n` +
            `Would you like to add comprehensive 6-dimensional development to your ${sectorName} certifications?\n\n` +
            `✅ Complete personal & professional growth system\n` +
            `✅ Level-based progression (1-5)\n` +
            `✅ Integrated certification pathways\n\n` +
            `Click OK to add HEXAD Framework, or Cancel for certifications only.`
        );
        
        if (choice) {
            // Redirect to HEXAD with preselected sector
            sessionStorage.setItem('preselectedSector', sectorName);
            this.setUserFlow(this.FLOW_TYPES.HYBRID, { preselectedSector: sectorName });
            window.location.href = 'hexad-checkout-system.html?preselect=' + sectorName;
        } else {
            // Direct to sector for certification-only
            this.setUserFlow(this.FLOW_TYPES.STANDALONE, { sector: sectorName });
            window.location.href = `programs/${sectorName}.html?mode=certification-only`;
        }
    }
    
    returnToCheckout() {
        const checkoutContext = this.getCheckoutContext();
        const selections = this.getCertificationSelections();
        
        if (!checkoutContext) {
            console.error('❌ No checkout context found');
            return;
        }
        
        if (selections.length === 0) {
            alert('Please select at least one certification before returning to checkout.');
            return;
        }
        
        // Prepare professional selections for HEXAD
        const professionalSelections = {
            sector: this.getSectorContext()?.sectorName || 'technology',
            level: checkoutContext.selectedLevel,
            certifications: selections,
            totalCertifications: selections.length,
            returnToCheckout: true,
            timestamp: Date.now(),
            sessionId: checkoutContext.sessionId
        };
        
        sessionStorage.setItem('professionalSelections', JSON.stringify(professionalSelections));
        
        // Return to HEXAD checkout
        window.location.href = 'hexad-checkout-system.html?resume=professional&session=' + checkoutContext.sessionId;
    }
    
    // Utility Methods
    generateSessionId() {
        return 'bth_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    cleanupExpiredSessions() {
        const expireTime = 24 * 60 * 60 * 1000; // 24 hours
        const now = Date.now();
        
        Object.values(this.SESSION_KEYS).forEach(key => {
            const stored = sessionStorage.getItem(key);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    if (data.timestamp && (now - data.timestamp) > expireTime) {
                        sessionStorage.removeItem(key);
                        console.log('🧹 Expired session cleaned:', key);
                    }
                } catch (e) {
                    sessionStorage.removeItem(key);
                }
            }
        });
    }
    
    bindPageUnloadHandler() {
        window.addEventListener('beforeunload', () => {
            // Keep essential context, clean up temporary data
            const checkoutContext = this.getCheckoutContext();
            if (checkoutContext && checkoutContext.timestamp) {
                checkoutContext.lastActive = Date.now();
                sessionStorage.setItem(this.SESSION_KEYS.CHECKOUT_CONTEXT, JSON.stringify(checkoutContext));
            }
        });
    }
    
    // Debug Helpers
    getSessionSummary() {
        return {
            checkoutContext: this.getCheckoutContext(),
            sectorContext: this.getSectorContext(),
            certificationSelections: this.getCertificationSelections(),
            userFlow: this.getUserFlow()
        };
    }
    
    clearAllSessions() {
        Object.values(this.SESSION_KEYS).forEach(key => {
            sessionStorage.removeItem(key);
        });
        console.log('🧹 All BTH sessions cleared');
    }
}

// Global session manager instance
window.BTHSession = new BTHSessionManager();

// Export for module usage
if (typeof exports !== 'undefined') {
    exports.BTHSessionManager = BTHSessionManager;
}