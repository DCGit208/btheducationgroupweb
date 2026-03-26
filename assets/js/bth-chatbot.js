/**
 * BTH Education Group — Intelligent Site Assistant
 * Comprehensive chatbot covering all programs, services, and inquiry types
 * Pattern: vanilla JS keyword-matching, typing animation, suggestion chips
 */

(function () {
  'use strict';

  // ─── KNOWLEDGE BASE ────────────────────────────────────────────────────────

  const knowledge = {

    // ── WHO IS BTH ──────────────────────────────────────────────────────────
    about: {
      keywords: [
        'what is bth', 'who is bth', 'about bth', 'bth education group',
        'what does bth do', 'tell me about bth', 'bth mission', 'bth vision',
        'history', 'founded', 'company', 'organization', 'institution',
        'what does bth stand for'
      ],
      response: `🏛️ <strong>BTH Education Group</strong>

We are the <strong>World's Leading Education Investment Organization</strong> — an ISO 17024 Personnel Certification Authority operating in 120+ countries with 5.8M+ certified professionals.

<strong>Our Mission:</strong>
Build strong institutions (SDG 16) by transforming how the world creates, delivers, and validates professional capability.

<strong>Core Framework — OEDP HEXAD:</strong>
A 6-dimensional workforce development system: Education → Assessment → Certification → Deployment → Optimization → Reinvention

<strong>Global Partnerships:</strong>
🔷 Microsoft Learning Partner
🟠 AWS Consulting Partner
🔵 Cisco Training Partner
🟣 Pearson VUE Authorized Partner
🟡 CompTIA Member

<strong>By the numbers:</strong>
• 5.8M+ certified professionals
• 120+ countries
• 25+ industry sectors
• ISO 17024 certified authority
• UDHR Article 26:2 aligned

📍 <a href="about.html" class="bth-chat-link">Our Full Story →</a>
📍 <a href="oedp.html" class="bth-chat-link">Explore OEDP Framework →</a>`,
      suggestions: ['OEDP framework', 'Certifications', 'Apply now', 'Contact us']
    },

    // ── OEDP / AWIS ─────────────────────────────────────────────────────────
    oedp: {
      keywords: [
        'oedp', 'awis', 'methodology', 'framework', 'hexad', 'workforce development',
        'transformation', '6-dimensional', 'six dimensions', 'education investment',
        'professional development', 'capability', 'what is oedp', 'what is awis',
        'what is hexad', 'how does bth train', 'bth method'
      ],
      response: `🚀 <strong>OEDP HEXAD — BTH's Core Framework</strong>

<strong>OEDP (Occupational Education Development Program)</strong> is our proprietary 6-dimensional workforce transformation system:

1️⃣ <strong>Education</strong> — Structured learning aligned to global standards
2️⃣ <strong>Assessment</strong> — Rigorous competency evaluation
3️⃣ <strong>Certification</strong> — ISO 17024 and globally recognised credentials
4️⃣ <strong>Deployment</strong> — Placement into live enterprise roles
5️⃣ <strong>Optimization</strong> — Performance tracking and upskilling
6️⃣ <strong>Reinvention</strong> — Career pivoting as industries evolve

<strong>AWIS (Advanced Workforce Integration System)</strong> is the delivery engine — orchestrating talent pipelines across all 25+ industry sectors.

<strong>HEXAD Mastery Framework:</strong>
A structured 6-level mastery path from Foundation → Associate → Professional → Expert → Master → Elite

📍 <a href="oedp.html" class="bth-chat-link">Explore OEDP →</a>
📍 <a href="hexad-mastery.html" class="bth-chat-link">HEXAD Mastery Levels →</a>`,
      suggestions: ['Program sectors', 'Certifications offered', 'Apply now', 'Cost and pricing']
    },

    // ── CERTIFICATIONS ───────────────────────────────────────────────────────
    certifications: {
      keywords: [
        'certification', 'certify', 'certified', 'cert', 'credentials',
        'microsoft', 'aws', 'cisco', 'comptia', 'pearson vue', 'comptia a+',
        'security+', 'network+', 'azure', 'sscp', 'pmp',
        'what certifications', 'which certifications', 'exams', 'credential',
        'vendor certification', 'industry certification', 'iso 17024'
      ],
      response: `🎓 <strong>Certifications at BTH Education Group</strong>

We are an <strong>ISO 17024 Personnel Certification Authority</strong> and a globally authorized testing partner.

<strong>Vendor Certifications We Deliver:</strong>

🔷 <strong>Microsoft</strong>
• Azure Fundamentals (AZ-900)
• Azure Administrator (AZ-104)
• Azure Solutions Architect (AZ-305)
• Microsoft 365 Fundamentals
• Power Platform certifications

🟠 <strong>AWS (Amazon Web Services)</strong>
• AWS Cloud Practitioner
• AWS Solutions Architect Associate/Professional
• AWS Developer, SysOps, DevOps Engineer

🔵 <strong>Cisco</strong>
• CCNA, CCNP, CCIE
• Cisco Cybersecurity, CyberOps

🟡 <strong>CompTIA</strong>
• A+, Network+, Security+, CySA+, CASP+, PenTest+
• Cloud+, Linux+, Project+, Data+

🟣 <strong>Other Globally Recognized</strong>
• PMP (Project Management)
• CISSP / SSCP (ISC²)
• CEH (Certified Ethical Hacker)
• Salesforce, Google Cloud, ITIL

<strong>BTH Proprietary Credentials:</strong>
• HEXAD Mastery Certificates (6 levels)
• OEDP Sector Completion Certificates
• Enterprise Deployment Digital Badges

📍 <a href="program.html" class="bth-chat-link">All Certification Pathways →</a>
📍 <a href="career-assessment.html" class="bth-chat-link">Free Career Assessment →</a>`,
      suggestions: ['Technology certifications', 'Healthcare certs', 'Apply for program', 'Cost of certification']
    },

    // ── TECHNOLOGY SECTOR ────────────────────────────────────────────────────
    technology: {
      keywords: [
        'technology', 'it', 'information technology', 'tech', 'software',
        'cybersecurity', 'cloud computing', 'networking', 'data science',
        'artificial intelligence', 'ai', 'machine learning', 'devops',
        'programming', 'coding', 'software development', 'web development',
        'database', 'systems administration', 'sysadmin', 'helpdesk',
        'cyber', 'network security', 'cloud'
      ],
      response: `💻 <strong>Technology & IT Programs</strong>

Our largest sector — preparing the world's next generation of technology professionals.

<strong>Sub-Sectors We Cover:</strong>

🔐 <strong>Cybersecurity</strong>
Security operations, ethical hacking, incident response, SIEM, SOC analyst, CISSP, CEH, CompTIA Security+

☁️ <strong>Cloud Computing</strong>
AWS, Azure, GCP — architecture, administration, DevOps, cloud-native development

🌐 <strong>Networking & Infrastructure</strong>
Cisco CCNA/CCNP, network design, wireless, SD-WAN, routing & switching

🤖 <strong>AI & Data Science</strong>
Machine learning, data analytics, Python, R, Power BI, Tableau, AI engineering

💻 <strong>Software Development</strong>
Full-stack web (React, Node.js), mobile apps, APIs, agile methodology

🛠️ <strong>IT Support & Systems</strong>
CompTIA A+/Network+, Microsoft 365, systems administration, ITIL

<strong>Certification Prep Included:</strong>
All programs include exam prep for globally recognized vendor certifications.

📍 <a href="programs/technology.html" class="bth-chat-link">Technology Programs →</a>
📍 <a href="programs/cybersecurity.html" class="bth-chat-link">Cybersecurity Track →</a>
📍 <a href="programs/informationtechnology.html" class="bth-chat-link">IT Support Track →</a>`,
      suggestions: ['Cybersecurity program', 'Cloud certifications', 'Software development', 'Apply for IT program']
    },

    // ── HEALTHCARE ───────────────────────────────────────────────────────────
    healthcare: {
      keywords: [
        'healthcare', 'health', 'medical', 'biotech', 'biotechnology',
        'clinical', 'hospital', 'nursing', 'pharmacy', 'medical technology',
        'health informatics', 'public health', 'medtech', 'life sciences',
        'patient care', 'health administration'
      ],
      response: `🏥 <strong>Healthcare & Medical Programs</strong>

Building the next generation of healthcare professionals and medical technology leaders.

<strong>Programs Include:</strong>

🧬 <strong>Biotechnology</strong>
Laboratory techniques, bioinformatics, clinical research, regulatory affairs

🏥 <strong>Healthcare Administration</strong>
Hospital management, health informatics, revenue cycle, EHR systems

💊 <strong>Medical Technology</strong>
Medical device sales, diagnostics, imaging technology, clinical engineering

📊 <strong>Health Informatics</strong>
EMR/EHR systems, healthcare data analytics, HIPAA compliance, interoperability

🩺 <strong>Public Health & Epidemiology</strong>
Disease surveillance, global health, community health programs

<strong>Certifications & Affiliations:</strong>
• HL7 / FHIR Health Informatics
• AHIMA Healthcare Information Management
• HFMA Revenue Cycle Certifications

📍 <a href="programs/healthcare.html" class="bth-chat-link">Healthcare Programs →</a>
📍 <a href="programs/biotech.html" class="bth-chat-link">Biotechnology Track →</a>`,
      suggestions: ['Apply for healthcare program', 'Medical technology', 'Health informatics', 'Assessment']
    },

    // ── BUSINESS & FINANCE ───────────────────────────────────────────────────
    business: {
      keywords: [
        'business', 'finance', 'accounting', 'management', 'mba',
        'business development', 'entrepreneurship', 'startup',
        'financial analysis', 'investment', 'banking', 'economics',
        'leadership', 'strategy', 'marketing', 'sales', 'human resources',
        'hr', 'project management', 'pmp', 'supply chain', 'operations'
      ],
      response: `📊 <strong>Business, Finance & Management Programs</strong>

Transform careers across every dimension of modern business.

<strong>Program Tracks:</strong>

📈 <strong>Finance & Accounting</strong>
CPA prep, CFA, financial analysis, bookkeeping, GAAP/IFRS, fintech

💼 <strong>Business Management</strong>
Organizational leadership, strategy, operations management, MBA equivalency

🚀 <strong>Business Development & Entrepreneurship</strong>
Startup launch, scaling, pitch preparation, venture capital readiness

🎯 <strong>Project Management</strong>
PMP certification, Agile/Scrum, PRINCE2, program management

👥 <strong>Human Resources</strong>
SHRM-CP/SCP, talent acquisition, HR analytics, employment law

📣 <strong>Marketing & Sales</strong>
Digital marketing, content strategy, B2B sales, Salesforce CRM, HubSpot

🔗 <strong>Supply Chain & Operations</strong>
APICS CSCP/CLTD, logistics, procurement, inventory management

📍 <a href="programs/business-development.html" class="bth-chat-link">Business Programs →</a>
📍 <a href="programs/finance-accounting.html" class="bth-chat-link">Finance & Accounting →</a>`,
      suggestions: ['Finance certifications', 'Project management', 'HR programs', 'Apply now']
    },

    // ── MANUFACTURING & ENGINEERING ──────────────────────────────────────────
    manufacturing: {
      keywords: [
        'manufacturing', 'engineering', 'industrial', 'production',
        'quality control', 'lean', 'six sigma', 'automotive', 'aerospace',
        'architecture', 'construction', 'civil engineering', 'mechanical',
        'electrical engineering', 'process improvement', 'cad', 'autocad',
        'bim', 'building information', 'structural', 'environmental'
      ],
      response: `⚙️ <strong>Manufacturing, Engineering & Construction Programs</strong>

<strong>Program Tracks:</strong>

🏭 <strong>Manufacturing & Industrial</strong>
Lean Six Sigma (White/Yellow/Green/Black Belt), quality management, ISO 9001, OSHA, CNC operations

🚗 <strong>Automotive Technology</strong>
ASE certification prep, hybrid/EV systems, diagnostics, fleet management

✈️ <strong>Aerospace</strong>
Avionics, systems engineering, space systems, FAA compliance

🏗️ <strong>Architecture, Engineering & Construction (AEC)</strong>
AutoCAD, Revit BIM, LEED Green Associate, structural engineering, project management (ACI)

🌿 <strong>Environmental & Sustainability</strong>
ISO 14001, environmental management, green building, sustainability reporting

🏢 <strong>Construction & Infrastructure</strong>
OSHA 30, construction management, estimating, BIM coordination

📍 <a href="programs/manufacturing.html" class="bth-chat-link">Manufacturing Programs →</a>
📍 <a href="programs/automotive-technology.html" class="bth-chat-link">Automotive Technology →</a>
📍 <a href="programs/architecture-engineering.html" class="bth-chat-link">AEC Programs →</a>`,
      suggestions: ['Lean Six Sigma', 'Automotive certification', 'Construction programs', 'Apply now']
    },

    // ── ENERGY & SUSTAINABILITY ──────────────────────────────────────────────
    energy: {
      keywords: [
        'energy', 'renewable', 'solar', 'wind', 'sustainability', 'green',
        'clean energy', 'electric vehicle', 'ev', 'battery storage',
        'utility', 'power systems', 'environmental', 'climate', 'carbon',
        'leed', 'energy management', 'oil and gas', 'nuclear'
      ],
      response: `⚡ <strong>Energy, Renewables & Sustainability Programs</strong>

Preparing professionals for the global energy transition and green economy.

<strong>Program Tracks:</strong>

☀️ <strong>Renewable Energy Systems</strong>
Solar PV installation, wind turbine technology, microgrid design, NABCEP certification

🔋 <strong>Energy Storage & EVs</strong>
Battery systems, EV charging infrastructure, grid-scale storage

🌱 <strong>Environmental Sustainability</strong>
ISO 14001, ESG reporting, carbon accounting, LEED AP, sustainability management

⚡ <strong>Power Systems & Utilities</strong>
Grid operations, smart grid, power electronics, NERC compliance

🏭 <strong>Energy Management</strong>
Certified Energy Manager (CEM), energy auditing, HVAC efficiency

📍 <a href="programs/renewable-energy.html" class="bth-chat-link">Renewable Energy Programs →</a>
📍 <a href="programs/energy-renewable-systems.html" class="bth-chat-link">Energy Systems Track →</a>`,
      suggestions: ['Solar certification', 'LEED programs', 'Environmental sustainability', 'Apply now']
    },

    // ── GOVERNMENT & PUBLIC SECTOR ────────────────────────────────────────────
    government: {
      keywords: [
        'government', 'public sector', 'military', 'defense', 'public safety',
        'law enforcement', 'emergency management', 'homeland security',
        'civil service', 'policy', 'administration', 'govtech',
        'public administration', 'federal', 'state', 'municipal', 'ngo'
      ],
      response: `🏛️ <strong>Government, Public Sector & GovTech Programs</strong>

Strengthening institutions and public administration globally — aligned with SDG 16.

<strong>Program Tracks:</strong>

🏛️ <strong>Public Administration</strong>
Government operations, policy development, public finance, e-government

🔐 <strong>Government Cybersecurity</strong>
FISMA, FedRAMP, NIST frameworks, classified systems security

🚔 <strong>Public Safety</strong>
Emergency management, FEMA certifications, law enforcement technology, crisis response

🤖 <strong>GovTech & Digital Government</strong>
Digital transformation, open data, citizen services platforms, AI in government

🌍 <strong>International Development</strong>
NGO management, development economics, grant writing, global health systems

📍 <a href="programs/government.html" class="bth-chat-link">Government Programs →</a>
📍 <a href="programs/public-safety.html" class="bth-chat-link">Public Safety Track →</a>
📍 <a href="programs/govtech.html" class="bth-chat-link">GovTech Programs →</a>`,
      suggestions: ['Public safety training', 'GovTech programs', 'Apply now', 'Contact us']
    },

    // ── CREATIVE & MEDIA ─────────────────────────────────────────────────────
    creative: {
      keywords: [
        'creative', 'design', 'media', 'graphic design', 'digital design',
        'animation', 'film', 'video production', 'photography', 'content',
        'ui ux', 'user experience', 'user interface', 'branding', 'web design',
        'adobe', 'illustrator', 'photoshop', 'premiere', 'after effects',
        'social media', 'digital marketing', 'content creation', 'arts'
      ],
      response: `🎨 <strong>Creative Arts & Digital Design Programs</strong>

<strong>Program Tracks:</strong>

🎨 <strong>Graphic & Digital Design</strong>
Adobe Creative Suite, brand identity, print design, digital illustration, UI/UX design

📱 <strong>UX/UI Design</strong>
Figma, Adobe XD, user research, prototyping, usability testing, design systems

🎬 <strong>Film & Video Production</strong>
Cinematography, video editing (Premiere Pro, DaVinci Resolve), motion graphics (After Effects)

📸 <strong>Photography & Visual Media</strong>
Commercial photography, photo retouching, Lightroom/Photoshop, studio workflow

📢 <strong>Digital Marketing & Content</strong>
Social media strategy, content creation, Google Analytics, SEO/SEM, email marketing

🌐 <strong>Web Design & Development</strong>
HTML/CSS, WordPress, UX principles, e-commerce (Shopify, WooCommerce)

<strong>Industry Certifications:</strong>
Adobe Certified Professional, Google Digital certifications, HubSpot Marketing

📍 <a href="programs/creative-arts-digital-design.html" class="bth-chat-link">Creative Programs →</a>
📍 <a href="programs/media.html" class="bth-chat-link">Media Production →</a>`,
      suggestions: ['UI/UX design', 'Digital marketing', 'Adobe certification', 'Apply now']
    },

    // ── LEGAL & COMPLIANCE ───────────────────────────────────────────────────
    legal: {
      keywords: [
        'legal', 'law', 'compliance', 'paralegal', 'contracts', 'regulation',
        'regulatory', 'gdpr', 'hipaa', 'contract law', 'corporate law',
        'intellectual property', 'compliance officer', 'aba', 'legaltech',
        'arbitration', 'mediation', 'criminal justice'
      ],
      response: `⚖️ <strong>Legal, Compliance & LegalTech Programs</strong>

<strong>Program Tracks:</strong>

📜 <strong>Legal & Compliance</strong>
Paralegal studies, contract management, regulatory compliance (GDPR, HIPAA, SOX, CCPA)

🔍 <strong>Corporate Compliance</strong>
Risk management, internal audit, anti-money laundering (AML), know-your-customer (KYC)

💻 <strong>LegalTech</strong>
E-discovery platforms, contract automation, legal project management, AI in law

🧑‍⚖️ <strong>Criminal Justice</strong>
Law enforcement management, forensic investigation, corrections administration

📍 <a href="programs/legal-compliance.html" class="bth-chat-link">Legal Programs →</a>
📍 <a href="programs/legaltech.html" class="bth-chat-link">LegalTech Track →</a>`,
      suggestions: ['Compliance certification', 'LegalTech', 'Apply now', 'Contact us']
    },

    // ── HOSPITALITY & TOURISM ─────────────────────────────────────────────────
    hospitality: {
      keywords: [
        'hospitality', 'hotel', 'tourism', 'travel', 'restaurant',
        'food service', 'culinary', 'event management', 'resort', 'airlines',
        'aviation', 'cruise', 'catering'
      ],
      response: `🏨 <strong>Hospitality & Tourism Programs</strong>

<strong>Program Tracks:</strong>

🏨 <strong>Hotel & Resort Management</strong>
Front office operations, revenue management, property management systems (Oracle OPERA)

🍽️ <strong>Food Service & Culinary Business</strong>
Restaurant management, food safety (ServSafe), culinary entrepreneurship

✈️ <strong>Travel & Tourism</strong>
Tour operations, travel agency management, GDS systems (Sabre, Amadeus)

🎪 <strong>Event Management</strong>
Corporate event planning, venue management, CMP certification

📍 <a href="programs/hospitality-tourism.html" class="bth-chat-link">Hospitality Programs →</a>`,
      suggestions: ['Hotel management', 'Event planning', 'Apply now', 'All sectors']
    },

    // ── EDTECH ───────────────────────────────────────────────────────────────
    edtech: {
      keywords: [
        'edtech', 'education technology', 'e-learning', 'lms', 'online learning',
        'instructional design', 'curriculum', 'teaching', 'training design',
        'moodle', 'canvas', 'blackboard', 'gamification', 'microlearning'
      ],
      response: `📚 <strong>EdTech & Education Programs</strong>

<strong>Program Tracks:</strong>

💻 <strong>EdTech & Learning Systems</strong>
LMS administration, instructional design, SCORM, e-learning development (Articulate Storyline, Adobe Captivate)

🎓 <strong>Education & Training</strong>
Adult education, curriculum development, training facilitation, corporate L&D

📐 <strong>HRTech & L&D Technology</strong>
HR information systems (HRIS), talent management platforms, learning analytics

📍 <a href="programs/edtech.html" class="bth-chat-link">EdTech Programs →</a>
📍 <a href="programs/education-training.html" class="bth-chat-link">Education Track →</a>`,
      suggestions: ['Instructional design', 'HR technology', 'Apply now', 'Contact us']
    },

    // ── WORKFORCE DEPLOYMENT PROGRAM ─────────────────────────────────────────
    workforce: {
      keywords: [
        'workforce deployment', 'sales specialist', 'employment', 'job placement',
        'work placement', 'deployed', 'placement', 'earn while you learn',
        'income', '1066', '1,066', 'salary', 'monthly income', 'paid placement',
        'wdp', 'workforce program', 'sales career', 'deploy', 'commission',
        'territory', 'independent specialist', 'representative'
      ],
      response: `💼 <strong>Workforce Deployment Program (WDP)</strong>

The BTH pathway from trained learner to <strong>deployed revenue-generating professional</strong>.

<strong>How It Works:</strong>
1. Complete your sector program and certification
2. Pass WDP readiness assessment
3. Get deployed as a BTH Specialist in your region
4. Earn commission on institutional contracts you facilitate

<strong>The Role — BTH Sales Specialist:</strong>
• Present BTH programs to institutions, businesses, and individuals
• Represent the world's leading education investment organization
• Work independently with BTH branding & materials
• Earn performance-based income starting at <strong>$1,066/month minimum</strong>
• Uncapped commission structure

<strong>Territories:</strong>
Open in North America, Europe, Africa, Asia-Pacific, Middle East

<strong>WHO QUALIFIES:</strong>
✅ BTH program completers
✅ Individuals with education or corporate sales background
✅ Motivated self-starters with professional networks

📍 <a href="workforce-deployment.html" class="bth-chat-link">Workforce Deployment Program →</a>
📍 <a href="apply-sales-specialist.html" class="bth-chat-link">Apply as Sales Specialist →</a>`,
      suggestions: ['Apply as sales specialist', 'Commission structure', 'Territory availability', 'Contact sales team']
    },

    // ── FRANCHISE ────────────────────────────────────────────────────────────
    franchise: {
      keywords: [
        'franchise', 'franchising', 'bth franchise', 'franchise opportunity',
        'open a school', 'start a training center', 'education franchise',
        'licensing', 'partnership model', 'reseller', 'affiliate education'
      ],
      response: `🏢 <strong>BTH Education Franchises</strong>

Launch your own BTH-branded education center anywhere in the world.

<strong>What You Get:</strong>
• Full BTH brand licensing
• OEDP curriculum and courseware
• Centralized certification management (Pearson VUE integration)
• Marketing & student acquisition support
• Operations manual and systems
• Ongoing pedagogical and business coaching

<strong>Franchise Models:</strong>
🏫 <strong>Full Campus Model</strong> — Physical institution with 5+ program tracks
📱 <strong>Digital Franchise</strong> — Online delivery with BTH branding
🤝 <strong>Hybrid Partner</strong> — Existing institution adding BTH certification tracks

<strong>Who This Is For:</strong>
• Education entrepreneurs
• Existing training institutions
• Governments and municipalities
• Universities seeking global certification programs

📍 <a href="franchise.html" class="bth-chat-link">Franchise Opportunities →</a>
📍 <a href="apply.html" class="bth-chat-link">Apply for Partnership →</a>`,
      suggestions: ['Franchise investment', 'Partnership inquiry', 'Contact us', 'About BTH']
    },

    // ── CAREER ASSESSMENT ─────────────────────────────────────────────────────
    careerAssessment: {
      keywords: [
        'career assessment', 'career test', 'career path', 'which program',
        'what should i study', 'best program for me', 'career advice',
        'career counseling', 'not sure what to study', 'recommend a program',
        'career quiz', 'discover my path', 'free assessment'
      ],
      response: `🧭 <strong>Free Career Assessment</strong>

Not sure which program fits your goals? Our <strong>Free Career Assessment</strong> maps your background, interests, and goals to the best BTH program track.

<strong>What It Covers:</strong>
• Current skills and experience inventory
• Industry interest and passion alignment
• Salary and career growth objectives
• Learning style preferences
• Timeline and availability

<strong>Result You Receive:</strong>
✅ Recommended program track(s)
✅ Certification pathway map
✅ Estimated time to deployment
✅ Earning potential by career stage

<strong>Takes just 10-15 minutes — completely free.</strong>

📍 <a href="career-assessment.html" class="bth-chat-link">Take Free Assessment →</a>
📍 <a href="contact.html" class="bth-chat-link">Talk to an Advisor →</a>`,
      suggestions: ['Apply now', 'Talk to advisor', 'View all programs', 'Technology sector']
    },

    // ── APPLY / ENROLLMENT ───────────────────────────────────────────────────
    apply: {
      keywords: [
        'apply', 'enroll', 'enrollment', 'sign up', 'register', 'get started',
        'join', 'start', 'admission', 'how to apply', 'application process',
        'how do i enroll', 'can i join', 'begin', 'onboard', 'intake',
        'application', 'requirements', 'prerequisites'
      ],
      response: `✅ <strong>How to Apply to BTH Education Group</strong>

<strong>Application Process:</strong>

1️⃣ <strong>Take Free Career Assessment</strong>
   Identify your ideal program track
   → <a href="career-assessment.html" class="bth-chat-link">Start Assessment →</a>

2️⃣ <strong>Choose Your Program</strong>
   Browse 25+ sector programs from our catalog
   → <a href="program.html" class="bth-chat-link">View All Programs →</a>

3️⃣ <strong>Submit Application</strong>
   Complete the online application form
   → <a href="apply.html" class="bth-chat-link">Apply Now →</a>

4️⃣ <strong>Admissions Consultation</strong>
   A BTH advisor reviews your profile and schedules an orientation call

5️⃣ <strong>Begin Your Program</strong>
   Access courseware, study materials, and certification prep immediately

<strong>For Institutional/Corporate Partnerships:</strong>
→ <a href="apply.html" class="bth-chat-link">Institutional Partnership Application →</a>

<strong>For Sales Specialist Role:</strong>
→ <a href="apply-sales-specialist.html" class="bth-chat-link">Sales Specialist Application →</a>`,
      suggestions: ['Program catalog', 'Career assessment', 'Contact admissions', 'Pricing and tuition']
    },

    // ── PRICING / COST ────────────────────────────────────────────────────────
    pricing: {
      keywords: [
        'price', 'pricing', 'cost', 'tuition', 'how much', 'fee', 'fees',
        'affordable', 'scholarship', 'financial aid', 'payment plan', 'monthly',
        'installment', 'discount', 'cost of program', 'program cost',
        'how much does it cost', 'subscription', 'investment'
      ],
      response: `💵 <strong>Program Pricing & Tuition</strong>

BTH programs are structured for maximum ROI — certification credentials that pay back quickly in salary increases and career advancement.

<strong>Pricing Factors:</strong>
• Program track and duration
• Certification vendor fees (Pearson VUE, Prometric)
• Delivery format (self-paced, instructor-led, hybrid)
• Corporate vs. individual enrollment

<strong>Available Options:</strong>
✅ Individual enrollment
✅ Corporate/team pricing (volume discounts)
✅ Government/institutional contracts
✅ NGO and development partner rates
✅ Scholarship and sponsored enrollment programs

<strong>Workforce Deployment Program:</strong>
Structured around performance — earn $1,066+/month as a deployed specialist while building income.

<strong>For exact pricing tailored to your goals:</strong>

📍 <a href="contact.html" class="bth-chat-link">Request a Personalized Quote →</a>
📍 <a href="career-assessment.html" class="bth-chat-link">Free Assessment First →</a>
📞 Contact our admissions team for current rates and scholarship availability.`,
      suggestions: ['Apply now', 'Career assessment', 'Corporate training', 'Contact admissions']
    },

    // ── CORPORATE / ENTERPRISE TRAINING ──────────────────────────────────────
    corporate: {
      keywords: [
        'corporate training', 'enterprise', 'business training', 'team training',
        'organization', 'company', 'employer', 'workforce', 'employee development',
        'l&d', 'learning and development', 'bulk enrollment', 'group training',
        'institutional', 'government contract', 'b2b', 'hire from bth',
        'talent pipeline', 'corporate partnership'
      ],
      response: `🏢 <strong>Corporate & Enterprise Training Solutions</strong>

BTH serves governments, Fortune 500 companies, and institutions across 120+ countries with <strong>bespoke enterprise training programs</strong>.

<strong>What We Deliver for Enterprises:</strong>

📋 <strong>Custom Curriculum Design</strong>
Programs built around your exact job roles, tools, and compliance requirements

🎓 <strong>Certified Training Delivery</strong>
Instructor-led and blended delivery by certified BTH facilitators

📊 <strong>Workforce Analytics Dashboard</strong>
Real-time competency tracking, completion rates, and certification validation

🔗 <strong>Talent Pipeline Development</strong>
Pre-hire training → certification → deployment into your open roles

🌍 <strong>Multi-Country Delivery</strong>
Standardized training quality across global operations

<strong>Sectors We Contract With:</strong>
Technology | Healthcare | Manufacturing | Government | Energy | Financial Services | Construction

<strong>Contract Types:</strong>
• Annual training contracts
• Per-seat licensing
• Managed learning partnerships
• Train-the-trainer programs

📍 <a href="apply.html" class="bth-chat-link">Enterprise Partnership Application →</a>
📍 <a href="contact.html" class="bth-chat-link">Request Enterprise Consultation →</a>`,
      suggestions: ['Hire from BTH', 'Custom curriculum', 'Contact enterprise team', 'Franchise']
    },

    // ── CONTACT ───────────────────────────────────────────────────────────────
    contact: {
      keywords: [
        'contact', 'reach', 'call', 'email', 'phone', 'speak', 'talk',
        'get in touch', 'advisor', 'admissions', 'helpdesk', 'support',
        'help', 'office', 'location', 'hours', 'response time'
      ],
      response: `📞 <strong>Contact BTH Education Group</strong>

<strong>General Inquiries:</strong>
📧 <a href="mailto:info@btheducationgroup.org" class="bth-chat-link">info@btheducationgroup.org</a>
🌐 <a href="https://btheducationgroup.org" class="bth-chat-link">btheducationgroup.org</a>

<strong>Admissions Team:</strong>
→ <a href="contact.html" class="bth-chat-link">Contact Form →</a>
→ <a href="career-assessment.html" class="bth-chat-link">Free Career Assessment →</a>

<strong>Enterprise & Partnerships:</strong>
→ <a href="apply.html" class="bth-chat-link">Partnership Inquiry →</a>

<strong>Sales Specialist Applications:</strong>
→ <a href="apply-sales-specialist.html" class="bth-chat-link">Apply Here →</a>

<strong>Media & Press:</strong>
→ <a href="contact.html" class="bth-chat-link">Press Contact →</a>

⏱️ <strong>Response Times:</strong>
• Email: Within 24 hours (business days)
• Application: Reviewed within 2 business days
• Enterprise: Priority response within 4 hours`,
      suggestions: ['Apply now', 'Career assessment', 'View programs', 'Franchise inquiry']
    },

    // ── PARTNERSHIPS & ACCREDITATION ──────────────────────────────────────────
    partners: {
      keywords: [
        'partner', 'partnership', 'microsoft partner', 'aws partner', 'cisco',
        'pearson vue', 'comptia', 'accreditation', 'accredited', 'iso 17024',
        'sdg', 'udhr', 'recognized', 'authorized', 'testing center',
        'exam center', 'accreditation body', 'validation'
      ],
      response: `🤝 <strong>BTH Education Group — Global Partnerships & Accreditation</strong>

<strong>Certification Authority Status:</strong>
🏛️ <strong>ISO 17024 Certified</strong> — Global standard for personnel certification bodies
📜 <strong>UDHR Article 26:2 Aligned</strong> — Access to education as a fundamental right
🌍 <strong>SDG 16 Contributor</strong> — Strong institutions mission framework

<strong>Global Technology Partners:</strong>
🔷 <strong>Microsoft Learning Partner</strong> — Azure, M365, Power Platform certs
🟠 <strong>AWS Consulting Partner</strong> — Full AWS certification catalog
🔵 <strong>Cisco Learning Partner</strong> — CCNA, CCNP, CyberOps tracks
🟡 <strong>CompTIA Authorized Partner</strong> — A+, Net+, Sec+, Cloud+, Data+
🟣 <strong>Pearson VUE Authorized Testing Partner</strong> — Global exam delivery

<strong>Industry Alliances:</strong>
• PMI (Project Management Institute) — PMP prep
• ISC² — CISSP, SSCP, CCSP
• ISACA — CISM, CISA, CRISC
• SHRM — HR certifications
• AICPA — CPA exam prep alignment
• NABCEP — Solar energy certifications

📍 <a href="about.html" class="bth-chat-link">Our Partnerships & Credentials →</a>`,
      suggestions: ['Microsoft certification', 'AWS certification', 'ISO 17024', 'Apply for program']
    },

    // ── AGRITECH / AGRICULTURE ────────────────────────────────────────────────
    agritech: {
      keywords: [
        'agriculture', 'agritech', 'farming', 'agri', 'food technology',
        'precision agriculture', 'smart farming', 'crop', 'livestock',
        'agricultural technology', 'food chain', 'agribusiness'
      ],
      response: `🌾 <strong>AgriTech & Agricultural Programs</strong>

<strong>Program Tracks:</strong>

🌱 <strong>AgriTech & Precision Agriculture</strong>
Drone technology for agriculture, smart irrigation, IoT sensors, satellite crop monitoring

🐄 <strong>Agribusiness Management</strong>
Farm management, commodity markets, agricultural finance, cooperative management

🍃 <strong>Food Technology & Safety</strong>
HACCP, food processing, quality control, food chain management, regulatory compliance

📍 <a href="programs/agtech.html" class="bth-chat-link">AgriTech Programs →</a>`,
      suggestions: ['Apply for program', 'View all sectors', 'Contact admissions', 'Career assessment']
    },

    // ── REAL ESTATE ───────────────────────────────────────────────────────────
    realEstate: {
      keywords: [
        'real estate', 'property', 'realty', 'housing', 'proptech',
        'real estate investment', 'mortgage', 'brokerage', 'commercial property',
        'property management', 'reit', 'appraisal'
      ],
      response: `🏠 <strong>Real Estate & PropTech Programs</strong>

<strong>Program Tracks:</strong>

🏠 <strong>Real Estate Fundamentals</strong>
Principles, law, financing, valuation, residential and commercial transactions

📊 <strong>Real Estate Investment</strong>
REITs, investment analysis, cap rates, portfolio management, 1031 exchanges

💻 <strong>PropTech</strong>
Real estate technology platforms, CRM for realtors, virtual tours, digital contract management

🏢 <strong>Property Management</strong>
Leasing, facilities management, HOA management, tenant relations

📍 <a href="programs/real-estate.html" class="bth-chat-link">Real Estate Programs →</a>`,
      suggestions: ['Apply for program', 'Finance sector', 'Career assessment', 'Contact us']
    },

    // ── FINTECH ───────────────────────────────────────────────────────────────
    fintech: {
      keywords: [
        'fintech', 'financial technology', 'blockchain', 'cryptocurrency',
        'defi', 'payments', 'insurtech', 'regtech', 'wealthtech',
        'digital banking', 'neobank', 'lending', 'credit', 'digital payments'
      ],
      response: `💳 <strong>FinTech & Financial Technology Programs</strong>

<strong>Program Tracks:</strong>

💳 <strong>FinTech Fundamentals</strong>
Digital banking, payment systems, API banking, open banking (PSD2)

🔗 <strong>Blockchain & Crypto</strong>
Distributed ledger technology, smart contracts (Solidity), DeFi, digital asset management

🛡️ <strong>InsurTech</strong>
Insurance technology, actuarial data analytics, claims automation, telematics

📋 <strong>RegTech & Compliance</strong>
AML/KYC automation, regulatory reporting, GDPR/CCPA in financial services

📍 <a href="programs/insurtech.html" class="bth-chat-link">InsurTech Programs →</a>
📍 <a href="programs/finance-accounting.html" class="bth-chat-link">Finance & Accounting →</a>`,
      suggestions: ['Finance programs', 'Blockchain certification', 'Apply now', 'Contact us']
    },

    // ── RETAIL & E-COMMERCE ───────────────────────────────────────────────────
    retail: {
      keywords: [
        'retail', 'ecommerce', 'e-commerce', 'online store', 'shopify',
        'amazon', 'omnichannel', 'supply chain retail', 'consumer goods',
        'merchandising', 'inventory', 'point of sale', 'pos'
      ],
      response: `🛒 <strong>Retail & E-Commerce Programs</strong>

<strong>Program Tracks:</strong>

🛒 <strong>E-Commerce Management</strong>
Shopify, WooCommerce, Amazon marketplace, digital merchandising, logistics

📦 <strong>Supply Chain & Retail Logistics</strong>
Inventory management, demand forecasting, warehouse operations, last-mile delivery

📊 <strong>Retail Analytics</strong>
Consumer behavior data, POS analytics, loyalty program management, omnichannel strategy

📍 <a href="programs/retail-ecommerce.html" class="bth-chat-link">Retail Programs →</a>`,
      suggestions: ['Supply chain programs', 'E-commerce certification', 'Apply now', 'Contact us']
    },

    // ── TRANSPORTATION & LOGISTICS ────────────────────────────────────────────
    transport: {
      keywords: [
        'transportation', 'logistics', 'supply chain', 'freight', 'shipping',
        'aviation', 'maritime', 'trucking', 'warehouse', 'last mile',
        'fleet management', 'customs', 'import export', 'intermodal'
      ],
      response: `🚛 <strong>Transportation & Logistics Programs</strong>

<strong>Program Tracks:</strong>

🚛 <strong>Logistics & Supply Chain</strong>
APICS CSCP/CLTD, freight management, 3PL operations, customs compliance

✈️ <strong>Aviation Logistics</strong>
Air cargo operations, IATA certification, dangerous goods (DGR), ground operations

🚢 <strong>Maritime & Freight</strong>
Port operations, maritime law, container logistics, international trade (Incoterms)

📦 <strong>Warehouse & Distribution</strong>
WMS systems, lean warehousing, pick-pack-ship, cold chain management

📍 <a href="programs/transportation-logistics.html" class="bth-chat-link">Transportation Programs →</a>`,
      suggestions: ['Supply chain programs', 'APICS certification', 'Apply now', 'Contact us']
    },

    // ── COMMUNICATIONS & TELECOM ──────────────────────────────────────────────
    communications: {
      keywords: [
        'communications', 'telecom', 'telecommunications', '5g', 'fiber',
        'broadband', 'wireless', 'network engineering', 'voip',
        'unified communications', 'radio frequency', 'rf', 'tower',
        'satellite', 'isp', 'noc'
      ],
      response: `📡 <strong>Communications & Telecommunications Programs</strong>

<strong>Program Tracks:</strong>

📡 <strong>Telecommunications Engineering</strong>
5G architecture, fiber optic installation (BICSI), RF engineering, microwave systems

☁️ <strong>Unified Communications</strong>
Microsoft Teams/Skype for Business, VoIP (Cisco UC), SIP trunking, contact centers

🔧 <strong>Network Operations</strong>
NOC management, SLA monitoring, incident management, ITIL for telecom

📍 <a href="programs/communications-telecommunications.html" class="bth-chat-link">Communications Programs →</a>`,
      suggestions: ['Network certification', 'Technology programs', 'Apply now', 'Contact us']
    },

    // ── PROFESSIONAL SERVICES ─────────────────────────────────────────────────
    professionalServices: {
      keywords: [
        'professional services', 'consulting', 'management consulting',
        'research', 'academic', 'research skills', 'data research',
        'market research', 'think tank', 'advisory'
      ],
      response: `🤝 <strong>Professional Services & Research Programs</strong>

<strong>Program Tracks:</strong>

🔍 <strong>Research Methodology</strong>
Quantitative/qualitative research, academic writing, statistical analysis (SPSS, R), grant proposal writing

💼 <strong>Management Consulting</strong>
Problem structuring, client engagement, change management (Prosci ADKAR), consulting frameworks

📊 <strong>Market Research & Analytics</strong>
Consumer insights, competitive intelligence, data visualization, survey design

📍 <a href="programs/professional-services.html" class="bth-chat-link">Professional Services →</a>
📍 <a href="programs/research.html" class="bth-chat-link">Research Programs →</a>`,
      suggestions: ['Business programs', 'Data science', 'Apply now', 'Contact us']
    },

    // ── ALL PROGRAMS ──────────────────────────────────────────────────────────
    allPrograms: {
      keywords: [
        'all programs', 'list programs', 'show programs', 'program catalog',
        'course catalog', 'what programs', 'what courses', 'all courses',
        'what sectors', 'all sectors', 'program list', 'available programs',
        'what do you offer', 'everything you offer', 'what can i study',
        'sectors you cover', 'industries covered'
      ],
      response: `📚 <strong>BTH Education Group — All Program Sectors (25+)</strong>

<strong>Technology & Digital:</strong>
💻 Information Technology | 🔐 Cybersecurity | ☁️ Cloud Computing | 🤖 AI & Data Science | 💱 FinTech | 🛒 E-Commerce | 💻 EdTech | 🖥️ Web Development

<strong>Business & Finance:</strong>
📊 Business Management | 💰 Finance & Accounting | 🚀 Business Development | 🎯 Project Management | 👥 Human Resources | 📣 Marketing & Sales

<strong>Healthcare & Sciences:</strong>
🏥 Healthcare Administration | 🧬 Biotechnology | 💊 Medical Technology | 🌱 Public Health

<strong>Engineering & Manufacturing:</strong>
⚙️ Manufacturing | 🚗 Automotive Technology | ✈️ Aerospace | 🏗️ Architecture & Engineering | 🌿 Environmental Sustainability | 🏢 Construction

<strong>Energy & Sustainability:</strong>
☀️ Renewable Energy | ⚡ Power Systems | 🔋 Energy Storage | 🌱 Environmental Management

<strong>Government & Society:</strong>
🏛️ Public Administration | 🔐 Government Cybersecurity | 🚔 Public Safety | 🤖 GovTech

<strong>Creative & Media:</strong>
🎨 Graphic Design | 📱 UX/UI | 🎬 Film & Video | 📸 Photography | 📢 Digital Marketing

<strong>Specialty Sectors:</strong>
⚖️ Legal & Compliance | 🌾 AgriTech | 🏨 Hospitality | 🚛 Transportation & Logistics | 🏠 Real Estate | 📡 Telecommunications | 🛡️ InsurTech | 📋 Professional Services

📍 <a href="program.html" class="bth-chat-link">Full Program Catalog →</a>
📍 <a href="career-assessment.html" class="bth-chat-link">Free Career Assessment →</a>`,
      suggestions: ['Technology programs', 'Healthcare programs', 'Business programs', 'Apply now']
    }
  };

  // ─── CONVERSATION CONTEXT ─────────────────────────────────────────────────
  const ctx = { messageCount: 0 };

  // ─── RESPONSE ENGINE ──────────────────────────────────────────────────────
  function getResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // Walk every category and check every keyword
    for (const [, data] of Object.entries(knowledge)) {
      for (const kw of data.keywords) {
        // Use word-boundary-aware matching for short keywords, substring for phrases
        const pattern = kw.length <= 4
          ? new RegExp(`\\b${escapeReg(kw)}\\b`, 'i')
          : new RegExp(escapeReg(kw), 'i');
        if (pattern.test(msg)) {
          return { response: data.response, suggestions: data.suggestions || [] };
        }
      }
    }

    // Default
    return {
      response: `👋 <strong>I'm the BTH Education Group Assistant!</strong>

I can help you with:

🎓 <strong>Programs & Certifications</strong> — 25+ industry sectors, Microsoft, AWS, Cisco, CompTIA
💼 <strong>Workforce Deployment</strong> — Join BTH as a deployed sales specialist ($1,066+/month)
🏢 <strong>Franchising</strong> — Launch a BTH education center in your country
🤝 <strong>Enterprise Training</strong> — Corporate workforce development contracts
📊 <strong>Career Guidance</strong> — Free assessment to discover your ideal program

<strong>Try asking:</strong>
• "Tell me about cybersecurity programs"
• "How do I apply?"
• "What certifications do you offer?"
• "Tell me about the workforce deployment program"
• "How can I franchise with BTH?"

📍 <a href="career-assessment.html" class="bth-chat-link">Free Career Assessment →</a>
📍 <a href="program.html" class="bth-chat-link">All Programs →</a>
📍 <a href="contact.html" class="bth-chat-link">Contact Us →</a>`,
      suggestions: ['All programs', 'Apply now', 'Certifications', 'Contact us']
    };
  }

  function escapeReg(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ─── DOM HELPERS ──────────────────────────────────────────────────────────
  function addMessage(html, isUser) {
    const wrap = document.createElement('div');
    wrap.style.cssText = isUser
      ? 'background:linear-gradient(135deg,#2563eb,#1e40af);padding:0.9rem 1rem;border-radius:0.75rem;animation:bthSlideIn 0.3s ease;'
      : 'background:rgba(255,255,255,0.06);border-left:3px solid #2563eb;padding:0.9rem 1rem;border-radius:0.75rem;animation:bthSlideIn 0.3s ease;';
    const p = document.createElement('p');
    p.style.cssText = 'color:white;font-size:0.92rem;line-height:1.65;margin:0;white-space:pre-line;';
    p.innerHTML = html;
    wrap.appendChild(p);
    DOM.messages.appendChild(wrap);
    smoothScroll();
    return wrap;
  }

  function showTyping() {
    const d = document.createElement('div');
    d.id = 'bth-typing';
    d.style.cssText = 'background:rgba(255,255,255,0.06);border-left:3px solid #2563eb;padding:0.9rem 1rem;border-radius:0.75rem;display:flex;align-items:center;gap:0.5rem;animation:bthSlideIn 0.3s ease;';
    d.innerHTML = `
      <div style="display:flex;gap:4px;">
        <span style="width:8px;height:8px;background:#2563eb;border-radius:50%;animation:bthDot 1.4s infinite 0s;"></span>
        <span style="width:8px;height:8px;background:#2563eb;border-radius:50%;animation:bthDot 1.4s infinite 0.2s;"></span>
        <span style="width:8px;height:8px;background:#2563eb;border-radius:50%;animation:bthDot 1.4s infinite 0.4s;"></span>
      </div>
      <span style="color:rgba(255,255,255,0.55);font-size:0.82rem;">BTH Assistant is typing…</span>`;
    DOM.messages.appendChild(d);
    smoothScroll();
  }

  function removeTyping() {
    const t = document.getElementById('bth-typing');
    if (t) t.remove();
  }

  function addSuggestions(suggestions, parentEl) {
    if (!suggestions || !suggestions.length) return;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.6rem;';
    suggestions.forEach(s => {
      const btn = document.createElement('button');
      btn.textContent = s;
      btn.style.cssText = 'background:rgba(37,99,235,0.12);border:1px solid rgba(37,99,235,0.3);border-radius:999px;padding:0.35rem 0.75rem;color:rgba(255,255,255,0.9);font-size:0.78rem;cursor:pointer;transition:all 0.2s;';
      btn.onmouseover = () => { btn.style.background = 'rgba(37,99,235,0.25)'; btn.style.borderColor = 'rgba(37,99,235,0.6)'; };
      btn.onmouseout = () => { btn.style.background = 'rgba(37,99,235,0.12)'; btn.style.borderColor = 'rgba(37,99,235,0.3)'; };
      btn.onclick = () => { DOM.input.value = s; send(); };
      row.appendChild(btn);
    });
    parentEl.appendChild(row);
  }

  function smoothScroll() {
    setTimeout(() => DOM.messages.scrollTo({ top: DOM.messages.scrollHeight, behavior: 'smooth' }), 80);
  }

  // ─── SEND ─────────────────────────────────────────────────────────────────
  function send() {
    const text = DOM.input.value.trim();
    if (!text) return;
    DOM.input.value = '';
    ctx.messageCount++;

    addMessage(text, true);
    showTyping();

    const delay = text.length > 60 ? 900 : 650;
    setTimeout(() => {
      removeTyping();
      const { response, suggestions } = getResponse(text);
      const msgEl = addMessage(response, false);
      if (ctx.messageCount < 8) addSuggestions(suggestions, msgEl);
    }, delay);
  }

  // ─── OPEN / CLOSE ─────────────────────────────────────────────────────────
  function openChat() {
    DOM.window.style.display = 'flex';
    DOM.toggle.style.display = 'none';
    DOM.input.focus();
  }
  function closeChat() {
    DOM.window.style.display = 'none';
    DOM.toggle.style.display = 'flex';
  }

  // ─── DOM REFS ─────────────────────────────────────────────────────────────
  const DOM = {};

  // ─── BUILD WIDGET ─────────────────────────────────────────────────────────
  function buildWidget() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bthSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      @keyframes bthDot { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      @keyframes bthPulse { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0.45)} 70%{box-shadow:0 0 0 12px rgba(37,99,235,0)} }
      #bth-chat-toggle { animation: bthPulse 2.5s infinite; }
      #bth-chat-toggle:hover { transform:scale(1.08) !important; }
      #bth-chat-messages::-webkit-scrollbar { width:5px; }
      #bth-chat-messages::-webkit-scrollbar-track { background:rgba(255,255,255,0.04); border-radius:10px; }
      #bth-chat-messages::-webkit-scrollbar-thumb { background:rgba(37,99,235,0.5); border-radius:10px; }
      .bth-chat-link { color:#60a5fa !important; text-decoration:underline; }
      .bth-chat-link:hover { color:#93c5fd !important; }
      #bth-chat-input:focus { border-color:rgba(37,99,235,0.5) !important; box-shadow:0 0 0 3px rgba(37,99,235,0.12); }
      #bth-chat-send:hover { background:linear-gradient(135deg,#1d4ed8,#1e3a8a) !important; }
      @media(max-width:480px){
        #bth-chat-window { width:calc(100vw - 1rem) !important; height:calc(100vh - 5rem) !important; bottom:1rem !important; right:0.5rem !important; }
      }
    `;
    document.head.appendChild(style);

    // Toggle button
    const toggle = document.createElement('button');
    toggle.id = 'bth-chat-toggle';
    toggle.setAttribute('aria-label', 'Open BTH Assistant');
    toggle.style.cssText = 'position:fixed;bottom:2rem;right:2rem;width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#1e40af);border:none;box-shadow:0 8px 24px rgba(37,99,235,0.45);cursor:pointer;z-index:9998;display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease;';
    toggle.innerHTML = `<svg width="27" height="27" fill="white" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/></svg>`;

    // Chat window
    const win = document.createElement('div');
    win.id = 'bth-chat-window';
    win.setAttribute('aria-hidden', 'true');
    win.style.cssText = 'position:fixed;bottom:2rem;right:2rem;width:430px;max-width:calc(100vw - 1rem);height:640px;max-height:calc(100vh - 2.5rem);background:rgba(9,13,37,0.98);backdrop-filter:blur(20px);border-radius:1.5rem;border:1px solid rgba(255,255,255,0.1);box-shadow:0 20px 60px rgba(0,0,0,0.55);display:none;flex-direction:column;z-index:9999;overflow:hidden;font-family:Inter,system-ui,sans-serif;';

    win.innerHTML = `
      <!-- Header -->
      <div style="padding:1.25rem 1.5rem;background:linear-gradient(135deg,#2563eb,#1e40af);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div>
          <h3 style="color:white;font-size:1.05rem;font-weight:700;margin:0;letter-spacing:-0.01em;">BTH Education Assistant</h3>
          <p style="color:rgba(255,255,255,0.78);font-size:0.75rem;margin:0.2rem 0 0;">Programs · Certifications · Careers · Partnerships</p>
        </div>
        <button id="bth-chat-close" aria-label="Close" style="background:rgba(255,255,255,0.15);border:none;color:white;width:30px;height:30px;border-radius:0.5rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </button>
      </div>

      <!-- Quick nav chips -->
      <div style="padding:0.75rem 1rem 0;display:flex;flex-wrap:wrap;gap:0.4rem;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.07);padding-bottom:0.75rem;">
        <button class="bth-qnav" data-q="All programs">All Programs</button>
        <button class="bth-qnav" data-q="Apply now">Apply Now</button>
        <button class="bth-qnav" data-q="Certifications">Certifications</button>
        <button class="bth-qnav" data-q="Workforce deployment program">WDP</button>
        <button class="bth-qnav" data-q="Franchise">Franchise</button>
        <button class="bth-qnav" data-q="Corporate training">Enterprise</button>
        <button class="bth-qnav" data-q="Contact">Contact</button>
      </div>

      <!-- Messages -->
      <div id="bth-chat-messages" style="flex:1;padding:1rem;overflow-y:auto;display:flex;flex-direction:column;gap:1rem;">
        <!-- Welcome -->
        <div style="background:rgba(37,99,235,0.1);border-left:3px solid #2563eb;padding:1rem;border-radius:0.75rem;">
          <p style="color:white;font-size:0.9rem;line-height:1.65;margin:0 0 0.75rem;">
            👋 <strong>Welcome to BTH Education Group!</strong><br><br>
            I'm your intelligent assistant — ask me anything about our programs, certifications, franchise opportunities, or career paths.
          </p>
          <div style="display:flex;flex-direction:column;gap:0.4rem;">
            <div style="display:flex;gap:0.5rem;"><span style="color:#60a5fa;">🎓</span><span style="color:rgba(255,255,255,0.8);font-size:0.82rem;"><strong>25+ industry sectors</strong> — technology, healthcare, business, energy &amp; more</span></div>
            <div style="display:flex;gap:0.5rem;"><span style="color:#60a5fa;">📜</span><span style="color:rgba(255,255,255,0.8);font-size:0.82rem;"><strong>ISO 17024 certified</strong> — Microsoft, AWS, Cisco, CompTIA, Pearson VUE partner</span></div>
            <div style="display:flex;gap:0.5rem;"><span style="color:#60a5fa;">💼</span><span style="color:rgba(255,255,255,0.8);font-size:0.82rem;"><strong>5.8M+ certified professionals</strong> across 120+ countries</span></div>
            <div style="display:flex;gap:0.5rem;"><span style="color:#60a5fa;">🚀</span><span style="color:rgba(255,255,255,0.8);font-size:0.82rem;"><strong>Workforce Deployment</strong> — earn $1,066+/month as a BTH specialist</span></div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div style="padding:0.85rem 1rem;border-top:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.2);flex-shrink:0;">
        <div style="display:flex;gap:0.6rem;align-items:center;">
          <input type="text" id="bth-chat-input" placeholder="Ask about programs, certifications, careers…" autocomplete="off"
            style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:0.65rem;padding:0.75rem 0.9rem;color:white;font-size:0.88rem;outline:none;transition:all 0.25s;font-family:inherit;"/>
          <button id="bth-chat-send" style="background:linear-gradient(135deg,#2563eb,#1e40af);border:none;border-radius:0.65rem;padding:0.75rem 1.1rem;color:white;font-weight:600;font-size:0.85rem;cursor:pointer;transition:all 0.2s;white-space:nowrap;">Send</button>
        </div>
        <p style="color:rgba(255,255,255,0.3);font-size:0.68rem;margin:0.4rem 0 0;text-align:center;">BTH Education Group · btheducationgroup.org</p>
      </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(win);

    // Cache DOM refs
    DOM.toggle = toggle;
    DOM.window = win;
    DOM.messages = win.querySelector('#bth-chat-messages');
    DOM.input = win.querySelector('#bth-chat-input');
    DOM.close = win.querySelector('#bth-chat-close');

    // Events
    toggle.addEventListener('click', openChat);
    DOM.close.addEventListener('click', closeChat);
    win.querySelector('#bth-chat-send').addEventListener('click', send);
    DOM.input.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && win.style.display === 'flex') closeChat(); });

    // Quick-nav chips
    win.querySelectorAll('.bth-qnav').forEach(btn => {
      btn.style.cssText = 'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:999px;padding:0.28rem 0.7rem;color:rgba(255,255,255,0.8);font-size:0.73rem;cursor:pointer;transition:all 0.2s;font-family:inherit;';
      btn.onmouseover = () => { btn.style.background = 'rgba(37,99,235,0.2)'; btn.style.borderColor = 'rgba(37,99,235,0.4)'; };
      btn.onmouseout = () => { btn.style.background = 'rgba(255,255,255,0.06)'; btn.style.borderColor = 'rgba(255,255,255,0.12)'; };
      btn.onclick = () => { DOM.input.value = btn.dataset.q; send(); };
    });
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

})();
