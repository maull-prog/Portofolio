import os
from flask import Flask
from config import Config
from model import db, User
from werkzeug.security import generate_password_hash
import cloudinary

def create_app():
    app = Flask(__name__, 
                template_folder='Frontend', 
                static_folder='Frontend', 
                static_url_path='/static')
    
    app.config.from_object(Config)
    
    # Initialize SQLAlchemy
    db.init_app(app)
    
    # Konfigurasi Cloudinary (dari config)
    cloudinary.config(
        cloud_name=app.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key=app.config.get('CLOUDINARY_API_KEY'),
        api_secret=app.config.get('CLOUDINARY_API_SECRET')
    )
    
    # Import Blueprints
    from Backend.admin.login import login_bp
    from Backend.admin.dashboard import dashboard_bp
    from Backend.admin.profiles import profiles_bp
    from Backend.admin.skills import skills_bp
    from Backend.admin.experience import experience_bp
    from Backend.admin.projects import projects_bp
    from Backend.admin.upload import upload_bp
    from Backend.utama.utama import utama_bp
    
    # Register Blueprints
    app.register_blueprint(login_bp, url_prefix='/admin')
    app.register_blueprint(dashboard_bp, url_prefix='/admin')
    app.register_blueprint(profiles_bp, url_prefix='/admin/api/profiles')
    app.register_blueprint(skills_bp, url_prefix='/admin/api/skills')
    app.register_blueprint(experience_bp, url_prefix='/admin/api/experiences')
    app.register_blueprint(projects_bp, url_prefix='/admin/api/projects')
    app.register_blueprint(upload_bp, url_prefix='/admin/api/upload')
    app.register_blueprint(utama_bp, url_prefix='/')

    # Buat tabel dan seeder
    with app.app_context():
        db.create_all()
        
        from model import Profile, Skill, Experience, Project
        
        # Seeder default admin: admin / admin123
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            hashed_pw = generate_password_hash('admin123')
            admin = User(username='admin', password_hash=hashed_pw, role='admin')
            db.session.add(admin)
            db.session.commit()
            print("Default admin created: admin/admin123")
        
        # Seeder Profile
        if not Profile.query.filter_by(user_id=admin.id).first():
            profile = Profile(
                user_id=admin.id,
                nama_lengkap='Pradika Maula Arrozaq',
                nama_panggilan='Pradika',
                email='pradikamaula01@gmail.com',
                telepon='+6281215623606',
                alamat='Indonesia',
            )
            db.session.add(profile)
            print("Profile seeded.")

        # Seeder Skills
        if not Skill.query.filter_by(user_id=admin.id).first():
            default_skills = [
                Skill(user_id=admin.id, nama_skill='HTML5', icon_class='fab fa-html5'),
                Skill(user_id=admin.id, nama_skill='CSS3', icon_class='fab fa-css3-alt'),
                Skill(user_id=admin.id, nama_skill='JavaScript', icon_class='fab fa-js-square'),
                Skill(user_id=admin.id, nama_skill='GitHub', icon_class='fab fa-github'),
                Skill(user_id=admin.id, nama_skill='SQL Database', icon_class='fas fa-database'),
                Skill(user_id=admin.id, nama_skill='Python', icon_class='fab fa-python'),
            ]
            db.session.add_all(default_skills)
            print("Skills seeded.")

        # Seeder Experiences
        if not Experience.query.filter_by(user_id=admin.id).first():
            default_exps = [
                Experience(user_id=admin.id, posisi='Full Stack Developer', perusahaan='Freelance', durasi='2022 - Present',
                    deskripsi='Developed full-stack web applications with React, Node.js, and PostgreSQL. Delivered scalable REST APIs and dynamic frontend experiences.'),
                Experience(user_id=admin.id, posisi='Frontend Developer', perusahaan='PT Digital Nusantara', durasi='2021 - 2022',
                    deskripsi='Built responsive interfaces using React and Tailwind CSS. Improved page load performance by 35% through optimization.'),
                Experience(user_id=admin.id, posisi='Junior Web Developer', perusahaan='StartUp Tech', durasi='2020 - 2021',
                    deskripsi='Worked on PHP/Laravel backend and jQuery frontend projects for SME clients.'),
            ]
            db.session.add_all(default_exps)
            print("Experiences seeded.")

        # Seeder Projects
        if not Project.query.filter_by(user_id=admin.id).first():
            default_projects = [
                Project(user_id=admin.id, judul='E-Commerce Platform', 
                    deskripsi='Full-featured online store with cart, user authentication, and secure payment gateway integration.', 
                    link_project='https://github.com'),
                Project(user_id=admin.id, judul='Task Management App', 
                    deskripsi='Collaborative todo application with real-time updates, drag-and-drop boards, and team workspaces.', 
                    link_project='https://github.com'),
                Project(user_id=admin.id, judul='Portfolio CMS', 
                    deskripsi='Headless content management system designed specifically for managing developer portfolios and blogs.', 
                    link_project='https://github.com'),
                Project(user_id=admin.id, judul='Weather Dashboard', 
                    deskripsi='Real-time weather application featuring location-based search, interactive maps, and 7-day forecasts.', 
                    link_project='https://github.com'),
                Project(user_id=admin.id, judul='Chat Application', 
                    deskripsi='Real-time messaging platform supporting direct messages, group chat rooms, and media sharing.', 
                    link_project='https://github.com'),
                Project(user_id=admin.id, judul='Blog Platform Design', 
                    deskripsi='Complete UI/UX redesign for a modern blogging platform focusing on typography and reading experience.', 
                    link_project='https://github.com'),
            ]
            db.session.add_all(default_projects)
            print("Projects seeded.")

        db.session.commit()
            
    return app

# Expose app for Vercel deployment
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
