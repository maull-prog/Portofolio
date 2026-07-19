from flask import Blueprint, request, jsonify, session
from model import db, Experience

experience_bp = Blueprint('experience_api', __name__)

@experience_bp.route('/', methods=['GET'])
def get_experiences():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    experiences = Experience.query.filter_by(user_id=session['user_id']).all()
    result = [{
        "id": e.id, 
        "posisi": e.posisi, 
        "perusahaan": e.perusahaan,
        "durasi": e.durasi,
        "deskripsi": e.deskripsi
    } for e in experiences]
    return jsonify({"status": "success", "data": result})

@experience_bp.route('/', methods=['POST'])
def create_experience():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    data = request.json
    new_exp = Experience(
        user_id=session['user_id'],
        posisi=data.get('posisi'),
        perusahaan=data.get('perusahaan'),
        durasi=data.get('durasi'),
        deskripsi=data.get('deskripsi')
    )
    db.session.add(new_exp)
    db.session.commit()
    return jsonify({"status": "success", "message": "Pengalaman berhasil ditambahkan"})

@experience_bp.route('/<int:id>', methods=['PUT'])
def update_experience(id):
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    exp = Experience.query.filter_by(id=id, user_id=session['user_id']).first()
    if not exp:
        return jsonify({"status": "error", "message": "Data tidak ditemukan"}), 404
        
    data = request.json
    exp.posisi = data.get('posisi')
    exp.perusahaan = data.get('perusahaan')
    exp.durasi = data.get('durasi')
    exp.deskripsi = data.get('deskripsi')
    db.session.commit()
    return jsonify({"status": "success", "message": "Pengalaman berhasil diupdate"})

@experience_bp.route('/<int:id>', methods=['DELETE'])
def delete_experience(id):
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    exp = Experience.query.filter_by(id=id, user_id=session['user_id']).first()
    if not exp:
        return jsonify({"status": "error", "message": "Data tidak ditemukan"}), 404
        
    db.session.delete(exp)
    db.session.commit()
    return jsonify({"status": "success", "message": "Pengalaman berhasil dihapus"})
