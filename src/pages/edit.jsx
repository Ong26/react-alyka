import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { roles } from "../constants";
import { EDIT_USER_API, GET_ONE_API } from "../util/apiString";
import { useDisabledButton } from "../util/hooks";
const EditUser = () => {
  const { id } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("reader");
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useDisabledButton();
  const navigation = useNavigate();
  const emailFormat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  useEffect(() => {
    document.title = "Edit User";
    // setLoading(true);
    const fetchDetail = async () => {
      const prom = axios.get(`${GET_ONE_API}/${id}`);
      const res = await toast.promise(prom, {
        pending: "Fetching data...",
        success: "Data loaded",
        error: "Fetch fail",
      });
      const user = res.data;
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setRole(user.user_role);
      setEmail(user.email);
      setLoading(false);
    };
    fetchDetail();
    return () => {
      setDisabled(false);
    };
  }, [id, setDisabled]);
  const onSubmit = async () => {
    if (!firstName || !lastName || !role) {
      if (!firstName) toast.error("Please fill in the first name");
      if (!lastName) toast.error("Please fill in the last name");
      if (!role) toast.error("Please fill in the first name");
      return;
    }
    if (!email || !email.match(emailFormat)) {
      toast.error("Please fill in the email with correct format");
      return;
    }
    try {
      setDisabled(true);
      const user = { id: +id, first_name: firstName, last_name: lastName, email: email, role: role };
      const prom = axios.post(EDIT_USER_API, user);
      const res = await toast.promise(prom, { pending: "Editing user..." });
      if (res.status === 200) {
        toast.success("Edited Successfully", { onClose: () => navigation("/") });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setDisabled(false);
    }
  };

  return (
    <div className="max-w-3xl mt-8 md:mx-auto mx-4">
      <ToastContainer autoClose={1250} />
      <p className="text-xl font-bold my-12">Edit User</p>
      {!loading && (
        <>
          <FormGroup onChange={e => setFirstName(e.target.value)} label={"First Name"} value={firstName} />
          <FormGroup onChange={e => setLastName(e.target.value)} label="Last Name" value={lastName} />
          <FormGroup onChange={e => setEmail(e.target.value)} label="Email" type="email" value={email} />
          <div className="flex-col flex mb-6">
            <label>Role</label>
            <select
              name="role"
              onChange={e => setRole(e.target.value)}
              value={role}
              className="h-10 border border-gray-400 mt-2 px-2"
            >
              {roles.map(x => (
                <option value={x.value} key={x.value}>
                  {x.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-end">
            <button
              disabled={disabled}
              type="submit"
              className={`bg-blue-600 text-white p-2 rounded-md ${disabled && "bg-blue-300"}`}
              onClick={onSubmit}
            >
              Edit User
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const FormGroup = ({ label, onChange, name, type = "text", value }) => {
  return (
    <div className="flex-col flex mb-6">
      <label>{label}</label>
      <input
        type={type}
        onChange={onChange}
        name={name}
        value={value}
        className="h-10 border border-slate-400 mt-2 px-2 "
      />
    </div>
  );
};

export default EditUser;
