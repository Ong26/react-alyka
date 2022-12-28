import React, { useEffect, useState } from "react";
import axios from "axios";
import { capitalizeFirstLetter } from "../util";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDisabledButton } from "../util/hooks";
import { DELETE_USER_API, GET_ALL_API } from "../util/apiString";
const fetchList = async () => {
  const prom = axios.get(GET_ALL_API);
  const res = await toast.promise(prom, {
    pending: "Fetching users...",
    success: "Users fetched",
    error: "Fetch fail",
  });
  return res;
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useDisabledButton();
  useEffect(() => {
    document.title = "User List";
    fetchList().then(({ data }) => setUsers(data));
  }, []);

  const deleteUser = async id => {
    if (window.confirm("Are you sure to delete this user?") === true) {
      try {
        if (!disabled) {
          setDisabled(true);
          const prom = axios.delete(DELETE_USER_API, { data: { id: +id } });
          await toast.promise(prom, {
            pending: "Deleting user...",
            success: "User deleted",
            error: "Delete fail",
          });

          fetchList().then(({ data }) => {
            setUsers(data);
            setDisabled(false);
          });
        }
      } catch (error) {
        setDisabled(false);
      }
    }
  };
  return (
    <div className="mt-8 max-w-3xl flex-col mx-auto">
      <ToastContainer autoClose={1250} />
      <div className="text-end">
        <button className="bg-blue-600 text-white p-2 rounded-md" onClick={() => navigate("/create")}>
          Add New User
        </button>
      </div>
      <table className="table-auto w-full mt-4">
        <thead className="uppercase text-gray-700 bg-slate-100 text-left">
          <tr>
            <th className="py-2 px-4">Full Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(x => (
            <tr key={x.email} className="border-b ">
              <td className="py-3 px-4">{x?.first_name + " " + x?.last_name}</td>
              <td className="py-3 px-4">{x?.email}</td>
              <td className="py-3 px-4">{capitalizeFirstLetter(x?.user_role)}</td>
              <td className="py-3 px-4 flex flex-row gap-x-4">
                <div className={`bg-slate-100 rounded-md flex-0  self-center  ${disabled && "bg-slate-50"}`}>
                  <Link to={disabled ? "" : `/edit/${x?.id}`} className="flex flex-row items-center px-2 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                    </svg>
                    Edit
                  </Link>
                </div>
                <div
                  className={`bg-red-500 cursor-pointer rounded-md flex-0 self-center flex flex-row items-center py-1 px-2 text-white ${
                    disabled && "bg-red-200"
                  }`}
                  onClick={() => deleteUser(x.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2 ">
                    <path
                      fillRule="evenodd"
                      fill="white"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
