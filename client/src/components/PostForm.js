import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../contexts/UserContext';
import { useDropzone } from "react-dropzone";


function PostForm({ onAddPost }) {
  const { userProfile } = useUser();
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif"] },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        alert(
          "Invalid file type or size. Only image files up to 5MB are allowed."
        );
      } else {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      }
    },
    maxSize: 1024 * 1024 * 5, // 5MB file size limit
  });


  useEffect(() => {
    setOrganizer(userProfile.username);
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text && date && eventName && location && organizer && files.length > 0) {
      const formData = new FormData();
      formData.append("organizer", organizer);
      formData.append("title", eventName);
      formData.append("description", text);
      formData.append("date", date);
      formData.append("location", location);
      formData.append("image", files[0]);

      try {
        console.log("Posting event...", formData);
        const response = await axios.post(
          "https://localhost:3000/events",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userProfile.username}`,
            },
            withCredentials: true,
          }
        );
        onAddPost(response.data); // Optionally update UI based on response
        setText("");
        setDate("");
        setEventName("");
        setLocation("");
        setFiles([]);
      } catch (error) {
        console.error("Error creating event:", error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-[#eeeeee] p-4 rounded-lg shadow-md"
      encType="multipart/form-data"
    >
      <h2 className="text-4xl text-center text-zinc-700 mb-8">Create a Post</h2>

      <div className="grid grid-cols-2 gap-24">
        <div {...getRootProps()} className="border-dashed border-2 border-zinc-600 bg-zinc-300 p-4 rounded-lg mb-4 cursor-pointer">
          <input name='image' {...getInputProps()} />
          {files.length > 0 ? (
            <div className="flex justify-center items-center">
              <img src={files[0].preview} alt="preview" className="w-full h-96" />
            </div>
          ) : (
            <p className="text-zinc-700 h-full flex justify-center items-center">
              {isDragActive ? "Drop the image here ..." : "Drag n drop an image here or click to select an image"}
            </p>
          )}
        </div>

        <div>
          {/* <div className="mb-4">
            <label className="block text-zinc-700 mb-1">Organizer:</label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full p-2 rounded border border-zinc-600 bg-zinc-300 text-zinc-700"
              required
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-zinc-700 mb-1">Event Name:</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2 rounded border border-zinc-600 bg-zinc-300 text-zinc-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-700 mb-1">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded border border-zinc-600 bg-zinc-300 text-zinc-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-700 mb-1">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 rounded border border-zinc-600 bg-zinc-300 text-zinc-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-700 mb-1">Post Content:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
              className="w-full p-2 rounded border border-zinc-600 bg-zinc-300 text-zinc-700"
              required
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full text-2xl bg-zinc-300 p-4 rounded-lg hover:brightness-90 text-zinc-700 transition-all"
      >
        Post
      </button>
    </form>
  );
}

export default PostForm;
