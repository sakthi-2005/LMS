import axios from "axios";

export async function fetchPendingRequest(user) {
  return await axios
    .get("/leave/pendingrequest", { params: { userId: user.id } })
    .then((response) => {
      console.log("Pending Requests:", response.data.leaveRequestes);
      return response.data.leaveRequestes;
    })
    .catch((err) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      console.error(err);
      return [];
    });
}
