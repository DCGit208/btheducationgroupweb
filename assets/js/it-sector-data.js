// IT Sector Comprehensive Database Implementation - CORRECTED LEVEL STRUCTURE
// Level 1 = 3 certifications, Level 2 = 4, Level 3 = 5, Level 4 = 6, Level 5 = 7-10

const ITSectorData = {
    categories: {
        'core-it-networking': {
            name: 'Core IT Foundations & Networking',
            icon: 'fas fa-network-wired',
            focusAreas: ['Network Infrastructure', 'System Administration', 'Help Desk Operations', 'Hardware Troubleshooting', 'Network Security Basics'],
            vendors: ['CompTIA', 'Cisco', 'CWNP', 'Juniper', 'Aruba'],
            partnershipTier: ['Premium', 'Premium', 'Standard', 'Premium', 'Standard'],
            color: '#2563eb',
            description: 'Build foundational IT skills and enterprise networking expertise'
        },
        'cloud-platforms': {
            name: 'Cloud & Platforms',
            icon: 'fas fa-cloud',
            focusAreas: ['Cloud Architecture', 'Platform Engineering', 'Container Orchestration', 'Infrastructure as Code', 'Multi-Cloud Management'],
            vendors: ['AWS', 'Microsoft', 'Google Cloud', 'Red Hat', 'VMware/Omnissa'],
            partnershipTier: ['Premium', 'Premium', 'Premium', 'Standard', 'Premium'],
            color: '#7c3aed',
            description: 'Master cloud technologies and platform engineering solutions'
        },
        'cybersecurity-privacy': {
            name: 'Cybersecurity & Privacy',
            icon: 'fas fa-shield-alt',
            focusAreas: ['Security Operations', 'Risk Management', 'Incident Response', 'Compliance & Governance', 'Ethical Hacking'],
            vendors: ['CompTIA', '(ISC)²', 'ISACA', 'EC-Council', 'GIAC'],
            partnershipTier: ['Premium', 'Premium', 'Premium', 'Standard', 'Premium'],
            color: '#dc2626',
            description: 'Protect organizations from evolving cyber threats'
        },
        'data-analytics-engineering': {
            name: 'Data Analytics & Engineering',
            icon: 'fas fa-chart-line',
            focusAreas: ['Business Intelligence', 'Data Pipeline Engineering', 'Advanced Analytics', 'Data Warehousing', 'Machine Learning Operations'],
            vendors: ['Tableau', 'Microsoft', 'Databricks', 'Snowflake', 'Alteryx'],
            partnershipTier: ['Premium', 'Premium', 'Premium', 'Premium', 'Standard'],
            color: '#059669',
            description: 'Transform data into actionable business insights'
        },
        'software-development-devops': {
            name: 'Software Development & DevOps',
            icon: 'fas fa-code',
            focusAreas: ['Application Development', 'CI/CD Pipelines', 'Container Management', 'Infrastructure Automation', 'Site Reliability Engineering'],
            vendors: ['Docker', 'Kubernetes', 'Terraform', 'GitHub', 'Jenkins'],
            partnershipTier: ['Premium', 'Premium', 'Standard', 'Premium', 'Standard'],
            color: '#f59e0b',
            description: 'Build and deploy applications with modern DevOps practices'
        },
        'emerging-technologies': {
            name: 'Emerging Technologies',
            icon: 'fas fa-robot',
            focusAreas: ['Artificial Intelligence', 'Machine Learning', 'Blockchain', 'IoT Implementation', 'AR/VR Development'],
            vendors: ['IBM', 'Microsoft', 'Google', 'NVIDIA', 'Unity'],
            partnershipTier: ['Premium', 'Premium', 'Premium', 'Premium', 'Standard'],
            color: '#ec4899',
            description: 'Lead innovation with cutting-edge technologies'
        },
        'it-service-management': {
            name: 'IT Service Management & Operations',
            icon: 'fas fa-cogs',
            focusAreas: ['IT Service Management', 'Project Management', 'Business Analysis', 'Process Improvement', 'Digital Transformation'],
            vendors: ['ServiceNow', 'Atlassian', 'PMI', 'AXELOS', 'Salesforce'],
            partnershipTier: ['Premium', 'Premium', 'Premium', 'Standard', 'Premium'],
            color: '#0891b2',
            description: 'Optimize IT operations and drive digital transformation'
        }
    },

    // Level-Based Certification Structure (CORRECTED)
    levels: {
        level1: {
            name: "IT Foundation Professional",
            count: 3, // EXACTLY 3 certifications
            certifications: [
                {
                    id: 'comptia-tech-plus',
                    name: 'CompTIA Tech+',
                    vendor: 'CompTIA',
                    category: 'core-it-networking',
                    focusAreas: ['Hardware Troubleshooting', 'Basic Networking'],
                    price: 358,
                    duration: '1-2 months',
                    difficulty: 'Beginner',
                    prerequisites: 'None',
                    description: 'Entry-point certification for IT fundamentals and basic troubleshooting'
                },
                {
                    id: 'comptia-aplus',
                    name: 'CompTIA A+',
                    vendor: 'CompTIA',
                    category: 'core-it-networking',
                    focusAreas: ['Hardware Troubleshooting', 'System Administration'],
                    price: 358,
                    duration: '3-4 months',
                    difficulty: 'Beginner',
                    prerequisites: 'Tech+ recommended',
                    description: 'Complete hardware and software troubleshooting certification'
                },
                {
                    id: 'comptia-network-plus',
                    name: 'CompTIA Network+',
                    vendor: 'CompTIA',
                    category: 'core-it-networking',
                    focusAreas: ['Network Infrastructure', 'Network Security Basics'],
                    price: 370,
                    duration: '2-3 months',
                    difficulty: 'Beginner',
                    prerequisites: 'A+ certification',
                    description: 'Networking fundamentals and infrastructure management'
                }
            ]
        },
        level2: {
            name: "IT Intermediate Professional",
            count: 4, // EXACTLY 4 certifications
            certifications: [
                {
                    id: 'comptia-security-plus',
                    name: 'CompTIA Security+',
                    vendor: 'CompTIA',
                    category: 'cybersecurity-privacy',
                    focusAreas: ['Security Operations', 'Risk Management'],
                    price: 370,
                    duration: '3-4 months',
                    difficulty: 'Intermediate',
                    prerequisites: 'Network+ certification',
                    description: 'Foundation cybersecurity principles and practices'
                },
                {
                    id: 'aws-cloud-practitioner',
                    name: 'AWS Cloud Practitioner',
                    vendor: 'AWS',
                    category: 'cloud-platforms',
                    focusAreas: ['Cloud Architecture'],
                    price: 100,
                    duration: '2-3 months',
                    difficulty: 'Beginner',
                    prerequisites: 'Basic IT knowledge',
                    description: 'AWS cloud fundamentals and services overview'
                },
                {
                    id: 'cisco-ccna',
                    name: 'Cisco CCNA',
                    vendor: 'Cisco',
                    category: 'core-it-networking',
                    focusAreas: ['Network Infrastructure', 'Network Security Basics'],
                    price: 300,
                    duration: '4-6 months',
                    difficulty: 'Intermediate',
                    prerequisites: 'Network+ certification',
                    description: 'Cisco networking associate level certification'
                },
                {
                    id: 'tableau-desktop-specialist',
                    name: 'Tableau Desktop Specialist',
                    vendor: 'Tableau',
                    category: 'data-analytics-engineering',
                    focusAreas: ['Business Intelligence'],
                    price: 100,
                    duration: '2-3 months',
                    difficulty: 'Beginner',
                    prerequisites: 'Basic data analysis knowledge',
                    description: 'Tableau data visualization fundamentals'
                }
            ]
        },
        level3: {
            name: "IT Advanced Professional",
            count: 5, // EXACTLY 5 certifications
            certifications: [
                {
                    id: 'aws-solutions-architect',
                    name: 'AWS Solutions Architect Associate',
                    vendor: 'AWS',
                    category: 'cloud-platforms',
                    focusAreas: ['Cloud Architecture'],
                    price: 150,
                    duration: '4-5 months',
                    difficulty: 'Intermediate',
                    prerequisites: 'AWS Cloud Practitioner',
                    description: 'Design distributed applications on AWS'
                },
                {
                    id: 'cisco-ccnp-enterprise',
                    name: 'Cisco CCNP Enterprise',
                    vendor: 'Cisco',
                    category: 'core-it-networking',
                    focusAreas: ['Network Infrastructure'],
                    price: 400,
                    duration: '6-8 months',
                    difficulty: 'Advanced',
                    prerequisites: 'CCNA certification',
                    description: 'Advanced enterprise networking solutions'
                },
                {
                    id: 'cissp',
                    name: 'CISSP',
                    vendor: '(ISC)²',
                    category: 'cybersecurity-privacy',
                    focusAreas: ['Risk Management', 'Compliance & Governance'],
                    price: 749,
                    duration: '6-9 months',
                    difficulty: 'Advanced',
                    prerequisites: '5 years experience',
                    description: 'Advanced security management and architecture'
                },
                {
                    id: 'kubernetes-cka',
                    name: 'Certified Kubernetes Administrator',
                    vendor: 'Kubernetes',
                    category: 'cloud-platforms',
                    focusAreas: ['Container Orchestration'],
                    price: 375,
                    duration: '5-7 months',
                    difficulty: 'Advanced',
                    prerequisites: 'Docker experience',
                    description: 'Kubernetes cluster administration and management'
                },
                {
                    id: 'microsoft-azure-architect',
                    name: 'Azure Solutions Architect Expert',
                    vendor: 'Microsoft',
                    category: 'cloud-platforms',
                    focusAreas: ['Cloud Architecture'],
                    price: 165,
                    duration: '6-8 months',
                    difficulty: 'Advanced',
                    prerequisites: 'Azure Associate level',
                    description: 'Design solutions on Microsoft Azure'
                }
            ]
        },
        level4: {
            name: "IT Expert/Specialist",
            count: 6, // EXACTLY 6 certifications
            certifications: [
                {
                    id: 'aws-solutions-architect-pro',
                    name: 'AWS Solutions Architect Professional',
                    vendor: 'AWS',
                    category: 'cloud-platforms',
                    focusAreas: ['Cloud Architecture'],
                    price: 300,
                    duration: '6-8 months',
                    difficulty: 'Expert',
                    prerequisites: 'AWS Associate level',
                    description: 'Advanced AWS architecture and design patterns'
                },
                {
                    id: 'gcp-cloud-architect',
                    name: 'Google Cloud Professional Cloud Architect',
                    vendor: 'Google Cloud',
                    category: 'cloud-platforms',
                    focusAreas: ['Cloud Architecture'],
                    price: 200,
                    duration: '5-7 months',
                    difficulty: 'Expert',
                    prerequisites: 'Cloud experience',
                    description: 'Design and manage Google Cloud solutions'
                },
                {
                    id: 'cism',
                    name: 'CISM - Certified Information Security Manager',
                    vendor: 'ISACA',
                    category: 'cybersecurity-privacy',
                    focusAreas: ['Risk Management'],
                    price: 760,
                    duration: '5-7 months',
                    difficulty: 'Expert',
                    prerequisites: '5 years management experience',
                    description: 'Information security management and governance'
                },
                {
                    id: 'cisco-ccie-rs',
                    name: 'Cisco CCIE Routing & Switching',
                    vendor: 'Cisco',
                    category: 'core-it-networking',
                    focusAreas: ['Network Infrastructure'],
                    price: 1600,
                    duration: '12-18 months',
                    difficulty: 'Expert',
                    prerequisites: 'CCNP certification',
                    description: 'Expert-level networking certification'
                },
                {
                    id: 'vmware-vcdx',
                    name: 'VMware Certified Design Expert',
                    vendor: 'VMware/Omnissa',
                    category: 'cloud-platforms',
                    focusAreas: ['Platform Engineering'],
                    price: 4000,
                    duration: '12-18 months',
                    difficulty: 'Expert',
                    prerequisites: 'VMware VCP and VCAP',
                    description: 'Expert-level virtualization design'
                },
                {
                    id: 'databricks-architect',
                    name: 'Databricks Certified Data Engineer Professional',
                    vendor: 'Databricks',
                    category: 'data-analytics-engineering',
                    focusAreas: ['Data Pipeline Engineering'],
                    price: 200,
                    duration: '6-8 months',
                    difficulty: 'Expert',
                    prerequisites: 'Data engineering experience',
                    description: 'Advanced data engineering on Databricks platform'
                }
            ]
        },
        level5: {
            name: "IT Master/Executive",
            count: '7-10', // 7-10 certifications (flexible executive level)
            certifications: [
                {
                    id: 'aws-devops-pro',
                    name: 'AWS DevOps Engineer Professional',
                    vendor: 'AWS',
                    category: 'software-development-devops',
                    focusAreas: ['CI/CD Pipelines', 'Infrastructure Automation'],
                    price: 300,
                    duration: '8-10 months',
                    difficulty: 'Expert',
                    prerequisites: 'AWS Associate level',
                    description: 'Advanced DevOps practices on AWS'
                },
                {
                    id: 'giac-gse',
                    name: 'GIAC Security Expert',
                    vendor: 'GIAC',
                    category: 'cybersecurity-privacy',
                    focusAreas: ['Security Operations', 'Incident Response'],
                    price: 15000,
                    duration: '12-18 months',
                    difficulty: 'Master',
                    prerequisites: 'Multiple GIAC certifications',
                    description: 'Master-level cybersecurity expertise'
                },
                {
                    id: 'pmp',
                    name: 'Project Management Professional',
                    vendor: 'PMI',
                    category: 'it-service-management',
                    focusAreas: ['Project Management'],
                    price: 405,
                    duration: '6-8 months',
                    difficulty: 'Advanced',
                    prerequisites: '4500 hours project experience',
                    description: 'Advanced project management certification'
                },
                {
                    id: 'togaf',
                    name: 'TOGAF 9 Certified',
                    vendor: 'The Open Group',
                    category: 'it-service-management',
                    focusAreas: ['Digital Transformation'],
                    price: 600,
                    duration: '4-6 months',
                    difficulty: 'Advanced',
                    prerequisites: 'Enterprise architecture experience',
                    description: 'Enterprise architecture framework certification'
                },
                {
                    id: 'itil-master',
                    name: 'ITIL Master',
                    vendor: 'AXELOS',
                    category: 'it-service-management',
                    focusAreas: ['IT Service Management'],
                    price: 2000,
                    duration: '12-18 months',
                    difficulty: 'Master',
                    prerequisites: 'ITIL Expert',
                    description: 'Master-level IT service management'
                },
                {
                    id: 'ml-engineer-gcp',
                    name: 'Google Professional ML Engineer',
                    vendor: 'Google Cloud',
                    category: 'emerging-technologies',
                    focusAreas: ['Machine Learning', 'Artificial Intelligence'],
                    price: 200,
                    duration: '8-12 months',
                    difficulty: 'Expert',
                    prerequisites: 'ML experience',
                    description: 'Advanced machine learning engineering'
                },
                {
                    id: 'sabsa',
                    name: 'SABSA Chartered Security Architect',
                    vendor: 'SABSA Institute',
                    category: 'cybersecurity-privacy',
                    focusAreas: ['Risk Management', 'Compliance & Governance'],
                    price: 3000,
                    duration: '12-18 months',
                    difficulty: 'Master',
                    prerequisites: '10 years security experience',
                    description: 'Master-level security architecture'
                },
                {
                    id: 'snowflake-architect',
                    name: 'SnowPro Advanced Architect',
                    vendor: 'Snowflake',
                    category: 'data-analytics-engineering',
                    focusAreas: ['Data Warehousing', 'Advanced Analytics'],
                    price: 375,
                    duration: '6-8 months',
                    difficulty: 'Expert',
                    prerequisites: 'Snowflake Core certification',
                    description: 'Advanced data architecture on Snowflake'
                },
                {
                    id: 'kubernetes-cks',
                    name: 'Certified Kubernetes Security Specialist',
                    vendor: 'Kubernetes',
                    category: 'cloud-platforms',
                    focusAreas: ['Container Orchestration', 'Security Operations'],
                    price: 375,
                    duration: '6-8 months',
                    difficulty: 'Expert',
                    prerequisites: 'CKA certification',
                    description: 'Advanced Kubernetes security practices'
                },
                {
                    id: 'enterprise-architect',
                    name: 'Certified Enterprise Architect',
                    vendor: 'IBM',
                    category: 'it-service-management',
                    focusAreas: ['Digital Transformation', 'Process Improvement'],
                    price: 200,
                    duration: '8-10 months',
                    difficulty: 'Expert',
                    prerequisites: '5 years architecture experience',
                    description: 'Enterprise-level architecture and strategy'
                }
            ]
        }
    },

    // Career Pathways
    careerPathways: {
        'network-infrastructure': {
            name: 'Network Infrastructure Specialist',
            description: 'Design and manage enterprise network infrastructure',
            levels: [
                { level: 1, certs: ['comptia-tech-plus', 'comptia-aplus', 'comptia-network-plus'] },
                { level: 2, certs: ['comptia-security-plus', 'cisco-ccna'] },
                { level: 3, certs: ['cisco-ccnp-enterprise'] },
                { level: 4, certs: ['cisco-ccie-rs'] },
                { level: 5, certs: ['enterprise-architect', 'togaf'] }
            ]
        },
        'cloud-architect': {
            name: 'Cloud Solutions Architect',
            description: 'Design and implement cloud-native solutions',
            levels: [
                { level: 1, certs: ['comptia-tech-plus', 'comptia-aplus', 'comptia-network-plus'] },
                { level: 2, certs: ['aws-cloud-practitioner', 'comptia-security-plus'] },
                { level: 3, certs: ['aws-solutions-architect', 'kubernetes-cka', 'microsoft-azure-architect'] },
                { level: 4, certs: ['aws-solutions-architect-pro', 'gcp-cloud-architect', 'vmware-vcdx'] },
                { level: 5, certs: ['aws-devops-pro', 'kubernetes-cks', 'ml-engineer-gcp', 'enterprise-architect'] }
            ]
        },
        'cybersecurity-expert': {
            name: 'Cybersecurity Professional',
            description: 'Protect organizations from cyber threats',
            levels: [
                { level: 1, certs: ['comptia-tech-plus', 'comptia-aplus', 'comptia-network-plus'] },
                { level: 2, certs: ['comptia-security-plus'] },
                { level: 3, certs: ['cissp'] },
                { level: 4, certs: ['cism'] },
                { level: 5, certs: ['giac-gse', 'sabsa'] }
            ]
        },
        'data-engineer': {
            name: 'Data Engineering Specialist',
            description: 'Build and maintain data infrastructure and pipelines',
            levels: [
                { level: 1, certs: ['comptia-tech-plus', 'comptia-aplus', 'comptia-network-plus'] },
                { level: 2, certs: ['aws-cloud-practitioner', 'tableau-desktop-specialist'] },
                { level: 3, certs: ['aws-solutions-architect', 'kubernetes-cka'] },
                { level: 4, certs: ['databricks-architect', 'aws-solutions-architect-pro'] },
                { level: 5, certs: ['snowflake-architect', 'ml-engineer-gcp', 'enterprise-architect'] }
            ]
        }
    },

    // Flattened certifications array for filtering system
    get certifications() {
        const allCerts = [];
        ['level1', 'level2', 'level3', 'level4', 'level5'].forEach(level => {
            if (this.levels[level] && this.levels[level].certifications) {
                this.levels[level].certifications.forEach(cert => {
                    allCerts.push({
                        ...cert,
                        level: level.replace('level', 'Level ')
                    });
                });
            }
        });
        return allCerts;
    }
};

// Add bundle pricing to main object
ITSectorData.bundlePricing = {
    level1: {
        standard: 8100,  // Standard Certification Pathway
        hexad: 12150     // HEXAD Mentoring Framework (+50%)
    },
    level2: {
        standard: 10800,
        hexad: 16200
    },
    level3: {
        standard: 13500,
        hexad: 20250
    },
    level4: {
        standard: 16200,
        hexad: 24300
    },
    level5: {
        standard: 17910,  // 7-10 certs average pricing
        hexad: 26865
    }
};

// Add partnership benefits to main object
ITSectorData.partnershipBenefits = {
    premium: {
        discount: 0.15,
        supportLevel: 'Priority',
        resourceAccess: 'Full',
        practiceExams: 'Unlimited',
        labAccess: 'Full'
    },
    standard: {
        discount: 0.10,
        supportLevel: 'Standard',
        resourceAccess: 'Limited',
        practiceExams: 'Limited',
        labAccess: 'Basic'
    }
};

// Create flattened certifications array for ITFilterManager
ITSectorData.certifications = [];
Object.values(ITSectorData.certificationLevels).forEach(level => {
    level.certifications.forEach(cert => {
        ITSectorData.certifications.push(cert);
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ITSectorData };
}