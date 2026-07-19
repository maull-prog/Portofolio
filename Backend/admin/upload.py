from flask import Blueprint, request, jsonify, session
import cloudinary
import cloudinary.uploader

upload_bp = Blueprint('upload_api', __name__)

@upload_bp.route('/', methods=['POST'])
def upload_file():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
        
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400
        
    try:
        upload_result = cloudinary.uploader.upload(file)
        return jsonify({
            "status": "success", 
            "url": upload_result.get('secure_url'),
            "message": "File uploaded successfully"
        })
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": str(e)
        }), 500
