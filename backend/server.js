const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Middleware
const authenticate = require("./middleware/authmiddleware");

// routesPath
const authRoutes = require("./routes/auth");
const leaveBalanceRoutes = require("./routes/leaveBalance");
const reportees = require("./routes/reportees");
const holidays = require("./routes/holidays");
const requestleave = require("./routes/request");
const pendingRequest = require("./routes/pendingrequest");
const calenderLeave = require("./routes/calendarLeaves");
const history = require("./routes/history");
const acceptRequest = require("./routes/acceptRequest");
const rejectRequest = require("./routes/rejectRequest");
const addUser = require("./routes/addUser");
const addLeave = require("./routes/addLeave");
const allUser = require("./routes/allUsers");
const allLeave = require("./routes/allLeaves");
const userDetails = require("./routes/userDetails");
const updateUser = require("./routes/updateUser");
const updateLeave = require("./routes/updateLeave");
const cancelRequest = require("./routes/cancelRequest");
const deleteLeave = require("./routes/deleteLeave");
const deleteuser = require("./routes/deleteUser");

dotenv.config();
const { initializeDatabase } = require("./config/db");
initializeDatabase();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api/leave", authenticate, leaveBalanceRoutes);
app.use("/api/user", authenticate, userDetails);
app.use("/api/user", authenticate, reportees);
app.use("/api/leave", authenticate, holidays);
app.use("/api/leave", authenticate, requestleave);
app.use("/api/leave", authenticate, pendingRequest);
app.use("/api/leave", authenticate, calenderLeave);
app.use("/api/leave", authenticate, history);
app.use("/api/leave", authenticate, acceptRequest);
app.use("/api/leave", authenticate, rejectRequest);
app.use("/api/leave", authenticate, cancelRequest);
app.use("/api/admin", authenticate, addUser);
app.use("/api/admin", authenticate, addLeave);
app.use("/api/admin", authenticate, allUser);
app.use("/api/admin", authenticate, allLeave);
app.use("/api/admin", authenticate, updateUser);
app.use("/api/admin", authenticate, updateLeave);
app.use("/api/admin", authenticate, deleteLeave);
app.use("/api/admin", authenticate, deleteuser);

// app.use('')

// Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
