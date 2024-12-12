document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const searchInput = document.getElementById('search');
    const typeFilter = document.getElementById('type-filter');
    const categoryFilter = document.getElementById('category-filter');
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const amountFrom = document.getElementById('amount-from');
    const amountTo = document.getElementById('amount-to');
    const resetFilters = document.getElementById('reset-filters');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const saveFilterBtn = document.getElementById('save-filter');
    const savedFilterSelect = document.getElementById('saved-filter-select');
    const filterStatus = document.querySelector('.filter-status');
    const activeFilters = document.querySelector('.active-filters');
    const sortField = document.getElementById('sort-field');
    const sortDirection = document.getElementById('sort-direction');
    
    let isAscending = false;
    const savedFilters = new Map();

    // Initialize MultiSelect for categories
    if (categoryFilter) {
        categoryFilter.style.height = 'auto';
        categoryFilter.multiple = true;
    }

    // Helper function to convert DD-MM-YYYY to YYYY-MM-DD
    function convertDateFormat(dateStr) {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
    }

    // Helper function to parse date considering both formats
    function parseDate(dateStr) {
        if (!dateStr) return null;
        // Check if date is in DD-MM-YYYY format
        if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const [day, month, year] = dateStr.split('-');
            return new Date(year, month - 1, day);
        }
        // If it's in YYYY-MM-DD format (from input field)
        return new Date(dateStr);
    }

    // Update the date range matching function
    function matchesDateRange(rowDate, fromDate, toDate) {
        if (!fromDate && !toDate) return true;
        
        const date = parseDate(rowDate);
        if (!date) return true; // Skip invalid dates
        
        const from = fromDate ? parseDate(fromDate) : null;
        const to = toDate ? parseDate(toDate) : null;

        if (from && date < from) return false;
        if (to && date > to) return false;
        
        return true;
    }

    // Apply filters function
    function applyAllFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedCategories = Array.from(categoryFilter.selectedOptions)
            .map(opt => opt.value)
            .filter(val => val !== '');
        const dateFromVal = dateFrom.value;
        const dateToVal = dateTo.value;
        const amountFromVal = amountFrom.value;
        const amountToVal = amountTo.value;

        console.log('Applying filters:', {
            searchTerm,
            selectedType,
            selectedCategories,
            dateFromVal,
            dateToVal,
            amountFromVal,
            amountToVal
        });

        const tbody = document.querySelector('tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        let filteredCount = 0;

        rows.forEach((row, index) => {
            const cells = row.getElementsByTagName('td');
            if (cells.length === 0) return;

            const rowDate = cells[1].textContent.trim();
            const rowType = cells[2].textContent.trim();
            const rowAmount = parseFloat(cells[3].textContent.replace(/[^0-9.-]+/g, ''));
            const rowCategory = cells[5].textContent.trim();
            const rowText = Array.from(cells)
                .map(cell => cell.textContent.toLowerCase())
                .join(' ');

            // Check all conditions
            const matchesSearch = !searchTerm || rowText.includes(searchTerm);
            const matchesType = !selectedType || rowType === selectedType;
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(rowCategory);
            const dateMatches = checkDateRange(rowDate, dateFromVal, dateToVal);
            const matchesAmountRange = (!amountFromVal || rowAmount >= parseFloat(amountFromVal)) &&
                                      (!amountToVal || rowAmount <= parseFloat(amountToVal));

            const shouldShow = matchesSearch && matchesType && matchesCategory && 
                              dateMatches && matchesAmountRange;

            if (index === 0) {
                console.log('First row matches:', {
                    rowDate,
                    matchesSearch,
                    matchesType,
                    matchesCategory,
                    dateMatches,
                    matchesAmountRange,
                    shouldShow
                });
            }

            row.style.display = shouldShow ? '' : 'none';
            if (shouldShow) filteredCount++;
        });

        console.log(`Filtered count: ${filteredCount}`);
        updateFilterStatus(filteredCount);
        updateFilterTags();
    }

    // Helper function to check date range
    function checkDateRange(rowDate, fromDate, toDate) {
        if (!fromDate && !toDate) return true;
        
        try {
            // Parse the row date (YYYY-MM-DD format)
            const [year, month, day] = rowDate.split('-');
            const rowDateObj = new Date(year, month - 1, day);
            rowDateObj.setHours(0, 0, 0, 0);

            // Parse the from date (YYYY-MM-DD format from input)
            if (fromDate) {
                const fromDateObj = new Date(fromDate);
                fromDateObj.setHours(0, 0, 0, 0);
                if (rowDateObj < fromDateObj) {
                    console.log('Date comparison:', {
                        rowDate: rowDateObj.toISOString(),
                        fromDate: fromDateObj.toISOString(),
                        comparison: rowDateObj < fromDateObj
                    });
                    return false;
                }
            }

            // Parse the to date (YYYY-MM-DD format from input)
            if (toDate) {
                const toDateObj = new Date(toDate);
                toDateObj.setHours(23, 59, 59, 999);
                if (rowDateObj > toDateObj) {
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Date parsing error:', error, {
                rowDate,
                fromDate,
                toDate
            });
            return true; // Skip invalid dates
        }
    }

    // Update filter status
    function updateFilterStatus(count) {
        if (!filterStatus) return;
        
        const hasActiveFilters = searchInput.value || typeFilter.value || 
                               categoryFilter.selectedOptions.length > 0 ||
                               dateFrom.value || dateTo.value ||
                               amountFrom.value || amountTo.value;

        if (hasActiveFilters) {
            filterStatus.textContent = `Showing ${count} results`;
            filterStatus.style.display = 'block';
        } else {
            filterStatus.style.display = 'none';
        }
    }

    // Update filter tags
    function updateFilterTags() {
        if (!activeFilters) return;
        activeFilters.innerHTML = '';

        if (dateFrom.value || dateTo.value) {
            const fromDisplay = dateFrom.value ? formatDateForDisplay(dateFrom.value) : 'Start';
            const toDisplay = dateTo.value ? formatDateForDisplay(dateTo.value) : 'End';
            addFilterTag('Date Range', `${fromDisplay} to ${toDisplay}`);
        }
        if (amountFrom.value || amountTo.value) {
            addFilterTag('Amount Range', `${amountFrom.value || 'Min'} to ${amountTo.value || 'Max'}`);
        }
        if (typeFilter.value) {
            addFilterTag('Type', typeFilter.value);
        }
        Array.from(categoryFilter.selectedOptions).forEach(opt => {
            if (opt.value) addFilterTag('Category', opt.value);
        });
        if (searchInput.value) {
            addFilterTag('Search', searchInput.value);
        }
    }

    // Helper function to format date for display
    function formatDateForDisplay(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Date format error:', error);
            return dateStr;
        }
    }

    // Add filter tag
    function addFilterTag(label, value) {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
            ${label}: ${value}
            <button onclick="this.parentElement.remove(); applyAllFilters();">×</button>
        `;
        activeFilters.appendChild(tag);
    }

    // Reset filters
    function resetAllFilters() {
        searchInput.value = '';
        typeFilter.value = '';
        Array.from(categoryFilter.options).forEach(opt => opt.selected = false);
        dateFrom.value = '';
        dateTo.value = '';
        amountFrom.value = '';
        amountTo.value = '';
        
        if (sortField) {
            sortField.value = 'Transaction Date';
            isAscending = false;
            sortDirection.textContent = '↓';
        }

        // Show all rows
        const tbody = document.querySelector('tbody');
        if (tbody) {
            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach(row => {
                row.style.display = '';
                row.style.visibility = '';
            });
        }

        // Clear filter status and tags
        filterStatus.style.display = 'none';
        activeFilters.innerHTML = '';
        
        // Re-apply filters (which will now show all rows)
        applyAllFilters();
    }

    // Save current filter
    function saveCurrentFilter() {
        const name = prompt('Enter a name for this filter:');
        if (!name) return;

        const filterState = {
            search: searchInput.value,
            type: typeFilter.value,
            categories: Array.from(categoryFilter.selectedOptions).map(opt => opt.value),
            dateFrom: dateFrom.value,
            dateTo: dateTo.value,
            amountFrom: amountFrom.value,
            amountTo: amountTo.value
        };

        savedFilters.set(name, filterState);
        updateSavedFiltersDropdown();
    }

    // Update saved filters dropdown
    function updateSavedFiltersDropdown() {
        savedFilterSelect.innerHTML = '<option value="">Load Saved Filter</option>';
        for (const [name] of savedFilters) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            savedFilterSelect.appendChild(option);
        }
    }

    // Load saved filter
    function loadSavedFilter(name) {
        const filter = savedFilters.get(name);
        if (!filter) return;

        searchInput.value = filter.search;
        typeFilter.value = filter.type;
        dateFrom.value = filter.dateFrom;
        dateTo.value = filter.dateTo;
        amountFrom.value = filter.amountFrom;
        amountTo.value = filter.amountTo;

        // Reset and set categories
        Array.from(categoryFilter.options).forEach(opt => {
            opt.selected = filter.categories.includes(opt.value);
        });

        applyAllFilters();
    }

    // Event Listeners
    searchInput?.addEventListener('input', applyAllFilters);
    typeFilter?.addEventListener('change', applyAllFilters);
    categoryFilter?.addEventListener('change', applyAllFilters);
    dateFrom?.addEventListener('change', applyAllFilters);
    dateTo?.addEventListener('change', applyAllFilters);
    amountFrom?.addEventListener('input', applyAllFilters);
    amountTo?.addEventListener('input', applyAllFilters);
    resetFilters?.addEventListener('click', resetAllFilters);
    applyFiltersBtn?.addEventListener('click', applyAllFilters);
    saveFilterBtn?.addEventListener('click', saveCurrentFilter);
    savedFilterSelect?.addEventListener('change', (e) => loadSavedFilter(e.target.value));

    // Initialize filters
    applyAllFilters();

    // Export functionality
    const exportButton = document.getElementById('export-csv');
    if (exportButton) {
        exportButton.addEventListener('click', exportTableToCSV);
    }

    function exportTableToCSV() {
        const table = document.querySelector('table');
        if (!table) {
            alert('No data to export');
            return;
        }

        const headers = Array.from(table.querySelectorAll('thead th'))
            .map(header => `"${header.textContent.trim()}"`);

        const visibleRows = Array.from(table.querySelectorAll('tbody tr'))
            .filter(row => row.style.display !== 'none');

        const rows = visibleRows.map(row => {
            return Array.from(row.querySelectorAll('td'))
                .map(cell => `"${cell.textContent.trim()}"`)
                .join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        
        link.href = window.URL.createObjectURL(blob);
        link.download = `transactions_${timestamp}.csv`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}); 