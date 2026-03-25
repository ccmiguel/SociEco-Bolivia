import os
from flask import Flask, jsonify, request
from config import get_supabase_client

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

# Uncomment when env variables are set
# supabase = get_supabase_client()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "backend-ai"}), 200

def mock_analyze_image(image_input):
    # Aquí iría un modelo de TensorFlow robusto (Ej: InceptionV3 o un modelo propio .tflite)
    # tf.keras.models.load_model('socieco_model.h5')
    # predictions = model.predict(image)...
    
    # Placeholder: Para esta demo, forzaremos que identifique 'Plástico'
    return "Plástico"

@app.route('/api/scan', methods=['POST'])
def scan_material():
    # 1. Recibir imagen (soporta formdata 'image' o json 'image_url')
    material_type = ""
    
    if 'image' in request.files:
        # Lectura si envían un binario/multipart
        image_file = request.files['image']
        material_type = mock_analyze_image(image_file)
    else:
        # Lectura si envían JSON (base64 o URL)
        data = request.json or {}
        image_data = data.get('image_url') or data.get('image_base64')
        if not image_data:
             return jsonify({"error": "No image provided"}), 400
        material_type = mock_analyze_image(image_data)
        
    # 2. Lógica de Inteligencia: Si es Plástico, devolver Reciclaje Creativo
    creative_ideas = []
    
    if material_type.lower() in ['plástico', 'plastico']:
        creative_ideas = [
            {
                "id": 1,
                "title": "Maceta Autorregable",
                "difficulty": "Fácil",
                "steps": [
                    "Corta la botella de plástico por la mitad.",
                    "Haz pequeños agujeros en la tapa y cruza un hilo de algodón.",
                    "Llena la parte superior con tierra y semilla; la inferior con agua.",
                    "Encaja la parte superior invertida dentro de la inferior para que el hilo absorba agua."
                ]
            },
            {
                "id": 2,
                "title": "Organizador Ecológico",
                "difficulty": "Fácil",
                "steps": [
                    "Lava y seca tu envase de plástico grueso (ej. detergente).",
                    "Corta la parte superior con un cúter dejando la altura deseada.",
                    "Pule los bordes con cuidado para evitar cortes.",
                    "Pinta y decora el exterior con marcadores permanentes.",
                    "Úsalo para guardar lápices, pinceles o accesorios de escritorio."
                ]
            },
            {
                "id": 3,
                "title": "Ecoladrillo",
                "difficulty": "Media",
                "steps": [
                    "Consigue una botella PET de 2 o 3 litros completamente limpia.",
                    "Introduce todos los envoltorios plásticos blandos de un solo uso que vayas consumiendo.",
                    "Usa un palo de madera para comprimir el plástico fuertemente dentro de la botella.",
                    "Repite hasta que la botella sea un bloque sólido que no se pueda hundir con los dedos."
                ]
            }
        ]
        
    # 3. Respuesta JSON hacia el Frontend
    result = {
        "success": True,
        "material_detected": material_type,
        "confidence": 0.94,
        "estimated_weight_kg": 0.25,
        "creative_recycling": creative_ideas
    }
    
    return jsonify(result), 200

if __name__ == '__main__':
    # Arrancar servidor en puerto 5000
    app.run(host='0.0.0.0', port=5000)
