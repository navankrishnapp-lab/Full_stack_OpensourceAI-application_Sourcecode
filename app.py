import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from ai import GemmaEngine

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ai_engine = GemmaEngine()

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'prompt' not in data:
        return jsonify({'error': 'Missing prompt configuration parameters.'}), 400
    
    response_text = ai_engine.ask_gemma(data['prompt'])
    return jsonify({'response': response_text})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file detected.'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No filename detected.'}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            message = ai_engine.load_pdf_into_memory(file_path)
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'message': message})
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': str(e)}), 500

@app.route('/reset', methods=['POST'])
def reset_memory():
    """Explicit endpoint to clear memory states completely."""
    ai_engine.clear_pdf_memory()
    return jsonify({'status': 'Memory completely cleared.'})

if __name__ == '__main__':
    app.run(port=8000, debug=False)