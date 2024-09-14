import React, { useState } from "react";
import axios from "axios";
import "./StudentItem.css";

const StudentItem = ({ student }) => {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!student.basicSubmitted && !student.advancedSubmitted) {
      setIsSubmitting(true);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("studentId", student.id);
        try {
          await axios.post("http://localhost:5000/api/submitFile", formData);
          if (file.name.includes("advanced")) {
            student.advancedSubmitted = true;
          } else {
            student.basicSubmitted = true;
          }
          alert("提交文件成功");
        } catch (error) {
          console.error("提交文件失败", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  return (
    <div className="student-item">
      <p>学生姓名：{student.name}</p>
      <p>基础作业提交状态：{student.basicSubmitted ? "已提交" : "未提交"}</p>
      <p>进阶作业提交状态：{student.advancedSubmitted ? "已提交" : "未提交"}</p>
      {student.advancedScore !== null && (
        <p>进阶作业分数：{student.advancedScore}</p>
      )}
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleSubmit}
        disabled={
          isSubmitting || student.basicSubmitted || student.advancedSubmitted
        }
        style={{
          backgroundColor:
            student.basicSubmitted || student.advancedSubmitted
              ? "#ccc"
              : "#007bff",
        }}
      >
        提交文件
      </button>
    </div>
  );
};

export default StudentItem;
