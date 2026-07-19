from flask import Blueprint, request, jsonify, session
from model import db, Profile

profiles_bp = Blueprint('profiles_api', __name__)

@profiles_bp.route('/', methods=['GET'])
def get_profile():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    profile = Profile.query.filter_by(user_id=session['user_id']).first()
    if profile:
        return jsonify({
            "status": "success",
            "data": {
                "id": profile.id,
                "nama_lengkap": profile.nama_lengkap,
                "nama_panggilan": profile.nama_panggilan,
                "tempat_lahir": profile.tempat_lahir,
                "tanggal_lahir": str(profile.tanggal_lahir) if profile.tanggal_lahir else None,
                "email": profile.email,
                "telepon": profile.telepon,
                "universitas": profile.universitas,
                "fakultas": profile.fakultas,
                "prodi": profile.prodi,
                "semester": profile.semester,
                "alamat": profile.alamat,
                "foto_url": profile.foto_url,
                "foto_about_url": profile.foto_about_url
            }
        })
    return jsonify({"status": "success", "data": None})

@profiles_bp.route('/', methods=['POST'])
def save_profile():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    data = request.json
    profile = Profile.query.filter_by(user_id=session['user_id']).first()
    
    if not profile:
        profile = Profile(user_id=session['user_id'])
        db.session.add(profile)
        
    profile.nama_lengkap = data.get('nama_lengkap')
    profile.nama_panggilan = data.get('nama_panggilan')
    profile.tempat_lahir = data.get('tempat_lahir')
    profile.tanggal_lahir = data.get('tanggal_lahir')
    profile.email = data.get('email')
    profile.telepon = data.get('telepon')
    profile.universitas = data.get('universitas')
    profile.fakultas = data.get('fakultas')
    profile.prodi = data.get('prodi')
    profile.semester = data.get('semester')
    profile.alamat = data.get('alamat')
    profile.foto_url = data.get('foto_url')
    profile.foto_about_url = data.get('foto_about_url')
    
    db.session.commit()
    return jsonify({"status": "success", "message": "Profil berhasil disimpan"})
