from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(10), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    profile = db.relationship('Profile', backref='user', uselist=False)
    skills = db.relationship('Skill', backref='user')
    experiences = db.relationship('Experience', backref='user')
    projects = db.relationship('Project', backref='user')


class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nama_lengkap = db.Column(db.String(100))
    nama_panggilan = db.Column(db.String(50))
    tempat_lahir = db.Column(db.String(50))
    tanggal_lahir = db.Column(db.Date)
    email = db.Column(db.String(100))
    telepon = db.Column(db.String(20))
    universitas = db.Column(db.String(100))
    fakultas = db.Column(db.String(100))
    prodi = db.Column(db.String(100))
    semester = db.Column(db.String(20))
    alamat = db.Column(db.String(4000))
    foto_url = db.Column(db.String(255))
    foto_about_url = db.Column(db.String(255))


class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nama_skill = db.Column(db.String(50), nullable=False)
    icon_class = db.Column(db.String(50))


class Experience(db.Model):
    __tablename__ = 'experiences'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    posisi = db.Column(db.String(100), nullable=False)
    perusahaan = db.Column(db.String(100), nullable=False)
    durasi = db.Column(db.String(50))
    deskripsi = db.Column(db.String(4000))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    judul = db.Column(db.String(100), nullable=False)
    deskripsi = db.Column(db.String(4000))
    gambar_url = db.Column(db.String(255))
    link_project = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
