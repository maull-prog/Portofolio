from flask import Blueprint, request, jsonify, session
from model import db, Project

projects_bp = Blueprint('projects_api', __name__)

@projects_bp.route('/', methods=['GET'])
def get_projects():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    projects = Project.query.filter_by(user_id=session['user_id']).all()
    result = [{
        "id": p.id, 
        "judul": p.judul, 
        "deskripsi": p.deskripsi,
        "gambar_url": p.gambar_url,
        "link_project": p.link_project
    } for p in projects]
    return jsonify({"status": "success", "data": result})

@projects_bp.route('/', methods=['POST'])
def create_project():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    data = request.json
    new_proj = Project(
        user_id=session['user_id'],
        judul=data.get('judul'),
        deskripsi=data.get('deskripsi'),
        gambar_url=data.get('gambar_url'),
        link_project=data.get('link_project')
    )
    db.session.add(new_proj)
    db.session.commit()
    return jsonify({"status": "success", "message": "Proyek berhasil ditambahkan"})

@projects_bp.route('/<int:id>', methods=['PUT'])
def update_project(id):
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    proj = Project.query.filter_by(id=id, user_id=session['user_id']).first()
    if not proj:
        return jsonify({"status": "error", "message": "Data tidak ditemukan"}), 404
        
    data = request.json
    proj.judul = data.get('judul')
    proj.deskripsi = data.get('deskripsi')
    proj.gambar_url = data.get('gambar_url')
    proj.link_project = data.get('link_project')
    db.session.commit()
    return jsonify({"status": "success", "message": "Proyek berhasil diupdate"})

@projects_bp.route('/<int:id>', methods=['DELETE'])
def delete_project(id):
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    proj = Project.query.filter_by(id=id, user_id=session['user_id']).first()
    if not proj:
        return jsonify({"status": "error", "message": "Data tidak ditemukan"}), 404
        
    db.session.delete(proj)
    db.session.commit()
    return jsonify({"status": "success", "message": "Proyek berhasil dihapus"})
