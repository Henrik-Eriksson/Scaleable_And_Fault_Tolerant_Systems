import React from "react";
import styled from "@emotion/styled";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateEvent from "../components/CreateEvent.jsx";
import {
  Button,
  Paper,
  Grid,
  FormGroup,
  Typography,
  TextField,
} from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar.jsx";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import EventDetails from "../components/EventDetails.jsx";
import { authenticate } from '../../controllers/userController.js';
import { Snackbar, Alert } from "@mui/material";

export const StyleWrapper = styled.div`
  overflow-y: hidden;
  font-family: "Roboto", sans-serif;
  font-size: 0.95em; /* Adjust as needed */

  .fc-daygrid-day-frame:hover {
    background: rgba(205, 209, 228, 0.3);
  }
  .fc-media-screen {
    background-image: url("../../../hehehe.png");
    background-size: cover; /* Adjust the image to cover the entire element */
    background-repeat: no-repeat; /* Prevents the image from repeating */
    background-position: center; /* Centers the image */
  }
  .css-14ogsoa-MuiModal-root-MuiPopover-root-MuiMenu-root {
    margin-top: 0px !important;
  }
  .fc table {
    font-size: 1.1em;
    color: white;
  }
  .fc-toolbar-title {
    font-size: 3em;
    color: white;
  }
  --fc-border-color: rgba(0, 0, 0, 0);
  .fc-divider {
    background-color: black;
  }
  fc-daygrid-day-frame {
    background-color: rgba(205, 209, 228, 0.3);
  }
`;

const holidays = [
  "2023-10-12T23:00:00.000Z",
  // ... add more dates as needed
];

function dayCellContentRender(info) {
  // Check if the current day is a holiday
  console.log(info.date);

  const date1 = info.date;
  const date2 = new Date("2023-10-12");

  if (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  ) {
    return <span style={{ color: "red" }}>{info.dayNumberText}</span>;
  } else {
    return <>{info.dayNumberText}</>;
  }

  // ... other code or return statements for other conditions
}

function handleMouseEnter(info) {
  console.log(info);
  // change the day's background color just for fun
  //info.dayEl.style.backgroundColor = 'red';
}

function handleMouseLeave(info) {
  console.log(info);
  info.dayEl.style.backgroundColor = "rgba(0,0,0,0)";
}

function MyCalendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);

  async function addExistingEvents() {
    let userId = await authenticate();
    if (userId == null) return;
    try {
      // Fetch existing events for the user
      let response = await axios.post(
        "http://20.45.152.9:5050/api/users/getEvents",
        {
          userId: userId,
        },
      );

      if (response.status !== 200) {
        console.error("Something went wrong while fetching events");
        return;
      }

      // Check if the newEvent already exists in the fetched events
      const existingEvents = response.data; // the server returns an array of events
      // Loop through each event and call addEvent
      existingEvents.forEach((event) => {
        setEvents((prevEvents) => [...prevEvents, event]);
      });
    } catch (error) {
      console.error(
        "An error occurred while fetching events: " + error.message,
      );
      return;
    }
  }
  async function addEvent(newEvent) {
    let userId = await authenticate();
    if (userId == null) return;
    console.log("hello");

    // If the event doesn't exist, add it to the database
    console.log("hello1");
    try {
      let response = await axios.post(
        "http://20.45.152.9:5050/api/users/createEvent",
        {
          event: newEvent,
          userId: userId,
          shared: [],
        },
      );

      console.log("hello2");
      if (response.status === 200) {
        console.log("Event added successfully");
        console.log(response);
        setEvents((prevEvents) => [...prevEvents, newEvent]);

        setSnackbarMessage("Event added successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        console.log("Something went wrong while adding the event");
        console.log(response);
        setSnackbarMessage("Something went wrong while adding the event");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(
        "An error occurred while adding the event: " + error.message,
      );
      console.log(response);
      setSnackbarMessage(
        "Something went wrong while adding the event" + error.message,
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  async function deleteEvent(id) {
    try {
      // Make a DELETE request to the backend to delete the event
      const response = await axios.delete(
        `http://20.45.152.9:5050/api/users/deleteEvent/${id}`,
      );

      // Check if the event was deleted successfully
      if (response.status === 200) {
        // Update the local state to reflect the deletion
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== id),
        );
        console.log("Event deleted successfully");
      } else {
        console.error(
          "Failed to delete event from backend:",
          response.data.message,
        );
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
    handleDetailClose();
  }

  const [eventDetails, setEventDetails] = useState([]);
  function handleEventClick(info) {
    let desc = info.event._def.extendedProps.description;
    let title = info.event._def.title;
    let eventType = info.event._def.extendedProps.eventType;
    let startTime = info.event._instance.range.start;
    let endTime = info.event._instance.range.end;
    let id = info.event._def.publicId;

    let temp = [
      {
        desc: desc,
        title: title,
        eventType: eventType,
        startTime: startTime,
        endTime: endTime,
        id: id,
      },
    ];

    setEventDetails(temp);
    setOpenEventDetails(true);
  }

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // can be 'error', 'warning', 'info', 'success'
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const [selectedDates, setSelectedDates] = useState([]);

  function handleDateClick(info) {
    const dateStr = info.dateStr;

    // Check if date is already selected
    if (selectedDates.includes(dateStr)) {
      // Remove the date from the selectedDates array
      setSelectedDates((prevDates) =>
        prevDates.filter((date) => date !== dateStr),
      );
      info.dayEl.style.backgroundColor = "rgba(205, 209, 228,0)";
    } else {
      // Add the date to the selectedDates array
      setSelectedDates((prevDates) => [...prevDates, dateStr]);
      info.dayEl.style.backgroundColor = "gray";
    }
  }

  const [open, setOpen] = useState(false);
  const [openEventDetails, setOpenEventDetails] = useState(false);
  function createEventClick(info) {
    if (selectedDates.length !== 0) {
      console.log(info);
      setOpen(true); // Open the dialog
    } else {
      setSnackbarMessage(
        "Please select a date on the calendar by clicking on it before you proceed to create an event.",
      );
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
  }

  function handleDetailClose() {
    setOpenEventDetails(false);
  }

  function handleClose() {
    setOpen(false);
  }

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reRender, setReRender] = useState(true); //ez just make a change to a key that forces the component to re mount

  useEffect(() => {
    const prepareCalendarData = async () => {
      let allHolidays = [];
      for (let year = 2022; year <= 2031; year++) {
        const response = await axios.get(
          `https://date.nager.at/api/v3/PublicHolidays/${year}/SE`,
        );
        allHolidays = allHolidays.concat(response.data);
      }
      setHolidays(allHolidays);

      await addExistingEvents();

      setLoading(false);
    };

    prepareCalendarData();
  }, []);

  function clearSelectedDates() {
    setSelectedDates((prevDates) => []);
    setReRender((prev) => !prev);
  }
  function toLocalISOString(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().split("T")[0];
  }
  function dayCellDidMount(info) {
    const dateStr = toLocalISOString(info.date); // Use the custom function here

    // Check if the date is in the selectedDates array
    if (selectedDates.includes(dateStr)) {
      console.log("CHECKING THIS");
      console.log(info);
      info.el.style.backgroundColor = "rgba(205, 209, 228,1)";
    }

  const holiday = holidays.find((h) => {
    // Parse the holiday date and adjust for the local time zone
    const holidayDate = new Date(h.date);
    holidayDate.setDate(holidayDate.getDate() - 1); // Adjust holiday date by subtracting one day

    // Compare the adjusted holiday date with the current cell's date
    return holidayDate.toISOString().split('T')[0] === info.date.toISOString().split('T')[0];
  });
    if (holiday) {
      const holidayNameElement = document.createElement("div");

      holidayNameElement.innerText = holiday.localName;
      holidayNameElement.innerHTML = holiday.localName.replace(" ", "<br>"); // This will break the text at the first space
      holidayNameElement.style.color = "#ff3333";
      holidayNameElement.style.fontSize = "0.8em"; // Adjust as needed
      holidayNameElement.style.display = "flex"; // Use flexbox for centering
      holidayNameElement.style.justifyContent = "center"; // Horizontal centering
      holidayNameElement.style.alignItems = "center"; // Vertical centering
      holidayNameElement.style.height = "100%"; // Take full height of the parent container
      holidayNameElement.style.width = "100%"; // Take full width of the parent container
      holidayNameElement.style.overflow = "hidden"; // Hide overflowed text
      holidayNameElement.style.textOverflow = "ellipsis"; // Display ellipsis for overflowed text
      holidayNameElement.style.whiteSpace = "nowrap"; // Prevent text from wrapping to the next line
      info.el
        .querySelector(".fc-daygrid-day-events")
        .appendChild(holidayNameElement);
      const dayNumberElement = info.el.querySelector(".fc-daygrid-day-number");
      dayNumberElement.style.color = "#ff3333";
    }
  }

  return (
<Paper style={{
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(../../../Hejsan.png)`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  minHeight: 'calc(100vh)', // Adjust this value to match the height of your navbar
  border: 'none', // This will remove any border
  boxShadow: 'none' // This will remove shadow as well, which might look like a border
}}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "90%",
            maxWidth: "600px",
            fontSize: "1.2rem",
            padding: "20px",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={0}>
        <ResponsiveAppBar />

        <Grid item xs={0} sm={1} md={2} lg={3} />

        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Paper>
            <StyleWrapper>
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                <FullCalendar
                  key={reRender}
                  events={events}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  dateClick={handleDateClick}
                  eventMouseEnter={handleMouseEnter}
                  eventMouseLeave={handleMouseLeave}
                  dayCellDidMount={dayCellDidMount}
                  eventClick={handleEventClick}
                  //dayCellContent={dayCellContentRender}
                  customButtons={{
                    myCustomButton: {
                      text: "Create Event",
                      click: createEventClick,
                    },
                  }}
                  headerToolbar={{
                    left: "myCustomButton",
                    center: "title",
                    //right: 'dayGridMonth'
                  }}
                />
              )}

            </StyleWrapper>

          </Paper>
        </Grid>




        <Dialog
          open={open}
          onClose={handleClose}
          sx={{ overflow: "auto" }}
          maxWidth="sm" // or "lg" or "xl"
          fullWidth={true}
        >
          <CreateEvent
            closeDialog={handleClose}
            addEvent={addEvent}
            setSelectedDates={setSelectedDates}
            selectedDates={selectedDates}
            clearSelectedDates={clearSelectedDates}
          />
        </Dialog>

        <Dialog
          open={openEventDetails}
          onClose={handleDetailClose}
          sx={{ overflow: "auto" }}
          maxWidth="xl"
        >
          <EventDetails
            deleteEvent={deleteEvent}
            closeDialog={handleClose}
            eventDetails={eventDetails}
          />
        </Dialog>
      </Grid>
    </Paper>
  );
}
export default MyCalendar;
