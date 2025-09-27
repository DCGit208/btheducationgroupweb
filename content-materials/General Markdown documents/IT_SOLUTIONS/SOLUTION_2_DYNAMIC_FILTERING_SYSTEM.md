# 🔧 SOLUTION #2: DYNAMIC FILTERING SYSTEM IMPLEMENTATION

**Reference**: IT_MASTER_SOLUTION_FRAMEWORK.md  
**Target**: hexad-mastery.html - Information Technology Sector  
**Scope**: Dual-Filter Architecture for Content Organization  

---

## 📋 **SOLUTION OVERVIEW**

This solution implements a comprehensive dual-filtering system that allows users to view IT certification pathways through two distinct organizational approaches: **BY INDUSTRY** (vendor-centric) and **BY DOMAIN** (skill-centric). The system provides real-time content switching, intelligent vendor/domain selection, and cross-vendor pathway mapping.

---

## 🏗️ **DUAL-FILTER ARCHITECTURE**

### **FILTER STATE MANAGEMENT SYSTEM**

```javascript
// Global Filter State Management
const FILTER_STATE = {
    // Current active filter mode
    currentFilter: 'industry', // 'industry' or 'domain'
    
    // Industry filter selections
    industry: {
        selectedVendor: 'all', // 'all' or specific vendor key
        selectedLevel: 'all',  // 'all', 'foundation', 'intermediate', 'advanced', 'expert'
        selectedCategory: 'all' // 'all' or category key
    },
    
    // Domain filter selections
    domain: {
        selectedDomain: 'all', // 'all' or specific domain key
        selectedLevel: 'all',  // 'all', 'foundation', 'intermediate', 'advanced', 'expert'
        progressionMode: 'pathway' // 'pathway' or 'grid'
    },
    
    // UI state
    ui: {
        animating: false,
        contentLoaded: false,
        filterPanelOpen: false
    }
};

// Filter Configuration
const FILTER_CONFIG = {
    industry: {
        name: 'BY INDUSTRY',
        icon: 'fas fa-building',
        description: 'Vendor-Specific Certification Paths',
        display_mode: 'vendor_cards_with_certifications',
        filter_options: {
            vendors: 'all_47_vendors',
            categories: 'all_6_categories',
            levels: 'all_levels'
        }
    },
    
    domain: {
        name: 'BY DOMAIN',
        icon: 'fas fa-layer-group',
        description: 'Skill-Specific Cross-Vendor Paths',
        display_mode: 'progression_paths_cross_vendor',
        filter_options: {
            domains: 'all_competency_domains',
            levels: 'all_levels',
            progression: 'pathway_or_grid'
        }
    }
};
```

### **DOMAIN MAPPING SYSTEM**

```javascript
// Cross-Vendor Competency Domains
const COMPETENCY_DOMAINS = {
    cybersecurity: {
        name: 'Cybersecurity',
        icon: 'fas fa-shield-alt',
        color: '#dc2626',
        description: 'Information security, threat analysis, and defense strategies',
        vendors: ['comptia', 'ec_council', 'isc2', 'isaca', 'giac', 'fortinet', 'mile2', 'checkpoint', 'cyberark'],
        progression_pathway: {
            foundation: {
                title: 'Security Foundations',
                certifications: [
                    { vendor: 'comptia', cert: 'Security+', code: 'SY0-701', priority: 1 },
                    { vendor: 'ec_council', cert: 'Computer Security Fundamentals', code: 'CSCU', priority: 2 },
                    { vendor: 'isc2', cert: 'Certified in Cybersecurity', code: 'CC', priority: 3 }
                ],
                skills: ['Security fundamentals', 'Risk management basics', 'Security policies', 'Incident response basics'],
                duration: '3-6 months'
            },
            intermediate: {
                title: 'Security Operations & Analysis',
                certifications: [
                    { vendor: 'comptia', cert: 'CySA+', code: 'CS0-003', priority: 1 },
                    { vendor: 'ec_council', cert: 'CEH', code: '312-50', priority: 2 },
                    { vendor: 'giac', cert: 'GSEC', code: 'N/A', priority: 3 },
                    { vendor: 'fortinet', cert: 'NSE 4', code: 'NSE4_FGT-7.2', priority: 4 }
                ],
                skills: ['Threat hunting', 'Vulnerability assessment', 'Ethical hacking', 'Security monitoring'],
                duration: '6-12 months'
            },
            advanced: {
                title: 'Advanced Security & Forensics',
                certifications: [
                    { vendor: 'comptia', cert: 'PenTest+', code: 'PT0-002', priority: 1 },
                    { vendor: 'ec_council', cert: 'CHFI', code: '312-49', priority: 2 },
                    { vendor: 'giac', cert: 'GCED', code: 'N/A', priority: 3 },
                    { vendor: 'isc2', cert: 'CSSLP', code: 'N/A', priority: 4 },
                    { vendor: 'fortinet', cert: 'NSE 7', code: 'NSE7_EFW-7.2', priority: 5 }
                ],
                skills: ['Penetration testing', 'Digital forensics', 'Secure development', 'Advanced threat analysis'],
                duration: '12-18 months'
            },
            expert: {
                title: 'Security Leadership & Architecture',
                certifications: [
                    { vendor: 'comptia', cert: 'CASP+', code: 'CAS-004', priority: 1 },
                    { vendor: 'isc2', cert: 'CISSP', code: 'N/A', priority: 2 },
                    { vendor: 'isaca', cert: 'CISM', code: 'N/A', priority: 3 },
                    { vendor: 'giac', cert: 'GSE', code: 'N/A', priority: 4 },
                    { vendor: 'fortinet', cert: 'NSE 8', code: 'NSE8_812', priority: 5 }
                ],
                skills: ['Security architecture', 'Governance & compliance', 'Strategic security management', 'Enterprise security'],
                duration: '18+ months'
            }
        },
        career_paths: {
            security_analyst: ['foundation', 'intermediate.CySA+', 'advanced.GCED'],
            penetration_tester: ['foundation', 'intermediate.CEH', 'advanced.PenTest+'],
            security_architect: ['foundation', 'intermediate', 'advanced', 'expert.CISSP'],
            compliance_manager: ['foundation', 'intermediate', 'expert.CISM']
        }
    },

    cloud_computing: {
        name: 'Cloud Computing',
        icon: 'fas fa-cloud',
        color: '#2563eb',
        description: 'Cloud platforms, services, and architecture',
        vendors: ['comptia', 'aws', 'microsoft', 'google_cloud', 'oracle', 'vmware', 'redhat'],
        progression_pathway: {
            foundation: {
                title: 'Cloud Fundamentals',
                certifications: [
                    { vendor: 'comptia', cert: 'Cloud Essentials+', code: 'CLO-002', priority: 1 },
                    { vendor: 'aws', cert: 'Cloud Practitioner', code: 'CLF-C02', priority: 2 },
                    { vendor: 'microsoft', cert: 'Azure Fundamentals', code: 'AZ-900', priority: 3 },
                    { vendor: 'google_cloud', cert: 'Cloud Digital Leader', code: 'N/A', priority: 4 }
                ],
                skills: ['Cloud concepts', 'Service models', 'Deployment models', 'Cloud economics'],
                duration: '2-4 months'
            },
            intermediate: {
                title: 'Platform Specialization',
                certifications: [
                    { vendor: 'comptia', cert: 'Cloud+', code: 'CV0-004', priority: 1 },
                    { vendor: 'aws', cert: 'Solutions Architect Associate', code: 'SAA-C03', priority: 2 },
                    { vendor: 'microsoft', cert: 'Azure Administrator', code: 'AZ-104', priority: 3 },
                    { vendor: 'google_cloud', cert: 'Associate Cloud Engineer', code: 'N/A', priority: 4 }
                ],
                skills: ['Platform administration', 'Resource management', 'Networking', 'Security basics'],
                duration: '6-9 months'
            },
            advanced: {
                title: 'Cloud Architecture & Development',
                certifications: [
                    { vendor: 'aws', cert: 'Solutions Architect Professional', code: 'SAP-C02', priority: 1 },
                    { vendor: 'microsoft', cert: 'Azure Solutions Architect', code: 'AZ-305', priority: 2 },
                    { vendor: 'google_cloud', cert: 'Professional Cloud Architect', code: 'N/A', priority: 3 },
                    { vendor: 'vmware', cert: 'VCP-Cloud', code: 'N/A', priority: 4 }
                ],
                skills: ['Cloud architecture', 'Multi-cloud strategies', 'DevOps integration', 'Cost optimization'],
                duration: '12-15 months'
            },
            expert: {
                title: 'Multi-Cloud & Specialization',
                certifications: [
                    { vendor: 'aws', cert: 'Advanced Networking', code: 'ANS-C01', priority: 1 },
                    { vendor: 'microsoft', cert: 'DevOps Engineer Expert', code: 'AZ-400', priority: 2 },
                    { vendor: 'google_cloud', cert: 'Professional ML Engineer', code: 'N/A', priority: 3 },
                    { vendor: 'vmware', cert: 'VCDX-Cloud', code: 'N/A', priority: 4 }
                ],
                skills: ['Advanced specializations', 'Multi-cloud management', 'Enterprise strategy', 'Innovation leadership'],
                duration: '18+ months'
            }
        },
        career_paths: {
            cloud_architect: ['foundation', 'intermediate.AWS-SAA', 'advanced.AWS-SAP'],
            devops_engineer: ['foundation', 'intermediate', 'expert.AZ-400'],
            cloud_security: ['foundation', 'intermediate', 'advanced.security-focus'],
            multi_cloud_specialist: ['foundation', 'intermediate.multi-platform', 'expert']
        }
    },

    networking: {
        name: 'Networking',
        icon: 'fas fa-network-wired',
        color: '#059669',
        description: 'Network infrastructure, protocols, and management',
        vendors: ['comptia', 'cisco', 'juniper', 'huawei', 'aruba', 'cwnp'],
        progression_pathway: {
            foundation: {
                title: 'Network Fundamentals',
                certifications: [
                    { vendor: 'comptia', cert: 'Network+', code: 'N10-009', priority: 1 },
                    { vendor: 'cisco', cert: 'CCST Networking', code: 'N/A', priority: 2 }
                ],
                skills: ['OSI model', 'TCP/IP', 'Basic routing/switching', 'Network troubleshooting'],
                duration: '3-6 months'
            },
            intermediate: {
                title: 'Enterprise Networking',
                certifications: [
                    { vendor: 'cisco', cert: 'CCNA', code: '200-301', priority: 1 },
                    { vendor: 'juniper', cert: 'JNCIA-Junos', code: 'JN0-104', priority: 2 },
                    { vendor: 'huawei', cert: 'HCIA', code: 'H12-811', priority: 3 },
                    { vendor: 'aruba', cert: 'ACMP', code: 'HPE6-A85', priority: 4 }
                ],
                skills: ['Enterprise routing', 'Switching technologies', 'VLANs', 'Network security'],
                duration: '6-12 months'
            },
            advanced: {
                title: 'Professional Networking',
                certifications: [
                    { vendor: 'cisco', cert: 'CCNP Enterprise', code: '350-401', priority: 1 },
                    { vendor: 'juniper', cert: 'JNCIP-ENT', code: 'JN0-649', priority: 2 },
                    { vendor: 'huawei', cert: 'HCIP', code: 'H12-821', priority: 3 }
                ],
                skills: ['Advanced routing protocols', 'Network design', 'Automation', 'Performance optimization'],
                duration: '12-18 months'
            },
            expert: {
                title: 'Network Architecture',
                certifications: [
                    { vendor: 'cisco', cert: 'CCIE Enterprise Infrastructure', code: '400-101', priority: 1 },
                    { vendor: 'juniper', cert: 'JNCIE-ENT', code: 'JPR-934', priority: 2 },
                    { vendor: 'huawei', cert: 'HCIE', code: 'H12-891', priority: 3 }
                ],
                skills: ['Expert-level troubleshooting', 'Network architecture', 'Innovation', 'Thought leadership'],
                duration: '18+ months'
            }
        }
    },

    systems_administration: {
        name: 'Systems Administration',
        icon: 'fas fa-server',
        color: '#7c3aed',
        description: 'Server management, operating systems, and infrastructure',
        vendors: ['comptia', 'microsoft', 'redhat', 'linux', 'vmware', 'suse'],
        progression_pathway: {
            foundation: {
                title: 'System Foundations',
                certifications: [
                    { vendor: 'comptia', cert: 'A+', code: '220-1201/1202', priority: 1 },
                    { vendor: 'linux', cert: 'Linux Essentials', code: '010-160', priority: 2 }
                ],
                skills: ['Hardware basics', 'Operating system fundamentals', 'Basic troubleshooting'],
                duration: '2-4 months'
            },
            intermediate: {
                title: 'System Administration',
                certifications: [
                    { vendor: 'comptia', cert: 'Server+', code: 'SK0-005', priority: 1 },
                    { vendor: 'microsoft', cert: 'Windows Server', code: 'AZ-800', priority: 2 },
                    { vendor: 'redhat', cert: 'RHCSA', code: 'EX200', priority: 3 },
                    { vendor: 'linux', cert: 'LPIC-1', code: '101-500/102-500', priority: 4 }
                ],
                skills: ['Server management', 'User administration', 'System monitoring', 'Backup/recovery'],
                duration: '6-12 months'
            },
            advanced: {
                title: 'Advanced Administration',
                certifications: [
                    { vendor: 'microsoft', cert: 'Windows Server Hybrid', code: 'AZ-801', priority: 1 },
                    { vendor: 'redhat', cert: 'RHCE', code: 'EX294', priority: 2 },
                    { vendor: 'vmware', cert: 'VCP-DCV', code: '2V0-21.20', priority: 3 },
                    { vendor: 'linux', cert: 'LPIC-2', code: '201-450/202-450', priority: 4 }
                ],
                skills: ['Advanced configuration', 'Automation', 'Virtualization', 'Performance tuning'],
                duration: '12-18 months'
            },
            expert: {
                title: 'Infrastructure Architecture',
                certifications: [
                    { vendor: 'redhat', cert: 'RHCA', code: 'Multiple', priority: 1 },
                    { vendor: 'vmware', cert: 'VCDX-DCV', code: 'N/A', priority: 2 },
                    { vendor: 'linux', cert: 'LPIC-3', code: '300-300', priority: 3 }
                ],
                skills: ['Infrastructure design', 'Enterprise architecture', 'Strategic planning'],
                duration: '18+ months'
            }
        }
    },

    software_development: {
        name: 'Software Development',
        icon: 'fas fa-code',
        color: '#f59e0b',
        description: 'Programming, development frameworks, and software engineering',
        vendors: ['oracle', 'microsoft', 'adobe', 'unity', 'qt', 'zend'],
        progression_pathway: {
            foundation: {
                title: 'Programming Fundamentals',
                certifications: [
                    { vendor: 'oracle', cert: 'Java SE Foundations', code: '1Z0-811', priority: 1 },
                    { vendor: 'microsoft', cert: 'Programming Fundamentals', code: '98-361', priority: 2 }
                ],
                skills: ['Programming basics', 'Object-oriented concepts', 'Data structures', 'Algorithms'],
                duration: '3-6 months'
            },
            intermediate: {
                title: 'Platform Development',
                certifications: [
                    { vendor: 'oracle', cert: 'OCA Java SE', code: '1Z0-808', priority: 1 },
                    { vendor: 'microsoft', cert: 'Azure Developer', code: 'AZ-204', priority: 2 },
                    { vendor: 'adobe', cert: 'ACP', code: 'N/A', priority: 3 },
                    { vendor: 'unity', cert: 'Unity Certified Associate', code: 'N/A', priority: 4 }
                ],
                skills: ['Framework development', 'API integration', 'Database connectivity', 'Testing'],
                duration: '6-12 months'
            },
            advanced: {
                title: 'Advanced Development',
                certifications: [
                    { vendor: 'oracle', cert: 'OCP Java SE', code: '1Z0-819', priority: 1 },
                    { vendor: 'microsoft', cert: 'Azure Solutions Developer', code: 'Multiple', priority: 2 },
                    { vendor: 'adobe', cert: 'ACE', code: 'N/A', priority: 3 }
                ],
                skills: ['Advanced programming', 'Architecture patterns', 'Performance optimization', 'DevOps'],
                duration: '12-18 months'
            },
            expert: {
                title: 'Software Architecture',
                certifications: [
                    { vendor: 'oracle', cert: 'Java Enterprise Architect', code: '1Z0-807', priority: 1 },
                    { vendor: 'microsoft', cert: 'Solutions Architecture', code: 'Multiple', priority: 2 }
                ],
                skills: ['System architecture', 'Enterprise patterns', 'Technical leadership', 'Innovation'],
                duration: '18+ months'
            }
        }
    },

    it_governance: {
        name: 'IT Governance & Project Management',
        icon: 'fas fa-tasks',
        color: '#8b5cf6',
        description: 'Project management, service management, and agile methodologies',
        vendors: ['pmi', 'itil', 'prince2', 'scrum_alliance', 'comptia'],
        progression_pathway: {
            foundation: {
                title: 'Management Fundamentals',
                certifications: [
                    { vendor: 'pmi', cert: 'CAPM', code: 'N/A', priority: 1 },
                    { vendor: 'itil', cert: 'ITIL Foundation', code: 'N/A', priority: 2 },
                    { vendor: 'scrum_alliance', cert: 'CSM', code: 'N/A', priority: 3 }
                ],
                skills: ['Project basics', 'Service management', 'Agile principles', 'Team leadership'],
                duration: '2-4 months'
            },
            intermediate: {
                title: 'Professional Management',
                certifications: [
                    { vendor: 'pmi', cert: 'PMP', code: 'N/A', priority: 1 },
                    { vendor: 'itil', cert: 'ITIL Managing Professional', code: 'N/A', priority: 2 },
                    { vendor: 'prince2', cert: 'PRINCE2 Practitioner', code: 'N/A', priority: 3 },
                    { vendor: 'comptia', cert: 'Project+', code: 'PK0-005', priority: 4 }
                ],
                skills: ['Project management', 'Process improvement', 'Risk management', 'Stakeholder management'],
                duration: '6-12 months'
            },
            advanced: {
                title: 'Advanced Management',
                certifications: [
                    { vendor: 'pmi', cert: 'PgMP', code: 'N/A', priority: 1 },
                    { vendor: 'itil', cert: 'ITIL Strategic Leader', code: 'N/A', priority: 2 },
                    { vendor: 'scrum_alliance', cert: 'CSP', code: 'N/A', priority: 3 }
                ],
                skills: ['Program management', 'Strategic planning', 'Organizational change', 'Portfolio management'],
                duration: '12-18 months'
            },
            expert: {
                title: 'Executive Leadership',
                certifications: [
                    { vendor: 'pmi', cert: 'PfMP', code: 'N/A', priority: 1 },
                    { vendor: 'itil', cert: 'ITIL Master', code: 'N/A', priority: 2 }
                ],
                skills: ['Portfolio leadership', 'Strategic transformation', 'Executive management', 'Organizational development'],
                duration: '18+ months'
            }
        }
    }
};
```

---

## 🎨 **FILTER UI COMPONENTS**

### **Filter Toggle System**

```html
<!-- Main Filter Toggle Interface -->
<div class="filter-system-container">
    <div class="filter-toggle-header">
        <h4>Choose Your Learning Path</h4>
        <p>Explore IT certifications by vendor expertise or skill domain</p>
    </div>
    
    <div class="filter-toggle-tabs">
        <button class="filter-toggle-tab active" data-filter="industry" onclick="switchFilterMode('industry')">
            <div class="tab-icon">
                <i class="fas fa-building"></i>
            </div>
            <div class="tab-content">
                <h5>BY INDUSTRY</h5>
                <p>Vendor-Specific Paths</p>
                <span class="tab-badge">47 Vendors</span>
            </div>
        </button>
        
        <button class="filter-toggle-tab" data-filter="domain" onclick="switchFilterMode('domain')">
            <div class="tab-icon">
                <i class="fas fa-layer-group"></i>
            </div>
            <div class="tab-content">
                <h5>BY DOMAIN</h5>
                <p>Skill-Specific Paths</p>
                <span class="tab-badge">6 Domains</span>
            </div>
        </button>
    </div>
</div>

<!-- Industry Filter Panel -->
<div class="filter-panel" id="industry-filter-panel" style="display: block;">
    <div class="filter-section">
        <h6>Select Vendor/Organization:</h6>
        <div class="vendor-selector">
            <button class="vendor-select-btn active" data-vendor="all">
                <i class="fas fa-globe"></i>
                All Vendors
                <span class="vendor-count">47</span>
            </button>
            
            <div class="vendor-categories">
                <div class="vendor-category">
                    <h7>BTH Primary Partners</h7>
                    <div class="vendor-buttons">
                        <button class="vendor-btn bth-partner" data-vendor="comptia">
                            <i class="fas fa-certificate"></i>
                            CompTIA
                        </button>
                        <button class="vendor-btn bth-partner" data-vendor="microsoft">
                            <i class="fab fa-microsoft"></i>
                            Microsoft
                        </button>
                        <button class="vendor-btn bth-partner" data-vendor="aws">
                            <i class="fab fa-aws"></i>
                            AWS
                        </button>
                        <button class="vendor-btn bth-partner" data-vendor="redhat">
                            <i class="fab fa-redhat"></i>
                            Red Hat
                        </button>
                        <button class="vendor-btn bth-partner" data-vendor="oracle">
                            <i class="fas fa-database"></i>
                            Oracle
                        </button>
                        <button class="vendor-btn bth-partner" data-vendor="eta">
                            <i class="fas fa-tools"></i>
                            ETA International
                        </button>
                    </div>
                </div>
                
                <div class="vendor-category">
                    <h7>Core IT & Networking</h7>
                    <div class="vendor-buttons">
                        <button class="vendor-btn" data-vendor="cisco">Cisco</button>
                        <button class="vendor-btn" data-vendor="juniper">Juniper</button>
                        <button class="vendor-btn" data-vendor="aruba">Aruba</button>
                        <button class="vendor-btn" data-vendor="huawei">Huawei</button>
                        <button class="vendor-btn" data-vendor="nokia">Nokia</button>
                        <button class="vendor-btn" data-vendor="zte">ZTE</button>
                        <button class="vendor-btn" data-vendor="cwnp">CWNP</button>
                    </div>
                </div>
                
                <div class="vendor-category">
                    <h7>Cloud & Platforms</h7>
                    <div class="vendor-buttons">
                        <button class="vendor-btn" data-vendor="google_cloud">Google Cloud</button>
                        <button class="vendor-btn" data-vendor="ibm">IBM</button>
                        <button class="vendor-btn" data-vendor="vmware">VMware</button>
                        <button class="vendor-btn" data-vendor="suse">SUSE</button>
                        <button class="vendor-btn" data-vendor="mongodb">MongoDB</button>
                        <button class="vendor-btn" data-vendor="snowflake">Snowflake</button>
                        <button class="vendor-btn" data-vendor="netapp">NetApp</button>
                        <button class="vendor-btn" data-vendor="tableau">Tableau</button>
                    </div>
                </div>
                
                <div class="vendor-category">
                    <h7>Cybersecurity</h7>
                    <div class="vendor-buttons">
                        <button class="vendor-btn" data-vendor="ec_council">EC-Council</button>
                        <button class="vendor-btn" data-vendor="isc2">(ISC)²</button>
                        <button class="vendor-btn" data-vendor="isaca">ISACA</button>
                        <button class="vendor-btn" data-vendor="giac">GIAC</button>
                        <button class="vendor-btn" data-vendor="fortinet">Fortinet</button>
                        <button class="vendor-btn" data-vendor="mile2">Mile2</button>
                        <button class="vendor-btn" data-vendor="iapp">IAPP</button>
                        <button class="vendor-btn" data-vendor="checkpoint">Check Point</button>
                        <button class="vendor-btn" data-vendor="cyberark">CyberArk</button>
                    </div>
                </div>
                
                <div class="vendor-category">
                    <h7>Software Development</h7>
                    <div class="vendor-buttons">
                        <button class="vendor-btn" data-vendor="adobe">Adobe</button>
                        <button class="vendor-btn" data-vendor="unity">Unity</button>
                        <button class="vendor-btn" data-vendor="epic">Epic Systems</button>
                        <button class="vendor-btn" data-vendor="infosys">Infosys</button>
                        <button class="vendor-btn" data-vendor="pega">Pegasystems</button>
                        <button class="vendor-btn" data-vendor="qt">Qt Company</button>
                        <button class="vendor-btn" data-vendor="zend">Zend</button>
                        <button class="vendor-btn" data-vendor="splunk">Splunk</button>
                    </div>
                </div>
                
                <div class="vendor-category">
                    <h7>Governance & Project</h7>
                    <div class="vendor-buttons">
                        <button class="vendor-btn" data-vendor="pmi">PMI</button>
                        <button class="vendor-btn" data-vendor="itil">ITIL</button>
                        <button class="vendor-btn" data-vendor="prince2">PRINCE2</button>
                        <button class="vendor-btn" data-vendor="scrum_alliance">Scrum Alliance</button>
                        <button class="vendor-btn" data-vendor="hdi">HDI</button>
                    </div>
                </div>
                
                <div class="vendor-category">
                    <h7>Specialized Domains</h7>
                    <div class="vendor-buttons">
                        <button class="vendor-btn" data-vendor="lpi">Linux Professional Institute</button>
                        <button class="vendor-btn" data-vendor="citrix">Citrix</button>
                        <button class="vendor-btn" data-vendor="veeam">VEEAM</button>
                        <button class="vendor-btn" data-vendor="forgerock">ForgeRock</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="filter-section">
        <h6>Certification Level:</h6>
        <div class="level-selector">
            <button class="level-btn active" data-level="all">All Levels</button>
            <button class="level-btn foundation" data-level="foundation">Foundation</button>
            <button class="level-btn intermediate" data-level="intermediate">Intermediate</button>
            <button class="level-btn advanced" data-level="advanced">Advanced</button>
            <button class="level-btn expert" data-level="expert">Expert</button>
        </div>
    </div>
</div>

<!-- Domain Filter Panel -->
<div class="filter-panel" id="domain-filter-panel" style="display: none;">
    <div class="filter-section">
        <h6>Select Competency Domain:</h6>
        <div class="domain-selector">
            <button class="domain-select-btn active" data-domain="all">
                <i class="fas fa-globe"></i>
                All Domains
                <span class="domain-count">6</span>
            </button>
            
            <div class="domain-buttons">
                <button class="domain-btn cybersecurity" data-domain="cybersecurity">
                    <div class="domain-icon" style="color: #dc2626;">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="domain-content">
                        <h7>Cybersecurity</h7>
                        <p>Security, threat analysis, defense</p>
                        <span class="vendor-count">9 vendors</span>
                    </div>
                </button>
                
                <button class="domain-btn cloud" data-domain="cloud_computing">
                    <div class="domain-icon" style="color: #2563eb;">
                        <i class="fas fa-cloud"></i>
                    </div>
                    <div class="domain-content">
                        <h7>Cloud Computing</h7>
                        <p>Cloud platforms & architecture</p>
                        <span class="vendor-count">7 vendors</span>
                    </div>
                </button>
                
                <button class="domain-btn networking" data-domain="networking">
                    <div class="domain-icon" style="color: #059669;">
                        <i class="fas fa-network-wired"></i>
                    </div>
                    <div class="domain-content">
                        <h7>Networking</h7>
                        <p>Network infrastructure & protocols</p>
                        <span class="vendor-count">6 vendors</span>
                    </div>
                </button>
                
                <button class="domain-btn systems" data-domain="systems_administration">
                    <div class="domain-icon" style="color: #7c3aed;">
                        <i class="fas fa-server"></i>
                    </div>
                    <div class="domain-content">
                        <h7>Systems Administration</h7>
                        <p>Server management & infrastructure</p>
                        <span class="vendor-count">6 vendors</span>
                    </div>
                </button>
                
                <button class="domain-btn development" data-domain="software_development">
                    <div class="domain-icon" style="color: #f59e0b;">
                        <i class="fas fa-code"></i>
                    </div>
                    <div class="domain-content">
                        <h7>Software Development</h7>
                        <p>Programming & development</p>
                        <span class="vendor-count">6 vendors</span>
                    </div>
                </button>
                
                <button class="domain-btn governance" data-domain="it_governance">
                    <div class="domain-icon" style="color: #8b5cf6;">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <div class="domain-content">
                        <h7>IT Governance</h7>
                        <p>Project management & service management</p>
                        <span class="vendor-count">5 vendors</span>
                    </div>
                </button>
            </div>
        </div>
    </div>
    
    <div class="filter-section">
        <h6>Progression View:</h6>
        <div class="progression-selector">
            <button class="progression-btn active" data-progression="pathway">
                <i class="fas fa-route"></i>
                Pathway View
            </button>
            <button class="progression-btn" data-progression="grid">
                <i class="fas fa-th"></i>
                Grid View
            </button>
        </div>
    </div>
    
    <div class="filter-section">
        <h6>Skill Level:</h6>
        <div class="level-selector">
            <button class="level-btn active" data-level="all">All Levels</button>
            <button class="level-btn foundation" data-level="foundation">Foundation</button>
            <button class="level-btn intermediate" data-level="intermediate">Intermediate</button>
            <button class="level-btn advanced" data-level="advanced">Advanced</button>
            <button class="level-btn expert" data-level="expert">Expert</button>
        </div>
    </div>
</div>
```

---

## ⚙️ **FILTER LOGIC IMPLEMENTATION**

### **Filter State Management Functions**

```javascript
// Filter Mode Switching
function switchFilterMode(mode) {
    if (FILTER_STATE.ui.animating) return;
    
    FILTER_STATE.ui.animating = true;
    FILTER_STATE.currentFilter = mode;
    
    // Update UI tabs
    document.querySelectorAll('.filter-toggle-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === mode);
    });
    
    // Show/hide filter panels with animation
    const industryPanel = document.getElementById('industry-filter-panel');
    const domainPanel = document.getElementById('domain-filter-panel');
    
    if (mode === 'industry') {
        domainPanel.style.display = 'none';
        industryPanel.style.display = 'block';
    } else {
        industryPanel.style.display = 'none';
        domainPanel.style.display = 'block';
    }
    
    // Update content display
    updateContentDisplay();
    
    // Reset animation flag
    setTimeout(() => {
        FILTER_STATE.ui.animating = false;
    }, 300);
}

// Content Display Update
function updateContentDisplay() {
    const contentContainer = document.getElementById('industry-content-display');
    
    if (FILTER_STATE.currentFilter === 'industry') {
        contentContainer.innerHTML = generateIndustryContent();
    } else {
        contentContainer.innerHTML = generateDomainContent();
    }
    
    // Apply animations
    contentContainer.classList.add('content-updating');
    setTimeout(() => {
        contentContainer.classList.remove('content-updating');
    }, 500);
}

// Industry Filter Content Generation
function generateIndustryContent() {
    const selectedVendor = FILTER_STATE.industry.selectedVendor;
    const selectedLevel = FILTER_STATE.industry.selectedLevel;
    
    if (selectedVendor === 'all') {
        return generateAllVendorsContent(selectedLevel);
    } else {
        return generateSingleVendorContent(selectedVendor, selectedLevel);
    }
}

function generateAllVendorsContent(levelFilter) {
    let content = `
        <div class="vendors-overview">
            <div class="overview-header">
                <h4>All IT Certification Vendors</h4>
                <p>Comprehensive coverage across ${Object.keys(BTH_PRIMARY_PARTNERS).length + Object.keys(PEARSON_VUE_VENDORS.core_networking).length + Object.keys(PEARSON_VUE_VENDORS.cloud_platforms).length} vendors</p>
            </div>
            <div class="vendors-grid">
    `;
    
    // BTH Primary Partners
    content += `<div class="vendor-section"><h5>BTH Primary Partners</h5><div class="vendor-cards">`;
    Object.entries(BTH_PRIMARY_PARTNERS).forEach(([key, vendor]) => {
        content += generateVendorCard(key, vendor, 'primary', levelFilter);
    });
    content += `</div></div>`;
    
    // Pearson VUE Vendors by category
    Object.entries(PEARSON_VUE_VENDORS).forEach(([category, vendors]) => {
        content += `<div class="vendor-section"><h5>${formatCategoryName(category)}</h5><div class="vendor-cards">`;
        Object.entries(vendors).forEach(([key, vendor]) => {
            if (typeof vendor === 'object' && vendor.name) {
                content += generateVendorCard(key, vendor, 'pearson', levelFilter);
            }
        });
        content += `</div></div>`;
    });
    
    content += `</div></div>`;
    return content;
}

function generateSingleVendorContent(vendorKey, levelFilter) {
    const vendor = findVendorData(vendorKey);
    if (!vendor) return '<div class="error">Vendor not found</div>';
    
    return `
        <div class="single-vendor-display">
            <div class="vendor-detailed-header">
                <div class="vendor-logo-large">
                    <img src="${vendor.logo}" alt="${vendor.name}">
                </div>
                <div class="vendor-info-detailed">
                    <h3>${vendor.name}</h3>
                    <p class="vendor-category">${vendor.category}</p>
                    <div class="partnership-info">
                        <span class="partnership-badge">${vendor.partnership.type}</span>
                        <span class="partnership-credentials">${vendor.partnership.credentials}</span>
                    </div>
                </div>
            </div>
            
            <div class="vendor-certifications-detailed">
                ${generateDetailedCertificationLevels(vendor.certifications || vendor.certification_template, levelFilter)}
            </div>
            
            ${vendor.training_paths ? generateTrainingPaths(vendor.training_paths) : ''}
        </div>
    `;
}

// Domain Filter Content Generation
function generateDomainContent() {
    const selectedDomain = FILTER_STATE.domain.selectedDomain;
    const selectedLevel = FILTER_STATE.domain.selectedLevel;
    const progressionMode = FILTER_STATE.domain.progressionMode;
    
    if (selectedDomain === 'all') {
        return generateAllDomainsContent(selectedLevel, progressionMode);
    } else {
        return generateSingleDomainContent(selectedDomain, selectedLevel, progressionMode);
    }
}

function generateAllDomainsContent(levelFilter, progressionMode) {
    let content = `
        <div class="domains-overview">
            <div class="overview-header">
                <h4>All Competency Domains</h4>
                <p>Cross-vendor skill-based certification pathways</p>
            </div>
            <div class="domains-grid">
    `;
    
    Object.entries(COMPETENCY_DOMAINS).forEach(([key, domain]) => {
        content += generateDomainCard(key, domain, levelFilter, progressionMode);
    });
    
    content += `</div></div>`;
    return content;
}

function generateSingleDomainContent(domainKey, levelFilter, progressionMode) {
    const domain = COMPETENCY_DOMAINS[domainKey];
    if (!domain) return '<div class="error">Domain not found</div>';
    
    if (progressionMode === 'pathway') {
        return generateDomainPathwayView(domain, levelFilter);
    } else {
        return generateDomainGridView(domain, levelFilter);
    }
}

function generateDomainPathwayView(domain, levelFilter) {
    return `
        <div class="domain-pathway-view">
            <div class="domain-header">
                <div class="domain-icon" style="color: ${domain.color};">
                    <i class="${domain.icon}"></i>
                </div>
                <div class="domain-info">
                    <h3>${domain.name}</h3>
                    <p>${domain.description}</p>
                    <div class="domain-stats">
                        <span>${domain.vendors.length} vendors</span>
                        <span>4 progression levels</span>
                    </div>
                </div>
            </div>
            
            <div class="progression-pathway">
                ${generateProgressionLevels(domain.progression_pathway, levelFilter, domain.color)}
            </div>
        </div>
    `;
}

function generateProgressionLevels(pathway, levelFilter, domainColor) {
    let content = '<div class="pathway-levels">';
    
    Object.entries(pathway).forEach(([level, levelData], index) => {
        if (levelFilter === 'all' || levelFilter === level) {
            content += `
                <div class="pathway-level" data-level="${level}">
                    <div class="level-indicator">
                        <div class="level-number" style="background: ${domainColor};">${index + 1}</div>
                        <div class="level-connector"></div>
                    </div>
                    <div class="level-content">
                        <div class="level-header">
                            <h5>${levelData.title}</h5>
                            <span class="level-badge ${level}">${level.toUpperCase()}</span>
                        </div>
                        <div class="level-certifications">
                            ${levelData.certifications.map(cert => generatePathwayCertificationCard(cert, domainColor)).join('')}
                        </div>
                        <div class="level-skills">
                            <h6>Key Skills:</h6>
                            <div class="skills-list">
                                ${levelData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                        <div class="level-duration">
                            <i class="fas fa-clock"></i>
                            <span>Duration: ${levelData.duration}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    content += '</div>';
    return content;
}
```

---

## 🎨 **CSS STYLING FOR FILTER SYSTEM**

```css
/* Filter System Container */
.filter-system-container {
    margin-bottom: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(20px);
}

.filter-toggle-header {
    text-align: center;
    margin-bottom: 2rem;
}

.filter-toggle-header h4 {
    color: #ffffff;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
}

.filter-toggle-header p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
}

/* Filter Toggle Tabs */
.filter-toggle-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
}

.filter-toggle-tab {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}

.filter-toggle-tab:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.filter-toggle-tab.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
}

.tab-icon {
    font-size: 2rem;
    color: #ffffff;
}

.tab-content h5 {
    color: #ffffff;
    margin: 0 0 0.25rem 0;
    font-size: 1.2rem;
    font-weight: 600;
}

.tab-content p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
}

.tab-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

/* Filter Panels */
.filter-panel {
    animation: fadeIn 0.3s ease-in-out;
}

.filter-section {
    margin-bottom: 2rem;
}

.filter-section h6 {
    color: #ffffff;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
}

/* Vendor Selector */
.vendor-select-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.vendor-select-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}

.vendor-select-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
}

.vendor-count {
    margin-left: auto;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
}

.vendor-categories {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.vendor-category h7 {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: block;
}

.vendor-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
}

.vendor-btn {
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.vendor-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
}

.vendor-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
}

.vendor-btn.bth-partner {
    border-color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

.vendor-btn.bth-partner:hover {
    background: rgba(255, 107, 107, 0.2);
}

/* Domain Selector */
.domain-select-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.domain-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.domain-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}

.domain-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.domain-btn.active {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
}

.domain-icon {
    font-size: 2rem;
    min-width: 60px;
    text-align: center;
}

.domain-content h7 {
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
}

.domain-content p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
}

.domain-content .vendor-count {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
}

/* Level Selector */
.level-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.level-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
}

.level-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.level-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
}

.level-btn.foundation { border-color: #27ae60; }
.level-btn.intermediate { border-color: #f39c12; }
.level-btn.advanced { border-color: #e74c3c; }
.level-btn.expert { border-color: #9b59b6; }

/* Progression Selector */
.progression-selector {
    display: flex;
    gap: 0.5rem;
}

.progression-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.progression-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.progression-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
}

/* Content Display Animation */
.content-updating {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .filter-toggle-tabs {
        grid-template-columns: 1fr;
    }
    
    .vendor-buttons {
        grid-template-columns: 1fr;
    }
    
    .domain-buttons {
        grid-template-columns: 1fr;
    }
    
    .filter-toggle-tab {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }
}
```

---

## 🚀 **IMPLEMENTATION STEPS**

### **Phase 1: Filter Infrastructure Setup**
1. **Create filter state management system**
2. **Build filter toggle UI components**  
3. **Implement vendor and domain selection interfaces**
4. **Create level filtering mechanisms**

### **Phase 2: Content Generation Logic**
1. **Build industry filter content generation**
2. **Create domain pathway content generation**
3. **Implement real-time content switching**
4. **Add progression pathway visualization**

### **Phase 3: Integration & Enhancement**
1. **Integrate with vendor coverage system**
2. **Add smooth animations and transitions**
3. **Implement mobile responsiveness**
4. **Add search and advanced filtering**

---

## ✅ **SUCCESS VALIDATION**

### **Completion Criteria**
- [ ] Dual filter system (Industry/Domain) operational
- [ ] Real-time content switching functional
- [ ] All 47 vendors filterable by industry
- [ ] All 6 domains with cross-vendor pathways
- [ ] Level filtering working across all content
- [ ] Smooth animations and transitions
- [ ] Mobile-responsive filter interface
- [ ] Search functionality integrated

---

**Previous**: [🎯 SOLUTION #1: Complete Vendor Coverage](./SOLUTION_1_COMPLETE_VENDOR_COVERAGE.md)  
**Next**: [⚖️ SOLUTION #3: Level 1 Algorithm Enforcement](./SOLUTION_3_LEVEL1_ALGORITHM_ENFORCEMENT.md)

---

*This solution provides comprehensive filtering capabilities, enabling users to explore IT certifications through both vendor-specific and skill-based approaches with intelligent content organization and real-time switching.*