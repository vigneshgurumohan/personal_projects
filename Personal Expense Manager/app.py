from flask import Flask, request, jsonify, render_template, make_response, Blueprint
import pandas as pd
import atexit
import os
import logging
import chardet
from datetime import datetime
from config import Config

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
handler = logging.FileHandler('transactions.log')
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Constants
DATA_FILE = 'user_data.csv'

# Data management functions
def load_data():
    """Load data from CSV file."""
    try:
        if os.path.exists(DATA_FILE):
            df = pd.read_csv(DATA_FILE, encoding='utf-8')
            df['Transaction Date'] = pd.to_datetime(df['Transaction Date'], format='%d-%m-%Y')
            return df.sort_values(['Transaction Date', 'Timestamp'], ascending=[False, False])
        return pd.DataFrame(columns=[
            'Timestamp', 'Transaction Date', 'Type of Transaction', 
            'Transaction Amount', 'Transaction Description', 
            'Transaction Towards', 'Mode of Transaction', 'Added By'
        ])
    except Exception as e:
        app.logger.error(f"Error loading data: {e}")
        return pd.DataFrame()

def save_data(dataframe):
    """Save the DataFrame to CSV."""
    try:
        if not dataframe.empty:
            save_df = dataframe.copy()
            save_df['Transaction Date'] = pd.to_datetime(save_df['Transaction Date'])
            save_df['Transaction Date'] = save_df['Transaction Date'].dt.strftime('%d-%m-%Y')
            save_df.to_csv(DATA_FILE, index=False, encoding='utf-8')
            app.logger.info(f"Data saved successfully to {DATA_FILE}")
            return True
        return False
    except Exception as e:
        app.logger.error(f"Error saving data: {e}")
        return False

def custom_table_render(df):
    """Convert DataFrame to HTML with custom styling."""
    if df.empty:
        return "<p>No transactions found.</p>"
    table_html = df.to_html(classes='data', index=False, escape=False)
    table_html = table_html.replace(
        '>Income<', ' data-type="Income">Income<'
    ).replace(
        '>Expense<', ' data-type="Expense">Expense<'
    )
    return table_html

# Load initial data
df = load_data()

@app.route('/')
def home():
    """Render the home page."""
    return render_template('index.html', options=Config.get_form_options())

@app.route('/more-details')
def more_details():
    """Render the details page."""
    table_html = custom_table_render(df)
    return render_template('hello_world.html', data=table_html, options=Config.get_form_options())

@app.route('/submit', methods=['POST'])
def submit():
    """Handle form submission."""
    try:
        global df
        data = request.get_json()
        
        # Convert date format
        date_obj = datetime.strptime(data['transaction_date'], '%Y-%m-%d')
        formatted_date = date_obj.strftime('%d-%m-%Y')
        
        new_row = {
            'Timestamp': data['timestamp'],
            'Transaction Date': formatted_date,
            'Type of Transaction': data['type_of_transaction'],
            'Transaction Amount': float(data['transaction_amount']),
            'Transaction Description': data['transaction_description'],
            'Transaction Towards': data['transaction_towards'],
            'Mode of Transaction': data['mode_of_transaction'],
            'Added By': data['added_by']
        }
        
        # Create new DataFrame with the row and concatenate
        new_df = pd.DataFrame([new_row])
        df = pd.concat([new_df, df], ignore_index=True) if not df.empty else new_df
        
        # Save immediately after update
        if save_data(df):
            app.logger.info("Transaction saved successfully")
            return jsonify({"message": "Data stored successfully!"})
        else:
            app.logger.error("Failed to save transaction")
            return jsonify({"error": "Failed to save data"}), 500
            
    except Exception as e:
        app.logger.error(f"Error in submit: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
