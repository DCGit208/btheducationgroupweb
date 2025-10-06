        // Advanced IT Filtering and UI Management System
        class ITFilterManager {
            constructor() {
                this.filters = {
                    category: '',
                    focusArea: '',
                    vendor: '',
                    partnershipTier: '',
                    level: '',
                    searchText: ''
                };
                this.activeFilters = [];
                this.filteredCertifications = [...ITSectorData.certifications];
                this.init();
            }

            init() {
                this.renderCategories();
                this.setupFilters();
                this.renderCertifications();
                this.renderCareerPathways();
                this.setupEventListeners();
                this.populateFilterOptions();
            }

            // Render category overview cards
            renderCategories() {
                const categoryGrid = document.getElementById('categoryGrid');
                const categories = ITSectorData.categories;

                categoryGrid.innerHTML = Object.keys(categories).map(key => {
                    const category = categories[key];
                    const vendorBadges = category.vendors.map((vendor, index) => {
                        const tier = category.partnershipTier[index];
                        return `<span class="vendor-badge ${tier.toLowerCase()}">${vendor} ${tier === 'Premium' ? '⭐' : ''}</span>`;
                    }).join('');

                    const focusAreaTags = category.focusAreas.map(area => 
                        `<span class="focus-area-tag" data-focus-area="${area}" data-category="${key}">${area}</span>`
                    ).join('');

                    return `
                        <div class="category-card" data-category="${key}" style="border-left: 4px solid ${category.color}">
                            <div class="category-header">
                                <i class="${category.icon}" style="color: ${category.color}"></i>
                                <h3>${category.name}</h3>
                            </div>
                            <p class="category-description">${category.description}</p>
                            <div class="focus-areas">
                                <strong>Focus Areas:</strong>
                                ${focusAreaTags}
                            </div>
                            <div class="vendors-list">
                                <strong>Vendors:</strong>
                                ${vendorBadges}
                            </div>
                            <div class="category-stats">
                                <span class="cert-count">${this.getCertificationCountByCategory(key)} certifications</span>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add click handlers for categories and focus areas
                categoryGrid.addEventListener('click', (e) => {
                    if (e.target.classList.contains('focus-area-tag')) {
                        this.selectFocusArea(e.target.dataset.focusArea, e.target.dataset.category);
                    } else if (e.target.closest('.category-card')) {
                        this.selectCategory(e.target.closest('.category-card').dataset.category);
                    }
                });
            }

            // Populate filter dropdown options
            populateFilterOptions() {
                // Category filter
                const categoryFilter = document.getElementById('categoryFilter');
                Object.keys(ITSectorData.categories).forEach(key => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = ITSectorData.categories[key].name;
                    categoryFilter.appendChild(option);
                });

                // Vendor filter
                const vendorFilter = document.getElementById('vendorFilter');
                const allVendors = new Set();
                Object.values(ITSectorData.categories).forEach(category => {
                    category.vendors.forEach(vendor => allVendors.add(vendor));
                });
                [...allVendors].sort().forEach(vendor => {
                    const option = document.createElement('option');
                    option.value = vendor;
                    option.textContent = vendor;
                    vendorFilter.appendChild(option);
                });
            }

            // Update focus area options based on selected category
            updateFocusAreaOptions(categoryKey) {
                const focusAreaFilter = document.getElementById('focusAreaFilter');
                focusAreaFilter.innerHTML = '<option value="">All Focus Areas</option>';
                
                if (categoryKey && ITSectorData.categories[categoryKey]) {
                    ITSectorData.categories[categoryKey].focusAreas.forEach(area => {
                        const option = document.createElement('option');
                        option.value = area;
                        option.textContent = area;
                        focusAreaFilter.appendChild(option);
                    });
                }
            }

            // Setup filter event listeners
            setupFilters() {
                const categoryFilter = document.getElementById('categoryFilter');
                const focusAreaFilter = document.getElementById('focusAreaFilter');
                const vendorFilter = document.getElementById('vendorFilter');
                const partnershipFilter = document.getElementById('partnershipFilter');
                const levelFilter = document.getElementById('levelFilter');
                const searchInput = document.getElementById('searchInput');
                const clearFilters = document.getElementById('clearFilters');
                const applyFilters = document.getElementById('applyFilters');

                // Category change updates focus areas
                categoryFilter.addEventListener('change', (e) => {
                    this.filters.category = e.target.value;
                    this.updateFocusAreaOptions(e.target.value);
                    this.filters.focusArea = ''; // Reset focus area when category changes
                    focusAreaFilter.value = '';
                });

                // Filter change handlers
                [categoryFilter, focusAreaFilter, vendorFilter, partnershipFilter, levelFilter].forEach(filter => {
                    filter.addEventListener('change', (e) => {
                        const filterType = e.target.id.replace('Filter', '');
                        this.filters[filterType === 'category' ? 'category' : 
                                   filterType === 'focusArea' ? 'focusArea' :
                                   filterType === 'vendor' ? 'vendor' :
                                   filterType === 'partnership' ? 'partnershipTier' : 'level'] = e.target.value;
                        this.applyFilters();
                    });
                });

                // Real-time search
                searchInput.addEventListener('input', (e) => {
                    this.filters.searchText = e.target.value;
                    this.applyFilters();
                });

                // Clear filters
                clearFilters.addEventListener('click', () => {
                    this.clearAllFilters();
                });

                applyFilters.addEventListener('click', () => {
                    this.applyFilters();
                });
            }

            // Apply comprehensive filtering
            applyFilters() {
                let results = [...ITSectorData.certifications];

                // Category filter
                if (this.filters.category) {
                    results = results.filter(cert => cert.category === this.filters.category);
                }

                // Focus area filter
                if (this.filters.focusArea) {
                    results = results.filter(cert => 
                        cert.focusAreas && cert.focusAreas.includes(this.filters.focusArea)
                    );
                }

                // Vendor filter
                if (this.filters.vendor) {
                    results = results.filter(cert => cert.vendor === this.filters.vendor);
                }

                // Partnership tier filter
                if (this.filters.partnershipTier) {
                    results = results.filter(cert => {
                        const category = ITSectorData.categories[cert.category];
                        if (!category) return false;
                        const vendorIndex = category.vendors.indexOf(cert.vendor);
                        return category.partnershipTier[vendorIndex] === this.filters.partnershipTier;
                    });
                }

                // Level filter
                if (this.filters.level) {
                    const levelNum = parseInt(this.filters.level);
                    const levelData = ITSectorData.levelProgression[levelNum];
                    
                    results = results.filter(cert => {
                        // Check if category is allowed for this level
                        if (levelData.categories !== 'all' && !levelData.categories.includes(cert.category)) {
                            return false;
                        }
                        
                        // Check if focus areas are allowed
                        if (levelData.focusAreas !== 'all' && cert.focusAreas) {
                            return cert.focusAreas.some(area => levelData.focusAreas.includes(area));
                        }
                        
                        return true;
                    });
                }

                // Search filter
                if (this.filters.searchText) {
                    const searchLower = this.filters.searchText.toLowerCase();
                    results = results.filter(cert => 
                        cert.name.toLowerCase().includes(searchLower) ||
                        cert.vendor.toLowerCase().includes(searchLower) ||
                        (cert.description && cert.description.toLowerCase().includes(searchLower)) ||
                        (cert.focusAreas && cert.focusAreas.some(area => area.toLowerCase().includes(searchLower)))
                    );
                }

                // Prioritize results
                results = this.prioritizeResults(results);

                this.filteredCertifications = results;
                this.renderCertifications();
                this.updateResultsCount();
            }

            // Prioritize search results
            prioritizeResults(results) {
                return results.sort((a, b) => {
                    // 1. Partnership tier priority (Premium first)
                    const aTier = this.getPartnershipTier(a);
                    const bTier = this.getPartnershipTier(b);
                    if (aTier !== bTier) {
                        return aTier === 'Premium' ? -1 : 1;
                    }

                    // 2. Focus area match priority
                    if (this.filters.focusArea) {
                        const aMatch = a.focusAreas && a.focusAreas.includes(this.filters.focusArea);
                        const bMatch = b.focusAreas && b.focusAreas.includes(this.filters.focusArea);
                        if (aMatch !== bMatch) {
                            return aMatch ? -1 : 1;
                        }
                    }

                    // 3. Level appropriateness
                    if (this.filters.level) {
                        const levelNum = parseInt(this.filters.level);
                        const levelDiff = Math.abs(a.level - levelNum) - Math.abs(b.level - levelNum);
                        if (levelDiff !== 0) return levelDiff;
                    }

                    // 4. Alphabetical by name
                    return a.name.localeCompare(b.name);
                });
            }

            // Get partnership tier for certification
            getPartnershipTier(cert) {
                const category = ITSectorData.categories[cert.category];
                if (!category) return 'Standard';
                const vendorIndex = category.vendors.indexOf(cert.vendor);
                return category.partnershipTier[vendorIndex] || 'Standard';
            }

            // Render certification results
            renderCertifications() {
                const certificationGrid = document.getElementById('certificationGrid');
                
                if (this.filteredCertifications.length === 0) {
                    certificationGrid.innerHTML = `
                        <div class="no-results">
                            <i class="fas fa-search" style="font-size: 48px; color: #94a3b8; margin-bottom: 16px;"></i>
                            <h3>No certifications found</h3>
                            <p>Try adjusting your filters or search terms</p>
                            <button onclick="filterManager.clearAllFilters()" class="btn-primary">Clear Filters</button>
                        </div>
                    `;
                    return;
                }

                certificationGrid.innerHTML = this.filteredCertifications.map(cert => {
                    const tier = this.getPartnershipTier(cert);
                    const category = ITSectorData.categories[cert.category];
                    
                    return `
                        <div class="cert-card" data-cert-id="${cert.id}" style="border-left-color: ${category?.color || '#667eea'}">
                            <div class="cert-header">
                                <div class="cert-title">
                                    <h4>${cert.name}</h4>
                                    <span class="vendor-badge ${tier.toLowerCase()}">${cert.vendor} ${tier === 'Premium' ? '⭐' : ''}</span>
                                </div>
                                <span class="level-indicator level-${cert.level}">Level ${cert.level}</span>
                            </div>
                            <p class="cert-description">${cert.description}</p>
                            <div class="cert-details">
                                <div class="detail-item">
                                    <i class="fas fa-clock"></i>
                                    <span>${cert.duration}</span>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-dollar-sign"></i>
                                    <span>$${cert.price}</span>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-tag"></i>
                                    <span>${category?.name || cert.category}</span>
                                </div>
                            </div>
                            ${cert.focusAreas ? `
                                <div class="cert-focus-areas">
                                    ${cert.focusAreas.map(area => `<span class="focus-area-tag">${area}</span>`).join('')}
                                </div>
                            ` : ''}
                            <div class="cert-actions">
                                <button class="btn-primary add-to-hexad" data-cert-id="${cert.id}">Add to HEXAD</button>
                                <button class="btn-secondary standalone-purchase" data-cert-id="${cert.id}">Buy Standalone</button>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add event listeners for certification actions
                this.setupCertificationActions();
            }

            // Setup certification action handlers
            setupCertificationActions() {
                const addToHexadButtons = document.querySelectorAll('.add-to-hexad');
                const standaloneButtons = document.querySelectorAll('.standalone-purchase');

                addToHexadButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        const certId = e.target.dataset.certId;
                        this.addToHEXAD(certId);
                    });
                });

                standaloneButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        const certId = e.target.dataset.certId;
                        this.purchaseStandalone(certId);
                    });
                });
            }

            // Add certification to HEXAD Professional Development
            addToHEXAD(certId) {
                const cert = ITSectorData.certifications.find(c => c.id === certId);
                if (!cert) return;

                // Validate with fact checker
                const vendorCheck = ITFactChecker.validateVendor(cert.vendor);
                if (!vendorCheck.official) {
                    ITFactChecker.logValidationError(`Invalid vendor for HEXAD integration: ${cert.vendor}`);
                    return;
                }

                const selectedCerts = BTHSessionManager.addCertification(cert);
                
                // Show confirmation
                this.showNotification(`${cert.name} added to HEXAD Professional Development (${selectedCerts.length} total)`);
                
                // Update button state
                const button = document.querySelector(`[data-cert-id="${certId}"].add-to-hexad`);
                if (button) {
                    button.textContent = 'Added ✓';
                    button.classList.add('added');
                    button.disabled = true;
                }
            }

            // Purchase standalone certification
            purchaseStandalone(certId) {
                const cert = ITSectorData.certifications.find(c => c.id === certId);
                if (!cert) return;

                // Set standalone purchase context
                BTHSessionManager.setSession('standalone_purchase', {
                    certification: cert,
                    timestamp: Date.now(),
                    source: 'technology_sector'
                });

                // Redirect to checkout
                window.location.href = `../hexad-checkout-system.html?mode=standalone&cert=${certId}`;
            }

            // Render career pathways
            renderCareerPathways() {
                const careerPathways = document.getElementById('careerPathways');
                const pathways = ITSectorData.careerPathways;

                careerPathways.innerHTML = Object.keys(pathways).map(key => {
                    const pathway = pathways[key];
                    
                    const progressionSteps = pathway.progression.map((step, index) => `
                        <div class="pathway-step">
                            <div class="step-header">
                                <span class="level-indicator level-${step.level}">Level ${step.level}</span>
                                <span class="step-duration">${step.duration}</span>
                            </div>
                            <div class="step-content">
                                <div class="step-certs">${step.certs.join(', ')}</div>
                                <div class="step-salary">${step.salary}</div>
                            </div>
                        </div>
                    `).join('');

                    return `
                        <div class="career-pathway" style="background: linear-gradient(135deg, ${pathway.color}20, ${pathway.color}40)">
                            <div class="pathway-header">
                                <i class="${pathway.icon}" style="color: ${pathway.color}"></i>
                                <h3>${pathway.name}</h3>
                            </div>
                            <div class="pathway-steps">
                                ${progressionSteps}
                            </div>
                            <div class="pathway-actions">
                                <button class="btn-primary start-pathway" data-pathway="${key}">Start This Pathway</button>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add pathway event listeners
                document.querySelectorAll('.start-pathway').forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.startCareerPathway(e.target.dataset.pathway);
                    });
                });
            }

            // Helper methods
            getCertificationCountByCategory(categoryKey) {
                return ITSectorData.certifications.filter(cert => cert.category === categoryKey).length;
            }

            updateResultsCount() {
                const resultsCount = document.getElementById('resultsCount');
                const resultsTitle = document.getElementById('resultsTitle');
                
                resultsCount.textContent = `${this.filteredCertifications.length} certifications found`;
                
                if (this.hasActiveFilters()) {
                    resultsTitle.textContent = 'Filtered IT Certifications';
                } else {
                    resultsTitle.textContent = 'All IT Certifications';
                }
            }

            hasActiveFilters() {
                return Object.values(this.filters).some(value => value !== '');
            }

            selectCategory(categoryKey) {
                document.getElementById('categoryFilter').value = categoryKey;
                this.filters.category = categoryKey;
                this.updateFocusAreaOptions(categoryKey);
                this.applyFilters();
            }

            selectFocusArea(focusArea, categoryKey) {
                this.selectCategory(categoryKey);
                document.getElementById('focusAreaFilter').value = focusArea;
                this.filters.focusArea = focusArea;
                this.applyFilters();
            }

            clearAllFilters() {
                this.filters = {
                    category: '',
                    focusArea: '',
                    vendor: '',
                    partnershipTier: '',
                    level: '',
                    searchText: ''
                };

                // Reset form elements
                document.getElementById('categoryFilter').value = '';
                document.getElementById('focusAreaFilter').value = '';
                document.getElementById('vendorFilter').value = '';
                document.getElementById('partnershipFilter').value = '';
                document.getElementById('levelFilter').value = '';
                document.getElementById('searchInput').value = '';

                this.updateFocusAreaOptions('');
                this.applyFilters();
            }

            startCareerPathway(pathwayKey) {
                const pathway = ITSectorData.careerPathways[pathwayKey];
                if (!pathway) return;

                BTHSessionManager.setSession('selected_pathway', {
                    pathway: pathwayKey,
                    pathwayData: pathway,
                    timestamp: Date.now()
                });

                // Redirect to HEXAD with pathway context
                window.location.href = `../hexad-mastery.html?pathway=${pathwayKey}&sector=technology`;
            }

            showNotification(message) {
                // Create notification element
                const notification = document.createElement('div');
                notification.className = 'notification success';
                notification.textContent = message;
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                `;

                document.body.appendChild(notification);

                // Animate in
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);

                // Remove after 3 seconds
                setTimeout(() => {
                    notification.style.transform = 'translateX(400px)';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);
            }

            setupEventListeners() {
                // Mobile menu toggle
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('nav-menu');

                if (hamburger && navMenu) {
                    hamburger.addEventListener('click', () => {
                        navMenu.classList.toggle('active');
                        hamburger.classList.toggle('active');
                    });
                }

                // Focus area color updates
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('focus-area-tag')) {
                        const focusArea = e.target.dataset.focusArea || e.target.textContent;
                        this.updateFocusAreaStyling(focusArea);
                    }
                });
            }

            updateFocusAreaStyling(focusArea) {
                const focusAreaColors = {
                    'Network Infrastructure': '#2563eb',
                    'Cloud Architecture': '#7c3aed',
                    'Security Operations': '#dc2626',
                    'Data Pipeline Engineering': '#059669',
                    'CI/CD Pipelines': '#f59e0b',
                    'Machine Learning Engineering': '#8b5cf6',
                    'System Administration': '#0891b2'
                };

                const color = focusAreaColors[focusArea] || '#667eea';
                document.documentElement.style.setProperty('--focus-primary-color', color);
            }
        }

        // Initialize the filter manager when DOM is loaded
        let filterManager;
        document.addEventListener('DOMContentLoaded', () => {
            filterManager = new ITFilterManager();
        });