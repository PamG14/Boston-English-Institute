import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configuración de Flask
app = Flask(__name__)
CORS(app, resources={r"/verify/*": {"origins": "*"}})

# Cargar credenciales desde variables de entorno
credentials_json = os.getenv('GOOGLE_CREDENTIALS')
if not credentials_json:
    raise ValueError("No se encontraron las credenciales en las variables de entorno")
credentials_data = json.loads(credentials_json)
credentials = service_account.Credentials.from_service_account_info(
    credentials_data,
    scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
)

# Configuración de la API de Google Sheets
spreadsheet_id = '1TsIqRDMV-8Rv2xlx4oG_DLVxCOcxnfhWt6-q96x9qKw'  # Asegúrate de actualizar el ID de la hoja
range_name = 'Hoja 1!A2:F'  # Ajusta el rango según tu hoja de cálculo

# Ruta principal (agregada para evitar 404 al acceder a la raíz)
@app.route('/')
def home():
    return "Bienvenido a la API de verificación de certificados"

# Ruta para verificar certificados
@app.route('/verify', methods=['GET'])
def verify_certificate():
    cert_id = request.args.get('cert_id')
    if not cert_id:
        return jsonify({'error': 'No se proporcionó cert_id'}), 400

    try:
        service = build('sheets', 'v4', credentials=credentials)
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        rows = result.get('values', [])

        for row in rows:
            if row[0] == cert_id:
                return jsonify({
                    'status': 'Certificado válido',
                    'student_name': row[1],
                    'course': row[2],
                    'issue_date': row[3]
                })

        return jsonify({'status': 'Certificado no encontrado'}), 404

    except Exception as e:
        return jsonify({'error': f'Error al consultar Google Sheets: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
