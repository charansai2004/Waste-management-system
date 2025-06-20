from flask import Flask, render_template, request, jsonify, redirect, url_for
import os
import numpy as np
from PIL import Image
import base64
from io import BytesIO
import random

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.jinja_env.cache = {}
app.jinja_env.auto_reload = True

# Simulate model loading (replace with actual model loading)
# model = tf.keras.models.load_model('vgg16.h5')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def preprocess_image(image_path):
    """Preprocess image for model prediction"""
    try:
        # Load and resize image to 224x224 (VGG16 input size)
        img = Image.open(image_path)
        img = img.convert('RGB')
        img = img.resize((224, 224))
        
        # Convert to array and normalize
        img_array = np.array(img)
        img_array = img_array.astype('float32') / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def predict_waste_category(image_path):
    """
    Simulate waste classification using VGG16 model
    Replace this with actual model prediction
    """
    try:
        # Preprocess the image
        processed_image = preprocess_image(image_path)
        if processed_image is None:
            return "Error"
        
        # Simulate model prediction (replace with actual model.predict())
        # preds = model.predict(processed_image)
        # predicted_class = np.argmax(preds)
        
        # For simulation, we'll use filename hints or random classification
        filename = os.path.basename(image_path).lower()
        
        if any(keyword in filename for keyword in ['biodeg', 'organic', 'food', 'compost', 'leaf', 'fruit']):
            return "Biodegradable"
        elif any(keyword in filename for keyword in ['recycl', 'plastic', 'paper', 'cardboard', 'bottle', 'can']):
            return "Recyclable"
        elif any(keyword in filename for keyword in ['trash', 'garbage', 'waste']):
            return "Trash"
        else:
            # Random classification for demo (replace with actual model prediction)
            categories = ["Biodegradable", "Recyclable", "Trash"]
            return random.choice(categories)
            
    except Exception as e:
        print(f"Error in prediction: {e}")
        return "Error"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/predict')
def predict():
    return render_template('predict.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file selected'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'})
    
    if file and allowed_file(file.filename):
        try:
            # Save the uploaded file
            filename = file.filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Get prediction
            prediction = predict_waste_category(filepath)
            
            # Convert image to base64 for display
            with open(filepath, "rb") as img_file:
                img_data = base64.b64encode(img_file.read()).decode('utf-8')
            
            return jsonify({
                'success': True,
                'prediction': prediction,
                'filename': filename,
                'image_data': img_data
            })
            
        except Exception as e:
            return jsonify({'error': f'Error processing file: {str(e)}'})
    
    return jsonify({'error': 'Invalid file type'})

@app.route('/results')
def results():
    return render_template('results.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
