import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/modules/loginStore";
import "./css/login.css";

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.user);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(loginUser({ username, password }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser({ username, password }));
      if (response.payload && response.payload.token) {
        localStorage.setItem("token", response.payload.token); // 存储 token
      } else {
        console.error("未收到有效的 token");
      }
    } catch (error) {
      console.error("登录失败", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} id="LoginForm">
        <h1 style={{ margin: "0 auto" }}>登录</h1>
        <div className="content">
          <p>学号:</p>
          <input
            className="username"
            type="text"
            placeholder="学号"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="content">
          <p>密码:</p>
          <input
            className="password"
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="loginbut" type="submit" disabled={loading}>
          {loading ? "登陆中..." : "登录"}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
