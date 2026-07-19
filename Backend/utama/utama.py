from flask import Blueprint, render_template, request, jsonify, current_app
from model import Profile, Skill, Experience, Project, User
import resend

utama_bp = Blueprint('utama', __name__)

@utama_bp.route('/')
def index():
    # Biasanya kita butuh user tertentu, misal admin pertama
    user = User.query.filter_by(username='admin').first()
    if not user:
        return "Admin belum disetup", 404
        
    profile = Profile.query.filter_by(user_id=user.id).first()
    skills = Skill.query.filter_by(user_id=user.id).all()
    experiences = Experience.query.filter_by(user_id=user.id).order_by(Experience.id.desc()).all()
    projects = Project.query.filter_by(user_id=user.id).order_by(Project.id.desc()).all()
    
    return render_template('utama/index.html', profile=profile, skills=skills, experiences=experiences, projects=projects)

@utama_bp.route('/contact', methods=['POST'])
def contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({"status": "error", "message": "Semua field harus diisi"}), 400
        
    resend.api_key = current_app.config['RESEND_API_KEY']
    
    try:
        r = resend.Emails.send({
            "from": current_app.config['RESEND_FROM_EMAIL'],
            "to": current_app.config['RESEND_TO_EMAIL'],
            "subject": f"Pesan Baru dari {name} - Portfolio Web",
            "html": f"<h3>Pesan dari {name} ({email})</h3><p>{message}</p>"
        })
        return jsonify({"status": "success", "message": "Pesan berhasil dikirim!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
