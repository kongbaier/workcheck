import React, { useState, useEffect, useRef } from "react";
import StudentItem from "./StudentItem";
import Search from "./Search";
import axios from "axios";

const App = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const studentRefs = useRef([]);

  // 设置组件的ref
  const setRef = (student, el) => {
    if (el) {
      studentRefs.current[student.id] = el;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getStudents"
        );
        console.log(response.data); // 打印后端返回的数据
        setStudents(response.data);
      } catch (error) {
        console.error("获取学生数据失败", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const targetStudent = students.find(
      (student) => student.id === parseInt(term)
    );
    // console.log("已找到学生", targetStudent);
    if (targetStudent) {
      const targetRef = studentRefs.current[targetStudent.id];
      // console.log("已找到 ref", targetRef);
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div>
      <Search onSearch={handleSearch} />
      <h1>学生作业管理系统</h1>
      {students.map((student) => (
        <StudentItem
          ref={(el) => setRef(student, el)}
          key={student.id}
          student={student}
        />
      ))}
    </div>
  );
};

export default App;
