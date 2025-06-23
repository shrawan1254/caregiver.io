from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize the database and create users table if it doesn't exist
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    ''')
    # Applications table
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT,
            age INTEGER,
            gender TEXT,
            phone TEXT,
            email TEXT,
            address TEXT,
            languages TEXT,
            education TEXT,
            availability TEXT,
            caretype TEXT,
            experience TEXT,
            experience_desc TEXT,
            certification TEXT,
            assist TEXT,
            gov_id TEXT,
            selfie TEXT,
            emergency_contact TEXT,
            reference_name TEXT,
            reference_number TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    try:
        c.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, password))
        conn.commit()
        return jsonify({'success': True, 'message': 'User registered!'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Email already exists.'})
    finally:
        conn.close()

@app.route('/apply', methods=['POST'])
def apply():
    print("Form data:", request.form)
    print("Files:", request.files)
    data = request.form
    files = request.files

    # Helper to save a file and return its filename
    def save_file(field):
        file = files.get(field)
        if file and file.filename:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filepath)
            return file.filename
        return None

    certification_doc = save_file('certification-doc')
    gov_id = save_file('gov-id')
    selfie = save_file('selfie')

    caretype = ','.join(request.form.getlist('caretype'))
    assist = ','.join(request.form.getlist('assist[]'))
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''
        INSERT INTO applications (
            fullname, age, gender, phone, email, address, languages, education, availability,
            caretype, experience, experience_desc, certification, assist, gov_id, selfie,
            emergency_contact, reference_name, reference_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('fullname'),
        data.get('age'),
        data.get('gender'),
        data.get('phone'),
        data.get('email'),
        data.get('address'),
        data.get('languages'),
        data.get('education'),
        data.get('availability'),
        caretype,
        data.get('experience'),
        data.get('experience-desc'),
        data.get('certification'),
        assist,
        gov_id,
        selfie,
        data.get('emergency-contact'),
        data.get('reference-name'),
        data.get('reference-number')
    ))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Application submitted!'})

@app.route('/')
def home():
    return "API is running!"

if __name__ == '__main__':
    app.run(debug=True)
    