        // IT Sector Comprehensive Database Implementation
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
                    focusAreas: ['Artificial Intelligence', 'Machine Learning Engineering', 'Computer Vision', 'Natural Language Processing', 'Edge Computing'],
                    vendors: ['NVIDIA', 'OpenAI', 'Google Cloud AI', 'IBM Watson', 'Hugging Face'],
                    partnershipTier: ['Premium', 'Standard', 'Premium', 'Standard', 'Standard'],
                    color: '#8b5cf6',
                    description: 'Lead innovation with cutting-edge AI and ML technologies'
                },
                'business-systems-governance': {
                    name: 'Business Systems & Governance',
                    icon: 'fas fa-cogs',
                    focusAreas: ['IT Service Management', 'Project Management', 'Business Analysis', 'Process Improvement', 'Digital Transformation'],
                    vendors: ['ServiceNow', 'Atlassian', 'PMI', 'AXELOS', 'Salesforce'],
                    partnershipTier: ['Premium', 'Premium', 'Premium', 'Standard', 'Premium'],
                    color: '#0891b2',
                    description: 'Optimize IT operations and drive digital transformation'
                }
            },

            // Complete 50+ Certifications Database
            certifications: [
                // Core IT & Networking (12 certifications)
                { id: 'comptia-aplus', name: 'CompTIA A+', vendor: 'CompTIA', level: 1, category: 'core-it-networking', focusAreas: ['Hardware Troubleshooting', 'System Administration'], price: 358, duration: '3-4 months', description: 'Entry-level IT certification covering hardware and software troubleshooting' },
                { id: 'comptia-network', name: 'CompTIA Network+', vendor: 'CompTIA', level: 2, category: 'core-it-networking', focusAreas: ['Network Infrastructure'], price: 370, duration: '4-5 months', description: 'Networking fundamentals and infrastructure management' },
                { id: 'cisco-ccna', name: 'Cisco CCNA', vendor: 'Cisco', level: 2, category: 'core-it-networking', focusAreas: ['Network Infrastructure', 'Network Security Basics'], price: 300, duration: '4-6 months', description: 'Cisco networking associate level certification' },
                { id: 'cisco-ccnp-enterprise', name: 'Cisco CCNP Enterprise', vendor: 'Cisco', level: 3, category: 'core-it-networking', focusAreas: ['Network Infrastructure'], price: 400, duration: '6-8 months', description: 'Advanced enterprise networking solutions' },
                { id: 'juniper-jncia', name: 'Juniper JNCIA-Junos', vendor: 'Juniper', level: 2, category: 'core-it-networking', focusAreas: ['Network Infrastructure'], price: 200, duration: '3-4 months', description: 'Juniper networking associate certification' },
                { id: 'aruba-acmp', name: 'Aruba Certified Mobility Professional', vendor: 'Aruba', level: 3, category: 'core-it-networking', focusAreas: ['Network Infrastructure'], price: 250, duration: '4-5 months', description: 'Wireless networking and mobility solutions' },
                { id: 'cwnp-cwna', name: 'CWNP CWNA', vendor: 'CWNP', level: 2, category: 'core-it-networking', focusAreas: ['Network Infrastructure'], price: 175, duration: '3-4 months', description: 'Wireless networking fundamentals' },
                { id: 'comptia-server', name: 'CompTIA Server+', vendor: 'CompTIA', level: 2, category: 'core-it-networking', focusAreas: ['System Administration'], price: 370, duration: '3-4 months', description: 'Server hardware and software management' },
                { id: 'cisco-ccna-security', name: 'Cisco CCNA Security', vendor: 'Cisco', level: 2, category: 'core-it-networking', focusAreas: ['Network Security Basics'], price: 300, duration: '4-5 months', description: 'Network security fundamentals' },
                { id: 'comptia-linux', name: 'CompTIA Linux+', vendor: 'CompTIA', level: 2, category: 'core-it-networking', focusAreas: ['System Administration'], price: 370, duration: '4-5 months', description: 'Linux system administration and troubleshooting' },
                { id: 'juniper-jncis', name: 'Juniper JNCIS-ENT', vendor: 'Juniper', level: 3, category: 'core-it-networking', focusAreas: ['Network Infrastructure'], price: 300, duration: '5-6 months', description: 'Juniper enterprise networking specialist' },
                { id: 'aruba-acmx', name: 'Aruba Certified Mobility Expert', vendor: 'Aruba', level: 4, category: 'core-it-networking', focusAreas: ['Network Infrastructure'], price: 400, duration: '8-10 months', description: 'Expert-level wireless and mobility solutions' },

                // Cloud & Platforms (10 certifications)
                { id: 'aws-cloud-practitioner', name: 'AWS Cloud Practitioner', vendor: 'AWS', level: 1, category: 'cloud-platforms', focusAreas: ['Cloud Architecture'], price: 100, duration: '2-3 months', description: 'AWS cloud fundamentals and services overview' },
                { id: 'aws-solutions-architect', name: 'AWS Solutions Architect Associate', vendor: 'AWS', level: 2, category: 'cloud-platforms', focusAreas: ['Cloud Architecture'], price: 150, duration: '4-5 months', description: 'Design distributed applications on AWS' },
                { id: 'aws-solutions-architect-pro', name: 'AWS Solutions Architect Professional', vendor: 'AWS', level: 3, category: 'cloud-platforms', focusAreas: ['Cloud Architecture'], price: 300, duration: '6-8 months', description: 'Advanced AWS architecture and design patterns' },
                { id: 'azure-fundamentals', name: 'Microsoft Azure Fundamentals', vendor: 'Microsoft', level: 1, category: 'cloud-platforms', focusAreas: ['Cloud Architecture'], price: 99, duration: '2-3 months', description: 'Azure cloud services and concepts' },
                { id: 'azure-solutions-architect', name: 'Azure Solutions Architect Expert', vendor: 'Microsoft', level: 3, category: 'cloud-platforms', focusAreas: ['Cloud Architecture'], price: 165, duration: '6-8 months', description: 'Design solutions on Microsoft Azure' },
                { id: 'gcp-cloud-engineer', name: 'Google Cloud Professional Cloud Architect', vendor: 'Google Cloud', level: 3, category: 'cloud-platforms', focusAreas: ['Cloud Architecture'], price: 200, duration: '5-7 months', description: 'Design and manage Google Cloud solutions' },
                { id: 'redhat-certified-admin', name: 'Red Hat Certified System Administrator', vendor: 'Red Hat', level: 2, category: 'cloud-platforms', focusAreas: ['Platform Engineering'], price: 400, duration: '4-6 months', description: 'Red Hat Enterprise Linux administration' },
                { id: 'vmware-vcp', name: 'VMware Certified Professional', vendor: 'VMware/Omnissa', level: 2, category: 'cloud-platforms', focusAreas: ['Platform Engineering'], price: 250, duration: '4-5 months', description: 'VMware vSphere virtualization platform' },
                { id: 'kubernetes-cka', name: 'Certified Kubernetes Administrator', vendor: 'Kubernetes', level: 3, category: 'cloud-platforms', focusAreas: ['Container Orchestration'], price: 375, duration: '5-7 months', description: 'Kubernetes cluster administration and management' },
                { id: 'terraform-associate', name: 'HashiCorp Terraform Associate', vendor: 'Terraform', level: 2, category: 'cloud-platforms', focusAreas: ['Infrastructure as Code'], price: 70, duration: '3-4 months', description: 'Infrastructure automation with Terraform' },

                // Cybersecurity & Privacy (10 certifications)
                { id: 'comptia-security', name: 'CompTIA Security+', vendor: 'CompTIA', level: 1, category: 'cybersecurity-privacy', focusAreas: ['Security Operations'], price: 370, duration: '3-4 months', description: 'Foundation cybersecurity principles and practices' },
                { id: 'cissp', name: 'CISSP', vendor: '(ISC)²', level: 3, category: 'cybersecurity-privacy', focusAreas: ['Risk Management', 'Compliance & Governance'], price: 749, duration: '6-9 months', description: 'Advanced security management and architecture' },
                { id: 'cism', name: 'CISM', vendor: 'ISACA', level: 3, category: 'cybersecurity-privacy', focusAreas: ['Risk Management'], price: 760, duration: '5-7 months', description: 'Information security management and governance' },
                { id: 'ceh', name: 'Certified Ethical Hacker', vendor: 'EC-Council', level: 2, category: 'cybersecurity-privacy', focusAreas: ['Ethical Hacking'], price: 1199, duration: '4-6 months', description: 'Ethical hacking and penetration testing' },
                { id: 'gsec', name: 'GIAC Security Essentials', vendor: 'GIAC', level: 2, category: 'cybersecurity-privacy', focusAreas: ['Security Operations'], price: 7000, duration: '4-6 months', description: 'Hands-on security skills and knowledge' },
                { id: 'comptia-cysa', name: 'CompTIA CySA+', vendor: 'CompTIA', level: 2, category: 'cybersecurity-privacy', focusAreas: ['Security Operations'], price: 370, duration: '4-5 months', description: 'Cybersecurity analyst skills and threat detection' },
                { id: 'cissp-associate', name: 'CISSP Associate', vendor: '(ISC)²', level: 2, category: 'cybersecurity-privacy', focusAreas: ['Security Operations'], price: 749, duration: '4-6 months', description: 'Associate-level security certification' },
                { id: 'cisa', name: 'CISA', vendor: 'ISACA', level: 3, category: 'cybersecurity-privacy', focusAreas: ['Compliance & Governance'], price: 760, duration: '6-8 months', description: 'Information systems auditing and control' },
                { id: 'gpen', name: 'GIAC Penetration Tester', vendor: 'GIAC', level: 3, category: 'cybersecurity-privacy', focusAreas: ['Ethical Hacking'], price: 7000, duration: '6-8 months', description: 'Advanced penetration testing techniques' },
                { id: 'comptia-casp', name: 'CompTIA CASP+', vendor: 'CompTIA', level: 3, category: 'cybersecurity-privacy', focusAreas: ['Risk Management'], price: 370, duration: '5-7 months', description: 'Advanced security practitioner certification' },

                // Data Analytics & Engineering (8 certifications)  
                { id: 'tableau-desktop-specialist', name: 'Tableau Desktop Specialist', vendor: 'Tableau', level: 1, category: 'data-analytics-engineering', focusAreas: ['Business Intelligence'], price: 100, duration: '2-3 months', description: 'Tableau data visualization fundamentals' },
                { id: 'tableau-certified-associate', name: 'Tableau Certified Data Analyst', vendor: 'Tableau', level: 2, category: 'data-analytics-engineering', focusAreas: ['Business Intelligence'], price: 250, duration: '3-4 months', description: 'Advanced Tableau data analysis and visualization' },
                { id: 'microsoft-power-bi', name: 'Microsoft Power BI Data Analyst', vendor: 'Microsoft', level: 2, category: 'data-analytics-engineering', focusAreas: ['Business Intelligence'], price: 165, duration: '3-4 months', description: 'Power BI data modeling and visualization' },
                { id: 'databricks-lakehouse', name: 'Databricks Lakehouse Fundamentals', vendor: 'Databricks', level: 2, category: 'data-analytics-engineering', focusAreas: ['Data Pipeline Engineering'], price: 200, duration: '3-5 months', description: 'Data lakehouse architecture and implementation' },
                { id: 'snowflake-core', name: 'SnowPro Core Certification', vendor: 'Snowflake', level: 2, category: 'data-analytics-engineering', focusAreas: ['Data Warehousing'], price: 175, duration: '3-4 months', description: 'Snowflake cloud data platform fundamentals' },
                { id: 'microsoft-azure-data-engineer', name: 'Azure Data Engineer Associate', vendor: 'Microsoft', level: 3, category: 'data-analytics-engineering', focusAreas: ['Data Pipeline Engineering'], price: 165, duration: '5-6 months', description: 'Design and implement data solutions on Azure' },
                { id: 'databricks-data-engineer', name: 'Databricks Certified Data Engineer', vendor: 'Databricks', level: 3, category: 'data-analytics-engineering', focusAreas: ['Data Pipeline Engineering'], price: 200, duration: '5-7 months', description: 'Advanced data engineering on Databricks platform' },
                { id: 'snowflake-advanced', name: 'SnowPro Advanced Data Engineer', vendor: 'Snowflake', level: 3, category: 'data-analytics-engineering', focusAreas: ['Data Warehousing'], price: 175, duration: '5-6 months', description: 'Advanced Snowflake data engineering patterns' },

                // Software Development & DevOps (6 certifications)
                { id: 'docker-certified-associate', name: 'Docker Certified Associate', vendor: 'Docker', level: 2, category: 'software-development-devops', focusAreas: ['Container Management'], price: 195, duration: '3-4 months', description: 'Docker containerization and orchestration' },
                { id: 'kubernetes-ckad', name: 'Certified Kubernetes Application Developer', vendor: 'Kubernetes', level: 2, category: 'software-development-devops', focusAreas: ['Container Management'], price: 375, duration: '4-5 months', description: 'Kubernetes application development and deployment' },
                { id: 'github-actions', name: 'GitHub Actions Certification', vendor: 'GitHub', level: 2, category: 'software-development-devops', focusAreas: ['CI/CD Pipelines'], price: 99, duration: '2-3 months', description: 'Automated workflows and CI/CD with GitHub Actions' },
                { id: 'terraform-professional', name: 'HashiCorp Terraform Professional', vendor: 'Terraform', level: 3, category: 'software-development-devops', focusAreas: ['Infrastructure Automation'], price: 295, duration: '5-6 months', description: 'Advanced infrastructure as code with Terraform' },
                { id: 'kubernetes-cks', name: 'Certified Kubernetes Security Specialist', vendor: 'Kubernetes', level: 4, category: 'software-development-devops', focusAreas: ['Site Reliability Engineering'], price: 375, duration: '6-8 months', description: 'Kubernetes security best practices and implementation' },
                { id: 'jenkins-engineer', name: 'CloudBees Jenkins Engineer', vendor: 'Jenkins', level: 2, category: 'software-development-devops', focusAreas: ['CI/CD Pipelines'], price: 300, duration: '3-5 months', description: 'Jenkins automation and pipeline management' },

                // Emerging Technologies (4 certifications)
                { id: 'nvidia-dli', name: 'NVIDIA Deep Learning Institute', vendor: 'NVIDIA', level: 2, category: 'emerging-technologies', focusAreas: ['Machine Learning Engineering'], price: 90, duration: '2-4 months', description: 'Deep learning and AI fundamentals with NVIDIA tools' },
                { id: 'google-ml-engineer', name: 'Google Cloud ML Engineer', vendor: 'Google Cloud AI', level: 3, category: 'emerging-technologies', focusAreas: ['Machine Learning Engineering'], price: 200, duration: '5-7 months', description: 'Machine learning solutions on Google Cloud' },
                { id: 'aws-ml-specialty', name: 'AWS Machine Learning Specialty', vendor: 'AWS', level: 3, category: 'emerging-technologies', focusAreas: ['Machine Learning Engineering'], price: 300, duration: '5-6 months', description: 'ML solutions design and implementation on AWS' },
                { id: 'ibm-watson-developer', name: 'IBM Watson Developer', vendor: 'IBM Watson', level: 2, category: 'emerging-technologies', focusAreas: ['Artificial Intelligence'], price: 200, duration: '3-5 months', description: 'AI application development with IBM Watson' }
            ],

            // Level progression system
            levelProgression: {
                1: { 
                    categories: ['core-it-networking'], 
                    maxCerts: 2, 
                    focusAreas: ['Network Infrastructure', 'System Administration'],
                    description: 'Foundation IT skills and basic networking',
                    price: 8100
                },
                2: { 
                    categories: ['core-it-networking', 'cybersecurity-privacy'], 
                    maxCerts: 3,
                    focusAreas: ['Network Infrastructure', 'System Administration', 'Security Operations'],
                    description: 'Intermediate IT with security fundamentals',
                    price: 13275
                },
                3: { 
                    categories: ['core-it-networking', 'cloud-platforms', 'cybersecurity-privacy'], 
                    maxCerts: 5,
                    focusAreas: ['Cloud Architecture', 'Security Operations', 'Network Infrastructure'],
                    description: 'Advanced IT with cloud and security specialization',
                    price: 18450
                },
                4: { 
                    categories: ['cloud-platforms', 'cybersecurity-privacy', 'data-analytics-engineering', 'software-development-devops'], 
                    maxCerts: 7,
                    focusAreas: ['Cloud Architecture', 'Data Pipeline Engineering', 'CI/CD Pipelines', 'Risk Management'],
                    description: 'Expert-level multi-domain IT specialization',
                    price: 23625
                },
                5: { 
                    categories: ['all'], 
                    maxCerts: 10,
                    focusAreas: ['all'],
                    description: 'Master-level access to all IT domains and emerging technologies',
                    price: 26865
                }
            },

            // Career pathways
            careerPathways: {
                'network-engineer': {
                    name: 'Network Engineering Pathway',
                    icon: 'fas fa-network-wired',
                    color: '#2563eb',
                    progression: [
                        { level: 1, certs: ['CompTIA Network+'], duration: '3-4 months', salary: '$55,000 - $75,000' },
                        { level: 2, certs: ['Cisco CCNA'], duration: '4-6 months', salary: '$65,000 - $85,000' },
                        { level: 3, certs: ['Cisco CCNP Enterprise', 'Juniper JNCIA'], duration: '6-8 months', salary: '$75,000 - $105,000' },
                        { level: 4, certs: ['Cisco CCIE Track', 'Aruba ACMP'], duration: '8-12 months', salary: '$95,000 - $130,000' },
                        { level: 5, certs: ['Multi-vendor Expert Certifications'], duration: '12+ months', salary: '$110,000 - $160,000' }
                    ]
                },
                'cloud-architect': {
                    name: 'Cloud Architecture Pathway',
                    icon: 'fas fa-cloud',
                    color: '#7c3aed',
                    progression: [
                        { level: 1, certs: ['AWS Cloud Practitioner'], duration: '2-3 months', salary: '$65,000 - $85,000' },
                        { level: 2, certs: ['AWS Solutions Architect Associate'], duration: '4-5 months', salary: '$80,000 - $100,000' },
                        { level: 3, certs: ['AWS Solutions Architect Professional', 'Azure Solutions Architect'], duration: '6-8 months', salary: '$100,000 - $130,000' },
                        { level: 4, certs: ['Multi-cloud Specialist', 'Google Cloud Architect'], duration: '8-10 months', salary: '$120,000 - $160,000' },
                        { level: 5, certs: ['Enterprise Cloud Strategy', 'Multi-cloud Expert'], duration: '12+ months', salary: '$140,000 - $200,000' }
                    ]
                },
                'cybersecurity-specialist': {
                    name: 'Cybersecurity Specialist Pathway',
                    icon: 'fas fa-shield-alt',
                    color: '#dc2626',
                    progression: [
                        { level: 1, certs: ['CompTIA Security+'], duration: '3-4 months', salary: '$60,000 - $80,000' },
                        { level: 2, certs: ['CISSP Associate', 'CompTIA CySA+'], duration: '5-6 months', salary: '$75,000 - $95,000' },
                        { level: 3, certs: ['CISSP', 'CISM'], duration: '6-9 months', salary: '$90,000 - $120,000' },
                        { level: 4, certs: ['CISSP Advanced', 'GIAC Certifications'], duration: '9-12 months', salary: '$110,000 - $150,000' },
                        { level: 5, certs: ['Security Leadership', 'Advanced GIAC'], duration: '12+ months', salary: '$130,000 - $180,000' }
                    ]
                }
            }
        };