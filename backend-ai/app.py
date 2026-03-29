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
    # 0. Autenticación (Resolver Profile ID)
    auth_id = None
    profile_id = None 
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        if supabase:
            try:
                user_response = supabase.auth.get_user(token)
                if user_response and user_response.user:
                    auth_id = user_response.user.id
                    # BUSCAMOS EL ID DE LA TABLA PERFILES
                    perfil_res = supabase.table('perfiles').select('id').eq('user_id', auth_id).single().execute()
                    if perfil_res.data:
                        profile_id = perfil_res.data['id']
                        print(f"DEBUG: Perfil vinculado exitosamente: {profile_id}")
            except Exception as e:
                print(f"Error de validación: {e}")

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
            # Definimos los valores de impacto para SocioEco
            peso_actual = 0.25
            impacto_co2 = peso_actual * 0.5   # 0.5kg CO2 por kg de plástico
            impacto_agua = peso_actual * 15.0 # 15L de agua por kg de plástico

            # Preparamos el dato para la tabla 'transacciones_reciclaje'
            data_to_insert = {
                "material": material_type,
                "peso": float(peso_actual),
                "co2_ahorrado": float(impacto_co2),
                "agua_ahorrada": float(impacto_agua), # Nueva columna para tu diseño de Figma
                "estado": "completado"
            }
            
            # CRUCIAL: Vinculamos el usuario_id real obtenido del token
            if profile_id:
                data_to_insert["usuario_id"] = profile_id
            else:
                print("DEBUG: No hay profile_id, revisa si el usuario tiene una fila en 'perfiles'")
            
            # Realizamos el insert
            # Al ejecutarse esto, el TRIGGER que creaste en SQL actualizará tu PERFIL automáticamente
            response = supabase.table('transacciones_reciclaje').insert(data_to_insert).execute()
            print(f"Transacción guardada exitosamente: {response.data}")

        except Exception as e:
            print(f"Error al guardar en la base de datos: {e}")
    
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) # debug=True para ver errores en vivo