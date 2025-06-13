import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from '../utils/Spinner'

let colour_arr = [];

const leaveColors = {
  Holiday: "#45aaf2",
  Weekend: "#ffeaa7",
  Today: "#00b894",
  Multiple: "#ff6b6b",
};

for(let i=0;i<20;i++)colour_arr.push(getRandomColor());

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function CalendarPage({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  let [userLeaves, setUserLeaves] = useState([]);
  let [holidays, setHolidays] = useState([]);
  let [loading, setLoading] = useState(true);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  useEffect(() => {
    
    async function fetchuserLeaves() {
      setLoading(true);
      await axios
        .get("/leave/calendarLeaves", { params: { userId: user.id } })
        .then((response) => {
          setLoading(false);
          console.log(response.data.leaves);
          setUserLeaves(response.data.leaves);
        })
        .catch((err) => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          console.log(err);
        });
    }
    fetchuserLeaves();

    async function fetchHolidays() {
      setLoading(true);
      await axios
        .get("/leave/holiday", { params: { userId: user.id } })
        .then((response) => {
          setLoading(false);
          setHolidays(response.data.holidays);
        })
        .catch((err) => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          console.log(err);
        });
    }
    fetchHolidays();

    async function fetchLeaveTypes() {
      setLoading(true);
      await axios
        .get("/admin/allLeaves")
        .then((response) => {
          setLoading(false);
          response.data.leaves.forEach((leave,i) => {
            leaveColors[leave.name] = colour_arr[i]
          });
        })
        .catch((err) => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          console.log(err);
        });
    }
    fetchLeaveTypes();
  }, []);

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = date.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const fullDate = new Date(year, month, d + 1);
      const dateStr = fullDate.toISOString().split("T")[0];
      const isWeekend = fullDate.getDay() === 1 || fullDate.getDay() === 0;
      let isHoliday = false;
      let holidayName = "";

      for (let day of holidays) {
        if (
          new Date(day.date).toLocaleDateString("de-DE") ==
          new Date(dateStr).toLocaleDateString("de-DE")
        ) {
          isHoliday = true;
          holidayName = day.name;
          break;
        }
      }

      let leaves = [];

      if (userLeaves != null && userLeaves.length != 0) {
        leaves = userLeaves.filter(
          (leave) =>
            new Date(leave.from_date).toLocaleDateString("de-DE") <=
              new Date(dateStr).toLocaleDateString("de-DE") &&
            new Date(leave.to_date).toLocaleDateString("de-DE") >=
              new Date(dateStr).toLocaleDateString("de-DE")
        );
      }

      let isLayout = false;
      let layoutColor = '#000';
      let isToday = false;
      let isLayoutStart = false;
      let isLayoutEnd = false;
      let color = leaveColors.Default;
      if (leaves.length == 1) {
        isLayout = true ; 
        layoutColor = leaveColors[leaves[0].Type];
        if(new Date(leaves[0].from_date).toLocaleDateString("de-DE") === new Date(dateStr).toLocaleDateString("de-DE") ){
          isLayoutStart = true;
        }
        if(new Date(leaves[0].from_date).toLocaleDateString("de-DE") === new Date(dateStr).toLocaleDateString("de-DE")){
          isLayoutEnd = true;
        }
      }
      else if (leaves.length > 1) {
        isLayout = true;
        layoutColor = leaveColors.Multiple;
        for(let i=0;i<leaves.length;i++){
          if(new Date(leaves[i].from_date).toLocaleDateString("de-DE") === new Date(dateStr).toLocaleDateString("de-DE") ){
            isLayoutStart = true;
          }
          if(new Date(leaves[i].from_date).toLocaleDateString("de-DE") === new Date(dateStr).toLocaleDateString("de-DE")){
            isLayoutEnd = true;
          }
        }
      }
      else if (isHoliday) {
        color = leaveColors.Holiday;
      } else if (isWeekend) color = leaveColors.Weekend;
      if (dateStr == new Date().toISOString().split("T")[0]){
        color = leaveColors.Today;
        isToday = true;
      }

      days.push({
        date: dateStr,
        isToday,
        label: d,
        isHoliday,
        isWeekend,
        leaves,
        color,
        holidayName,
        isLayout,
        layoutColor,
        isLayoutStart,
        isLayoutEnd
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = getDaysInMonth(year, month);
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="calendar-container">
        {loading && <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: '#fff',
        }}>
          <Spinner size={60} borderColor="rgba(255,255,255,0.2)" borderTopColor="#00c6ff" />
          <div style={{ marginTop: 16, fontSize: '1.2rem', opacity: 0.9, fontFamily: 'Arial, sans-serif' }}>
            Please wait...
          </div>
        </div>}
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&larr;</button>
        <h2>
          {monthName} {year}
        </h2>
        <button onClick={handleNextMonth}>&rarr;</button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
          <div key={i} className="calendar-day-name">
            {d}
          </div>
        ))}

        {days.map((day, idx) => (
          <div
            key={idx}
            className="calendar-cell"
            style={{position: 'relative', backgroundColor: day?.color || "transparent", outline: (day?.isToday ? '1.5px solid brown' : 0)}}
            onClick={() => day && setSelectedDay(day)}
          >
            {day && day.isLayout && <span style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:day.layoutColor,textAlign:'center',opacity:((day.isHoliday || day.isWeekend) ? 0.6 : 1), mixBlendMode: 'overlay', borderRadius: `${day.isLayoutStart ? '1rem' : '0'} ${day.isLayoutEnd ? '1rem' : '0'} ${day.isLayoutEnd ? '1rem' : '0'} ${day.isLayoutStart ? '1rem' : '0'}`}}>{day.label}</span>}
            {day && !day.isLayout && day.label}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        {Object.entries(leaveColors).map(([type, color]) => (
          <span key={type}>
            <span className="legend-color" style={{ background: color }}></span>{" "}
            {type}
          </span>
        ))}
      </div>
      {selectedDay &&
        (selectedDay.isHoliday ||
          selectedDay.leaves.length > 0 ) && (
          <div className="day-details">
            <h3>{new Date(selectedDay.date).toLocaleDateString("en-GB")}</h3>
            {selectedDay.leaves.length > 0 && (
              <ul>
                {selectedDay.leaves.map((leave, i) => (
                  <li key={i}>
                    <strong>{leave.u_name}</strong> - {leave.Type}
                  </li>
                ))}
              </ul>
            ) } 

            { selectedDay.isHoliday && (
              <p>{selectedDay.holidayName}</p>
            ) }
            <button onClick={() => setSelectedDay(null)}>Close</button>
          </div>
        )}
    </div>
  );
}
