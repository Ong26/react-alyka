import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { roles } from "../constants";
import { CREATE_USER_API } from "../util/apiString";
import { useDisabledButton } from "../util/hooks";
const CreateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("administrator");
  const [disabled, setDisabled] = useDisabledButton();
  const navigation = useNavigate();
  useEffect(() => {
    document.title = "Create New User";
    return () => setDisabled(false);
  }, [setDisabled]);
  const emailFormat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const onSubmit = async () => {
    if (!firstName || !lastName || !role) {
      if (!firstName) toast.error("Please fill in the first name");
      if (!lastName) toast.error("Please fill in the last name");
      if (!role) toast.error("Please fill in the role");
      return;
    }
    if (!email || !email.match(emailFormat)) {
      toast.error("Please fill in the email with correct format");
      return;
    }
    try {
      setDisabled(true);
      const user = { first_name: firstName, last_name: lastName, email: email, role: role };
      const prom = axios.post(CREATE_USER_API, user);
      const res = await toast.promise(prom, { pending: "Creating user..." });

      if (res.status === 200) {
        toast.success("Created Successfully", { onClose: () => navigation("/") });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setDisabled(false);
    }
  };

  return (
    <div className="max-w-3xl mt-8 md:mx-auto mx-4">
      <ToastContainer autoClose={1250} />
      <p className="text-xl font-bold my-12">Add New User</p>
      <FormGroup onChange={e => setFirstName(e.target.value)} label={"First Name"} />
      <FormGroup onChange={e => setLastName(e.target.value)} label="Last Name" />
      <FormGroup onChange={e => setEmail(e.target.value)} label="Email" type="email" />
      <div className="flex-col flex mb-6">
        <label>Role</label>
        <select name="role" onChange={e => setRole(e.target.value)} className="h-10 border border-gray-400 mt-2 px-2">
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
          Create User
        </button>
      </div>
    </div>
  );
};

const FormGroup = ({ label, onChange, name, type = "text" }) => {
  return (
    <div className="flex-col flex mb-6">
      <label>{label}</label>
      <input type={type} onChange={onChange} name={name} className="h-10 border border-slate-400 mt-2 px-2 " />
    </div>
  );
};

export default CreateUser;
