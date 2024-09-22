from flask import Flask, request, jsonify
import os
import mysql.connector
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash,generate_password_hash
import jwt
import datetime

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = '22RuanGong2'

UPLOAD_FOLDER = 'workcheck/resp_works'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 数据库配置
def get_db_connection():
    return mysql.connector.connect(
        user='root', password='root', host='localhost', database='mydb', auth_plugin='mysql_native_password'
    )

@app.route('/api/getStudents', methods=['GET'])
def get_students():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM students")
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(students), 200
    except Exception as e:
        print(f"Error fetching students: {e}")
        return jsonify({'error': 'Failed to fetch students'}), 500

@app.route('/api/submitFile', methods=['POST'])
def receive_file():
    try:
        student_id = request.form.get('studentId')
        file = request.files['file']
        if file:
            filename = secure_filename(f'student_{student_id}_{file.filename}')
            file.save(os.path.join(UPLOAD_FOLDER, filename))

            conn = get_db_connection()
            cursor = conn.cursor()
            is_advanced = 'advanced' in filename

            if is_advanced:
                cursor.execute("UPDATE students SET advanced_assignment_submitted = true WHERE id = %s", (student_id,))
            else:
                cursor.execute("UPDATE students SET basic_assignment_submitted = true WHERE id = %s", (student_id,))

            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({'message': 'File received and database updated'}), 200
        else:
            return jsonify({'error': 'No file uploaded'}), 400
    except Exception as e:
        print(f"Error receiving file: {e}")
        return jsonify({'error': 'Failed to process file'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('username')
    password = data.get('password')
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE student_id = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    # print(type(password),type(user['password']))
    # print(generate_password_hash(user['password']))
    # print(password)
    # print(check_password_hash(user['password'], password))

    if user and user['password'] == password:
        # 创建 JWT
        print("检测通过")
        token = jwt.encode({
            'user_id': user['student_id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # JWT 有效期为 1 小时
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'id': user['student_id'],
            'name': user['name'],
            'token': token
        }), 200
    else:
        return jsonify({'message': '登录失败，用户名或密码不正确'}), 401

if __name__ == '__main__':
    app.run(port=5000)
