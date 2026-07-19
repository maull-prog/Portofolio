from flask import Blueprint, request, jsonify, session
from model import db, Skill

skills_bp = Blueprint('skills_api', __name__)

@skills_bp.route('/', methods=['GET'])
def get_skills():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    skills = Skill.query.filter_by(user_id=session['user_id']).all()
    result = [{"id": s.id, "nama_skill": s.nama_skill, "icon_class": s.icon_class} for s in skills]
    return jsonify({"status": "success", "data": result})

@skills_bp.route('/', methods=['POST'])
def create_skill():
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    data = request.json
    new_skill = Skill(
        user_id=session['user_id'],
        nama_skill=data.get('nama_skill'),
        icon_class=data.get('icon_class')
    )
    db.session.add(new_skill)
    db.session.commit()
    return jsonify({"status": "success", "message": "Skill berhasil ditambahkan"})

@skills_bp.route('/<int:id>', methods=['PUT'])
def update_skill(id):
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    skill = Skill.query.filter_by(id=id, user_id=session['user_id']).first()
    if not skill:
        return jsonify({"status": "error", "message": "Data tidak ditemukan"}), 404
        
    data = request.json
    skill.nama_skill = data.get('nama_skill')
    skill.icon_class = data.get('icon_class')
    db.session.commit()
    return jsonify({"status": "success", "message": "Skill berhasil diupdate"})

@skills_bp.route('/<int:id>', methods=['DELETE'])
def delete_skill(id):
    if 'user_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    skill = Skill.query.filter_by(id=id, user_id=session['user_id']).first()
    if not skill:
        return jsonify({"status": "error", "message": "Data tidak ditemukan"}), 404
        
    db.session.delete(skill)
    db.session.commit()
    return jsonify({"status": "success", "message": "Skill berhasil dihapus"})
