import React from 'react';

import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axiosInstance.get(`/comments/${videoId}`);
      setComments(res.data);
    };
    fetchComments();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post(`/comments/${videoId}`, { text });
    setText("");
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-zinc-800 p-2 rounded-md"
          placeholder="Add a comment"
        />
        <button className="bg-red-600 px-4 rounded-md">
          Post
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-zinc-900 p-3 rounded-md">
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
