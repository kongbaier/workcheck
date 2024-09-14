import React, { useState, useEffect } from "react";
import StudentItem from "./StudentItem";
import axios from "axios";

const App = () => {
  const [students, setStudents] = useState([]);

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

  return (
    <div>
      <h1>学生作业管理系统</h1>
      {students.map((student) => (
        <StudentItem key={student.id} student={student} />
      ))}
    </div>
  );
};

export default App;
