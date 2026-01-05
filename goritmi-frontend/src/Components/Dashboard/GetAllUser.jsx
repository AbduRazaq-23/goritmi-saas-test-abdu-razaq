import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const GetAllUser = () => {
  const [users, setUsers] = useState();
  const { getUsers } = useAuth();

  // get all user here
  useEffect(() => {
    (async () => {
      const Users = await getUsers();
      setUsers(Users);
    })();
  }, []);

  // delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/api/user/delete-user/" + id);

      setUsers((pre) => pre.filter((u) => u._id !== id));
    } catch (error) {
      throw error;
    }
  };
  // deActivate or Activate user
  const toggleStatus = async (id) => {
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/user/toggle-status/" + id
      );
      // to update ui button
      setUsers((pre) =>
        pre.map((u) =>
          u._id === id ? { ...u, isActive: res.data.user.isActive } : u
        )
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="w-full  ">
      {users?.map((u) => {
        return (
          <div
            key={u._id}
            className="flex flex-col  my-2 p-5 bg-white rounded-md shadow-md"
          >
            <div className="md:flex justify-between items-center">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <img
                  className="w-14 h-14 rounded-full"
                  src={u?.logo?.url}
                  alt=""
                />
                <div>
                  <h1 className="font-bold">{u.name}</h1>
                  <p className="text-gray-700">{u.email}</p>
                </div>
              </div>
              {u.role === "admin" && (
                <p className="text-gray-700 font-bold">{u.role}</p>
              )}

              {u?.role === "user" && (
                <div className="flex gap-2 mt-2">
                  {" "}
                  <button
                    onClick={() => toggleStatus(u._id)}
                    className={`${
                      u.isActive ? "bg-green-600" : "bg-red-500"
                    } text-gray-300 px-3 py-1 rounded-md hover:scale-105`}
                  >
                    {u.isActive ? "Activate" : "Deactivated"}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-600 text-gray-300 px-3 py-1 rounded-md hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GetAllUser;
