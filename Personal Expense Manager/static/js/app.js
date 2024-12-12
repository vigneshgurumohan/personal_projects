// Create a TransactionUI class
class TransactionUI {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        this.table = document.querySelector('.data-table table');
        this.searchInput = document.getElementById('search');
        this.typeFilter = document.getElementById('type-filter');
        this.categoryFilter = document.getElementById('category-filter');
        this.dateFrom = document.getElementById('date-from');
        this.dateTo = document.getElementById('date-to');
        this.applyFilters = document.getElementById('apply-filters');
        this.resetFilters = document.getElementById('reset-filters');
    }
    
    attachEventListeners() {
        this.searchInput?.addEventListener('input', () => this.applyFilters());
        this.typeFilter?.addEventListener('change', () => this.applyFilters());
        this.categoryFilter?.addEventListener('change', () => this.applyFilters());
        this.dateFrom?.addEventListener('change', () => this.applyFilters());
        this.dateTo?.addEventListener('change', () => this.applyFilters());
        this.resetFilters?.addEventListener('click', () => this.resetAllFilters());
    }
    
    // ... rest of the UI logic
} 