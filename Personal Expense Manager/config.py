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
    
    @classmethod
    def get_form_options(cls):
        return {
            'transaction_types': cls.TRANSACTION_TYPES,
            'transaction_towards': cls.CATEGORIES,
            'transaction_modes': cls.PAYMENT_MODES,
            'added_by': cls.USERS
        } 