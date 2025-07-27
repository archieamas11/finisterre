// Map Filter Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mapFilterModal = document.getElementById('mapFilterModal');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const selectAllBlocksCheckbox = document.getElementById('selectAllBlocks');
    const blockCheckboxes = document.querySelectorAll('.block-checkbox');
    const statusCheckboxes = document.querySelectorAll('.status-checkbox input[type="checkbox"]');
    const filterResultCount = document.getElementById('filterResultCount');

    // Current filter state
    let currentFilters = {
        statuses: ['vacant', 'reserved', 'occupied1'],
        blocks: [],
        yearFrom: null,
        yearTo: null,
        privacy: 'all',
        searchRadius: 'all'
    };

    // Initialize block filters
    function initializeBlockFilters() {
        currentFilters.blocks = Array.from(blockCheckboxes).map(cb => cb.value);
    }

    // Handle select all blocks
    if (selectAllBlocksCheckbox) {
        selectAllBlocksCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            blockCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateBlockFilters();
        });
    }

    // Handle individual block checkboxes
    blockCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateBlockFilters();
            updateSelectAllState();
        });
    });

    // Update block filters array
    function updateBlockFilters() {
        currentFilters.blocks = Array.from(blockCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    }

    // Update select all checkbox state
    function updateSelectAllState() {
        const checkedBlocks = Array.from(blockCheckboxes).filter(cb => cb.checked);
        const allBlocks = Array.from(blockCheckboxes);

        if (selectAllBlocksCheckbox) {
            selectAllBlocksCheckbox.checked = checkedBlocks.length === allBlocks.length;
            selectAllBlocksCheckbox.indeterminate = checkedBlocks.length > 0 && checkedBlocks.length < allBlocks
                .length;
        }
    }

    // Handle status checkboxes
    statusCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateStatusFilters();
        });
    });

    // Update status filters array
    function updateStatusFilters() {
        currentFilters.statuses = Array.from(statusCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    }

    // Apply filters function
    function applyMapFilters() {
        // Show loading state
        const applyBtn = document.getElementById('applyFilters');
        const originalText = applyBtn.innerHTML;
        applyBtn.classList.add('btn-loading');
        applyBtn.disabled = true;

        // Get additional filter values
        currentFilters.yearFrom = document.getElementById('yearFrom')?.value || null;
        currentFilters.yearTo = document.getElementById('yearTo')?.value || null;
        currentFilters.privacy = document.getElementById('privacyFilter')?.value || 'all';
        currentFilters.searchRadius = document.getElementById('searchRadius')?.value || 'all';

        // Simulate processing time for better UX
        setTimeout(() => {
            try {
                // Call the filter function that interfaces with the map
                if (typeof applyStatusFilter === 'function') {
                    // Use the existing filter function from user_cemetery_map.php
                    applyStatusFilter(currentFilters.statuses);
                } else if (typeof layer_pointsfinall_3 !== 'undefined') {
                    // Direct implementation if the function doesn't exist
                    applyMapFiltersDirectly();
                }

                // Update result count
                updateFilterResultCount();

                // Update filter button state
                updateFilterButtonState();

                // Show success message
                showFilterAppliedMessage();
            } catch (error) {
                console.error('Error applying filters:', error);
                // Show error message to user
                showErrorMessage('Failed to apply filters. Please try again.');
            } finally {
                // Always remove loading state and close modal
                applyBtn.classList.remove('btn-loading');
                applyBtn.disabled = false;
                applyBtn.innerHTML = originalText;

                // Properly close modal with backup cleanup
                closeModalWithCleanup(mapFilterModal);
            }
        }, 500);
    }

    // Direct filter implementation
    function applyMapFiltersDirectly() {
        if (typeof layer_pointsfinall_3 === 'undefined' || typeof json_pointsfinall_3 === 'undefined') {
            console.warn('Map layers not available for filtering');
            return;
        }

        // Clear current layer
        layer_pointsfinall_3.clearLayers();

        // Filter features based on current filters
        const filteredFeatures = json_pointsfinall_3.features.filter(function(feature) {
            const graveStatus = feature.properties.Status;
            const graveBlock = feature.properties.Block;
            const visibility = feature.properties.Visibility;
            const deathYear = feature.properties.DeathYear;

            // Privacy filter
            if (currentFilters.privacy === 'public' && visibility === 'private') return false;
            if (currentFilters.privacy === 'private' && visibility !== 'private') return false;

            // Status filter
            if (currentFilters.statuses.length > 0 && !currentFilters.statuses.includes(graveStatus))
                return false;

            // Block filter
            if (currentFilters.blocks.length > 0 && !currentFilters.blocks.includes(graveBlock))
            return false;

            // Year range filter
            if (currentFilters.yearFrom && deathYear && parseInt(deathYear) < parseInt(currentFilters
                    .yearFrom)) return false;
            if (currentFilters.yearTo && deathYear && parseInt(deathYear) > parseInt(currentFilters
                    .yearTo)) return false;

            return true;
        });

        // Create filtered GeoJSON
        const filteredGeoJSON = {
            type: "FeatureCollection",
            features: filteredFeatures
        };

        // Add filtered data back to layer
        layer_pointsfinall_3.addData(filteredGeoJSON);
    }

    // Reset all filters
    function resetAllFilters() {
        // Reset status checkboxes
        statusCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });

        // Reset block checkboxes
        blockCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });

        if (selectAllBlocksCheckbox) {
            selectAllBlocksCheckbox.checked = true;
        }

        // Reset additional filters
        document.getElementById('yearFrom').value = '';
        document.getElementById('yearTo').value = '';
        document.getElementById('privacyFilter').value = 'all';
        document.getElementById('searchRadius').value = 'all';

        // Update filter state
        currentFilters = {
            statuses: ['vacant', 'reserved', 'occupied1'],
            blocks: Array.from(blockCheckboxes).map(cb => cb.value),
            yearFrom: null,
            yearTo: null,
            privacy: 'all',
            searchRadius: 'all'
        };
    }

    // Update filter result count
    function updateFilterResultCount() {
        let count = 0;
        if (typeof json_pointsfinall_3 !== 'undefined') {
            const filteredFeatures = json_pointsfinall_3.features.filter(function(feature) {
                const graveStatus = feature.properties.Status;
                const graveBlock = feature.properties.Block;
                const visibility = feature.properties.Visibility;
                const deathYear = feature.properties.DeathYear;

                if (currentFilters.privacy === 'public' && visibility === 'private') return false;
                if (currentFilters.privacy === 'private' && visibility !== 'private') return false;
                if (currentFilters.statuses.length > 0 && !currentFilters.statuses.includes(
                    graveStatus)) return false;
                if (currentFilters.blocks.length > 0 && !currentFilters.blocks.includes(graveBlock))
                    return false;
                if (currentFilters.yearFrom && deathYear && parseInt(deathYear) < parseInt(
                        currentFilters.yearFrom)) return false;
                if (currentFilters.yearTo && deathYear && parseInt(deathYear) > parseInt(currentFilters
                        .yearTo)) return false;

                return true;
            });
            count = filteredFeatures.length;
        }

        if (filterResultCount) {
            filterResultCount.textContent = `Showing ${count} graves`;
        }
    }

    // Show filter applied message
    function showFilterAppliedMessage() {
        // Create toast notification if available, or simple alert
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const toastHtml = `
                <div class="toast position-fixed top-0 end-0 m-3" role="alert" style="z-index: 9999;">
                    <div class="toast-header bg-success text-white">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        <strong class="me-auto">Filters Applied</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        Map filters have been successfully applied.
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', toastHtml);
            const toastElement = document.querySelector('.toast:last-child');
            const toast = new bootstrap.Toast(toastElement, {
                delay: 3000
            });
            toast.show();

            // Remove toast after it's hidden
            toastElement.addEventListener('hidden.bs.toast', function() {
                toastElement.remove();
            });
        }
    }

    // Update filter button state to show if filters are active
    function updateFilterButtonState() {
        const filterBtn = document.querySelector('button[onclick="filterMap()"]');
        if (!filterBtn) return;

        const hasActiveFilters =
            currentFilters.statuses.length < 3 || // Not all statuses selected
            currentFilters.blocks.length < Array.from(blockCheckboxes).length || // Not all blocks selected
            currentFilters.yearFrom ||
            currentFilters.yearTo ||
            currentFilters.privacy !== 'all' ||
            currentFilters.searchRadius !== 'all';

        if (hasActiveFilters) {
            filterBtn.classList.add('btn-filter-active');
            filterBtn.title = 'Filters are active - click to modify';
        } else {
            filterBtn.classList.remove('btn-filter-active');
            filterBtn.title = 'Filter the map';
        }
    }

    // Check if filters are different from default
    function hasFiltersChanged() {
        const defaultStatuses = ['vacant', 'reserved', 'occupied1'];
        const allBlocks = Array.from(blockCheckboxes).map(cb => cb.value);

        return (
            JSON.stringify(currentFilters.statuses.sort()) !== JSON.stringify(defaultStatuses.sort()) ||
            JSON.stringify(currentFilters.blocks.sort()) !== JSON.stringify(allBlocks.sort()) ||
            currentFilters.yearFrom ||
            currentFilters.yearTo ||
            currentFilters.privacy !== 'all' ||
            currentFilters.searchRadius !== 'all'
        );
    }

    // Modal cleanup function to handle backdrop issues
    function closeModalWithCleanup(modalElement) {
        try {
            // Get the modal instance
            const modalInstance = bootstrap.Modal.getInstance(modalElement);

            if (modalInstance) {
                // Hide the modal properly
                modalInstance.hide();

                // Set up a one-time event listener for when the modal is completely hidden
                modalElement.addEventListener('hidden.bs.modal', function handleModalHidden() {
                    // Remove this event listener after it's executed
                    modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);

                    // Force cleanup of any remaining backdrop elements
                    cleanupModalBackdrops();
                }, {
                    once: true
                });

                // Backup cleanup in case the event doesn't fire
                setTimeout(() => {
                    cleanupModalBackdrops();
                }, 300);
            } else {
                // If no modal instance, force cleanup immediately
                cleanupModalBackdrops();
            }
        } catch (error) {
            console.warn('Error closing modal:', error);
            // Force cleanup as fallback
            cleanupModalBackdrops();
        }
    }

    // Force cleanup of modal backdrops
    function cleanupModalBackdrops() {
        // Remove any lingering modal backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
            backdrop.remove();
        });

        // Remove modal-open class from body
        document.body.classList.remove('modal-open');

        // Reset body padding and overflow
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';

        // Reset any inline styles that might have been added
        document.documentElement.style.paddingRight = '';
    }

    // Error message function
    function showErrorMessage(message) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const toastHtml = `
                <div class="toast position-fixed top-0 end-0 m-3" role="alert" style="z-index: 9999;">
                    <div class="toast-header bg-danger text-white">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <strong class="me-auto">Error</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', toastHtml);
            const toastElement = document.querySelector('.toast:last-child');
            const toast = new bootstrap.Toast(toastElement, {
                delay: 5000
            });
            toast.show();

            // Remove toast after it's hidden
            toastElement.addEventListener('hidden.bs.toast', function() {
                toastElement.remove();
            });
        } else {
            // Fallback to alert if Bootstrap Toast is not available
            alert(message);
        }
    }

    // Event listeners
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyMapFilters);
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetAllFilters();
            updateFilterResultCount();
        });
    }

    // Initialize
    initializeBlockFilters();
    updateFilterResultCount();
});

// Global filterMap function that opens the modal
function filterMap() {
    const modal = new bootstrap.Modal(document.getElementById('mapFilterModal'));
    modal.show();
}