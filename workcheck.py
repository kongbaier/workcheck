from flask import Flask, request
import os
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'resp_works'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 配置数据库连接
conn = mysql.connector.connect(user='root', password='root', host='localhost', database='mydb', auth_plugin='mysql_native_password')

@app.route('/api/getStudents')
def get_students():
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()
    print("成功查询到学生信息")
    return students

@app.route('/api/submitFile', methods=['POST'])
def receive_file():
    student_id = request.form.get('studentId')
    file = request.files['file']
    if file:
        filename = f'student_{student_id}_{file.filename}'
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        cursor = conn.cursor()
        is_advanced = 'advanced' in filename
        if is_advanced:
            # 更新进阶作业提交状态为已提交
            cursor.execute("UPDATE students SET advanced_assignment_submitted = true WHERE id = %s", (student_id,))
            conn.commit()
            print(f"学生 {student_id} 的进阶作业已接收并保存，数据库已更新。")
        else:
            # 更新基础作业提交状态为已提交
            cursor.execute("UPDATE students SET basic_assignment_submitted = true WHERE id = %s", (student_id,))
            conn.commit()
            print(f"学生 {student_id} 的基础作业已接收并保存，数据库已更新。")
        return '文件接收成功，数据库已更新', 200
    else:
        return '没有文件上传', 400

if __name__ == '__main__':
    app.run(port=5000)