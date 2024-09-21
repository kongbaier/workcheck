import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    } else {
      alert("请输入有效的学生 ID");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="输入学生 ID..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button type="submit">搜索</button>
    </form>
  );
};

export default Search;
