import axios from "axios";
import React, { useEffect, useState } from "react";

const GetAllUser = () => {
  const [user, setUser] = useState();

  // get all user here
  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "http://localhost:5000/api/auth/get-all-users",
        {
          withCredentials: true,
        }
      );
      setUser(res.data.users);
    })();
  }, []);

  // delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/api/auth/delete-user/" + id);

      setUser((pre) => pre.filter((u) => u._id !== id));
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="w-full  ">
      {user?.map((u) => {
        return (
          <div
            key={u.name}
            className="flex flex-col my-2 p-5 bg-white rounded-md shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-bold">{u.name}</h1>
                <p className="text-gray-700">{u.email}</p>
              </div>
              {u.role === "admin" && (
                <p className="text-gray-700 font-bold">{u.role}</p>
              )}

              {u?.role === "user" && (
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-600 text-gray-300 px-3 py-1 rounded-md hover:scale-105"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GetAllUser;
