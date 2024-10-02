import React, { useState, forwardRef } from "react";
import axios from "axios";
import "./css/StudentItem.css";
import config from "../../../config.json";

const StudentItem = forwardRef(({ student }, ref) => {
  const url = config.url;
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 提交文件和学生ID
  const handleSubmit = async () => {
    if (!file) {
      alert("请选择一个文件");
      return;
    }

    if (
      student.basic_assignment_submitted ||
      student.advanced_assignment_submitted
    ) {
      alert("作业已提交");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", student.id);

    try {
      await axios.post(` ${url}/api/submitFile`, formData);
      if (file.name.includes("advanced")) {
        student.advanced_assignment_submitted = true;
      } else {
        student.basic_assignment_submitted = true;
      }
      alert("提交文件成功");
    } catch (error) {
      console.error("提交文件失败", error);
      alert("提交文件失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="student-item" ref={ref}>
      <p>学生姓名：{student.name}</p>
      <p>
        基础作业提交状态：
        {student.basic_assignment_submitted ? "已提交" : "未提交"}
      </p>
      <p>
        进阶作业提交状态：
        {student.advanced_assignment_submitted ? "已提交" : "未提交"}
      </p>
      {student.advanced_assignment_score !== null && (
        <p>进阶作业分数：{student.advanced_assignment_score}</p>
      )}
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          student.basic_assignment_submitted ||
          student.advanced_assignment_submitted
        }
        style={{
          backgroundColor:
            isSubmitting ||
            student.basic_assignment_submitted ||
            student.advanced_assignment_submitted
              ? "#ccc"
              : "#007bff",
        }}
      >
        提交文件
      </button>
    </div>
  );
});

export default StudentItem;
