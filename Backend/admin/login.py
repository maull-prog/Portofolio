from flask import Blueprint, request, jsonify, session, render_template, redirect, url_for
from werkzeug.security import check_password_hash
from model import User

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('admin/login.html')
        
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            return jsonify({"status": "success", "message": "Login berhasil"})
            
        return jsonify({"status": "error", "message": "Username atau password salah"}), 401

@login_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect('/admin/login')
