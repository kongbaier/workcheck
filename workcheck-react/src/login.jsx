import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./store/modules/loginStore";

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="学号"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "登陆中..." : "登录"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
