# 🎯 SOLUTION #5: DOMAIN ORGANIZATION SYSTEM

**Reference**: IT_MASTER_SOLUTION_FRAMEWORK.md  
**Target**: hexad-mastery.html - Information Technology Sector  
**Scope**: Competency-Based Pathway System & Cross-Vendor Skill Mapping  

---

## 📋 **SOLUTION OVERVIEW**

This solution implements a streamlined domain organization system that organizes IT certifications by competency domains rather than vendors. The system provides cross-vendor skill mapping, career progression tracking, and competency-based pathway recommendations across all 47 vendors and 6 major IT domains.

---

## 🏗️ **CORE DOMAIN STRUCTURE**

### **6 PRIMARY COMPETENCY DOMAINS**

```javascript
// Streamlined Domain Configuration
const IT_COMPETENCY_DOMAINS = {
    cybersecurity: {
        name: 'Cybersecurity & Information Assurance',
        icon: 'fas fa-shield-alt',
        color: '#dc2626',
        priority: 1,
        vendors: ['comptia', 'ec_council', 'isc2', 'isaca', 'giac', 'fortinet', 'mile2', 'checkpoint', 'cyberark'],
        foundation_path: ['CompTIA Security+', 'CompTIA Network+'],
        career_tracks: ['Security Analyst', 'Penetration Tester', 'Security Architect', 'Compliance Manager']
    },

    cloud_computing: {
        name: 'Cloud Computing & Architecture',
        icon: 'fas fa-cloud',
        color: '#2563eb',
        priority: 2,
        vendors: ['comptia', 'aws', 'microsoft', 'google_cloud', 'oracle', 'vmware', 'redhat'],
        foundation_path: ['CompTIA Cloud Essentials+', 'AWS Cloud Practitioner', 'Azure Fundamentals'],
        career_tracks: ['Cloud Administrator', 'Solutions Architect', 'DevOps Engineer', 'Cloud Security Architect']
    },

    networking: {
        name: 'Networking & Infrastructure',
        icon: 'fas fa-network-wired',
        color: '#059669',
        priority: 3,
        vendors: ['comptia', 'cisco', 'juniper', 'huawei', 'aruba', 'cwnp'],
        foundation_path: ['CompTIA Network+', 'Cisco CCST Networking'],
        career_tracks: ['Network Administrator', 'Network Engineer', 'Network Architect', 'Wireless Specialist']
    },

    systems_administration: {
        name: 'Systems Administration & Infrastructure',
        icon: 'fas fa-server',
        color: '#7c3aed',
        priority: 4,
        vendors: ['comptia', 'microsoft', 'redhat', 'linux', 'vmware', 'suse'],
        foundation_path: ['CompTIA A+', 'CompTIA Server+'],
        career_tracks: ['System Administrator', 'Infrastructure Engineer', 'Virtualization Specialist', 'DevOps Engineer']
    },

    software_development: {
        name: 'Software Development & Programming',
        icon: 'fas fa-code',
        color: '#f59e0b',
        priority: 5,
        vendors: ['oracle', 'microsoft', 'adobe', 'unity', 'qt', 'zend'],
        foundation_path: ['Oracle Java SE Foundations', 'Microsoft Programming Fundamentals'],
        career_tracks: ['Software Developer', 'Full Stack Developer', 'Application Architect', 'DevOps Developer']
    },

    it_governance: {
        name: 'IT Governance & Project Management',
        icon: 'fas fa-tasks',
        color: '#8b5cf6',
        priority: 6,
        vendors: ['pmi', 'itil', 'prince2', 'scrum_alliance', 'comptia'],
        foundation_path: ['CompTIA Project+', 'ITIL Foundation'],
        career_tracks: ['Project Manager', 'Scrum Master', 'IT Service Manager', 'Program Manager']
    }
};

// Cross-Domain Skill Mapping
const CROSS_DOMAIN_SKILLS = {
    networking: {
        domains: ['cybersecurity', 'cloud_computing', 'systems_administration'],
        bridge_certifications: ['CompTIA Network+', 'Cisco CCNA']
    },
    automation: {
        domains: ['cloud_computing', 'systems_administration', 'software_development'],
        bridge_certifications: ['Red Hat Ansible', 'AWS DevOps', 'Azure DevOps']
    },
    security: {
        domains: ['cybersecurity', 'cloud_computing', 'networking'],
        bridge_certifications: ['CompTIA Security+', 'AWS Security', 'Azure Security']
    }
};
```

---

## 🎨 **DOMAIN UI COMPONENTS**

### **Domain Selection Interface**

```html
<!-- Domain Navigation System -->
<div class="domain-navigation-container">
    <div class="domain-header">
        <h4>IT Competency Domains</h4>
        <p>Explore career pathways organized by skill competencies</p>
    </div>
    
    <div class="domains-grid">
        {{#each IT_COMPETENCY_DOMAINS}}
        <div class="domain-card" data-domain="{{@key}}" onclick="selectDomain('{{@key}}')">
            <div class="domain-icon" style="color: {{this.color}};">
                <i class="{{this.icon}}"></i>
            </div>
            <div class="domain-content">
                <h5>{{this.name}}</h5>
                <div class="domain-stats">
                    <span class="vendor-count">{{this.vendors.length}} vendors</span>
                    <span class="career-count">{{this.career_tracks.length}} career tracks</span>
                </div>
            </div>
            <div class="domain-priority">Priority {{this.priority}}</div>
        </div>
        {{/each}}
    </div>
</div>

<!-- Domain Detail View -->
<div class="domain-detail-container" id="domain-detail" style="display: none;">
    <div class="domain-detail-header">
        <button class="back-btn" onclick="backToDomains()">
            <i class="fas fa-arrow-left"></i> Back
        </button>
        <h4 id="domain-title"></h4>
    </div>
    
    <div class="domain-tabs">
        <button class="domain-tab active" data-tab="pathways" onclick="switchDomainTab('pathways')">
            Career Pathways
        </button>
        <button class="domain-tab" data-tab="vendors" onclick="switchDomainTab('vendors')">
            Vendor Mapping
        </button>
        <button class="domain-tab" data-tab="progression" onclick="switchDomainTab('progression')">
            Skill Progression
        </button>
    </div>
    
    <div class="domain-tab-content" id="domain-content">
        <!-- Content populated dynamically -->
    </div>
</div>
```

### **Career Pathway Visualization**

```html
<!-- Career Pathways Tab -->
<div class="career-pathways-tab">
    <div class="pathways-grid" id="career-pathways-grid">
        <!-- Populated by generateCareerPathways() -->
    </div>
</div>

<!-- Vendor Mapping Tab -->
<div class="vendor-mapping-tab">
    <div class="vendor-mapping-grid" id="vendor-mapping-grid">
        <!-- Populated by generateVendorMapping() -->
    </div>
</div>

<!-- Skill Progression Tab -->
<div class="skill-progression-tab">
    <div class="progression-pathway" id="skill-progression-pathway">
        <!-- Populated by generateSkillProgression() -->
    </div>
</div>
```

---

## ⚙️ **DOMAIN ORGANIZATION FUNCTIONS**

### **Core Domain Functions**

```javascript
// Domain Selection and Display
function selectDomain(domainKey) {
    const domain = IT_COMPETENCY_DOMAINS[domainKey];
    
    // Hide domain grid, show detail view
    document.querySelector('.domain-navigation-container').style.display = 'none';
    document.getElementById('domain-detail').style.display = 'block';
    
    // Update domain title and content
    document.getElementById('domain-title').textContent = domain.name;
    document.getElementById('domain-title').style.color = domain.color;
    
    // Load default tab (pathways)
    switchDomainTab('pathways', domainKey);
}

function backToDomains() {
    document.querySelector('.domain-navigation-container').style.display = 'block';
    document.getElementById('domain-detail').style.display = 'none';
}

function switchDomainTab(tabName, domainKey) {
    // Update active tab
    document.querySelectorAll('.domain-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Load tab content
    const contentContainer = document.getElementById('domain-content');
    
    switch(tabName) {
        case 'pathways':
            contentContainer.innerHTML = generateCareerPathways(domainKey);
            break;
        case 'vendors':
            contentContainer.innerHTML = generateVendorMapping(domainKey);
            break;
        case 'progression':
            contentContainer.innerHTML = generateSkillProgression(domainKey);
            break;
    }
}

// Career Pathways Generation
function generateCareerPathways(domainKey) {
    const domain = IT_COMPETENCY_DOMAINS[domainKey];
    
    return `
        <div class="career-pathways-container">
            <h6>Career Pathways in ${domain.name}</h6>
            <div class="pathways-grid">
                ${domain.career_tracks.map(career => `
                    <div class="career-pathway-card">
                        <div class="career-icon">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="career-info">
                            <h7>${career}</h7>
                            <p>Click to explore this career path</p>
                        </div>
                        <button class="explore-career-btn" onclick="exploreCareer('${domainKey}', '${career}')">
                            Explore Path
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Vendor Mapping Generation
function generateVendorMapping(domainKey) {
    const domain = IT_COMPETENCY_DOMAINS[domainKey];
    
    return `
        <div class="vendor-mapping-container">
            <h6>Certification Vendors for ${domain.name}</h6>
            <div class="vendors-grid">
                ${domain.vendors.map(vendorKey => {
                    const vendor = findVendorInAllSources(vendorKey);
                    return `
                        <div class="vendor-mapping-card" onclick="exploreVendorInDomain('${vendorKey}', '${domainKey}')">
                            <img src="${vendor?.logo || '/assets/images/vendor-placeholder.png'}" alt="${vendor?.name || vendorKey}">
                            <h8>${vendor?.name || formatVendorName(vendorKey)}</h8>
                            <p>${vendor?.certification_count || 'Multiple'} certifications</p>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Skill Progression Generation
function generateSkillProgression(domainKey) {
    const domain = IT_COMPETENCY_DOMAINS[domainKey];
    
    return `
        <div class="skill-progression-container">
            <h6>Foundation Learning Path</h6>
            <div class="foundation-pathway">
                <div class="pathway-steps">
                    ${domain.foundation_path.map((cert, index) => `
                        <div class="pathway-step">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-content">
                                <h8>${cert}</h8>
                                <p>Foundation certification</p>
                            </div>
                        </div>
                        ${index < domain.foundation_path.length - 1 ? '<div class="step-arrow"><i class="fas fa-arrow-right"></i></div>' : ''}
                    `).join('')}
                </div>
            </div>
            
            <div class="cross-domain-skills">
                <h6>Cross-Domain Opportunities</h6>
                <div class="cross-skills-grid">
                    ${Object.entries(CROSS_DOMAIN_SKILLS)
                        .filter(([skill, data]) => data.domains.includes(domainKey))
                        .map(([skill, data]) => `
                            <div class="cross-skill-card">
                                <h8>${formatSkillName(skill)}</h8>
                                <p>Bridges to: ${data.domains.filter(d => d !== domainKey).join(', ')}</p>
                                <div class="bridge-certs">
                                    ${data.bridge_certifications.slice(0, 2).map(cert => `
                                        <span class="cert-tag">${cert}</span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Integration with Filter System
function integrateDomainWithFilters() {
    // Override filter generation to include domain-based content
    const originalGenerateITContent = generateITContent;
    
    generateITContent = function() {
        const filterMode = FILTER_STATE?.currentFilter || 'industry';
        
        if (filterMode === 'domain') {
            return generateDomainBasedContent();
        } else {
            return originalGenerateITContent();
        }
    };
}

function generateDomainBasedContent() {
    return `
        <div class="domain-based-content">
            ${generateDomainNavigation()}
            <div id="domain-specific-content">
                <!-- Populated by domain selection -->
            </div>
        </div>
    `;
}

function generateDomainNavigation() {
    return `
        <div class="domain-navigation-container">
            <div class="domain-header">
                <h4>IT Competency Domains</h4>
                <p>Explore career pathways organized by skill competencies across 47 vendors</p>
            </div>
            
            <div class="domains-grid">
                ${Object.entries(IT_COMPETENCY_DOMAINS).map(([key, domain]) => `
                    <div class="domain-card" data-domain="${key}" onclick="selectDomain('${key}')">
                        <div class="domain-icon" style="color: ${domain.color};">
                            <i class="${domain.icon}"></i>
                        </div>
                        <div class="domain-content">
                            <h5>${domain.name}</h5>
                            <div class="domain-stats">
                                <span class="vendor-count">${domain.vendors.length} vendors</span>
                                <span class="career-count">${domain.career_tracks.length} careers</span>
                            </div>
                        </div>
                        <div class="domain-priority">Priority ${domain.priority}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="domain-detail-container" id="domain-detail" style="display: none;">
            <div class="domain-detail-header">
                <button class="back-btn" onclick="backToDomains()">
                    <i class="fas fa-arrow-left"></i> Back to Domains
                </button>
                <h4 id="domain-title"></h4>
            </div>
            
            <div class="domain-tabs">
                <button class="domain-tab active" data-tab="pathways" onclick="switchDomainTab('pathways')">
                    Career Pathways
                </button>
                <button class="domain-tab" data-tab="vendors" onclick="switchDomainTab('vendors')">
                    Vendor Mapping
                </button>
                <button class="domain-tab" data-tab="progression" onclick="switchDomainTab('progression')">
                    Skill Progression
                </button>
            </div>
            
            <div class="domain-tab-content" id="domain-content">
                <!-- Content populated dynamically -->
            </div>
        </div>
    `;
}

// Utility Functions
function formatVendorName(vendorKey) {
    return vendorKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatSkillName(skillKey) {
    return skillKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function findVendorInAllSources(vendorKey) {
    // Check BTH Primary Partners first
    if (BTH_PRIMARY_PARTNERS[vendorKey]) {
        return BTH_PRIMARY_PARTNERS[vendorKey];
    }
    
    // Check Pearson VUE vendors
    for (const category of Object.values(PEARSON_VUE_VENDORS)) {
        if (category[vendorKey]) {
            return category[vendorKey];
        }
    }
    
    // Check Platform Specific vendors
    if (PLATFORM_SPECIFIC_VENDORS[vendorKey]) {
        return PLATFORM_SPECIFIC_VENDORS[vendorKey];
    }
    
    return null;
}
```

---

## 🎨 **CSS STYLING FOR DOMAIN ORGANIZATION**

```css
/* Domain Navigation */
.domain-navigation-container {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    margin-bottom: 2rem;
}

.domain-header {
    text-align: center;
    margin-bottom: 2rem;
}

.domain-header h4 {
    color: #ffffff;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.domain-header p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
}

.domains-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.domain-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.domain-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.domain-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.domain-content h5 {
    color: #ffffff;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    font-weight: 600;
}

.domain-stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.vendor-count, .career-count {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
}

.domain-priority {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

/* Domain Detail View */
.domain-detail-container {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    padding: 2rem;
}

.domain-detail-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.domain-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.domain-tab {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 1rem 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
}

.domain-tab.active {
    color: #ffffff;
    border-bottom-color: #667eea;
}

.domain-tab:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
}

/* Career Pathways */
.career-pathways-container h6 {
    color: #ffffff;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
}

.pathways-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.career-pathway-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
}

.career-pathway-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.career-icon {
    font-size: 2rem;
    color: #667eea;
    margin-bottom: 1rem;
}

.career-info h7 {
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
}

.career-info p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.explore-career-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.explore-career-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
    .domains-grid {
        grid-template-columns: 1fr;
    }
    
    .domain-tabs {
        flex-direction: column;
        gap: 0;
    }
    
    .domain-tab {
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0;
    }
    
    .pathways-grid {
        grid-template-columns: 1fr;
    }
}
```

---

## 🚀 **IMPLEMENTATION STEPS**

### **Phase 1: Core Integration**
1. **Add domain organization to filter system**
2. **Integrate with existing vendor coverage**
3. **Connect to level enforcement system**
4. **Apply BTH partnership enhancements**

### **Phase 2: UI Implementation**
1. **Add domain navigation interface**
2. **Implement career pathway visualization**
3. **Create vendor mapping displays**
4. **Add skill progression tracking**

### **Phase 3: Enhancement**
1. **Connect to user progress tracking**
2. **Add cross-domain skill mapping**
3. **Implement industry-specific recommendations**
4. **Add mobile responsiveness**

---

## ✅ **SUCCESS VALIDATION**

### **Completion Criteria**
- [ ] All 6 domains properly organized and accessible
- [ ] Career pathway visualization functional
- [ ] Vendor mapping integrated with existing systems
- [ ] Cross-domain skill mapping operational
- [ ] Integration with filter system complete
- [ ] Mobile-responsive design implemented
- [ ] User progress tracking connected

---

**Previous**: [🤝 SOLUTION #4: BTH Partnership Integration](./SOLUTION_4_BTH_PARTNERSHIP_INTEGRATION.md)  
**Next**: [🔧 Implementation in hexad-mastery.html](../hexad-mastery.html)

---

*This solution provides competency-based organization of IT certifications, enabling users to explore career pathways across vendor boundaries while maintaining integration with all other solution components.*