// change root url to
const ROOT = "http://localhost:8000";
const ROOT_URL = `${ROOT}/wp-json/wp/v2`;

const GET_ALL_API = `${ROOT_URL}/user_list`;
const GET_ONE_API = `${ROOT_URL}/user`;
const CREATE_USER_API = `${ROOT_URL}/create_user`;

const EDIT_USER_API = `${ROOT_URL}/edit_user`;
const DELETE_USER_API = `${ROOT_URL}/delete_user`;

export { GET_ALL_API, GET_ONE_API, CREATE_USER_API, EDIT_USER_API, DELETE_USER_API };
