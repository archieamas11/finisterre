document.addEventListener('DOMContentLoaded', function () {
    // Advanced Search functionality
    const advancedSearchModal = document.getElementById('advancedSearchModal');
    const applySearchBtn = document.getElementById('applySearch');
    const clearFiltersBtn = document.getElementById('clearFilters');

    // Search input elements
    const nameSearchInput = document.getElementById('nameSearch');
    const blockFilterSelect = document.getElementById('graveBlockFilter');
    const graveIdInput = document.getElementById('graveIdSearch');
    const genderFilterSelect = document.getElementById('genderFilter');
    const birthDateInput = document.getElementById('birthYearFrom');

    // Apply advanced search
    applySearchBtn.addEventListener('click', function () {
        performAdvancedSearch();
    });

    // Clear all filters
    clearFiltersBtn.addEventListener('click', function () {
        clearAllFilters();
    });

    // Allow Enter key to trigger search
    [nameSearchInput, graveIdInput, birthDateInput].forEach(function (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performAdvancedSearch();
            }
        });
    });

    function performAdvancedSearch() {
        const searchCriteria = {
            name: nameSearchInput.value.toLowerCase().trim(),
            block: blockFilterSelect.value.toLowerCase().trim(),
            graveId: graveIdInput.value.toLowerCase().trim(),
            gender: genderFilterSelect.value.toLowerCase().trim(),
            birthDate: birthDateInput.value.trim()
        };

        // Count how many fields have input
        const filledFields = Object.values(searchCriteria).filter(value => value !== '').length;

        if (filledFields === 0) {
            showSearchError('Please enter at least 3 search criteria for more accurate results.');
            return;
        }

        if (filledFields < 3) {
            showSearchError(
                'Please fill at least 3 fields to perform an advanced search. This helps ensure more accurate and specific results.'
            );
            return;
        }

        const results = [];

        // Search through all grave points
        if (typeof layer_pointsfinall_3 !== 'undefined') {
            layer_pointsfinall_3.eachLayer(function (layer) {
                const props = layer.feature.properties;
                const visibility = String(props['Visibility'] || '').toLowerCase();

                // Skip private graves for regular users
                if (userType === 'user' && visibility !== 'public') {
                    return;
                }

                // Prepare search fields
                const searchFields = {
                    name: String(props['Name'] || '').toLowerCase(),
                    block: String(props['Block'] || '').toLowerCase(),
                    graveId: String(props['Grave No.'] || '').toLowerCase(),
                    death: String(props['Death'] || '').toLowerCase()
                };

                // Check if this grave matches the search criteria
                let matches = true;

                // Name search (partial match)
                if (searchCriteria.name && !searchFields.name.includes(searchCriteria.name)) {
                    matches = false;
                }

                // Block search (exact match)
                if (searchCriteria.block && searchFields.block !== searchCriteria.block) {
                    matches = false;
                }

                // Grave ID search (partial match)
                if (searchCriteria.graveId && !searchFields.graveId.includes(searchCriteria.graveId)) {
                    matches = false;
                }

                // Birth date search (year comparison)
                if (searchCriteria.birthDate) {
                    const searchYear = new Date(searchCriteria.birthDate).getFullYear();
                    const birthField = String(props['Birth'] || '');

                    if (birthField) {
                        const birthYear = new Date(birthField).getFullYear();
                        if (birthYear !== searchYear) {
                            matches = false;
                        }
                    } else {
                        matches = false;
                    }
                }

                if (matches) {
                    results.push({
                        layer: layer,
                        name: props['Name'] || 'Unnamed Grave',
                        graveId: props['Grave No.'] || 'N/A',
                        block: props['Block'] || 'N/A'
                    });
                }
            });
        }

        // Display results
        if (results.length > 0) {
            displaySearchResults(results);
        } else {
            showSearchError('0 results found. Please try different search criteria.');
        }
    }

    function displaySearchResults(results) {
        // Close the modal
        const modal = bootstrap.Modal.getInstance(advancedSearchModal);
        modal.hide();

        if (results.length === 1) {
            // Single result - navigate directly and open popup
            const result = results[0];
            const latlng = result.layer.getLatLng();

            // Center map and open popup
            map.setView(latlng, 28);
            result.layer.openPopup();

            // Show success message
            showToast({
                title: "Search Success",
                description: `Found: ${result.name} (Grave ${result.graveId}, Block ${result.block})`,
                type: "success",
            });
        } else {
            // Multiple results - show selection modal
            showMultipleResultsModal(results);
        }
    }

    function showMultipleResultsModal(results) {
        // Create and show a results selection modal
        const resultsHtml = results.map((result, index) => `
            <div class="result-item p-3 border-bottom" data-index="${index}" style="cursor: pointer;">
                <h6 class="mb-1">${htmlEscape(result.name)}</h6>
                <small class="text-muted">Grave No: ${htmlEscape(result.graveId)} | Block: ${htmlEscape(result.block)}</small>
            </div>
        `).join('');

        const modalHtml = `
            <div class="modal fade" id="searchResultsModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-search me-2"></i>Search Results (${results.length} found)
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-0" style="max-height: 400px; overflow-y: auto;">
                            ${resultsHtml}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing results modal if any
        const existingModal = document.getElementById('searchResultsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add click handlers for results
        const resultsModal = document.getElementById('searchResultsModal');
        resultsModal.querySelectorAll('.result-item').forEach(function (item) {
            item.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                const result = results[index];
                const latlng = result.layer.getLatLng();

                // Close modal
                const modal = bootstrap.Modal.getInstance(resultsModal);
                modal.hide();

                // Navigate to result
                map.setView(latlng, 28);
                result.layer.openPopup();
            });
        });

        // Show the results modal
        const resultsModal_instance = new bootstrap.Modal(resultsModal);
        resultsModal_instance.show();
    }

    function clearAllFilters() {
        nameSearchInput.value = '';
        blockFilterSelect.value = '';
        graveIdInput.value = '';
        genderFilterSelect.value = '';
        birthDateInput.value = '';
    }

    function showSearchError(message) {
        // Create error alert
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>${htmlEscape(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Insert at top of modal body
        const modalBody = advancedSearchModal.querySelector('.modal-body');
        modalBody.insertAdjacentHTML('afterbegin', alertHtml);

        // Auto-remove after 5 seconds
        setTimeout(function () {
            const alert = modalBody.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }

    function showSearchSuccess(message) {
        // Create success toast
        const toastHtml = `
            <div class="toast-container position-fixed top-0 end-0 p-3">
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <i class="bi bi-check-circle text-success me-2"></i>
                        <strong class="me-auto">Search Success</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${htmlEscape(message)}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', toastHtml);

        const toastElement = document.querySelector('.toast-container:last-child .toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Remove toast container after hiding
        toastElement.addEventListener('hidden.bs.toast', function () {
            this.closest('.toast-container').remove();
        });
    }

    function htmlEscape(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});