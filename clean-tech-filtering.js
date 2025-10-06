// Clean JavaScript for technology.html filtering system
// This will replace the broken section

        // COMPREHENSIVE IT ADVANCED FILTERING SYSTEM - CLEAN VERSION
        class ITAdvancedFilteringSystemComplete {
            constructor() {
                this.currentLevel = 1;
                this.currentFilter = 'categories';
                this.selectedCategories = new Set(['all']);
                this.selectedVendors = new Set();
                this.selectedDomains = new Set();
                this.partnershipFilter = 'all';
                this.searchQuery = '';
                
                // Complete IT Category Database with Focus Areas
                this.categoryDatabase = {
                    'core-it': {
                        name: 'Core IT Foundations & Networking',
                        icon: '🔧',
                        focusAreas: ['Foundations', 'OS', 'Enterprise R&S', 'Wireless', '5G/SP'],
                        vendors: {
                            premium: ['CompTIA', 'Cisco', 'CWNP'],
                            standard: ['Juniper', 'Aruba', 'Nokia', 'Huawei', 'ZTE', 'Fortinet']
                        },
                        totalCerts: 85
                    },
                    'cloud-platforms': {
                        name: 'Cloud & Platforms',
                        icon: '☁️',
                        focusAreas: ['Public Cloud', 'Virtualization', 'Linux', 'Data Platforms', 'Modern Workplace'],
                        vendors: {
                            premium: ['AWS', 'Microsoft', 'Google Cloud', 'Red Hat', 'VMware/Omnissa'],
                            standard: ['SUSE', 'Snowflake', 'MongoDB', 'NetApp', 'Oracle']
                        },
                        totalCerts: 125
                    },
                    'cybersecurity': {
                        name: 'Cybersecurity & Privacy',
                        icon: '🛡️',
                        focusAreas: ['Blue Team', 'Offensive Security', 'Cloud Security', 'GRC & Audit', 'Privacy'],
                        vendors: {
                            premium: ['CompTIA', '(ISC)²', 'ISACA', 'EC-Council'],
                            standard: ['GIAC', 'IAPP', 'CSA', 'Fortinet']
                        },
                        totalCerts: 95
                    }
                    // Additional categories would be here in full implementation
                };

                // Level Pricing System
                this.levelPricing = {
                    1: { maxCerts: 3, perDimension: 967.11, duration: "8-12 Months", intensity: "Foundation", certification: 8100, totalDimensions: 6 },
                    2: { maxCerts: 5, perDimension: 1450.67, duration: "12-18 Months", intensity: "Intermediate", certification: 10500, totalDimensions: 6 },
                    3: { maxCerts: 7, perDimension: 1934.22, duration: "18-24 Months", intensity: "Advanced", certification: 13500, totalDimensions: 6 },
                    4: { maxCerts: 9, perDimension: 2417.78, duration: "24-30 Months", intensity: "Expert", certification: 17000, totalDimensions: 6 },
                    5: { maxCerts: 12, perDimension: 2901.33, duration: "30-36 Months", intensity: "Master", certification: 26865, totalDimensions: 6 }
                };

                this.initializeSystem();
            }

            initializeSystem() {
                this.updateLevelDisplay(this.currentLevel);
                this.attachEventListeners();
                console.log('IT Advanced Filtering System initialized successfully');
            }

            attachEventListeners() {
                // Filter tab switching
                document.querySelectorAll('.filter-tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        this.switchMainFilter(tab.dataset.filter);
                    });
                });

                // Level selector
                document.querySelectorAll('.level-button').forEach(button => {
                    button.addEventListener('click', () => {
                        this.switchLevel(parseInt(button.dataset.level));
                    });
                });

                // Search functionality
                const searchInput = document.getElementById('advancedSearch');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        this.searchQuery = e.target.value.toLowerCase();
                        this.applyFilters();
                    });
                }

                // Partnership filter
                const partnershipFilter = document.getElementById('partnershipFilter');
                if (partnershipFilter) {
                    partnershipFilter.addEventListener('change', (e) => {
                        this.partnershipFilter = e.target.value;
                        this.applyFilters();
                    });
                }

                window.addEventListener('scroll', () => this.handleScroll());
            }

            switchLevel(level) {
                this.currentLevel = level;
                this.updateLevelDisplay(level);
                this.applyFilters();
            }

            updateLevelDisplay(level) {
                document.querySelectorAll('.level-button').forEach(button => {
                    button.classList.toggle('active', parseInt(button.dataset.level) === level);
                });

                const levelData = this.levelPricing[level];
                const elements = {
                    maxCerts: document.getElementById('maxCerts'),
                    duration: document.getElementById('duration'),
                    complexity: document.getElementById('complexity'),
                    programValue: document.getElementById('programValue')
                };

                if (elements.maxCerts) elements.maxCerts.textContent = levelData.maxCerts;
                if (elements.duration) elements.duration.textContent = levelData.duration;
                if (elements.complexity) elements.complexity.textContent = levelData.intensity;
                if (elements.programValue) {
                    const totalValue = (levelData.perDimension * levelData.totalDimensions) + levelData.certification;
                    elements.programValue.textContent = '$' + totalValue.toLocaleString();
                }
            }

            switchMainFilter(filter) {
                this.currentFilter = filter;
                
                document.querySelectorAll('.filter-tab').forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.filter === filter);
                });

                const containers = {
                    category: document.getElementById('categoryFilterContainer'),
                    vendor: document.getElementById('vendorFilterContainer'),
                    domain: document.getElementById('domainFilterContainer')
                };

                if (containers.category) containers.category.style.display = filter === 'categories' ? 'block' : 'none';
                if (containers.vendor) containers.vendor.style.display = filter === 'vendors' ? 'block' : 'none';
                if (containers.domain) containers.domain.style.display = filter === 'domains' ? 'block' : 'none';

                this.applyFilters();
            }

            applyFilters() {
                const categoryCards = document.querySelectorAll('.category-card');
                let visibleCount = 0;
                
                categoryCards.forEach(card => {
                    let shouldShow = true;

                    if (this.searchQuery) {
                        const title = card.querySelector('.category-title')?.textContent.toLowerCase() || '';
                        const subtitle = card.querySelector('.category-subtitle')?.textContent.toLowerCase() || '';
                        shouldShow = title.includes(this.searchQuery) || subtitle.includes(this.searchQuery);
                    }

                    card.style.display = shouldShow ? 'block' : 'none';
                    if (shouldShow) visibleCount++;
                });

                console.log(`Filters applied: ${visibleCount} categories visible`);
            }

            handleScroll() {
                const backToTop = document.querySelector('.back-to-top');
                if (backToTop) {
                    if (window.pageYOffset > 300) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                }
            }

            clearAllFilters() {
                this.selectedCategories.clear();
                this.selectedCategories.add('all');
                this.partnershipFilter = 'all';
                this.searchQuery = '';
                
                const partnershipFilter = document.getElementById('partnershipFilter');
                const searchInput = document.getElementById('advancedSearch');
                
                if (partnershipFilter) partnershipFilter.value = 'all';
                if (searchInput) searchInput.value = '';
                
                this.applyFilters();
            }
        }