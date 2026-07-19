from flask import Blueprint, render_template, session, redirect
from functools import wraps

dashboard_bp = Blueprint('dashboard', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect('/admin/login')
        return f(*args, **kwargs)
    return decorated_function

@dashboard_bp.route('/dashboard')
@login_required
def dashboard():
    return render_template('admin/dashboard.html')

@dashboard_bp.route('/profiles')
@login_required
def profiles_view():
    return render_template('admin/profiles.html')

@dashboard_bp.route('/skills')
@login_required
def skills_view():
    return render_template('admin/skills.html')

@dashboard_bp.route('/experiences')
@login_required
def experiences_view():
    return render_template('admin/experience.html')

@dashboard_bp.route('/projects')
@login_required
def projects_view():
    return render_template('admin/projects.html')
