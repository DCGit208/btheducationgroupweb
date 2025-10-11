/**
 * CompTIA Bundle Evaluation System
 * Evaluates certification progress against CompTIA bundle paths
 */

class CompTIABundleEvaluator {
    constructor() {
        this.bundles = [];
        this.certifications = [];
        this.userCertifications = new Set();
        this.loadBundles();
    }

    /**
     * Load CompTIA bundles data
     */
    async loadBundles() {
        try {
            const response = await fetch('assets/data/comptia-bundles.json');
            this.bundles = await response.json();
        } catch (error) {
            console.error('Error loading CompTIA bundles:', error);
        }
    }

    /**
     * Load certifications data for cross-reference
     */
    async loadCertifications() {
        try {
            const response = await fetch('assets/data/certifications.json');
            this.certifications = await response.json();
        } catch (error) {
            console.error('Error loading certifications:', error);
        }
    }

    /**
     * Set user's current certifications
     * @param {Array} userCerts - Array of certification IDs the user has completed
     */
    setUserCertifications(userCerts) {
        this.userCertifications = new Set(userCerts);
    }

    /**
     * Evaluate user progress against a specific bundle
     * @param {string} bundleId - Bundle ID to evaluate
     * @returns {Object} Evaluation results
     */
    evaluateBundle(bundleId) {
        const bundle = this.bundles.find(b => b.bundle_id === bundleId);
        if (!bundle) {
            return { error: 'Bundle not found' };
        }

        const totalCerts = bundle.certifications.length;
        const completedCerts = bundle.certifications.filter(cert => 
            this.userCertifications.has(cert.certification_id)
        );
        const completedCount = completedCerts.length;
        const progressPercentage = Math.round((completedCount / totalCerts) * 100);

        const nextCertification = bundle.certifications.find(cert => 
            !this.userCertifications.has(cert.certification_id)
        );

        const prerequisites = this.checkPrerequisites(bundle);
        const canStart = prerequisites.canStart;
        const missingPrereqs = prerequisites.missing;

        return {
            bundle_id: bundleId,
            bundle_name: bundle.name,
            level: bundle.level,
            focus_area: bundle.focus_area,
            total_certifications: totalCerts,
            completed_certifications: completedCount,
            progress_percentage: progressPercentage,
            is_complete: completedCount === totalCerts,
            can_start: canStart,
            missing_prerequisites: missingPrereqs,
            next_certification: nextCertification,
            completed_certs: completedCerts,
            remaining_certs: bundle.certifications.filter(cert => 
                !this.userCertifications.has(cert.certification_id)
            ),
            estimated_time_remaining: this.calculateRemainingTime(bundle, completedCount),
            career_outcomes: bundle.career_outcomes,
            specialization_options: bundle.specialization_options || []
        };
    }

    /**
     * Check if user meets prerequisites for a bundle
     * @param {Object} bundle - Bundle to check prerequisites for
     * @returns {Object} Prerequisites status
     */
    checkPrerequisites(bundle) {
        if (!bundle.prerequisites || bundle.prerequisites.length === 0) {
            return { canStart: true, missing: [] };
        }

        const missing = [];
        let canStart = true;

        for (const prereqBundleId of bundle.prerequisites) {
            const prereqEvaluation = this.evaluateBundle(prereqBundleId);
            if (!prereqEvaluation.is_complete) {
                canStart = false;
                missing.push({
                    bundle_id: prereqBundleId,
                    bundle_name: prereqEvaluation.bundle_name,
                    progress: prereqEvaluation.progress_percentage
                });
            }
        }

        return { canStart, missing };
    }

    /**
     * Calculate estimated time remaining for bundle completion
     * @param {Object} bundle - Bundle object
     * @param {number} completedCount - Number of completed certifications
     * @returns {number} Estimated months remaining
     */
    calculateRemainingTime(bundle, completedCount) {
        const totalTime = bundle.estimated_time_months || 12;
        const remainingCerts = bundle.total_certifications - completedCount;
        const timePerCert = totalTime / bundle.total_certifications;
        return Math.ceil(remainingCerts * timePerCert);
    }

    /**
     * Get all available bundles for a specific level
     * @param {number} level - Level to filter by
     * @returns {Array} Array of bundles at the specified level
     */
    getBundlesByLevel(level) {
        return this.bundles.filter(bundle => bundle.level === level);
    }

    /**
     * Get recommended next bundle based on current progress
     * @returns {Object} Recommended bundle and reasoning
     */
    getRecommendedPath() {
        const evaluations = this.bundles.map(bundle => this.evaluateBundle(bundle.bundle_id));
        
        // Find highest completed level
        const completedBundles = evaluations.filter(evaluation => evaluation.is_complete);
        const highestCompletedLevel = completedBundles.reduce((max, bundle) => 
            Math.max(max, bundle.level), 0);

        // Find bundles in progress
        const inProgressBundles = evaluations.filter(evaluation => 
            evaluation.progress_percentage > 0 && !evaluation.is_complete);

        // If bundles in progress, recommend continuing
        if (inProgressBundles.length > 0) {
            const mostProgress = inProgressBundles.reduce((best, current) =>
                current.progress_percentage > best.progress_percentage ? current : best
            );
            return {
                type: 'continue',
                bundle: mostProgress,
                reason: `Continue your progress on ${mostProgress.bundle_name} (${mostProgress.progress_percentage}% complete)`
            };
        }

        // Recommend next level bundles
        const nextLevel = highestCompletedLevel + 1;
        const nextLevelBundles = this.getBundlesByLevel(nextLevel)
            .map(bundle => this.evaluateBundle(bundle.bundle_id))
            .filter(evaluation => evaluation.can_start);

        if (nextLevelBundles.length === 0) {
            return {
                type: 'complete',
                reason: 'You have completed all available CompTIA certification bundles!'
            };
        }

        if (nextLevelBundles.length === 1) {
            return {
                type: 'next_level',
                bundle: nextLevelBundles[0],
                reason: `Ready for Level ${nextLevel}: ${nextLevelBundles[0].bundle_name}`
            };
        }

        // Multiple options at next level - let user choose focus area
        return {
            type: 'choose_focus',
            level: nextLevel,
            options: nextLevelBundles,
            reason: `Choose your Level ${nextLevel} focus area`
        };
    }

    /**
     * Generate a complete learning path report
     * @returns {Object} Complete evaluation report
     */
    generateProgressReport() {
        const allEvaluations = this.bundles.map(bundle => this.evaluateBundle(bundle.bundle_id));
        const recommendation = this.getRecommendedPath();
        
        const summary = {
            total_bundles: this.bundles.length,
            completed_bundles: allEvaluations.filter(evaluation => evaluation.is_complete).length,
            in_progress_bundles: allEvaluations.filter(evaluation => 
                evaluation.progress_percentage > 0 && !evaluation.is_complete).length,
            available_bundles: allEvaluations.filter(evaluation => 
                evaluation.can_start && evaluation.progress_percentage === 0).length
        };

        return {
            summary,
            recommendation,
            bundle_evaluations: allEvaluations,
            learning_paths: {
                cybersecurity: allEvaluations.filter(evaluation => evaluation.focus_area === 'cybersecurity'),
                infrastructure: allEvaluations.filter(evaluation => evaluation.focus_area === 'infrastructure'),
                foundation: allEvaluations.filter(evaluation => !evaluation.focus_area)
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompTIABundleEvaluator;
}

// Global instance for browser use
if (typeof window !== 'undefined') {
    window.CompTIABundleEvaluator = CompTIABundleEvaluator;
}