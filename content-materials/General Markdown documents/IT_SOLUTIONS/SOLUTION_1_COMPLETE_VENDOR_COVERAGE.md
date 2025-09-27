# 🎯 SOLUTION #1: COMPLETE VENDOR COVERAGE IMPLEMENTATION

**Reference**: IT_MASTER_SOLUTION_FRAMEWORK.md  
**Target**: hexad-mastery.html - Information Technology Sector  
**Scope**: Integration of 47 Certification Vendors across 6 Major IT Categories  

---

## 📋 **SOLUTION OVERVIEW**

This solution implements comprehensive vendor coverage for the IT sector, integrating **47 certification vendors** across **6 major industry categories** using a scalable 3-tier architecture. The system supports BTH's direct partnerships while leveraging Pearson VUE authorization for extensive vendor coverage.

---

## 🏗️ **3-TIER VENDOR ARCHITECTURE**

### **TIER 1: BTH PRIMARY PARTNERS (6 Vendors)**
**Full Custom Implementation with Direct Partnership Credentials**

```javascript
const BTH_PRIMARY_PARTNERS = {
    comptia: {
        name: 'CompTIA',
        category: 'Core IT Foundations & Cybersecurity',
        logo: 'assets/images/vendors/comptia-logo.png',
        partnership: {
            type: 'BTH Partner',
            status: 'Active 2025',
            credentials: 'CompTIA Authorized Training Partner',
            verification: 'https://www.comptia.org/partners'
        },
        certifications: {
            foundation: [
                { name: 'A+ Core 1', code: '220-1201', complexity: 'foundation', duration: '90 mins' },
                { name: 'A+ Core 2', code: '220-1202', complexity: 'foundation', duration: '90 mins' },
                { name: 'Cloud Essentials+', code: 'CLO-002', complexity: 'foundation', duration: '90 mins' },
                { name: 'Tech+', code: 'FC0-U61', complexity: 'foundation', duration: '90 mins' }
            ],
            intermediate: [
                { name: 'Network+', code: 'N10-009', complexity: 'intermediate', duration: '90 mins' },
                { name: 'Security+', code: 'SY0-701', complexity: 'intermediate', duration: '90 mins' },
                { name: 'Server+', code: 'SK0-005', complexity: 'intermediate', duration: '90 mins' },
                { name: 'Cloud+', code: 'CV0-004', complexity: 'intermediate', duration: '90 mins' },
                { name: 'Linux+', code: 'XK0-005', complexity: 'intermediate', duration: '90 mins' },
                { name: 'Project+', code: 'PK0-005', complexity: 'intermediate', duration: '90 mins' },
                { name: 'CTT+', code: 'TK0-201', complexity: 'intermediate', duration: '90 mins' }
            ],
            advanced: [
                { name: 'CySA+', code: 'CS0-003', complexity: 'advanced', duration: '165 mins' },
                { name: 'PenTest+', code: 'PT0-002', complexity: 'advanced', duration: '165 mins' }
            ],
            expert: [
                { name: 'CASP+', code: 'CAS-004', complexity: 'expert', duration: '165 mins' }
            ]
        },
        training_paths: {
            it_fundamentals: ['Tech+', 'A+'],
            networking: ['Network+', 'Security+', 'Server+'],
            cybersecurity: ['Security+', 'CySA+', 'PenTest+', 'CASP+'],
            cloud: ['Cloud Essentials+', 'Cloud+']
        }
    },

    microsoft: {
        name: 'Microsoft',
        category: 'Cloud & Platforms',
        logo: 'assets/images/vendors/microsoft-logo.png',
        partnership: {
            type: 'Microsoft Partner',
            status: 'Active 2025',
            credentials: 'MPN ID: 6149008',
            verification: 'https://partner.microsoft.com/membership'
        },
        certifications: {
            foundation: [
                { name: 'Azure Fundamentals', code: 'AZ-900', complexity: 'foundation', duration: '60 mins' },
                { name: 'Security Fundamentals', code: 'SC-900', complexity: 'foundation', duration: '60 mins' },
                { name: 'Microsoft 365 Fundamentals', code: 'MS-900', complexity: 'foundation', duration: '60 mins' },
                { name: 'Power Platform Fundamentals', code: 'PL-900', complexity: 'foundation', duration: '60 mins' }
            ],
            intermediate: [
                { name: 'Azure Administrator Associate', code: 'AZ-104', complexity: 'intermediate', duration: '120 mins' },
                { name: 'Azure Security Engineer Associate', code: 'AZ-500', complexity: 'intermediate', duration: '120 mins' },
                { name: 'Microsoft 365 Administrator', code: 'MS-102', complexity: 'intermediate', duration: '120 mins' },
                { name: 'Power Platform App Maker', code: 'PL-100', complexity: 'intermediate', duration: '120 mins' }
            ],
            advanced: [
                { name: 'Azure Developer Associate', code: 'AZ-204', complexity: 'advanced', duration: '120 mins' },
                { name: 'Azure Network Engineer Associate', code: 'AZ-700', complexity: 'advanced', duration: '120 mins' },
                { name: 'Power Platform Solution Architect', code: 'PL-600', complexity: 'advanced', duration: '120 mins' }
            ],
            expert: [
                { name: 'Azure Solutions Architect Expert', code: 'AZ-305', complexity: 'expert', duration: '120 mins' },
                { name: 'DevOps Engineer Expert', code: 'AZ-400', complexity: 'expert', duration: '120 mins' }
            ]
        },
        training_paths: {
            azure_infrastructure: ['AZ-900', 'AZ-104', 'AZ-305'],
            azure_security: ['SC-900', 'AZ-500'],
            microsoft_365: ['MS-900', 'MS-102'],
            power_platform: ['PL-900', 'PL-100', 'PL-600']
        }
    },

    aws: {
        name: 'Amazon Web Services',
        category: 'Cloud & Platforms',
        logo: 'assets/images/vendors/aws-logo.png',
        partnership: {
            type: 'AWS Partner',
            status: 'Active 2025',
            credentials: 'Partner ID: 1686885',
            verification: 'https://partners.amazonaws.com/'
        },
        certifications: {
            foundation: [
                { name: 'Cloud Practitioner', code: 'CLF-C02', complexity: 'foundation', duration: '90 mins' }
            ],
            intermediate: [
                { name: 'Solutions Architect Associate', code: 'SAA-C03', complexity: 'intermediate', duration: '130 mins' },
                { name: 'SysOps Administrator Associate', code: 'SOA-C02', complexity: 'intermediate', duration: '130 mins' },
                { name: 'Developer Associate', code: 'DVA-C02', complexity: 'intermediate', duration: '130 mins' }
            ],
            advanced: [
                { name: 'Solutions Architect Professional', code: 'SAP-C02', complexity: 'advanced', duration: '180 mins' },
                { name: 'DevOps Engineer Professional', code: 'DOP-C02', complexity: 'advanced', duration: '180 mins' }
            ],
            expert: [
                { name: 'Security Specialty', code: 'SCS-C02', complexity: 'expert', duration: '170 mins' },
                { name: 'Advanced Networking Specialty', code: 'ANS-C01', complexity: 'expert', duration: '170 mins' },
                { name: 'Machine Learning Specialty', code: 'MLS-C01', complexity: 'expert', duration: '180 mins' }
            ]
        },
        training_paths: {
            cloud_foundations: ['CLF-C02'],
            solutions_architect: ['CLF-C02', 'SAA-C03', 'SAP-C02'],
            developer: ['DVA-C02', 'DOP-C02'],
            sysops: ['SOA-C02', 'DOP-C02']
        }
    },

    redhat: {
        name: 'Red Hat',
        category: 'Cloud & Platforms',
        logo: 'assets/images/vendors/redhat-logo.png',
        partnership: {
            type: 'Red Hat Organization Member',
            status: 'Active 2025',
            credentials: 'Org ID: 12969076',
            verification: 'https://www.redhat.com/en/partners'
        },
        certifications: {
            foundation: [
                { name: 'Red Hat System Administration I', code: 'RH124', complexity: 'foundation', duration: 'Performance-based' }
            ],
            intermediate: [
                { name: 'RHCSA', code: 'EX200', complexity: 'intermediate', duration: '2.5 hours' }
            ],
            advanced: [
                { name: 'RHCE', code: 'EX294', complexity: 'advanced', duration: '4 hours' },
                { name: 'OpenShift Administrator', code: 'EX280', complexity: 'advanced', duration: '4 hours' }
            ],
            expert: [
                { name: 'RHCA', code: 'Multiple Exams', complexity: 'expert', duration: 'Variable' }
            ]
        },
        training_paths: {
            linux_admin: ['RH124', 'EX200', 'EX294'],
            openshift: ['EX200', 'EX280'],
            automation: ['EX294', 'EX407']
        }
    },

    oracle: {
        name: 'Oracle',
        category: 'Cloud & Platforms',
        logo: 'assets/images/vendors/oracle-logo.png',
        partnership: {
            type: 'Oracle Academy Member',
            status: 'Active 2025',
            credentials: 'Oracle Academy Member',
            verification: 'https://academy.oracle.com/'
        },
        certifications: {
            foundation: [
                { name: 'Java SE Foundations', code: '1Z0-811', complexity: 'foundation', duration: '150 mins' }
            ],
            intermediate: [
                { name: 'OCA Java SE', code: '1Z0-808', complexity: 'intermediate', duration: '150 mins' },
                { name: 'Oracle Database Administrator', code: '1Z0-082', complexity: 'intermediate', duration: '120 mins' }
            ],
            advanced: [
                { name: 'OCP Java SE', code: '1Z0-819', complexity: 'advanced', duration: '180 mins' },
                { name: 'Oracle Cloud Infrastructure', code: '1Z0-1085', complexity: 'advanced', duration: '105 mins' }
            ],
            expert: [
                { name: 'OCM Java Enterprise Architect', code: '1Z0-807', complexity: 'expert', duration: 'Practical Exam' }
            ]
        },
        training_paths: {
            java_development: ['1Z0-811', '1Z0-808', '1Z0-819'],
            database_admin: ['1Z0-082', '1Z0-083'],
            cloud_infrastructure: ['1Z0-1085', '1Z0-997']
        }
    },

    eta: {
        name: 'ETA International',
        category: 'Specialized Technical Domains',
        logo: 'assets/images/vendors/eta-logo.png',
        partnership: {
            type: 'ETA International Partner',
            status: 'Active 2025',
            credentials: 'Partner: 147960',
            verification: 'https://www.eta-i.org/'
        },
        certifications: {
            foundation: [
                { name: 'Computer Service Technician Foundation', code: 'CST-F', complexity: 'foundation', duration: '4 hours' },
                { name: 'Student Electronics Technician', code: 'SET', complexity: 'foundation', duration: '4 hours' }
            ],
            intermediate: [
                { name: 'Computer Service Technician', code: 'CST', complexity: 'intermediate', duration: '4 hours' },
                { name: 'Network Computer Technician', code: 'NCT', complexity: 'intermediate', duration: '4 hours' },
                { name: 'Information Technology Security', code: 'ITS', complexity: 'intermediate', duration: '4 hours' }
            ],
            advanced: [
                { name: 'Network Systems Technician', code: 'NST', complexity: 'advanced', duration: '4 hours' },
                { name: 'Wireless Network Technician', code: 'WNT', complexity: 'advanced', duration: '4 hours' }
            ],
            expert: [
                { name: 'Certified Service Manager', code: 'CSM', complexity: 'expert', duration: '4 hours' }
            ]
        },
        specializations: {
            information_technology: ['CST', 'NCT', 'NST', 'ITS', 'WNT'],
            electronics: ['SET', 'CETa', 'BMD'],
            communications: ['GCT1', 'GCT2', 'MRT'],
            renewable_energy: ['PVI1', 'PV2', 'SWI']
        }
    }
};
```

### **TIER 2: PEARSON VUE STANDARD (35 Vendors)**
**Template-Driven Implementation with Pearson VUE Authorization**

```javascript
const PEARSON_VUE_VENDORS = {
    core_networking: {
        cisco: {
            name: 'Cisco Systems',
            category: 'Core IT Foundations & Networking',
            logo: 'assets/images/vendors/cisco-logo.png',
            partnership: {
                type: 'Pearson VUE Authorized',
                status: 'Active 2025',
                credentials: 'Site ID: 89828',
                verification: 'BTH Authorized Test Center'
            },
            certification_template: {
                foundation: ['CCST Networking', 'CCST Cybersecurity'],
                intermediate: ['CCNA', 'CCDA'],
                advanced: ['CCNP Enterprise', 'CCNP Security', 'CCDP'],
                expert: ['CCIE Enterprise Infrastructure', 'CCIE Security']
            }
        },
        
        juniper: {
            name: 'Juniper Networks',
            category: 'Core IT Foundations & Networking',
            logo: 'assets/images/vendors/juniper-logo.png',
            partnership: {
                type: 'Pearson VUE Authorized',
                status: 'Active 2025',
                credentials: 'Site ID: 89828',
                verification: 'BTH Authorized Test Center'
            },
            certification_template: {
                foundation: ['JNCIA-Junos'],
                intermediate: ['JNCIS-ENT', 'JNCIS-SEC'],
                advanced: ['JNCIP-ENT', 'JNCIP-SEC'],
                expert: ['JNCIE-ENT', 'JNCIE-SEC']
            }
        },

        // Template for remaining networking vendors...
        vendor_template_networking: {
            aruba: ['ACMP', 'ACCX'],
            huawei: ['HCIA', 'HCIP', 'HCIE'],
            nokia: ['Nokia Bell Labs Certifications'],
            zte: ['ZTE Certified Network Professional'],
            cwnp: ['CWNA', 'CWSP', 'CWDP']
        }
    },

    cloud_platforms: {
        google_cloud: {
            name: 'Google Cloud',
            category: 'Cloud & Platforms',
            logo: 'assets/images/vendors/google-cloud-logo.png',
            partnership: {
                type: 'Pearson VUE Authorized',
                status: 'Active 2025',
                credentials: 'Site ID: 89828',
                verification: 'BTH Authorized Test Center'
            },
            certification_template: {
                foundation: ['Cloud Digital Leader'],
                intermediate: ['Associate Cloud Engineer'],
                advanced: ['Professional Cloud Architect', 'Professional Cloud Developer'],
                expert: ['Professional Data Engineer', 'Professional ML Engineer']
            }
        },

        // Template for remaining cloud vendors...
        vendor_template_cloud: {
            ibm: ['IBM Cloud Certified'],
            vmware: ['VCA', 'VCP', 'VCIX', 'VCDX'],
            suse: ['SCA', 'SCE', 'SEA'],
            mongodb: ['MongoDB Certified DBA', 'Developer Associate'],
            snowflake: ['SnowPro Core', 'SnowPro Advanced'],
            netapp: ['NetApp Certified Data Administrator'],
            tableau: ['Desktop Specialist', 'Certified Consultant']
        }
    },

    cybersecurity: {
        // Template for cybersecurity vendors...
        vendor_template_security: {
            ec_council: ['CEH', 'CND', 'CHFI', 'LPT Master'],
            isc2: ['CISSP', 'CCSP', 'CSSLP', 'SSCP'],
            isaca: ['CISA', 'CISM', 'CRISC', 'CGEIT'],
            fortinet: ['NSE 1-8 Program'],
            mile2: ['CPTE', 'CPTC', 'CISSO'],
            iapp: ['CIPP', 'CIPM', 'CIPT'],
            checkpoint: ['Check Point Security Certifications'],
            cyberark: ['CyberArk Security Solutions']
        }
    },

    software_development: {
        // Template for software/development vendors...
        vendor_template_development: {
            adobe: ['ACP', 'ACE Creative Cloud'],
            unity: ['Unity Certified Associate', 'Unity Programmer'],
            epic: ['EpicCare', 'MyChart'],
            infosys: ['Infosys Certified Software Tracks'],
            pega: ['Pega System Architect'],
            qt: ['Qt Certified Specialist'],
            zend: ['Zend PHP Certification'],
            splunk: ['Splunk Data Analytics']
        }
    },

    governance: {
        // Template for governance vendors...
        vendor_template_governance: {
            pmi: ['PMP', 'CAPM', 'PMI-ACP', 'PgMP'],
            hdi: ['Desktop Support', 'Support Center']
        }
    },

    specialized: {
        // Template for specialized vendors...
        vendor_template_specialized: {
            lpi: ['Linux Essentials', 'LPIC-1', 'LPIC-2', 'LPIC-3'],
            citrix: ['CCIA', 'CCA'],
            veeam: ['VMCE'],
            forgerock: ['Identity Access Management']
        }
    }
};
```

### **TIER 3: PLATFORM-SPECIFIC (6 Vendors)**
**Special Integration for Non-Pearson VUE Platforms**

```javascript
const PLATFORM_SPECIFIC_VENDORS = {
    peoplecert_platform: {
        itil: {
            name: 'ITIL (PeopleCert)',
            category: 'IT Governance, Project & Agile',
            logo: 'assets/images/vendors/itil-logo.png',
            partnership: {
                type: 'PeopleCert Platform',
                status: 'Active 2025',
                credentials: 'Independent Platform',
                verification: 'Non-Pearson VUE Delivery'
            },
            certification_levels: {
                foundation: ['ITIL Foundation'],
                intermediate: ['ITIL Managing Professional Modules'],
                advanced: ['ITIL Managing Professional'],
                expert: ['ITIL Strategic Leader', 'ITIL Master']
            }
        },

        prince2: {
            name: 'PRINCE2 (PeopleCert)',
            category: 'IT Governance, Project & Agile',
            logo: 'assets/images/vendors/prince2-logo.png',
            partnership: {
                type: 'PeopleCert Platform',
                status: 'Active 2025',
                credentials: 'Independent Platform',
                verification: 'Non-Pearson VUE Delivery'
            },
            certification_levels: {
                foundation: ['PRINCE2 Foundation'],
                intermediate: ['PRINCE2 Practitioner'],
                advanced: ['PRINCE2 Advanced Practitioner'],
                expert: ['PRINCE2 Agile Practitioner']
            }
        }
    },

    scrum_alliance: {
        name: 'Scrum Alliance',
        category: 'IT Governance, Project & Agile',
        logo: 'assets/images/vendors/scrum-alliance-logo.png',
        partnership: {
            type: 'Own Platform',
            status: 'Active 2025',
            credentials: 'Independent Platform',
            verification: 'Non-Pearson VUE Delivery'
        },
        certification_levels: {
            foundation: ['CSM', 'CSPO'],
            intermediate: ['A-CSM', 'A-CSPO'],
            advanced: ['CSP-SM', 'CSP-PO'],
            expert: ['Agile Leader', 'Coach']
        }
    },

    giac_kryterion: {
        name: 'GIAC (SANS)',
        category: 'Cybersecurity & Privacy',
        logo: 'assets/images/vendors/giac-logo.png',
        partnership: {
            type: 'Kryterion Platform',
            status: 'Active 2025',
            credentials: 'Alternative Testing Platform',
            verification: 'Non-Pearson VUE Delivery'
        },
        certification_levels: {
            foundation: ['GSEC'],
            intermediate: ['GCIH', 'GCIA', 'GCED'],
            advanced: ['GMON', 'GCWN', 'GWAPT'],
            expert: ['GREM', 'GXPN', 'GSE']
        }
    }
};
```

---

## 🔧 **VENDOR GENERATION SYSTEM**

### **Template-Based Vendor Creation**

```javascript
// Vendor Generation Functions
function generateVendorContent(vendorKey, vendorData, tier) {
    const baseStructure = {
        header: generateVendorHeader(vendorData),
        partnership: generatePartnershipBadge(vendorData.partnership),
        certifications: generateCertificationLevels(vendorData.certifications || vendorData.certification_template),
        training_paths: generateTrainingPaths(vendorData.training_paths || vendorData.certification_levels)
    };

    return `
        <div class="vendor-container" data-vendor="${vendorKey}" data-tier="${tier}">
            ${baseStructure.header}
            ${baseStructure.partnership}
            ${baseStructure.certifications}
            ${baseStructure.training_paths}
        </div>
    `;
}

function generateVendorHeader(vendorData) {
    return `
        <div class="vendor-header">
            <div class="vendor-logo-section">
                <img src="${vendorData.logo}" alt="${vendorData.name}" class="vendor-logo">
                <div class="vendor-info">
                    <h4 class="vendor-name">${vendorData.name}</h4>
                    <span class="vendor-category">${vendorData.category}</span>
                </div>
            </div>
            <div class="partnership-status">
                <span class="partnership-badge ${getPartnershipClass(vendorData.partnership.type)}">
                    ${vendorData.partnership.type}
                </span>
                <small class="partnership-credentials">${vendorData.partnership.credentials}</small>
            </div>
        </div>
    `;
}

function generatePartnershipBadge(partnership) {
    const badgeClass = getBadgeClass(partnership.type);
    
    return `
        <div class="partnership-verification ${badgeClass}">
            <div class="badge-icon">
                <i class="fas fa-certificate"></i>
            </div>
            <div class="badge-content">
                <strong>${partnership.type}</strong>
                <span class="credentials">${partnership.credentials}</span>
                <span class="status">${partnership.status}</span>
            </div>
        </div>
    `;
}

function generateCertificationLevels(certifications) {
    let levelHTML = '';
    
    Object.keys(certifications).forEach(level => {
        if (certifications[level].length > 0) {
            levelHTML += `
                <div class="certification-level" data-level="${level}">
                    <div class="level-header">
                        <h6 class="level-title">${level.toUpperCase()}</h6>
                        <span class="cert-count">${certifications[level].length} certifications</span>
                    </div>
                    <div class="certification-grid">
                        ${certifications[level].map(cert => generateCertificationCard(cert, level)).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    return levelHTML;
}

function generateCertificationCard(cert, level) {
    const certData = typeof cert === 'object' ? cert : { name: cert, code: 'N/A', complexity: level, duration: 'Variable' };
    
    return `
        <div class="certification-card" data-complexity="${certData.complexity}">
            <div class="cert-header">
                <h7 class="cert-name">${certData.name}</h7>
                <span class="cert-code">${certData.code}</span>
            </div>
            <div class="cert-details">
                <span class="cert-duration">
                    <i class="fas fa-clock"></i> ${certData.duration}
                </span>
                <span class="cert-level ${certData.complexity}">
                    ${certData.complexity.toUpperCase()}
                </span>
            </div>
            <div class="cert-actions">
                <button class="btn-cert-info" onclick="showCertDetails('${certData.code}')">
                    Details
                </button>
                <button class="btn-cert-select" onclick="selectCertification('${certData.code}')">
                    Select
                </button>
            </div>
        </div>
    `;
}
```

---

## 🎨 **UI COMPONENTS & STYLING**

### **Vendor Display Components**

```html
<!-- Vendor Category Navigation -->
<div class="vendor-categories">
    <div class="category-tabs">
        <button class="category-tab active" data-category="all">All Categories</button>
        <button class="category-tab" data-category="core_networking">
            <i class="fas fa-network-wired"></i>
            Core IT & Networking
        </button>
        <button class="category-tab" data-category="cloud_platforms">
            <i class="fas fa-cloud"></i>
            Cloud & Platforms
        </button>
        <button class="category-tab" data-category="cybersecurity">
            <i class="fas fa-shield-alt"></i>
            Cybersecurity
        </button>
        <button class="category-tab" data-category="software_dev">
            <i class="fas fa-code"></i>
            Software Development
        </button>
        <button class="category-tab" data-category="governance">
            <i class="fas fa-tasks"></i>
            Governance & Project
        </button>
        <button class="category-tab" data-category="specialized">
            <i class="fas fa-tools"></i>
            Specialized Domains
        </button>
    </div>
</div>

<!-- Vendor Grid Display -->
<div class="vendors-grid-container">
    <div class="vendors-grid" id="vendors-display">
        <!-- Vendors will be dynamically generated here -->
    </div>
</div>

<!-- Partnership Verification Section -->
<div class="partnership-verification-section">
    <div class="verification-header">
        <h5>
            <i class="fas fa-certificate"></i>
            BTH Education Group - Official Partnerships & Testing Authorization
        </h5>
    </div>
    
    <div class="partnership-stats">
        <div class="stat-item">
            <div class="stat-number">47</div>
            <div class="stat-label">Certification Vendors</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">6</div>
            <div class="stat-label">Primary Partners</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">70+</div>
            <div class="stat-label">Pearson VUE Authorized</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">200+</div>
            <div class="stat-label">Certification Programs</div>
        </div>
    </div>
</div>
```

### **CSS Styling for Vendor System**

```css
/* Vendor Categories */
.vendor-categories {
    margin-bottom: 2rem;
}

.category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.category-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #ffffff;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.category-tab:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.category-tab.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
}

/* Vendor Grid */
.vendors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.vendor-container {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.vendor-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.vendor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.vendor-logo-section {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.vendor-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.5rem;
}

.vendor-name {
    color: #ffffff;
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
}

.vendor-category {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
}

/* Partnership Badges */
.partnership-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.partnership-badge.bth-partner {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
}

.partnership-badge.pearson-vue {
    background: linear-gradient(135deg, #0066cc, #004080);
    color: white;
}

.partnership-badge.platform-specific {
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    color: white;
}

/* Certification Levels */
.certification-level {
    margin-bottom: 1.5rem;
}

.level-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.level-title {
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
}

.cert-count {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
}

.certification-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.75rem;
}

.certification-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;
}

.certification-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.cert-header {
    margin-bottom: 0.5rem;
}

.cert-name {
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
}

.cert-code {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
}

.cert-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.cert-duration {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
}

.cert-level {
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
}

.cert-level.foundation { background: #27ae60; color: white; }
.cert-level.intermediate { background: #f39c12; color: white; }
.cert-level.advanced { background: #e74c3c; color: white; }
.cert-level.expert { background: #9b59b6; color: white; }

.cert-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-cert-info, .btn-cert-select {
    flex: 1;
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cert-info {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cert-select {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.btn-cert-info:hover, .btn-cert-select:hover {
    transform: translateY(-1px);
}

/* Partnership Verification */
.partnership-verification-section {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
}

.verification-header h5 {
    color: #ffffff;
    margin-bottom: 1.5rem;
    text-align: center;
}

.partnership-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.stat-item {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}
```

---

## 🚀 **IMPLEMENTATION STEPS**

### **Phase 1: Core Architecture Setup**
1. **Create vendor data structures** for all 3 tiers
2. **Implement template-based generation system**
3. **Build partnership verification components**
4. **Create vendor category navigation**

### **Phase 2: Content Population**
1. **Populate BTH primary partners** with full certification data
2. **Generate Pearson VUE vendors** using templates
3. **Configure platform-specific vendors** with special handling
4. **Implement vendor filtering and search**

### **Phase 3: Integration & Testing**
1. **Integrate with existing hexad-mastery.html**
2. **Test vendor display and filtering**
3. **Validate partnership credential display**
4. **Performance optimization and mobile responsiveness**

---

## ✅ **SUCCESS VALIDATION**

### **Completion Criteria**
- [ ] All 47 vendors implemented across 6 categories
- [ ] BTH partnership credentials displayed for primary partners
- [ ] Pearson VUE authorization shown for applicable vendors
- [ ] Vendor filtering and categorization functional
- [ ] Template-based generation system operational
- [ ] Mobile-responsive vendor display
- [ ] Partnership verification components active

---

**Next**: [🔧 SOLUTION #2: Dynamic Filtering System](./SOLUTION_2_DYNAMIC_FILTERING_SYSTEM.md)

---

*This solution provides the foundation for comprehensive vendor coverage, enabling the IT sector to showcase BTH's extensive certification ecosystem with proper partnership credentials and scalable architecture.*