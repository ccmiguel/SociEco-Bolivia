import os
from flask import Flask, jsonify, request
from flask_cors import CORS  # <--- CAMBIO 1: Importar CORS
from config import get_supabase_client

app = Flask(__name__)
# CAMBIO 2: Permitir que el frontend (puerto 3000) acceda al backend
CORS(app) 

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

# Ya puedes desvincular esto porque tienes tus credenciales
# Asegúrate de tener las variables en un archivo .env dentro de /backend-ai
try:
    supabase = get_supabase_client()
    print("Conexión exitosa con Supabase")
except Exception as e:
    print(f"Error conectando a Supabase: {e}")
    supabase = None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "backend-ai"}), 200

def mock_analyze_image(image_input):
    # Simulación de IA para la demo de SocioEco
    return "Plástico"

# Agregamos 'OPTIONS' explícitamente por si el navegador lo requiere
@app.route('/api/scan', methods=['POST', 'OPTIONS'])
def scan_material():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    # 0. Autenticación (Obtener usuario vía token de Supabase)
    user_id = None
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        if supabase:
            try:
                user_response = supabase.auth.get_user(token)
                if user_response and user_response.user:
                    user_id = user_response.user.id
            except Exception as e:
                print(f"Error de auth: {e}")
                return jsonify({"error": "Token inválido o no autorizado"}), 401

    # 1. Recibir imagen
    material_type = ""
    if 'image' in request.files:
        image_file = request.files['image']
        material_type = mock_analyze_image(image_file)
    else:
        data = request.json or {}
        image_data = data.get('image_url') or data.get('image_base64')
        # Si el body viene vacío (como en tu test de page.tsx), devolvemos éxito para el ping
        if not image_data and not request.files:
             return jsonify({"success": True, "message": "Ping exitoso al servidor AI"}), 200
        material_type = mock_analyze_image(image_data)
        
    # 2. Lógica de Upcycling (RECILAKA Style)
    creative_ideas = [
        {
            "id": 1,
            "title": "Maceta Autorregable",
            "difficulty": "Fácil",
            "steps": ["Corta la botella", "Haz agujeros", "Llena con tierra"]
        }
    ]
    
    # 3. Respuesta JSON
    result = {
        "success": True,
        "material_detected": material_type,
        "confidence": 0.94,
        "estimated_weight_kg": 0.25,
        "creative_recycling": creative_ideas
    }
    
    # 4. Guardar en Supabase (Persistencia Real)
    if supabase:
        try:
            # Preparamos el dato para la tabla que creamos
            data_to_insert = {
                "material": material_type,
                "peso": 0.25,
                "co2_ahorrado": 0.12, # Cálculo simple de impacto: 0.25*0.5
                "estado": "completado"
            }
            
            if user_id:
                data_to_insert["usuario_id"] = user_id
                
            response = supabase.table('transacciones_reciclaje').insert(data_to_insert).execute()
            print(f"Transacción guardada en Supabase: {response.data}")
        except Exception as e:
            print(f"Error al guardar en BD: {e}")

    return jsonify(result), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) # debug=True para ver errores en vivo