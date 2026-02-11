import React from 'react';

import { useState } from "react";
import axiosInstance from "../config/axiosConfig";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/video", formData);
    setFormData({ title: "", description: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-6 rounded-md space-y-4"
    >
      <input
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        placeholder="Title"
        className="w-full p-2 bg-zinc-800 rounded-md"
      />

      <textarea
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Description"
        className="w-full p-2 bg-zinc-800 rounded-md"
      />

      <button className="bg-red-600 px-4 py-2 rounded-md">
        Upload
      </button>
    </form>
  );
};

export default UploadForm;

