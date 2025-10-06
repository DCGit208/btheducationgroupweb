/**
 * BTH Education Group - Comprehensive Certification Database
 * Complete certification data for all 25+ industry sectors
 */

class BTHCertificationDatabase {
    constructor() {
        this.DATABASE = {
            technology: {
                name: 'Information Technology',
                totalCertifications: 200,
                categories: {
                    'core-it': {
                        name: 'Core IT Foundations & Networking',
                        focusAreas: ['Network Infrastructure', 'System Administration', 'Help Desk Support'],
                        vendors: {
                            'CompTIA': {
                                partnership: 'premium',
                                certifications: [
                                    { 
                                        id: 'comptia-aplus', 
                                        name: 'CompTIA A+', 
                                        level: 1, 
                                        description: 'PC hardware and software troubleshooting fundamentals',
                                        duration: '3-6 months',
                                        examCodes: ['220-1101', '220-1102'],
                                        prerequisites: 'None',
                                        careerPaths: ['Help Desk Technician', 'Desktop Support', 'Field Service Technician']
                                    },
                                    { 
                                        id: 'comptia-network', 
                                        name: 'CompTIA Network+', 
                                        level: 1, 
                                        description: 'Network infrastructure configuration and troubleshooting',
                                        duration: '3-4 months',
                                        examCodes: ['N10-008'],
                                        prerequisites: 'None (A+ recommended)',
                                        careerPaths: ['Network Technician', 'Network Administrator', 'Help Desk Technician']
                                    },
                                    { 
                                        id: 'comptia-security', 
                                        name: 'CompTIA Security+', 
                                        level: 2, 
                                        description: 'Cybersecurity fundamentals and best practices',
                                        duration: '4-6 months',
                                        examCodes: ['SY0-701'],
                                        prerequisites: 'Network+ or equivalent experience',
                                        careerPaths: ['Security Specialist', 'Security Administrator', 'Systems Administrator']
                                    },
                                    { 
                                        id: 'comptia-server', 
                                        name: 'CompTIA Server+', 
                                        level: 2, 
                                        description: 'Server hardware and software management',
                                        duration: '4-5 months',
                                        examCodes: ['SK0-005'],
                                        prerequisites: 'A+ and Network+ recommended',
                                        careerPaths: ['Server Administrator', 'Data Center Technician', 'Cloud Support']
                                    },
                                    { 
                                        id: 'comptia-cloud', 
                                        name: 'CompTIA Cloud+', 
                                        level: 3, 
                                        description: 'Cloud infrastructure and services management',
                                        duration: '5-6 months',
                                        examCodes: ['CV0-003'],
                                        prerequisites: 'Network+ and Server+ recommended',
                                        careerPaths: ['Cloud Administrator', 'Cloud Architect', 'DevOps Engineer']
                                    },
                                    { 
                                        id: 'comptia-cysa', 
                                        name: 'CompTIA CySA+', 
                                        level: 3, 
                                        description: 'Cybersecurity analyst skills and threat detection',
                                        duration: '6-8 months',
                                        examCodes: ['CS0-002'],
                                        prerequisites: 'Security+ or equivalent experience',
                                        careerPaths: ['Cybersecurity Analyst', 'SOC Analyst', 'Threat Hunter']
                                    },
                                    { 
                                        id: 'comptia-pentest', 
                                        name: 'CompTIA PenTest+', 
                                        level: 4, 
                                        description: 'Penetration testing and vulnerability assessment',
                                        duration: '6-8 months',
                                        examCodes: ['PT0-002'],
                                        prerequisites: 'Security+ and hands-on security experience',
                                        careerPaths: ['Penetration Tester', 'Vulnerability Assessor', 'Security Consultant']
                                    },
                                    { 
                                        id: 'comptia-casp', 
                                        name: 'CompTIA CASP+', 
                                        level: 5, 
                                        description: 'Advanced security practitioner and enterprise security architecture',
                                        duration: '8-12 months',
                                        examCodes: ['CAS-004'],
                                        prerequisites: '10+ years experience or multiple CompTIA security certs',
                                        careerPaths: ['Security Architect', 'Senior Security Engineer', 'Chief Security Officer']
                                    }
                                ]
                            },
                            'Cisco': {
                                partnership: 'premium',
                                certifications: [
                                    { 
                                        id: 'cisco-ccna', 
                                        name: 'Cisco CCNA', 
                                        level: 2, 
                                        description: 'Network fundamentals and Cisco device configuration',
                                        duration: '6-8 months',
                                        examCodes: ['200-301'],
                                        prerequisites: 'Basic networking knowledge',
                                        careerPaths: ['Network Administrator', 'Network Engineer', 'Systems Administrator']
                                    },
                                    { 
                                        id: 'cisco-ccnp-enterprise', 
                                        name: 'Cisco CCNP Enterprise', 
                                        level: 3, 
                                        description: 'Enterprise networking solutions and advanced routing',
                                        duration: '8-12 months',
                                        examCodes: ['350-401', 'Plus one concentration exam'],
                                        prerequisites: 'CCNA or equivalent experience',
                                        careerPaths: ['Senior Network Engineer', 'Network Architect', 'Network Consultant']
                                    },
                                    { 
                                        id: 'cisco-ccnp-security', 
                                        name: 'Cisco CCNP Security', 
                                        level: 3, 
                                        description: 'Network security implementation and management',
                                        duration: '8-12 months',
                                        examCodes: ['350-701', 'Plus one concentration exam'],
                                        prerequisites: 'CCNA Security or equivalent',
                                        careerPaths: ['Security Engineer', 'Network Security Specialist', 'Security Architect']
                                    },
                                    { 
                                        id: 'cisco-ccie-enterprise', 
                                        name: 'Cisco CCIE Enterprise', 
                                        level: 5, 
                                        description: 'Expert-level enterprise networking and infrastructure',
                                        duration: '12-18 months',
                                        examCodes: ['350-401 Written', '8-hour Lab Exam'],
                                        prerequisites: 'CCNP Enterprise and extensive experience',
                                        careerPaths: ['Principal Network Architect', 'Senior Network Consultant', 'CTO']
                                    },
                                    { 
                                        id: 'cisco-devnet-associate', 
                                        name: 'Cisco DevNet Associate', 
                                        level: 2, 
                                        description: 'Network programmability and automation fundamentals',
                                        duration: '4-6 months',
                                        examCodes: ['200-901'],
                                        prerequisites: 'Basic programming and networking knowledge',
                                        careerPaths: ['Network Programmer', 'Automation Engineer', 'DevOps Engineer']
                                    }
                                ]
                            }
                        }
                    },
                    'cloud-platforms': {
                        name: 'Cloud & Platform Services',
                        focusAreas: ['Cloud Architecture', 'DevOps & Automation', 'Container Orchestration'],
                        vendors: {
                            'Microsoft': {
                                partnership: 'premium',
                                certifications: [
                                    { 
                                        id: 'ms-365-fundamentals', 
                                        name: 'Microsoft 365 Fundamentals', 
                                        level: 1, 
                                        description: 'Microsoft 365 services and concepts overview',
                                        duration: '2-3 months',
                                        examCodes: ['MS-900'],
                                        prerequisites: 'None',
                                        careerPaths: ['Microsoft 365 Administrator', 'Help Desk Analyst', 'IT Support Specialist']
                                    },
                                    { 
                                        id: 'ms-azure-fundamentals', 
                                        name: 'Azure Fundamentals', 
                                        level: 1, 
                                        description: 'Microsoft Azure cloud services and basic concepts',
                                        duration: '2-4 months',
                                        examCodes: ['AZ-900'],
                                        prerequisites: 'None',
                                        careerPaths: ['Cloud Support Associate', 'Azure Administrator', 'Cloud Sales Specialist']
                                    },
                                    { 
                                        id: 'ms-azure-administrator', 
                                        name: 'Azure Administrator', 
                                        level: 2, 
                                        description: 'Azure infrastructure management and administration',
                                        duration: '4-6 months',
                                        examCodes: ['AZ-104'],
                                        prerequisites: 'Azure Fundamentals recommended',
                                        careerPaths: ['Azure Administrator', 'Cloud Administrator', 'Systems Administrator']
                                    },
                                    { 
                                        id: 'ms-azure-developer', 
                                        name: 'Azure Developer', 
                                        level: 3, 
                                        description: 'Azure application development and integration',
                                        duration: '6-8 months',
                                        examCodes: ['AZ-204'],
                                        prerequisites: 'Azure Fundamentals and development experience',
                                        careerPaths: ['Cloud Developer', 'Azure Solutions Developer', 'DevOps Engineer']
                                    },
                                    { 
                                        id: 'ms-azure-solutions-architect', 
                                        name: 'Azure Solutions Architect', 
                                        level: 4, 
                                        description: 'Azure architecture design and implementation',
                                        duration: '8-12 months',
                                        examCodes: ['AZ-305'],
                                        prerequisites: 'Azure Administrator or Developer plus experience',
                                        careerPaths: ['Cloud Architect', 'Solutions Architect', 'Principal Engineer']
                                    },
                                    { 
                                        id: 'ms-azure-devops-engineer', 
                                        name: 'Azure DevOps Engineer', 
                                        level: 4, 
                                        description: 'DevOps practices and Azure DevOps implementation',
                                        duration: '6-10 months',
                                        examCodes: ['AZ-400'],
                                        prerequisites: 'Azure Developer or Administrator experience',
                                        careerPaths: ['DevOps Engineer', 'Release Manager', 'Platform Engineer']
                                    }
                                ]
                            },
                            'AWS': {
                                partnership: 'premium',
                                certifications: [
                                    { 
                                        id: 'aws-cloud-practitioner', 
                                        name: 'AWS Cloud Practitioner', 
                                        level: 1, 
                                        description: 'AWS cloud fundamentals and basic services overview',
                                        duration: '2-3 months',
                                        examCodes: ['CLF-C01'],
                                        prerequisites: 'None',
                                        careerPaths: ['Cloud Support Associate', 'Cloud Sales', 'Technical Account Manager']
                                    },
                                    { 
                                        id: 'aws-solutions-architect-associate', 
                                        name: 'AWS Solutions Architect Associate', 
                                        level: 2, 
                                        description: 'AWS architecture design and best practices',
                                        duration: '4-6 months',
                                        examCodes: ['SAA-C03'],
                                        prerequisites: 'Cloud Practitioner recommended',
                                        careerPaths: ['Solutions Architect', 'Cloud Architect', 'Technical Consultant']
                                    },
                                    { 
                                        id: 'aws-developer-associate', 
                                        name: 'AWS Developer Associate', 
                                        level: 2, 
                                        description: 'AWS application development and deployment',
                                        duration: '4-6 months',
                                        examCodes: ['DVA-C01'],
                                        prerequisites: 'Programming experience and Cloud Practitioner',
                                        careerPaths: ['Cloud Developer', 'Application Developer', 'DevOps Engineer']
                                    },
                                    { 
                                        id: 'aws-sysops-administrator', 
                                        name: 'AWS SysOps Administrator', 
                                        level: 3, 
                                        description: 'AWS systems operations and management',
                                        duration: '5-7 months',
                                        examCodes: ['SOA-C02'],
                                        prerequisites: 'Solutions Architect Associate or equivalent',
                                        careerPaths: ['Cloud Operations Engineer', 'Systems Administrator', 'DevOps Engineer']
                                    },
                                    { 
                                        id: 'aws-solutions-architect-professional', 
                                        name: 'AWS Solutions Architect Professional', 
                                        level: 4, 
                                        description: 'Advanced AWS architecture and complex system design',
                                        duration: '8-12 months',
                                        examCodes: ['SAP-C02'],
                                        prerequisites: 'Solutions Architect Associate and 2+ years experience',
                                        careerPaths: ['Senior Cloud Architect', 'Principal Engineer', 'Cloud Practice Lead']
                                    },
                                    { 
                                        id: 'aws-devops-engineer-professional', 
                                        name: 'AWS DevOps Engineer Professional', 
                                        level: 5, 
                                        description: 'Advanced AWS DevOps practices and automation',
                                        duration: '10-12 months',
                                        examCodes: ['DOP-C02'],
                                        prerequisites: 'Developer or SysOps Associate and extensive experience',
                                        careerPaths: ['Senior DevOps Engineer', 'Platform Architect', 'Engineering Manager']
                                    }
                                ]
                            },
                            'Google Cloud': {
                                partnership: 'premium',
                                certifications: [
                                    { 
                                        id: 'gcp-cloud-digital-leader', 
                                        name: 'Google Cloud Digital Leader', 
                                        level: 1, 
                                        description: 'Google Cloud basics and business transformation',
                                        duration: '2-3 months',
                                        examCodes: ['CDL'],
                                        prerequisites: 'None',
                                        careerPaths: ['Cloud Business Analyst', 'Technical Sales', 'Project Manager']
                                    },
                                    { 
                                        id: 'gcp-associate-cloud-engineer', 
                                        name: 'Associate Cloud Engineer', 
                                        level: 2, 
                                        description: 'Google Cloud infrastructure deployment and management',
                                        duration: '4-6 months',
                                        examCodes: ['ACE'],
                                        prerequisites: 'Cloud Digital Leader recommended',
                                        careerPaths: ['Cloud Engineer', 'DevOps Engineer', 'Site Reliability Engineer']
                                    },
                                    { 
                                        id: 'gcp-professional-cloud-architect', 
                                        name: 'Professional Cloud Architect', 
                                        level: 4, 
                                        description: 'Google Cloud architecture design and implementation',
                                        duration: '8-12 months',
                                        examCodes: ['PCA'],
                                        prerequisites: 'Associate Cloud Engineer and 3+ years experience',
                                        careerPaths: ['Cloud Architect', 'Principal Engineer', 'Technical Lead']
                                    },
                                    { 
                                        id: 'gcp-professional-data-engineer', 
                                        name: 'Professional Data Engineer', 
                                        level: 4, 
                                        description: 'Data processing and machine learning on Google Cloud',
                                        duration: '8-10 months',
                                        examCodes: ['PDE'],
                                        prerequisites: 'Associate Cloud Engineer and data experience',
                                        careerPaths: ['Data Engineer', 'ML Engineer', 'Data Architect']
                                    }
                                ]
                            }
                        }
                    },
                    'cybersecurity': {
                        name: 'Cybersecurity & Privacy',
                        focusAreas: ['Threat Detection & Response', 'Security Architecture', 'Compliance & Governance'],
                        vendors: {
                            '(ISC)²': {
                                partnership: 'premium',
                                certifications: [
                                    { 
                                        id: 'cissp', 
                                        name: 'CISSP', 
                                        level: 4, 
                                        description: 'Certified Information Systems Security Professional',
                                        duration: '8-12 months',
                                        examCodes: ['CISSP'],
                                        prerequisites: '5 years security experience',
                                        careerPaths: ['Security Manager', 'CISO', 'Security Consultant']
                                    },
                                    { 
                                        id: 'ccsp', 
                                        name: 'CCSP', 
                                        level: 4, 
                                        description: 'Certified Cloud Security Professional',
                                        duration: '6-10 months',
                                        examCodes: ['CCSP'],
                                        prerequisites: '5 years IT and 3 years cloud security experience',
                                        careerPaths: ['Cloud Security Architect', 'Cloud Security Manager', 'Security Consultant']
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            healthcare: {
                name: 'Healthcare Technology',
                totalCertifications: 150,
                categories: {
                    'health-it': {
                        name: 'Health Information Technology',
                        focusAreas: ['Electronic Health Records', 'Health Information Exchange', 'Clinical Decision Support'],
                        vendors: {
                            'Epic': {
                                partnership: 'premium',
                                certifications: [
                                    { 
                                        id: 'epic-certified-technical-solutions', 
                                        name: 'Epic Certified Technical Solutions', 
                                        level: 3, 
                                        description: 'Epic EHR technical implementation and support',
                                        duration: '6-9 months',
                                        examCodes: ['Epic Internal'],
                                        prerequisites: 'Healthcare IT experience',
                                        careerPaths: ['Epic Analyst', 'EHR Implementation Specialist', 'Health IT Consultant']
                                    }
                                ]
                            },
                            'Cerner': {
                                partnership: 'standard',
                                certifications: [
                                    { 
                                        id: 'cerner-millennium-developer', 
                                        name: 'Cerner Millennium Developer', 
                                        level: 3, 
                                        description: 'Cerner Millennium platform development and customization',
                                        duration: '4-6 months',
                                        examCodes: ['Cerner Internal'],
                                        prerequisites: 'Programming experience',
                                        careerPaths: ['Cerner Developer', 'Clinical Application Analyst', 'Health Systems Integrator']
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            manufacturing: {
                name: 'Manufacturing & Industrial',
                totalCertifications: 100,
                categories: {
                    'quality-control': {
                        name: 'Quality Control & Management',
                        focusAreas: ['Lean Six Sigma', 'Statistical Process Control', 'Quality Assurance'],
                        vendors: {
                            'ASQ': {
                                partnership: 'premium',
                                certifications: [
                                    { 
                                        id: 'asq-cqe', 
                                        name: 'Certified Quality Engineer', 
                                        level: 3, 
                                        description: 'Quality engineering principles and statistical methods',
                                        duration: '6-8 months',
                                        examCodes: ['CQE'],
                                        prerequisites: '8 years quality experience or engineering degree + 4 years',
                                        careerPaths: ['Quality Engineer', 'Process Improvement Manager', 'Quality Director']
                                    },
                                    { 
                                        id: 'asq-six-sigma-black-belt', 
                                        name: 'Six Sigma Black Belt', 
                                        level: 4, 
                                        description: 'Advanced Six Sigma methodology and project leadership',
                                        duration: '8-12 months',
                                        examCodes: ['CSSBB'],
                                        prerequisites: 'Green Belt and project leadership experience',
                                        careerPaths: ['Six Sigma Black Belt', 'Process Excellence Manager', 'Continuous Improvement Director']
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        };
    }
    
    // Get all certifications for a sector
    getSectorCertifications(sectorName) {
        return this.DATABASE[sectorName] || null;
    }
    
    // Get certifications filtered by level
    getCertificationsByLevel(sectorName, level) {
        const sector = this.getSectorCertifications(sectorName);
        if (!sector) return [];
        
        const certifications = [];
        Object.values(sector.categories).forEach(category => {
            Object.values(category.vendors).forEach(vendor => {
                vendor.certifications.forEach(cert => {
                    if (cert.level <= level) {
                        certifications.push({
                            ...cert,
                            category: category.name,
                            vendor: Object.keys(category.vendors).find(k => category.vendors[k] === vendor)
                        });
                    }
                });
            });
        });
        
        return certifications;
    }
    
    // Get vendor certifications
    getVendorCertifications(sectorName, vendorName, level = 5) {
        const sector = this.getSectorCertifications(sectorName);
        if (!sector) return [];
        
        const certifications = [];
        Object.values(sector.categories).forEach(category => {
            if (category.vendors[vendorName]) {
                category.vendors[vendorName].certifications.forEach(cert => {
                    if (cert.level <= level) {
                        certifications.push({
                            ...cert,
                            category: category.name,
                            vendor: vendorName
                        });
                    }
                });
            }
        });
        
        return certifications;
    }
    
    // Get category certifications
    getCategoryCertifications(sectorName, categoryName, level = 5) {
        const sector = this.getSectorCertifications(sectorName);
        if (!sector || !sector.categories[categoryName]) return [];
        
        const category = sector.categories[categoryName];
        const certifications = [];
        
        Object.entries(category.vendors).forEach(([vendorName, vendor]) => {
            vendor.certifications.forEach(cert => {
                if (cert.level <= level) {
                    certifications.push({
                        ...cert,
                        category: category.name,
                        vendor: vendorName
                    });
                }
            });
        });
        
        return certifications;
    }
    
    // Search certifications
    searchCertifications(sectorName, query, level = 5) {
        const sector = this.getSectorCertifications(sectorName);
        if (!sector) return [];
        
        const searchTerms = query.toLowerCase().split(' ');
        const certifications = [];
        
        Object.values(sector.categories).forEach(category => {
            Object.entries(category.vendors).forEach(([vendorName, vendor]) => {
                vendor.certifications.forEach(cert => {
                    if (cert.level <= level) {
                        const searchText = `${cert.name} ${cert.description} ${vendorName} ${category.name}`.toLowerCase();
                        const matches = searchTerms.some(term => searchText.includes(term));
                        
                        if (matches) {
                            certifications.push({
                                ...cert,
                                category: category.name,
                                vendor: vendorName
                            });
                        }
                    }
                });
            });
        });
        
        return certifications;
    }
    
    // Get all sectors
    getAllSectors() {
        return Object.keys(this.DATABASE).map(key => ({
            key,
            name: this.DATABASE[key].name,
            totalCertifications: this.DATABASE[key].totalCertifications
        }));
    }
    
    // Get sector summary
    getSectorSummary(sectorName) {
        const sector = this.getSectorCertifications(sectorName);
        if (!sector) return null;
        
        return {
            name: sector.name,
            totalCertifications: sector.totalCertifications,
            categories: Object.keys(sector.categories).length,
            vendors: this.getUniqueVendors(sectorName).length,
            levels: this.getAvailableLevels(sectorName)
        };
    }
    
    getUniqueVendors(sectorName) {
        const sector = this.getSectorCertifications(sectorName);
        if (!sector) return [];
        
        const vendors = new Set();
        Object.values(sector.categories).forEach(category => {
            Object.keys(category.vendors).forEach(vendor => vendors.add(vendor));
        });
        
        return Array.from(vendors);
    }
    
    getAvailableLevels(sectorName) {
        const sector = this.getSectorCertifications(sectorName);
        if (!sector) return [];
        
        const levels = new Set();
        Object.values(sector.categories).forEach(category => {
            Object.values(category.vendors).forEach(vendor => {
                vendor.certifications.forEach(cert => levels.add(cert.level));
            });
        });
        
        return Array.from(levels).sort();
    }
}

// Global certification database instance
window.BTHCertDB = new BTHCertificationDatabase();

// Export for module usage
if (typeof exports !== 'undefined') {
    exports.BTHCertificationDatabase = BTHCertificationDatabase;
}