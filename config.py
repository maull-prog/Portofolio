import os
from dotenv import load_dotenv

# Memuat environment variables dari file .env
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'default_secret_key')
    
    # TiDB / MySQL Database URI Configuration
    TIDB_HOST = os.getenv('TIDB_HOST', '127.0.0.1')
    TIDB_PORT = os.getenv('TIDB_PORT', '4000')
    TIDB_USER = os.getenv('TIDB_USER', 'root')
    TIDB_PASSWORD = os.getenv('TIDB_PASSWORD', '')
    TIDB_DATABASE = os.getenv('TIDB_DATABASE', 'portofolio_db')
    
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{TIDB_USER}:{TIDB_PASSWORD}@{TIDB_HOST}:{TIDB_PORT}/{TIDB_DATABASE}?ssl_verify_cert=true&ssl_verify_identity=true"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Cloudinary configuration is usually set automatically if CLOUDINARY_URL exists,
    # but we can configure it explicitly in app.py or upload module.
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
    
    # Resend configuration
    RESEND_API_KEY = os.getenv('RESEND_API_KEY')
    RESEND_FROM_EMAIL = os.getenv('RESEND_FROM_EMAIL')
    RESEND_TO_EMAIL = os.getenv('RESEND_TO_EMAIL')
