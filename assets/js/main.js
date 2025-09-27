// BTH Education Group - Main JavaScript
// Professional, conversion-optimized interactions

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileClose = document.getElementById('mobileClose');

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeHeader();
        initializeMobileNav();
        initializeAnimations();
        initializeFormValidation();
        initializeCTATracking();
        
        // Initialize page-specific features
        if (document.querySelector('.hero-stats')) {
            animateCounters();
        }
        
        if (document.querySelector('.testimonials-slider')) {
            initializeTestimonialSlider();
        }

        // Initialize OEDP Certification System
        if (document.getElementById('certification-results')) {
            initializeOEDPSystem();
        }

        // Certification Programs Navigation
        const navPills = document.querySelectorAll('.nav-pill');
        const certificationCategories = document.querySelectorAll('.certification-category');
        
        navPills.forEach(pill => {
            pill.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                
                // Remove active class from all pills and categories
                navPills.forEach(p => p.classList.remove('active'));
                certificationCategories.forEach(cat => cat.classList.remove('active'));
                
                // Add active class to clicked pill
                this.classList.add('active');
                
                // Show target category
                const targetCategory = document.getElementById(targetId);
                if (targetCategory) {
                    targetCategory.classList.add('active');
                }
                
                // Scroll to programs section
                document.getElementById('programs').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

    });

    // OEDP Certification System - World-Class Workforce Development
    function initializeOEDPSystem() {
        // Comprehensive certification database covering all major industries
        const certificationDatabase = {
          // Information Technology
          technology: {
            title: "Information Technology",
            icon: "💻",
            subtitle: "Core IT & Infrastructure",
            color: "#3b82f6",
            certifications: {
              foundation: [
                { name: "CompTIA A+ Core 1", code: "220-1201", partner: "CompTIA" },
                { name: "CompTIA A+ Core 2", code: "220-1202", partner: "CompTIA" },
                { name: "CompTIA Tech+", code: "FC0-U71", partner: "CompTIA" }
              ],
              associate: [
                { name: "CompTIA Network+", code: "N10-008", partner: "CompTIA" },
                { name: "CompTIA Server+", code: "SK0-005", partner: "CompTIA" },
                { name: "CompTIA Linux+", code: "XK0-005", partner: "CompTIA" },
                { name: "Microsoft 365 Fundamentals", code: "MS-900", partner: "Microsoft" }
              ],
              professional: [
                { name: "CCNA", code: "200-301", partner: "Cisco" },
                { name: "Microsoft 365 Administrator", code: "MS-102", partner: "Microsoft" },
                { name: "RHCSA", code: "EX200", partner: "Red Hat" }
              ],
              expert: [
                { name: "CCNP Enterprise", code: "350-401", partner: "Cisco" },
                { name: "RHCE", code: "EX294", partner: "Red Hat" },
                { name: "VMware VCP-DCV", code: "2V0-21.23", partner: "VMware" }
              ],
              master: [
                { name: "CCIE Enterprise Infrastructure", code: "400-101", partner: "Cisco" },
                { name: "VCDX", code: "VCDX7-DCV", partner: "VMware" }
              ]
            }
          },
          
          // Cybersecurity
          cybersecurity: {
            title: "Cybersecurity & Information Assurance",
            icon: "🛡️",
            subtitle: "Security & Risk Management",
            color: "#dc2626",
            certifications: {
              foundation: [
                { name: "CompTIA Security+", code: "SY0-701", partner: "CompTIA" },
                { name: "EC-Council Computer Hacking Forensic Investigator Associate", code: "CHFI-A", partner: "EC-Council" }
              ],
              associate: [
                { name: "CompTIA CySA+", code: "CS0-003", partner: "CompTIA" },
                { name: "GIAC Security Essentials", code: "GSEC", partner: "GIAC" }
              ],
              professional: [
                { name: "Certified Ethical Hacker", code: "CEH v12", partner: "EC-Council" },
                { name: "CISSP", code: "CISSP", partner: "(ISC)²" },
                { name: "CISM", code: "CISM", partner: "ISACA" }
              ],
              expert: [
                { name: "CompTIA CASP+", code: "CAS-004", partner: "CompTIA" },
                { name: "CISSP Concentrations", code: "CISSP-ISSAP/ISSEP", partner: "(ISC)²" }
              ],
              master: [
                { name: "EC-Council CCISO", code: "CCISO", partner: "EC-Council" },
                { name: "Cybersecurity Virtuoso Program", code: "CVP-M", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Cloud Computing
          cloud: {
            title: "Cloud Computing Platforms",
            icon: "☁️",
            subtitle: "Cloud Architecture & Services",
            color: "#059669",
            certifications: {
              foundation: [
                { name: "AWS Cloud Practitioner", code: "CLF-C02", partner: "AWS" },
                { name: "Azure Fundamentals", code: "AZ-900", partner: "Microsoft" },
                { name: "Google Cloud Digital Leader", code: "CDL", partner: "Google Cloud" }
              ],
              associate: [
                { name: "AWS Solutions Architect Associate", code: "SAA-C03", partner: "AWS" },
                { name: "Azure Administrator", code: "AZ-104", partner: "Microsoft" },
                { name: "CompTIA Cloud+", code: "CV0-004", partner: "CompTIA" }
              ],
              professional: [
                { name: "AWS Solutions Architect Professional", code: "SAP-C02", partner: "AWS" },
                { name: "Azure Solutions Architect Expert", code: "AZ-305", partner: "Microsoft" },
                { name: "Google Cloud Professional Cloud Architect", code: "PCA", partner: "Google Cloud" }
              ],
              expert: [
                { name: "AWS DevOps Engineer Professional", code: "DOP-C02", partner: "AWS" },
                { name: "Kubernetes Administrator", code: "CKA", partner: "CNCF" }
              ],
              master: [
                { name: "Multi-Cloud Architect Virtuoso", code: "MCA-V", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Healthcare & Medical
          healthcare: {
            title: "Healthcare & Medical Technology",
            icon: "🏥",
            subtitle: "Healthcare IT & Medical Devices",
            color: "#0891b2",
            certifications: {
              foundation: [
                { name: "Certified Medical Administrative Assistant", code: "CMAA", partner: "NHA" },
                { name: "Electronic Health Records Specialist", code: "EHR", partner: "AHIMA" }
              ],
              associate: [
                { name: "Certified Medical Assistant", code: "CMA", partner: "AAMA" },
                { name: "Biomedical Electronics Technician", code: "BMD", partner: "ETA International" },
                { name: "Phlebotomy Technician", code: "CPT", partner: "ASCP" },
                { name: "Pharmacy Technician", code: "PTCB", partner: "PTCB" }
              ],
              professional: [
                { name: "Biomedical Equipment Technician", code: "BMET", partner: "ETA International" },
                { name: "Biomedical Imaging Equipment Technician", code: "BIET", partner: "ETA International" },
                { name: "Health Information Management", code: "RHIA", partner: "AHIMA" }
              ],
              expert: [
                { name: "Healthcare Quality Professional", code: "CPHQ", partner: "NAHQ" }
              ],
              master: [
                { name: "Medical Technology Virtuoso", code: "MTV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Manufacturing & Industrial
          manufacturing: {
            title: "Manufacturing & Industrial",
            icon: "🏭",
            subtitle: "Advanced Manufacturing & Automation",
            color: "#7c3aed",
            certifications: {
              foundation: [
                { name: "Manufacturing Fundamentals", code: "MF-01", partner: "MSSC" },
                { name: "Safety Fundamentals", code: "SF-01", partner: "MSSC" }
              ],
              associate: [
                { name: "Certified Production Technician", code: "CPT", partner: "MSSC" },
                { name: "Industrial Maintenance", code: "IM-02", partner: "MSSC" }
              ],
              professional: [
                { name: "Lean Six Sigma Green Belt", code: "LSSGB", partner: "IASSC" },
                { name: "Quality Control Professional", code: "CQT", partner: "ASQ" }
              ],
              expert: [
                { name: "Lean Six Sigma Black Belt", code: "LSSBB", partner: "IASSC" },
                { name: "Certified Quality Engineer", code: "CQE", partner: "ASQ" }
              ],
              master: [
                { name: "Manufacturing Excellence Virtuoso", code: "MEV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Construction & Engineering
          construction: {
            title: "Construction & Engineering",
            icon: "🏗️",
            subtitle: "Architecture, Engineering & Construction",
            color: "#ea580c",
            certifications: {
              foundation: [
                { name: "NCCER Core Curriculum", code: "NCCER-CORE", partner: "NCCER" },
                { name: "OSHA 30-Hour Construction", code: "OSHA-30", partner: "OSHA" }
              ],
              associate: [
                { name: "AutoCAD Certified User", code: "ACA-AutoCAD", partner: "Autodesk" },
                { name: "Revit Architecture Associate", code: "ACA-Revit", partner: "Autodesk" }
              ],
              professional: [
                { name: "Project Management Professional", code: "PMP", partner: "PMI" },
                { name: "LEED Green Associate", code: "LEED-GA", partner: "GBCI" }
              ],
              expert: [
                { name: "LEED AP Specialty", code: "LEED-AP", partner: "GBCI" },
                { name: "Professional Engineer", code: "PE", partner: "NCEES" }
              ],
              master: [
                { name: "Construction Virtuoso Program", code: "CVP", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Automotive
          automotive: {
            title: "Automotive Technology",
            icon: "🚗",
            subtitle: "Vehicle Systems & EV Technology",
            color: "#1f2937",
            certifications: {
              foundation: [
                { name: "Automotive Service Fundamentals", code: "ASF-01", partner: "ASE" },
                { name: "Automotive Maintenance & Light Repair", code: "G1", partner: "ASE" }
              ],
              associate: [
                { name: "ASE A1 Engine Repair", code: "A1", partner: "ASE" },
                { name: "ASE A2 Automatic Transmission/Transaxle", code: "A2", partner: "ASE" },
                { name: "ASE A3 Manual Drive Train and Axles", code: "A3", partner: "ASE" },
                { name: "ASE A4 Suspension and Steering", code: "A4", partner: "ASE" },
                { name: "ASE A5 Brakes", code: "A5", partner: "ASE" },
                { name: "ASE A6 Electric and Electronic Systems", code: "A6", partner: "ASE" },
                { name: "ASE A7 Heating and Air Conditioning", code: "A7", partner: "ASE" },
                { name: "ASE A8 Engine Performance", code: "A8", partner: "ASE" },
                { name: "ASE A9 Light Vehicle Diesel Engines", code: "A9", partner: "ASE" }
              ],
              professional: [
                { name: "ASE Service Consultant", code: "C1", partner: "ASE" },
                { name: "ASE Compressed Natural Gas Vehicles", code: "F1", partner: "ASE" },
                { name: "ASE Exhaust Systems Specialist", code: "X1", partner: "ASE" },
                { name: "Master Automobile Technician", code: "ASE-Master", partner: "ASE" }
              ],
              expert: [
                { name: "Advanced Engine Performance", code: "L1", partner: "ASE" },
                { name: "Electronic Diesel Engine Diagnosis", code: "L2", partner: "ASE" },
                { name: "Light Duty Hybrid/Electric Vehicle", code: "L3", partner: "ASE" }
              ],
              master: [
                { name: "Automotive Technology Virtuoso", code: "ATV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Communications & 5G
          communications: {
            title: "Communications & 5G Technology",
            icon: "📡",
            subtitle: "Telecommunications & Wireless Systems",
            color: "#8b5cf6",
            certifications: {
              foundation: [
                { name: "Electronics Fundamentals", code: "EF-01", partner: "ETA International" },
                { name: "General Communications Technician Level 1", code: "GCT1", partner: "ETA International" },
                { name: "Student Electronics Technician", code: "SET", partner: "ETA International" }
              ],
              associate: [
                { name: "General Communications Technician Level 2", code: "GCT2", partner: "ETA International" },
                { name: "Telecommunications", code: "TCM", partner: "ETA International" },
                { name: "Associate Certified Electronics Technician", code: "CETa", partner: "ETA International" },
                { name: "Basic Systems Technician", code: "BST", partner: "ETA International" }
              ],
              professional: [
                { name: "5G Technician", code: "5GT", partner: "ETA International" },
                { name: "Wireless Communications", code: "WCM", partner: "ETA International" },
                { name: "Microwave Radio Technician", code: "MRT", partner: "ETA International" },
                { name: "Certified Satellite Installer", code: "CSI", partner: "ETA International" },
                { name: "Mobile Communications and Electronics Installer", code: "MCEI", partner: "ETA International" },
                { name: "Practical Antenna Basics", code: "PAB", partner: "ETA International" },
                { name: "Computer Service Technician", code: "CST", partner: "ETA International" },
                { name: "Network Computer Technician", code: "NCT", partner: "ETA International" },
                { name: "Network Systems Technician", code: "NST", partner: "ETA International" }
              ],
              expert: [
                { name: "Distributed Antenna Systems", code: "DAS", partner: "ETA International" },
                { name: "RF Interference Mitigation", code: "RFIM", partner: "ETA International" },
                { name: "Advanced Interference Mitigation", code: "AIM", partner: "ETA International" },
                { name: "Line & Antenna Sweep", code: "LAS", partner: "ETA International" },
                { name: "Radar Technician", code: "RAD", partner: "ETA International" },
                { name: "Wireless Network Technician", code: "WNT", partner: "ETA International" },
                { name: "Information Technology Security", code: "ITS", partner: "ETA International" },
                { name: "Certified Service Manager", code: "CSM", partner: "ETA International" },
                { name: "Customer Service Specialist", code: "CSS", partner: "ETA International" }
              ],
              master: [
                { name: "Advanced Telecommunications Virtuoso", code: "ATV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Renewable Energy
          energy: {
            title: "Renewable Energy Systems",
            icon: "🌱",
            subtitle: "Solar, Wind & Green Technology",
            color: "#059669",
            certifications: {
              foundation: [
                { name: "Solar PV Associate", code: "NABCEP-PVA", partner: "NABCEP" },
                { name: "Renewable Energy Fundamentals", code: "REF-01", partner: "ETA International" }
              ],
              associate: [
                { name: "Photovoltaic Installer Level 1", code: "PVI1", partner: "ETA International" },
                { name: "Solar PV Installation Professional", code: "NABCEP-PVIP", partner: "NABCEP" },
                { name: "Small Wind Installer", code: "SWI", partner: "ETA International" }
              ],
              professional: [
                { name: "Photovoltaic Installer/Designer Level 2", code: "PV2", partner: "ETA International" },
                { name: "Solar PV Installer", code: "NABCEP-PVI", partner: "NABCEP" },
                { name: "Energy Storage Associate", code: "ESA", partner: "NABCEP" }
              ],
              expert: [
                { name: "Solar PV Technical Sales", code: "NABCEP-TS", partner: "NABCEP" },
                { name: "Battery Storage Systems", code: "BSS", partner: "ETA International" }
              ],
              master: [
                { name: "Renewable Energy Virtuoso", code: "REV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Smart Home & IoT
          "smart-home": {
            title: "Smart Home & IoT Technology",
            icon: "🏠",
            subtitle: "Connected Devices & Automation",
            color: "#7c2d12",
            certifications: {
              foundation: [
                { name: "Smart Technology Systems", code: "STS", partner: "ETA International" },
                { name: "IoT Fundamentals", code: "IoT-F", partner: "Cisco" },
                { name: "Certified Alarm Security Technician", code: "CAST", partner: "ETA International" }
              ],
              associate: [
                { name: "Electronic Security Networking Technician", code: "ESNT", partner: "ETA International" },
                { name: "Home Technology Integrator", code: "HTI+", partner: "CompTIA" }
              ],
              professional: [
                { name: "Certified Technology Specialist", code: "CTS", partner: "AVIXA" },
                { name: "Smart Technology Systems Master Integrator", code: "STSmi", partner: "ETA International" }
              ],
              expert: [
                { name: "Smart Home Designer", code: "SHD", partner: "ETA International" },
                { name: "IoT Systems Architect", code: "IoT-SA", partner: "Cisco" }
              ],
              master: [
                { name: "Smart Technology Virtuoso", code: "STV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Business & Management
          business: {
            title: "Business & Management",
            icon: "💼",
            subtitle: "Leadership & Operations",
            color: "#1e40af",
            certifications: {
              foundation: [
                { name: "Business Fundamentals", code: "BF-01", partner: "NIMS" },
                { name: "Customer Service Excellence", code: "CSE", partner: "HDI" }
              ],
              associate: [
                { name: "Project Management Associate", code: "CAPM", partner: "PMI" },
                { name: "Scrum Fundamentals", code: "SFC", partner: "Scrum.org" }
              ],
              professional: [
                { name: "Project Management Professional", code: "PMP", partner: "PMI" },
                { name: "Certified ScrumMaster", code: "CSM", partner: "Scrum Alliance" },
                { name: "Digital Marketing Professional", code: "DMP", partner: "Google" }
              ],
              expert: [
                { name: "Program Management Professional", code: "PgMP", partner: "PMI" },
                { name: "Six Sigma Black Belt", code: "SSBB", partner: "IASSC" }
              ],
              master: [
                { name: "Business Leadership Virtuoso", code: "BLV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Finance & Accounting
          finance: {
            title: "Finance & Accounting",
            icon: "💰",
            subtitle: "Financial Management & Analysis",
            color: "#dc2626",
            certifications: {
              foundation: [
                { name: "QuickBooks ProAdvisor", code: "QBA", partner: "Intuit" },
                { name: "Accounting Fundamentals", code: "AF-01", partner: "AIPB" }
              ],
              associate: [
                { name: "Certified Bookkeeper", code: "CB", partner: "AIPB" },
                { name: "Payroll Fundamentals", code: "FPC", partner: "APA" }
              ],
              professional: [
                { name: "Certified Management Accountant", code: "CMA", partner: "IMA" },
                { name: "Certified Payroll Professional", code: "CPP", partner: "APA" }
              ],
              expert: [
                { name: "Chartered Financial Analyst", code: "CFA", partner: "CFA Institute" },
                { name: "Financial Risk Manager", code: "FRM", partner: "GARP" }
              ],
              master: [
                { name: "Financial Excellence Virtuoso", code: "FEV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Data Analytics & Business Intelligence
          "data-analytics": {
            title: "Data Analytics & BI",
            icon: "📊",
            subtitle: "Data Science & Analytics",
            color: "#7c3aed",
            certifications: {
              foundation: [
                { name: "Tableau Desktop Specialist", code: "TDS", partner: "Tableau" },
                { name: "Power BI Fundamentals", code: "PL-900", partner: "Microsoft" }
              ],
              associate: [
                { name: "Tableau Desktop Certified Associate", code: "TCA", partner: "Tableau" },
                { name: "Power BI Data Analyst Associate", code: "PL-300", partner: "Microsoft" },
                { name: "Snowflake SnowPro Core", code: "COF-C02", partner: "Snowflake" }
              ],
              professional: [
                { name: "Tableau Server Certified Associate", code: "TSCA", partner: "Tableau" },
                { name: "Splunk Core Certified User", code: "SPLK-1001", partner: "Splunk" },
                { name: "Teradata Certified Professional", code: "TE0-142", partner: "Teradata" }
              ],
              expert: [
                { name: "Snowflake SnowPro Advanced Architect", code: "ARA-C01", partner: "Snowflake" },
                { name: "Splunk Enterprise Certified Architect", code: "SPLK-2002", partner: "Splunk" }
              ],
              master: [
                { name: "Data Analytics Virtuoso", code: "DAV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Creative Arts & Design
          "creative-arts": {
            title: "Creative Arts & Design",
            icon: "🎨",
            subtitle: "Digital Design & Media",
            color: "#ec4899",
            certifications: {
              foundation: [
                { name: "Adobe Certified Professional - Photoshop", code: "ACP-PS", partner: "Adobe" },
                { name: "Autodesk Certified User - AutoCAD", code: "ACU-AutoCAD", partner: "Autodesk" }
              ],
              associate: [
                { name: "Adobe Certified Professional - InDesign", code: "ACP-ID", partner: "Adobe" },
                { name: "Adobe Certified Professional - Illustrator", code: "ACP-AI", partner: "Adobe" },
                { name: "Autodesk Certified Professional - Revit", code: "ACP-Revit", partner: "Autodesk" }
              ],
              professional: [
                { name: "Unity Certified 3D Artist", code: "U3D-A", partner: "Unity" },
                { name: "Meta Certified Digital Marketing Associate", code: "MCD-DMA", partner: "Meta" },
                { name: "Adobe Certified Expert - After Effects", code: "ACE-AE", partner: "Adobe" }
              ],
              expert: [
                { name: "Unity Certified Programmer", code: "UCP", partner: "Unity" },
                { name: "Autodesk Certified Professional - 3ds Max", code: "ACP-3dsMax", partner: "Autodesk" }
              ],
              master: [
                { name: "Creative Excellence Virtuoso", code: "CEV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Welding & Manufacturing
          welding: {
            title: "Welding & Fabrication",
            icon: "🔥",
            subtitle: "Advanced Welding Processes",
            color: "#f97316",
            certifications: {
              foundation: [
                { name: "SMAW Shielded Metal Arc Welding", code: "SMAW-1", partner: "AWS" },
                { name: "Safety & Fundamentals", code: "WF-101", partner: "AWS" }
              ],
              associate: [
                { name: "GMAW Gas Metal Arc Welding", code: "GMAW-1", partner: "AWS" },
                { name: "FCAW Flux Cored Arc Welding", code: "FCAW-1", partner: "AWS" },
                { name: "GTAW Gas Tungsten Arc Welding", code: "GTAW-1", partner: "AWS" }
              ],
              professional: [
                { name: "SAW Submerged Arc Welding", code: "SAW-1", partner: "AWS" },
                { name: "Certified Welding Inspector", code: "CWI", partner: "AWS" },
                { name: "Brazing Specialist", code: "BZ-1", partner: "AWS" }
              ],
              expert: [
                { name: "Certified Welding Educator", code: "CWE", partner: "AWS" },
                { name: "Senior Certified Welding Inspector", code: "SCWI", partner: "AWS" }
              ],
              master: [
                { name: "Welding Excellence Virtuoso", code: "WEV", partner: "BTH Exclusive" }
              ]
            }
          },
          
          // Digital Literacy & Office Skills
          "digital-literacy": {
            title: "Digital Literacy & Office Skills",
            icon: "💻",
            subtitle: "Essential Digital Skills",
            color: "#059669",
            certifications: {
              foundation: [
                { name: "IC3 Digital Literacy Certification", code: "IC3-1", partner: "Certiport" },
                { name: "Microsoft Office Specialist - Word", code: "MOS-Word", partner: "Microsoft" }
              ],
              associate: [
                { name: "Microsoft Office Specialist - Excel", code: "MOS-Excel", partner: "Microsoft" },
                { name: "Microsoft Office Specialist - PowerPoint", code: "MOS-PPT", partner: "Microsoft" },
                { name: "Information Technology Specialist", code: "ITS", partner: "Certiport" }
              ],
              professional: [
                { name: "Microsoft Office Specialist Expert - Excel", code: "MOS-Excel-Expert", partner: "Microsoft" },
                { name: "Microsoft Office Specialist Expert - Word", code: "MOS-Word-Expert", partner: "Microsoft" }
              ],
              expert: [
                { name: "Microsoft Office Specialist Master", code: "MOS-Master", partner: "Microsoft" }
              ],
              master: [
                { name: "Digital Excellence Virtuoso", code: "DEV", partner: "BTH Exclusive" }
              ]
            }
          }
        };

        // Initialize the OEDP system
        initializeFilterSystem();
        renderIndustries();

        function initializeFilterSystem() {
          const industryFilter = document.getElementById('industry-filter');
          const roleFilter = document.getElementById('role-filter');
          const levelFilter = document.getElementById('level-filter');
          const partnerFilter = document.getElementById('partner-filter');
          const searchInput = document.getElementById('cert-search');
          const applyFilters = document.getElementById('apply-filters');
          const clearFilters = document.getElementById('clear-filters');
          const careerAdvisor = document.getElementById('career-advisor');
          
          if (!industryFilter || !roleFilter || !levelFilter) return;

          // Event listeners
          industryFilter.addEventListener('change', handleFilterChange);
          roleFilter.addEventListener('change', handleFilterChange);
          levelFilter.addEventListener('change', handleFilterChange);
          if (partnerFilter) partnerFilter.addEventListener('change', handleFilterChange);
          if (searchInput) searchInput.addEventListener('input', debounce(handleSearchChange, 300));
          if (applyFilters) applyFilters.addEventListener('click', applyCurrentFilters);
          if (clearFilters) clearFilters.addEventListener('click', clearAllFilters);
          if (careerAdvisor) careerAdvisor.addEventListener('click', showCareerAdvisor);
        }

        function handleFilterChange() {
          renderIndustries();
        }

        function handleSearchChange() {
          renderIndustries();
        }

        function applyCurrentFilters() {
          renderIndustries();
          if (window.BTH && window.BTH.showNotification) {
            window.BTH.showNotification('Filters applied! Showing matching certifications.', 'success');
          }
        }

        function clearAllFilters() {
          const industryFilter = document.getElementById('industry-filter');
          const roleFilter = document.getElementById('role-filter');
          const levelFilter = document.getElementById('level-filter');
          const partnerFilter = document.getElementById('partner-filter');
          const searchInput = document.getElementById('cert-search');
          
          if (industryFilter) industryFilter.value = 'all';
          if (roleFilter) roleFilter.value = 'all';
          if (levelFilter) levelFilter.value = 'all';
          if (partnerFilter) partnerFilter.value = 'all';
          if (searchInput) searchInput.value = '';
          
          renderIndustries();
          if (window.BTH && window.BTH.showNotification) {
            window.BTH.showNotification('All filters cleared!', 'info');
          }
        }

        function showCareerAdvisor() {
          if (window.BTH && window.BTH.showNotification) {
            window.BTH.showNotification('Career advisor feature coming soon! Contact us for personalized guidance.', 'info');
          }
        }

        function renderIndustries() {
          const container = document.getElementById('certification-results');
          if (!container) return;

          const industryFilter = document.getElementById('industry-filter');
          const roleFilter = document.getElementById('role-filter');
          const levelFilter = document.getElementById('level-filter');
          const partnerFilter = document.getElementById('partner-filter');
          const searchInput = document.getElementById('cert-search');

          const industryValue = industryFilter ? industryFilter.value : 'all';
          const roleValue = roleFilter ? roleFilter.value : 'all';
          const levelValue = levelFilter ? levelFilter.value : 'all';
          const partnerValue = partnerFilter ? partnerFilter.value : 'all';
          const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

          let html = '';

          // Special handling for "All Industries" view - show overview cards
          if (industryValue === 'all' && roleValue === 'all' && levelValue === 'all' && partnerValue === 'all' && searchQuery === '') {
            html = renderIndustriesOverview();
          } else {
            // Specific filter applied - show detailed certification cards
            const industriesToShow = industryValue === 'all' 
              ? Object.keys(certificationDatabase)
              : [industryValue];

            industriesToShow.forEach(industryKey => {
              const industry = certificationDatabase[industryKey];
              if (!industry) return;

              const matchingCerts = getMatchingCertifications(industry, roleValue, levelValue, partnerValue, searchQuery);
              
              if (matchingCerts.length > 0) {
                html += renderIndustryCard(industryKey, industry, matchingCerts, levelValue, partnerValue, searchQuery);
              }
            });
          }

          if (html === '') {
            html = `
              <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No certifications found</h3>
                <p>Try adjusting your filters or search terms to find relevant certifications</p>
                <button onclick="window.clearAllFilters()" class="btn btn-primary">Clear All Filters</button>
              </div>
            `;
          }

          container.innerHTML = html;
          initializeLevelTabs();
        }

        function renderIndustriesOverview() {
          // Industry descriptions based on Microsoft's clean, benefit-focused approach
          const descriptions = {
            technology: "Build core IT infrastructure skills and advance to enterprise architecture with industry-leading certifications from CompTIA, Cisco, Microsoft, and Red Hat.",
            cybersecurity: "Protect digital assets and build security expertise with comprehensive certifications in ethical hacking, incident response, and security architecture.",
            cloud: "Master modern cloud platforms with hands-on training in AWS, Microsoft Azure, Google Cloud, and hybrid cloud solutions for enterprise environments.",
            healthcare: "Transform healthcare delivery with medical technology certifications, health information management, and biomedical equipment expertise.",
            manufacturing: "Drive industrial innovation with smart manufacturing, quality systems, and Industry 4.0 certifications for the modern connected factory.",
            construction: "Shape the built environment with construction technology, sustainable building practices, and project management certifications.",
            automotive: "Lead the automotive evolution from traditional systems to electric vehicles with comprehensive ASE certifications and emerging technologies.",
            communications: "Build the 5G future with telecommunications infrastructure, wireless systems, and network technology certifications from industry leaders.",
            energy: "Power the clean energy transition with solar, wind, and sustainable technology certifications for the renewable energy sector.",
            "smart-home": "Create intelligent connected environments with IoT, home automation, and smart building technology integration certifications.",
            business: "Excel in organizational leadership with project management, business analysis, and strategic management certifications from PMI and leading bodies.",
            finance: "Master financial services with comprehensive certifications in accounting, risk management, compliance, and financial planning.",
            "data-analytics": "Transform business through data with cutting-edge analytics, visualization, and business intelligence certifications from industry leaders.",
            "creative-arts": "Create compelling digital experiences with professional design, media production, and creative technology certifications.",
            welding: "Master precision fabrication with comprehensive welding process certifications and advanced materials expertise from AWS.",
            "digital-literacy": "Build essential workplace technology skills with Microsoft Office expertise, digital fluency, and modern productivity certifications."
          };

          let html = `
            <div class="industries-overview">
              <div class="overview-header">
                <h2>Choose Your Industry Path</h2>
                <p>Explore world-class certification programs across leading industries. Each path offers comprehensive training from foundation to expert level, designed to advance your career and meet industry demands.</p>
              </div>
              <div class="industry-cards-grid">
          `;

          // Show only first 8 industries for clean layout, not crowded
          const mainIndustries = ['technology', 'cybersecurity', 'cloud', 'healthcare', 'manufacturing', 'automotive', 'communications', 'energy'];
          
          mainIndustries.forEach(industryKey => {
            if (certificationDatabase[industryKey]) {
              const industry = certificationDatabase[industryKey];
              const totalCerts = Object.values(industry.certifications).reduce((sum, certs) => sum + certs.length, 0);
              const partners = [...new Set(Object.values(industry.certifications).flat().map(cert => cert.partner))].length;
              
              html += `
                <div class="industry-overview-card" onclick="selectIndustry('${industryKey}')" data-industry="${industryKey}">
                  <div class="industry-card-visual">
                    <div class="industry-icon">${industry.icon}</div>
                  </div>
                  <div class="industry-card-content">
                    <div class="industry-card-header">
                      <h3 class="industry-card-title">${industry.title}</h3>
                      <div class="industry-card-subtitle">${industry.subtitle}</div>
                    </div>
                    <div class="industry-card-stats">
                      <div class="stat-item">
                        <span class="stat-number">${totalCerts}</span>
                        <span class="stat-label">Programs</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">5</span>
                        <span class="stat-label">Levels</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">${partners}</span>
                        <span class="stat-label">Partners</span>
                      </div>
                    </div>
                    <p class="industry-card-description">${descriptions[industryKey]}</p>
                    <div class="industry-card-footer">
                      <button class="certification-count">${totalCerts} Programs</button>
                      <svg class="explore-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              `;
            }
          });

          // Add "View All Industries" card
          html += `
            <div class="industry-overview-card view-all-card" onclick="showAllIndustries()" style="--card-color: #6366f1; --card-color-rgb: 99, 102, 241;">
              <div class="industry-card-visual">
                <div class="industry-icon">🌟</div>
              </div>
              <div class="industry-card-content">
                <div class="industry-card-header">
                  <h3 class="industry-card-title">View All Industries</h3>
                  <div class="industry-card-subtitle">Complete Industry Portfolio</div>
                </div>
                <div class="industry-card-stats">
                  <div class="stat-item">
                    <span class="stat-number">16+</span>
                    <span class="stat-label">Industries</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">150+</span>
                    <span class="stat-label">Programs</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">100+</span>
                    <span class="stat-label">Partners</span>
                  </div>
                </div>
                <p class="industry-card-description">Explore our complete portfolio including finance, creative arts, welding, smart home technology, and emerging industries.</p>
                <div class="industry-card-footer">
                  <button class="certification-count">View All</button>
                  <svg class="explore-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          `;

          html += `
              </div>
            </div>
          `;

          return html;
        }

        window.selectIndustry = function(industryKey) {
          const industryFilter = document.getElementById('industry-filter');
          if (industryFilter) {
            industryFilter.value = industryKey;
            renderIndustries();
            
            // Scroll to results
            const resultsContainer = document.getElementById('certification-results');
            if (resultsContainer) {
              resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        };

        function getMatchingCertifications(industry, roleFilter, levelFilter, partnerFilter, searchQuery) {
          const allCerts = [];
          
          Object.keys(industry.certifications).forEach(level => {
            if (levelFilter === 'all' || levelFilter === level) {
              industry.certifications[level].forEach(cert => {
                const matchesRole = roleFilter === 'all' || cert.name.toLowerCase().includes(roleFilter);
                const matchesPartner = partnerFilter === 'all' || cert.partner === partnerFilter;
                const matchesSearch = searchQuery === '' || 
                  cert.name.toLowerCase().includes(searchQuery) ||
                  cert.partner.toLowerCase().includes(searchQuery) ||
                  cert.code.toLowerCase().includes(searchQuery);
                
                if (matchesRole && matchesPartner && matchesSearch) {
                  allCerts.push({...cert, level});
                }
              });
            }
          });
          
          return allCerts;
        }

        function renderIndustryCard(industryKey, industry, matchingCerts, levelFilter, partnerFilter, searchQuery) {
          const levelsToShow = levelFilter === 'all' 
            ? ['foundation', 'associate', 'professional', 'expert', 'master']
            : [levelFilter];

          let tabsHtml = '';
          let contentHtml = '';

          levelsToShow.forEach((level, index) => {
            const levelCerts = industry.certifications[level] || [];
            const filteredCerts = levelCerts.filter(cert => {
              const matchesSearch = searchQuery === '' || 
                cert.name.toLowerCase().includes(searchQuery) ||
                cert.partner.toLowerCase().includes(searchQuery) ||
                cert.code.toLowerCase().includes(searchQuery);
              return matchesSearch;
            });

            if (filteredCerts.length > 0) {
              const isActive = index === 0 ? 'active' : '';
              const levelName = level.charAt(0).toUpperCase() + level.slice(1);
              const levelIcon = getLevelIcon(level);
              
              tabsHtml += `
                <button class="level-tab ${isActive}" data-level="${level}" data-industry="${industryKey}">
                  <span class="level-icon">${levelIcon}</span>
                  <span class="level-name">${levelName}</span>
                  <span class="level-count">${filteredCerts.length}</span>
                </button>
              `;

              contentHtml += `
                <div class="level-content ${isActive}" data-level="${level}">
                  <div class="level-description">
                    <h4>${levelName} Level Certifications</h4>
                    <p>${getLevelDescription(level)}</p>
                  </div>
                  <div class="certifications-grid">
                    ${filteredCerts.map(cert => `
                      <div class="cert-card">
                        <div class="cert-card-header">
                          <div class="cert-badge">${cert.partner}</div>
                          <div class="cert-difficulty">${levelName}</div>
                        </div>
                        <div class="cert-card-body">
                          <h5 class="cert-title">${cert.name}</h5>
                          <div class="cert-code-display">
                            <span class="cert-code-label">Exam Code:</span>
                            <span class="cert-code-value">${cert.code}</span>
                          </div>
                          <div class="cert-meta">
                            <span class="cert-duration">4-8 weeks</span>
                            <span class="cert-format">Online + Hands-on</span>
                          </div>
                        </div>
                        <div class="cert-card-footer">
                          <button class="btn-learn-more" onclick="window.showCertDetails('${cert.code}')">
                            <span>View Details</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </button>
                          <button class="btn-enroll" onclick="window.location.href='apply.html?cert=${cert.code}'">
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            }
          });

          // If no tabs have content, don't render the industry
          if (tabsHtml === '') {
            return '';
          }

          return `
            <div class="industry-section" data-industry="${industryKey}">
              <div class="industry-header-modern">
                <div class="industry-icon-wrapper" style="background: linear-gradient(135deg, ${industry.color}, ${adjustColorBrightness(industry.color, -20)})">
                  <span class="industry-icon-large">${industry.icon}</span>
                </div>
                <div class="industry-header-content">
                  <div class="industry-title-wrapper">
                    <h3 class="industry-title">${industry.title}</h3>
                    <span class="industry-cert-count">${matchingCerts.length} certifications available</span>
                  </div>
                  <p class="industry-description">${industry.subtitle}</p>
                  <div class="industry-quick-actions">
                    <a href="apply.html?industry=${industryKey}" class="btn-primary-modern">
                      <span>Start Learning</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                    <button class="btn-secondary-modern" onclick="window.showIndustryDetails('${industryKey}')">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="certification-pathway">
                <div class="pathway-tabs">
                  ${tabsHtml}
                </div>
                
                <div class="pathway-content">
                  ${contentHtml}
                </div>
              </div>
            </div>
          `;
        }

        function getLevelIcon(level) {
          const icons = {
            foundation: '🎯',
            associate: '📈', 
            professional: '💼',
            expert: '🏆',
            master: '👑'
          };
          return icons[level] || '📋';
        }

        function getLevelDescription(level) {
          const descriptions = {
            foundation: 'Entry-level certifications perfect for beginners starting their career journey',
            associate: 'Mid-level certifications for professionals with some experience',
            professional: 'Advanced certifications for experienced professionals seeking career growth',
            expert: 'Specialized certifications for technical leaders and subject matter experts',
            master: 'Elite-level certifications representing the highest level of expertise'
          };
          return descriptions[level] || 'Professional certification pathway';
        }

        function adjustColorBrightness(color, percent) {
          const num = parseInt(color.replace("#", ""), 16);
          const amt = Math.round(2.55 * percent);
          const R = (num >> 16) + amt;
          const G = (num >> 8 & 0x00FF) + amt;
          const B = (num & 0x0000FF) + amt;
          return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        }

        window.showIndustryDetails = function(industryKey) {
          const industry = certificationDatabase[industryKey];
          if (window.BTH && window.BTH.showNotification) {
            window.BTH.showNotification(`Learn more about ${industry.title} career opportunities. Contact us for detailed information!`, 'info');
          }
        };

        function initializeLevelTabs() {
          document.querySelectorAll('.level-tab').forEach(tab => {
            // Remove existing listeners to prevent duplicates
            tab.replaceWith(tab.cloneNode(true));
          });
          
          document.querySelectorAll('.level-tab').forEach(tab => {
            tab.addEventListener('click', function() {
              const level = this.dataset.level;
              const industryKey = this.dataset.industry;
              const industrySection = this.closest('.industry-section');
              
              if (!industrySection) return;
              
              // Update active tab within this industry section
              industrySection.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
              this.classList.add('active');
              
              // Update active content within this industry section
              industrySection.querySelectorAll('.level-content').forEach(c => c.classList.remove('active'));
              const targetContent = industrySection.querySelector(`[data-level="${level}"]`);
              if (targetContent) {
                targetContent.classList.add('active');
              }
            });
          });
        }

        // Utility functions
        function debounce(func, wait) {
          let timeout;
          return function executedFunction(...args) {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        }

        // Global functions for button clicks
        window.showCertDetails = function(certCode) {
          if (window.BTH && window.BTH.showNotification) {
            window.BTH.showNotification(`Detailed information for ${certCode} coming soon! Contact us for more details.`, 'info');
          }
        };

        window.clearAllFilters = clearAllFilters;

        window.showAllIndustries = function() {
          // Clear all filters to show complete industry portfolio
          const industryFilter = document.getElementById('industry-filter');
          const roleFilter = document.getElementById('role-filter');
          const levelFilter = document.getElementById('level-filter');
          const partnerFilter = document.getElementById('partner-filter');
          const searchInput = document.getElementById('cert-search');
          
          if (industryFilter) industryFilter.value = 'all';
          if (roleFilter) roleFilter.value = 'all';
          if (levelFilter) levelFilter.value = 'all';
          if (partnerFilter) partnerFilter.value = 'all';
          if (searchInput) searchInput.value = '';
          
          // Show expanded view with all industries
          renderAllIndustriesExpanded();
          
          // Scroll to results
          const resultsContainer = document.getElementById('certification-results');
          if (resultsContainer) {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        };

        function renderAllIndustriesExpanded() {
          const container = document.getElementById('certification-results');
          if (!container) return;

          let html = `
            <div class="industries-overview">
              <div class="overview-header">
                <h2>Complete Industry Portfolio</h2>
                <p>Explore all 16+ industries with comprehensive certification pathways from foundation to expert level.</p>
              </div>
              <div class="industry-cards-grid">
          `;

          Object.keys(certificationDatabase).forEach(industryKey => {
            const industry = certificationDatabase[industryKey];
            const totalCerts = Object.values(industry.certifications).reduce((sum, certs) => sum + certs.length, 0);
            const partners = [...new Set(Object.values(industry.certifications).flat().map(cert => cert.partner))].length;
            
            const descriptions = {
              technology: "Build core IT infrastructure skills and advance to enterprise architecture with industry-leading certifications.",
              cybersecurity: "Protect digital assets and build security expertise with comprehensive cybersecurity certifications.",
              cloud: "Master modern cloud platforms with hands-on training in AWS, Microsoft Azure, and Google Cloud solutions.",
              healthcare: "Transform healthcare delivery with medical technology and health information management certifications.",
              manufacturing: "Drive industrial innovation with smart manufacturing and Industry 4.0 certifications.",
              construction: "Shape the built environment with construction technology and project management certifications.",
              automotive: "Lead automotive evolution with comprehensive ASE certifications and emerging vehicle technologies.",
              communications: "Build the 5G future with telecommunications infrastructure and network technology certifications.",
              energy: "Power the clean energy transition with solar, wind, and sustainable technology certifications.",
              "smart-home": "Create intelligent connected environments with IoT and smart building technology certifications.",
              business: "Excel in organizational leadership with project management and strategic business certifications.",
              finance: "Master financial services with comprehensive accounting, risk management, and compliance certifications.",
              "data-analytics": "Transform business through data with analytics, visualization, and business intelligence certifications.",
              "creative-arts": "Create compelling digital experiences with professional design and creative technology certifications.",
              welding: "Master precision fabrication with comprehensive welding process and materials expertise certifications.",
              "digital-literacy": "Build essential workplace technology skills with Microsoft Office and digital productivity certifications."
            };
            
            html += `
              <div class="industry-overview-card" onclick="selectIndustry('${industryKey}')" data-industry="${industryKey}">
                <div class="industry-card-visual">
                  <div class="industry-icon">${industry.icon}</div>
                </div>
                <div class="industry-card-content">
                  <div class="industry-card-header">
                    <h3 class="industry-card-title">${industry.title}</h3>
                    <div class="industry-card-subtitle">${industry.subtitle}</div>
                  </div>
                  <div class="industry-card-stats">
                    <div class="stat-item">
                      <span class="stat-number">${totalCerts}</span>
                      <span class="stat-label">Programs</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-number">5</span>
                      <span class="stat-label">Levels</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-number">${partners}</span>
                      <span class="stat-label">Partners</span>
                    </div>
                  </div>
                  <p class="industry-card-description">${descriptions[industryKey] || industry.subtitle}</p>
                  <div class="industry-card-footer">
                    <button class="certification-count">${totalCerts} Programs</button>
                    <svg class="explore-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            `;
          });

          html += `
              </div>
            </div>
          `;

          container.innerHTML = html;
        }

        // ============================================
        // OEDP CAREER PATH FINDER & FILTER SYSTEM
        // ============================================

        function initializeOEDPFilters() {
          const industryFilter = document.getElementById('industry-filter');
          const roleFilter = document.getElementById('role-filter');
          const levelFilter = document.getElementById('level-filter');
          const partnerFilter = document.getElementById('partner-filter');
          const searchInput = document.getElementById('cert-search');
          const applyFiltersBtn = document.getElementById('apply-filters');
          const clearFiltersBtn = document.getElementById('clear-filters');
          const careerAdvisorBtn = document.getElementById('career-advisor');

          // Comprehensive certification data
          const certificationDatabase = {
              technology: {
                  name: 'Information Technology',
                  certifications: [
                      { name: 'CompTIA A+', code: '220-1101, 220-1102', provider: 'CompTIA', level: 'foundation', role: 'technician' },
                      { name: 'CompTIA Network+', code: 'N10-008', provider: 'CompTIA', level: 'associate', role: 'technician' },
                      { name: 'CompTIA Security+', code: 'SY0-601', provider: 'CompTIA', level: 'associate', role: 'specialist' },
                      { name: 'Microsoft Azure Fundamentals', code: 'AZ-900', provider: 'Microsoft', level: 'foundation', role: 'administrator' },
                      { name: 'Microsoft Azure Administrator', code: 'AZ-104', provider: 'Microsoft', level: 'professional', role: 'administrator' },
                      { name: 'Microsoft Azure Solutions Architect', code: 'AZ-305', provider: 'Microsoft', level: 'expert', role: 'architect' },
                      { name: 'Cisco CCNA', code: '200-301', provider: 'Cisco', level: 'associate', role: 'engineer' },
                      { name: 'Cisco CCNP Enterprise', code: '350-401', provider: 'Cisco', level: 'professional', role: 'engineer' },
                      { name: 'VMware VCP-DCV', code: '2V0-21.23', provider: 'VMware', level: 'professional', role: 'administrator' },
                      { name: 'Red Hat RHCSA', code: 'EX200', provider: 'Red Hat', level: 'associate', role: 'administrator' }
                  ]
              },
              cybersecurity: {
                  name: 'Cybersecurity',
                  certifications: [
                      { name: 'Certified Ethical Hacker', code: '312-50', provider: 'EC-Council', level: 'professional', role: 'specialist' },
                      { name: 'CISSP', code: 'CISSP', provider: '(ISC)²', level: 'expert', role: 'manager' },
                      { name: 'CISM', code: 'CISM', provider: 'ISACA', level: 'expert', role: 'manager' },
                      { name: 'GSEC', code: 'GSEC', provider: 'GIAC', level: 'professional', role: 'analyst' },
                      { name: 'CompTIA CySA+', code: 'CS0-003', provider: 'CompTIA', level: 'professional', role: 'analyst' },
                      { name: 'Fortinet NSE 4', code: 'NSE4_FGT-7.2', provider: 'Fortinet', level: 'professional', role: 'engineer' }
                  ]
              },
              cloud: {
                  name: 'Cloud Computing',
                  certifications: [
                      { name: 'AWS Solutions Architect Associate', code: 'SAA-C03', provider: 'AWS', level: 'associate', role: 'architect' },
                      { name: 'AWS Solutions Architect Professional', code: 'SAP-C02', provider: 'AWS', level: 'expert', role: 'architect' },
                      { name: 'Google Cloud Professional Cloud Architect', code: 'PCA', provider: 'Google Cloud', level: 'professional', role: 'architect' },
                      { name: 'Alibaba Cloud ACP', code: 'ACP-Cloud1', provider: 'Alibaba Cloud', level: 'professional', role: 'engineer' }
                  ]
              },
              healthcare: {
                  name: 'Healthcare Technology',
                  certifications: [
                      { name: 'RHIA', code: 'RHIA', provider: 'AHIMA', level: 'professional', role: 'administrator' },
                      { name: 'RHIT', code: 'RHIT', provider: 'AHIMA', level: 'associate', role: 'technician' },
                      { name: 'Biomedical Electronics Technician', code: 'BMD', provider: 'ETA International', level: 'professional', role: 'technician' }
                  ]
              },
              automotive: {
                  name: 'Automotive Technology',
                  certifications: [
                      { name: 'ASE A1 Engine Repair', code: 'A1', provider: 'ASE', level: 'professional', role: 'technician' },
                      { name: 'ASE A2 Automatic Transmission', code: 'A2', provider: 'ASE', level: 'professional', role: 'technician' },
                      { name: 'ASE A6 Electrical Systems', code: 'A6', provider: 'ASE', level: 'professional', role: 'technician' },
                      { name: 'ASE A8 Engine Performance', code: 'A8', provider: 'ASE', level: 'professional', role: 'technician' }
                  ]
              },
              manufacturing: {
                  name: 'Manufacturing',
                  certifications: [
                      { name: 'APICS CSCP', code: 'CSCP', provider: 'APICS', level: 'professional', role: 'manager' },
                      { name: 'Six Sigma Black Belt', code: 'SSBB', provider: 'APICS', level: 'expert', role: 'analyst' }
                  ]
              }
          };

          // Filter functions
          function applyFilters() {
              const filters = {
                  industry: industryFilter.value,
                  role: roleFilter.value,
                  level: levelFilter.value,
                  partner: partnerFilter.value,
                  search: searchInput.value.toLowerCase()
              };

              displayFilteredResults(filters);
          }

          function displayFilteredResults(filters) {
              let results = [];
              
              Object.entries(certificationDatabase).forEach(([industry, data]) => {
                  if (filters.industry === 'all' || filters.industry === industry) {
                      data.certifications.forEach(cert => {
                          if (matchesFilters(cert, filters)) {
                              results.push({
                                  ...cert,
                                  industry: data.name,
                                  industryKey: industry
                              });
                          }
                      });
                  }
              });

              renderResults(results);
          }

          function matchesFilters(cert, filters) {
              if (filters.role !== 'all' && cert.role !== filters.role) return false;
              if (filters.level !== 'all' && cert.level !== filters.level) return false;
              if (filters.partner !== 'all' && cert.provider !== filters.partner) return false;
              
              if (filters.search && !cert.name.toLowerCase().includes(filters.search) && 
                  !cert.code.toLowerCase().includes(filters.search) && 
                  !cert.provider.toLowerCase().includes(filters.search)) {
                  return false;
              }
              
              return true;
          }

          function renderResults(results) {
              const resultsContainer = document.getElementById('certification-results') || createResultsContainer();
              
              if (results.length === 0) {
                  resultsContainer.innerHTML = `
                      <div class="no-results">
                          <h3>No certifications found</h3>
                          <p>Try adjusting your filters or search terms.</p>
                      </div>
                  `;
                  return;
              }

              const resultsHTML = results.map(cert => `
                  <div class="certification-result-card" data-industry="${cert.industryKey}">
                      <div class="cert-header">
                          <h4>${cert.name}</h4>
                          <span class="cert-provider">${cert.provider}</span>
                      </div>
                      <div class="cert-details">
                          <span class="cert-code">Exam: ${cert.code}</span>
                          <span class="cert-level">${cert.level.charAt(0).toUpperCase() + cert.level.slice(1)} Level</span>
                          <span class="cert-role">${cert.role.charAt(0).toUpperCase() + cert.role.slice(1)}</span>
                      </div>
                      <div class="cert-actions">
                          <a href="certifications/${cert.industryKey}/${cert.code.toLowerCase().replace(/[\s-]/g, '')}.html" 
                             class="btn btn-primary btn-small">View Details</a>
                          <a href="apply.html?cert=${cert.code}" class="btn btn-outline btn-small">Enroll Now</a>
                      </div>
                  </div>
              `).join('');

              resultsContainer.innerHTML = `
                  <div class="results-header">
                      <h3>Found ${results.length} Certification${results.length !== 1 ? 's' : ''}</h3>
                  </div>
                  <div class="results-grid">
                      ${resultsHTML}
                  </div>
              `;
          }

          function createResultsContainer() {
              const container = document.createElement('div');
              container.id = 'certification-results';
              container.className = 'certification-results-section';
              
              const filtersSection = document.querySelector('.filter-system');
              filtersSection.parentNode.insertBefore(container, filtersSection.nextSibling);
              
              return container;
          }

          function clearAllFilters() {
              industryFilter.value = 'all';
              roleFilter.value = 'all';
              levelFilter.value = 'all';
              partnerFilter.value = 'all';
              searchInput.value = '';
              
              const resultsContainer = document.getElementById('certification-results');
              if (resultsContainer) {
                  resultsContainer.innerHTML = '';
              }
          }

          function showCareerAdvisor() {
              // Create career advisor modal
              const modal = document.createElement('div');
              modal.className = 'career-advisor-modal';
              modal.innerHTML = `
                  <div class="modal-content">
                      <div class="modal-header">
                          <h3>🎯 Career Path Advisor</h3>
                          <button class="close-modal">&times;</button>
                      </div>
                      <div class="modal-body">
                          <p>Get personalized certification recommendations based on your career goals.</p>
                          <form id="career-advisor-form">
                              <div class="form-group">
                                  <label>Current Experience Level</label>
                                  <select name="experience" required>
                                      <option value="">Select your level</option>
                                      <option value="entry">Entry Level (0-1 years)</option>
                                      <option value="junior">Junior (1-3 years)</option>
                                      <option value="mid">Mid-Level (3-7 years)</option>
                                      <option value="senior">Senior (7+ years)</option>
                                  </select>
                              </div>
                              <div class="form-group">
                                  <label>Career Interest</label>
                                  <select name="interest" required>
                                      <option value="">Select your interest</option>
                                      <option value="technology">Information Technology</option>
                                      <option value="cybersecurity">Cybersecurity</option>
                                      <option value="cloud">Cloud Computing</option>
                                      <option value="healthcare">Healthcare Technology</option>
                                      <option value="automotive">Automotive Technology</option>
                                      <option value="manufacturing">Manufacturing</option>
                                  </select>
                              </div>
                              <div class="form-group">
                                  <label>Salary Goal</label>
                                  <select name="salary">
                                      <option value="">Optional</option>
                                      <option value="40-60k">$40,000 - $60,000</option>
                                      <option value="60-80k">$60,000 - $80,000</option>
                                      <option value="80-100k">$80,000 - $100,000</option>
                                      <option value="100k+">$100,000+</option>
                                  </select>
                              </div>
                              <button type="submit" class="btn btn-primary">Get Recommendations</button>
                          </form>
                      </div>
                  </div>
              `;
              
              document.body.appendChild(modal);
              
              // Handle modal close
              modal.querySelector('.close-modal').addEventListener('click', () => {
                  document.body.removeChild(modal);
              });
              
              // Handle form submission
              modal.querySelector('#career-advisor-form').addEventListener('submit', handleCareerAdvice);
          }

          function handleCareerAdvice(e) {
              e.preventDefault();
              const formData = new FormData(e.target);
              const experience = formData.get('experience');
              const interest = formData.get('interest');
              
              // Generate recommendations based on input
              const recommendations = generateRecommendations(experience, interest);
              
              // Display recommendations
              const modalBody = e.target.parentElement;
              modalBody.innerHTML = `
                  <h4>🎯 Your Personalized Career Path</h4>
                  <div class="career-recommendations">
                      ${recommendations.map(rec => `
                          <div class="recommendation-card">
                              <h5>${rec.title}</h5>
                              <p>${rec.description}</p>
                              <div class="rec-certifications">
                                  ${rec.certifications.map(cert => `<span class="cert-tag">${cert}</span>`).join('')}
                              </div>
                              <a href="${rec.link}" class="btn btn-primary btn-small">Start This Path</a>
                          </div>
                      `).join('')}
                  </div>
              `;
          }

          function generateRecommendations(experience, interest) {
              const pathways = {
                  technology: {
                      entry: [
                          { 
                              title: 'IT Support Specialist Path',
                              description: 'Start with foundational certifications and build towards system administration.',
                              certifications: ['CompTIA A+', 'CompTIA Network+', 'Microsoft 365 Fundamentals'],
                              link: 'programs/technology.html#it-support'
                          }
                      ],
                      mid: [
                          {
                              title: 'Cloud Solutions Architect Path',
                              description: 'Advance to cloud architecture with multi-platform expertise.',
                              certifications: ['AWS Solutions Architect', 'Azure Solutions Architect', 'Google Cloud Architect'],
                              link: 'programs/cloud-computing.html#architect'
                          }
                      ]
                  },
                  cybersecurity: {
                      entry: [
                          {
                              title: 'Security Analyst Path',
                              description: 'Build security fundamentals and advance to threat analysis.',
                              certifications: ['CompTIA Security+', 'CompTIA CySA+', 'CEH'],
                              link: 'programs/cybersecurity.html#analyst'
                          }
                      ]
                  }
              };
              
              return pathways[interest]?.[experience] || pathways[interest]?.entry || [];
          }

          // Event listeners
          if (applyFiltersBtn) {
              applyFiltersBtn.addEventListener('click', applyFilters);
          }
          
          if (clearFiltersBtn) {
              clearFiltersBtn.addEventListener('click', clearAllFilters);
          }
          
          if (careerAdvisorBtn) {
              careerAdvisorBtn.addEventListener('click', showCareerAdvisor);
          }

          // Real-time search
          if (searchInput) {
              searchInput.addEventListener('input', debounce(applyFilters, 300));
          }

          // Auto-apply filters on change
          [industryFilter, roleFilter, levelFilter, partnerFilter].forEach(filter => {
              if (filter) {
                  filter.addEventListener('change', applyFilters);
              }
          });
        }

    // Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // Testimonial Slider

    // Header Scroll Effects
    function initializeHeader() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide header on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Mobile Navigation
    function initializeMobileNav() {
        if (hamburger) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                mobileNavOverlay.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
        }

        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileNav);
        }

        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', function(e) {
                if (e.target === mobileNavOverlay) {
                    closeMobileNav();
                }
            });
        }

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }

    function closeMobileNav() {
        hamburger.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    // Scroll Animations
    function initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animation if this is a stats section
                    if (entry.target.classList.contains('stats-grid')) {
                        animateCounters();
                    }
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll, .program-tile, .testimonial-card, .stats-grid, .mission-card, .team-member').forEach(el => {
            observer.observe(el);
        });
    }

    // Counter Animations
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            if (counter.classList.contains('animated')) return;
            
            const target = parseInt(counter.getAttribute('data-target') || counter.textContent.replace(/[^\d]/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = formatNumber(target) + (counter.textContent.includes('%') ? '%' : '+');
                    clearInterval(timer);
                } else {
                    counter.textContent = formatNumber(Math.floor(current)) + (counter.textContent.includes('%') ? '%' : '+');
                }
            }, 20);
            
            counter.classList.add('animated');
        });
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // Testimonial Slider
    function initializeTestimonialSlider() {
        const slider = document.querySelector('.testimonials-slider');
        const slides = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        if (!slider || slides.length === 0) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        function updateSlider() {
            const translateX = -currentSlide * 100;
            slider.style.transform = `translateX(${translateX}%)`;
            
            // Update dots if they exist
            document.querySelectorAll('.slider-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
        
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Auto-advance slider
        setInterval(nextSlide, 5000);
        
        // Initialize
        updateSlider();
    }

    // Form Validation
    function initializeFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateForm(form)) {
                    submitForm(form);
                }
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('[required]');
        
        fields.forEach(field => {
            const error = field.parentNode.querySelector('.field-error');
            
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            } else {
                hideFieldError(field);
            }
        });
        
        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        let error = field.parentNode.querySelector('.field-error');
        
        if (!error) {
            error = document.createElement('div');
            error.className = 'field-error';
            field.parentNode.appendChild(error);
        }
        
        error.textContent = message;
    }

    function hideFieldError(field) {
        field.classList.remove('error');
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    // Form Submission
    function submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Track conversion
            trackConversion('form_submission', {
                form_type: form.dataset.formType || 'contact',
                page: window.location.pathname
            });
        }, 2000);
    }

    // CTA Tracking
    function initializeCTATracking() {
        document.querySelectorAll('.btn, .cta-button').forEach(btn => {
            btn.addEventListener('click', function() {
                const ctaText = this.textContent.trim();
                const ctaType = this.classList.contains('btn-primary') ? 'primary' : 'secondary';
                
                trackConversion('cta_click', {
                    cta_text: ctaText,
                    cta_type: ctaType,
                    page: window.location.pathname
                });
            });
        });
    }

    // Notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
    }

    // Analytics & Conversion Tracking
    function trackConversion(event, data = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', event, data);
        }
        
        // Console log for development
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            console.log('Conversion tracked:', event, data);
        }
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Search Functionality (if search form exists)
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input[type="search"]').value;
            
            if (query.trim()) {
                // Redirect to search results or handle search
                window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }

    // Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // HEXAD Methodology Navigator
    function initializeHEXADNavigator() {
        const navTabs = document.querySelectorAll('.dimension-navigator .nav-tab');
        const dimensionPanels = document.querySelectorAll('.dimension-panel');
        
        if (navTabs.length === 0 || dimensionPanels.length === 0) return;
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetLevel = this.getAttribute('data-level');
                
                // Remove active class from all tabs and panels
                navTabs.forEach(t => t.classList.remove('active'));
                dimensionPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show target panel
                const targetPanel = document.getElementById(targetLevel + '-panel');
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    
                    // Smooth scroll to panel if needed
                    setTimeout(() => {
                        targetPanel.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 100);
                }
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'hexad_level_view', {
                        event_category: 'HEXAD Navigator',
                        event_label: targetLevel,
                        value: 1
                    });
                }
            });
        });
        
        // Keyboard navigation
        const navigator = document.querySelector('.dimension-navigator');
        if (navigator) {
            navigator.addEventListener('keydown', function(e) {
                const activeTab = document.querySelector('.nav-tab.active');
                if (!activeTab) return;
                
                let nextTab = null;
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    nextTab = activeTab.previousElementSibling;
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    nextTab = activeTab.nextElementSibling;
                }
                
                if (nextTab && nextTab.classList.contains('nav-tab')) {
                    e.preventDefault();
                    nextTab.click();
                    nextTab.focus();
                }
            });
        }
    }
    
    // Initialize HEXAD Navigator if present
    if (document.querySelector('.dimension-navigator')) {
        initializeHEXADNavigator();
    }

    // Expose useful functions globally
    window.BTH = {
        showNotification,
        trackConversion,
        closeMobileNav,
        initializeHEXADNavigator
    };

})();
