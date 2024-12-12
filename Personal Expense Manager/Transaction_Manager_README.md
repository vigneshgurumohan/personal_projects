
# Transaction Manager

A modern, intuitive web application for personal finance management built with Flask and JavaScript. This application helps users track their income and expenses with advanced filtering and reporting capabilities.

## Features

### 1. Transaction Management
- **Transaction Entry**
  - Date selection with calendar interface
  - Transaction type categorization (Income/Expense)
  - Amount tracking with currency support (A$)
  - Detailed description fields
  - Category-based organization
  - Multiple payment mode options
  - Multi-user support

### 2. Categories
```
✓ Rent          ✓ Online Food      ✓ Online Shopping
✓ Utility       ✓ Entertainment    ✓ Gift
✓ Groceries     ✓ Offline Food     ✓ Family
✓ Travel        ✓ Offline Shopping ✓ Medical
                ✓ Fuel             ✓ Others
```

### 3. Advanced Filtering & Search
- **Date Range Filtering**
  - Custom date range selection
  - Preset date ranges
- **Amount Filtering**
  - Min/Max amount range
  - Currency-aware filtering
- **Category & Type Filtering**
  - Multiple category selection
  - Income/Expense type filtering
  - Combination filters
- **Search Features**
  - Full-text search
  - Save favorite filters
  - Active filter indicators

## Technology Stack

### Backend
```python
Python 3.x
Flask 3.0.2
Pandas 2.2.1
Python-dateutil 2.9.0
Pydantic 2.6.1
```

### Frontend
```javascript
HTML5
CSS3
JavaScript (ES6+)
SF Pro Display Font
```

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/transaction-manager.git
cd transaction-manager
```

2. **Create a virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the application**
```bash
python app.py
```

5. Access the application at `http://localhost:5000`

## Project Structure
```
transaction-manager/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── static/
│   ├── style.css      # Global styles
│   ├── script.js      # Form handling
│   ├── details.js     # Transaction details page
│   └── js/
│       └── app.js     # Core application logic
├── templates/
│   ├── index.html     # Transaction entry page
│   └── hello_world.html # Transaction details page
└── transactions.csv    # Data storage
```

## Configuration

The application can be configured through `config.py`:
```python
class Config:
    TRANSACTION_TYPES = ['Income', 'Expense']
    CATEGORIES = [
        'Rent', 'Utility', 'Groceries', 'Travel', 
        'Offline Food', 'Online Food', 'Entertainment',
        'Offline Shopping', 'Online Shopping', 'Gift', 
        'Family', 'Medical', 'Fuel', 'Others'
    ]
    PAYMENT_MODES = ['Online', 'Debit Card', 'Credit Card']
    USERS = ['Vignesh', 'Keerthana']
    
    CURRENCY_SYMBOL = 'A$'
    DATE_FORMAT = '%d-%m-%Y'
```

## Features in Detail

### Transaction Entry
- Automatic timestamp generation
- Required field validation
- Real-time form feedback
- Success/error notifications

### Transaction Viewing
- Sortable columns
- Filter combinations
- Saved filter presets
- Export filtered data

### Data Management
- Automatic data validation
- Error handling
- Transaction logging
- Data export capabilities

## Security Features
- Form validation
- Data sanitization
- Error logging
- Cache control

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
