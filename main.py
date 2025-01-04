import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configuración de Flask
app = Flask(__name__)

# Configuración de CORS para permitir solicitudes desde GitHub Pages
CORS(app, resources={
    r"/verify/*": {
        "origins": "https://pamg14.github.io",
        "methods": ["GET", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Cargar las credenciales de Google Sheets desde las variables de entorno
credentials_json = os.getenv('GOOGLE_CREDENTIALS')  # Variable de entorno
if not credentials_json:
    raise ValueError("No se encontraron las credenciales en las variables de entorno")

credentials_data = json.loads(credentials_json)
credentials = service_account.Credentials.from_service_account_info(
    credentials_data,
    scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
)

# Configuración de la API de Google Sheets
spreadsheet_id = '1TsIqRDMV-8Rv2xlx4oG_DLVxCOcxnfhWt6-q96x9qKw'  # ID de la hoja de cálculo de Google Sheets
range_name = 'Hoja 1!A2:F'  # Rango de celdas a consultar

# Ruta principal (para evitar 404 al acceder a la raíz)
@app.route('/')
def home():
    return "Bienvenido a la API de verificación de certificados"

# Ruta para verificar certificados
@app.route('/verify', methods=['GET'])
def verify_certificate():
    cert_id = request.args.get('cert_id')  # Obtiene el parámetro 'cert_id'
    if not cert_id:
        return jsonify({'error': 'No se proporcionó cert_id'}), 400

    try:
        # Construye el servicio de Google Sheets utilizando las credenciales
        service = build('sheets', 'v4', credentials=credentials)
        sheet = service.spreadsheets()

        # Realiza la consulta para obtener los datos de la hoja
        result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        rows = result.get('values', [])  # Obtiene las filas de la hoja de cálculo

        # Verifica si el cert_id existe en la hoja
        for row in rows:
            if row[0] == cert_id:
                return jsonify({
for row in rows:
    if row[0] == cert_id:  # Compara el cert_id
        return jsonify({
            'status': 'Certificado válido',
            'student_name': row[1],  # Nombre del estudiante
            'course': row[2],       # Curso
            'level': row[3],        # Nivel
            'issue_date': row[4]    # Fecha de emisión
        })


        # Si no se encuentra el cert_id, retorna un error 404
        return jsonify({'status': 'Certificado no encontrado'}), 404

    except Exception as e:
        # Si ocurre algún error, lo maneja y lo retorna en la respuesta
        return jsonify({'error': f'Error al consultar Google Sheets: {str(e)}'}), 500

# Inicia la aplicación Flask
if __name__ == '__main__':
    port = int(os.getenv("PORT", 8080))  # Render asigna el puerto en la variable de entorno PORT
    app.run(host='0.0.0.0', port=port)

