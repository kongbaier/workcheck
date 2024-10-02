import React, { useState, useEffect, useRef } from "react";
import StudentItem from "./components/StudentItem/StudentItem";
import { useSelector } from "react-redux";
import Search from "./Search";
import axios from "axios";
import Login from "./components/login/login";
import { loginUser } from "./store/modules/loginStore";
import config from "../config.json";

const App = () => {
  const url = config.url;
  const token = useSelector((state) => state.user.userInfo?.token);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const studentRefs = useRef({});

  // 设置组件的ref
  const setRef = (student, el) => {
    if (el) {
      studentRefs.current[student.id] = el;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/getStudents`);
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("获取学生数据失败", error);
        setError("无法加载学生数据");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 搜索方法实现
  const handleSearch = (term) => {
    const targetStudent = students.find(
      (student) => student.id === parseInt(term)
    );
    if (targetStudent) {
      const targetRef = studentRefs.current[targetStudent.id];
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      alert("未找到学生");
    }
  };

  if (loading) return <p>加载中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* {!isLoggedIn ? <Login /> : <StudentManagement /> } */}

      {!isLoggedIn ? (
        <Login />
      ) : (
        <>
          <Search onSearch={handleSearch} />
          <h1>学生作业管理系统</h1>
          {students.map((student) => (
            <StudentItem
              ref={(el) => setRef(student, el)}
              key={student.id}
              student={student}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
