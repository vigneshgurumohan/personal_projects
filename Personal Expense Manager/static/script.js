document.addEventListener('DOMContentLoaded', function() {
    // Keep intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.form-group, .button-group').forEach(el => {
        observer.observe(el);
    });

    const form = document.getElementById('user-form');
    const loadingIndicator = document.getElementById('loading');
    
    // Add custom validation for dropdowns
    const selects = form.querySelectorAll('select');

    selects.forEach(select => {
        select.addEventListener('invalid', function(e) {
            if (select.value === '') {
                select.setCustomValidity('Please select an option');
            }
        });

        select.addEventListener('change', function(e) {
            select.setCustomValidity('');
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const formData = new FormData(form);
        
        // Generate current timestamp in ISO format
        const currentTimestamp = new Date().toISOString();
        
        // Show the loading indicator
        loadingIndicator.style.display = 'block';
        
        fetch('/submit', {
            method: 'POST',
            body: JSON.stringify({
                timestamp: currentTimestamp, // Automatically generated timestamp
                transaction_date: formData.get('transaction_date'),
                type_of_transaction: formData.get('type_of_transaction'),
                transaction_amount: formData.get('transaction_amount'),
                transaction_description: formData.get('transaction_description'),
                transaction_towards: formData.get('transaction_towards'),
                mode_of_transaction: formData.get('mode_of_transaction'),
                added_by: formData.get('added_by')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Hide the loading indicator
            loadingIndicator.style.display = 'none';
            
            if (data.message === 'Data stored successfully!') {
                alert('Data submitted successfully!');
                form.reset(); // Reset the form fields
            } else {
                alert('Failed to store data. Please try again.');
            }
        })
        .catch(error => {
            // Hide the loading indicator
            loadingIndicator.style.display = 'none';
            alert('An error occurred. Please try again.');
            console.error('Error:', error);
        });
    });
});

window.onload = function() {
    if ('caches' in window) {
        caches.keys().then(function(names) {
            for (let name of names) {
                caches.delete(name);
            }
        });
    }
};
