import { useEffect } from "react";
import { Bell, List, Square, Timer } from "lucide-react";
import { Sunrise, Moon } from "lucide-react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Heading,
} from "react-aria-components";

import {
  today,
  getDayOfWeek,
  CalendarDateTime,
  getLocalTimeZone,
  Time,
} from "@internationalized/date";
import { LightTooltip } from "../mainSidebar/ToolTipLabel";
import { SelectDropdown } from "../SelectDropdown";
import { TextLimit } from "../mainSidebar/MainProfile";
import { useParams } from "react-router-dom";
import { usePersonalListContext } from "../../context/PersonalListContext";
import { useMenu } from "../sidebar/List/MenuProvider";
import { useTaskForm } from "../../context/TaskFormContext";
import { Recurrence } from "./AddTask";

export const AddTaskDropdown = () => {
  const { setOpenTaskCreate } = useMenu();
  const {
    setFormDate,
    setReminder,
    setTaskList,
    recurrence,
    DailyRecurrenceToggle,
    clientReminder,
    clientTaskList,
    setClientRecurrence,
    setClientReminder,
    setClientTaskList,
    resetAll,
    setTime,
    time,
    setClientTime,
    date,
    setDate,
  } = useTaskForm();

  const defaultDate = today(getLocalTimeZone());
  const { items } = usePersonalListContext();
  const locale = navigator.language;
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenTaskCreate(false);
      }
    };
    if (id) {
      setTaskList(id);
      const matchedList = items.find((item) => item.id === id);
      const name = matchedList?.name;
      if (name) setClientTaskList(name);
    }
    document.addEventListener("keydown", escFunction);
    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, []);

  useEffect(() => {
    if (time) {
      // If date is null (not selected), use defaultDate with the selected time
      const selectedDate = date || defaultDate;

      // Create date object treating the input as UTC
      const utcDate = new Date(
        Date.UTC(
          selectedDate.year,
          selectedDate.month - 1,
          selectedDate.day,
          time.hour,
          time.minute,
          time.second
        )
      );

      // Get ISO string (UTC)
      setFormDate(utcDate.toISOString());

      // If we're using the default date because no date was selected,
      // we should also update the date state to reflect this
      if (!date) {
        setDate(
          new CalendarDateTime(
            defaultDate.year,
            defaultDate.month,
            defaultDate.day,
            time.hour,
            time.minute,
            time.second
          )
        );
      }
    }
  }, [date, time, defaultDate, setFormDate]);

  const handleTimeSelect = (selectedTime: Time) => {
    setTime(selectedTime);
    setClientTime(selectedTime.toString());
    // If no date is selected, use today's date with the new time
    if (!date) {
      setDate(
        new CalendarDateTime(
          defaultDate.year,
          defaultDate.month,
          defaultDate.day,
          selectedTime.hour,
          selectedTime.minute,
          selectedTime.second
        )
      );
    }
  };

  const timeDropdown = Array.from({ length: 24 }, (_, i) => {
    return new Time(i, 0); // Creates Time objects for each hour (0-23) at 0 minutes
  });

  return (
    <div className="absolute  flex items-center justify-center w-full h-screen z-50 ">
      <div className="absolute w-[540px] ">
        <div className="flex flex-col p-5  bg-white dark:bg-d dark:border-purple-700 border-primary border rounded-xl">
          <div
            className={`flex   text-gray-600 items-center justify-center space-x-7 dark:text-texto h-full`}
          >
            {/*////////// datePicker //////////////// */}

            <div className="flex flex-1">
              <div
                className="w-72 
                        px-1 py-2 rounded-lg "
              >
                <Calendar
                  value={defaultDate}
                  onChange={(calendarDate) => {
                    time
                      ? setDate(
                          new CalendarDateTime(
                            calendarDate.year,
                            calendarDate.month,
                            calendarDate.day,
                            time.hour,
                            time.minute,
                            time.second
                          )
                        )
                      : setDate(
                          new CalendarDateTime(
                            calendarDate.year,
                            calendarDate.month,
                            calendarDate.day
                          )
                        );
                  }}
                  aria-label="Appointment date"
                  className="w-full text-gray-600 dark:text-texto text-sm max-w-[300px]"
                >
                  <header className="flex items-center justify-between mb-2">
                    <Button
                      slot="previous"
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dd"
                    >
                      ◀
                    </Button>
                    <Heading className="font-medium" />
                    <Button
                      slot="next"
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dd"
                    >
                      ▶
                    </Button>
                  </header>
                  <CalendarGrid weekdayStyle={`short`} className="w-full">
                    {(dateInfo) => (
                      <CalendarCell
                        date={dateInfo}
                        className={`p-2
                                } text-center rounded-full ${
                                  (!date &&
                                    defaultDate &&
                                    dateInfo.compare(defaultDate) == 0) ||
                                  (date && dateInfo.compare(date) === 0) ||
                                  (date &&
                                    recurrence === "DAILY" &&
                                    dateInfo.compare(date) >= 0) ||
                                  (!date &&
                                    recurrence === "DAILY" &&
                                    dateInfo.compare(defaultDate) >= 0) ||
                                  (date &&
                                    recurrence === "WEEKLY" &&
                                    getDayOfWeek(dateInfo, locale) ===
                                      getDayOfWeek(date, locale) &&
                                    dateInfo.compare(date) >= 0) ||
                                  (!date &&
                                    defaultDate &&
                                    recurrence === "WEEKLY" &&
                                    getDayOfWeek(dateInfo, locale) ===
                                      getDayOfWeek(defaultDate, locale) &&
                                    dateInfo.compare(defaultDate) >= 0) ||
                                  (date &&
                                    recurrence === "MONTHLY" &&
                                    dateInfo.day ===
                                      Math.min(
                                        date.day,
                                        dateInfo.calendar.getDaysInMonth(
                                          dateInfo
                                        )
                                      ) &&
                                    dateInfo.compare(date) >= 0) ||
                                  (!date &&
                                    defaultDate &&
                                    recurrence === "MONTHLY" &&
                                    dateInfo.day ===
                                      Math.min(
                                        defaultDate.day,
                                        dateInfo.calendar.getDaysInMonth(
                                          dateInfo
                                        )
                                      ) &&
                                    dateInfo.compare(defaultDate) >= 0)
                                    ? "bg-primary dark:bg-purple-700 text-white "
                                    : "hover:bg-gray-100 dark:hover:bg-dd hover:text-gray-900 dark:hover:text-white"
                                } `}
                      />
                    )}
                  </CalendarGrid>
                </Calendar>
              </div>
            </div>

            <div className="flex flex-col pt-6 gap-4 h-full max-w-full">
              <SelectDropdown
                height="h-52"
                LabelClass={`justify-between w-44 p-2 rounded-md`}
                dropdownClass="top-full left-0 mt-2 w-44  max-w-44 "
                label={time ? time.toString().slice(0, 5) : "Time"}
                info="Time"
                icon={<Timer size={20}></Timer>}
              >
                {({ setOpen }) =>
                  timeDropdown.map((Time) => (
                    <button
                      className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => {
                        handleTimeSelect(Time);
                        setOpen(false);
                      }}
                    >
                      <span>{Time.toString().slice(0, 5)}</span>
                    </button>
                  ))
                }
              </SelectDropdown>
              <SelectDropdown
                height="h-full"
                LabelClass="justify-between w-44 p-2 rounded-md"
                dropdownClass="top-full left-0 mt-2 w-44  max-w-44"
                label={clientTaskList ?? "List"}
                info="List"
                icon={<List size={20}></List>}
              >
                {/* lists array start */}
                {({ setOpen }) =>
                  items.map((list, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setClientTaskList(list.name);
                        setTaskList(list.id);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <TextLimit text={list.name} limit={16} />
                      <Square
                        fill={list.color}
                        stroke={list.color}
                        className="w-5 h-5"
                      />
                    </button>
                  )) ?? <div>Add Lists</div>
                }
              </SelectDropdown>

              <SelectDropdown
                height="h-full"
                LabelClass="justify-between w-44 p-2  rounded-md"
                dropdownClass="top-full left-0 mt-2 w-48  max-w-48"
                label={clientReminder ?? "Reminder"}
                info="Reminder Time"
                icon={<Bell size={20}></Bell>}
              >
                {/* Remineder at */}
                {({ setOpen }) => (
                  <>
                    <button
                      onClick={() => {
                        if (date) {
                          const jsDate = new Date(date.toString());
                          const rDate = new Date(jsDate);
                          rDate.setDate(rDate.getDate() - 1);
                          setClientReminder("1 Day Before");
                          setReminder(rDate.toISOString());
                        }
                        setOpen(false);
                      }}
                      className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>1 Day Before</span>
                    </button>
                    <button
                      onClick={() => {
                        if (date) {
                          const jsDate = new Date(date.toString());
                          const rDate = new Date(jsDate);
                          rDate.setDate(rDate.getDate() - 2);
                          setClientReminder("2 Days Before");
                          setReminder(rDate.toISOString());
                        }
                        setOpen(false);
                      }}
                      className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>2 Days Before</span>
                    </button>
                    <button
                      onClick={() => {
                        if (date) {
                          const jsDate = new Date(date.toString());
                          const rDate = new Date(jsDate);
                          rDate.setDate(rDate.getDate() - 3);
                          setClientReminder("3 Days Before");
                          setReminder(rDate.toISOString());
                        }
                        setOpen(false);
                      }}
                      className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>3 Days Before</span>
                    </button>
                    <button
                      onClick={() => {
                        if (date) {
                          const jsDate = new Date(date.toString());
                          const rDate = new Date(jsDate);
                          rDate.setDate(rDate.getDate() - 4);
                          setClientReminder("4 Days Before");
                          setReminder(rDate.toISOString());
                        }
                        setOpen(false);
                      }}
                      className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>4 Days Before</span>
                    </button>
                  </>
                )}
              </SelectDropdown>

              <div className="hidden lg:block">
                <div
                  className={` flex pt-4 h-20 
                            "space-x-8"
                           justify-between`}
                >
                  <LightTooltip arrow title="Daily">
                    <button
                      type="button"
                      onClick={() => {
                        DailyRecurrenceToggle(Recurrence.daily);
                        setClientRecurrence(Recurrence.daily);
                      }}
                      className={`group flex items-center justify-center hover:border-opacity-70 dark:hover:text-opacity-70  bg-main ${
                        recurrence === "DAILY"
                          ? "text-primary  dark:text-purple-400"
                          : ""
                      }  dark:bg-dd rounded-lg w-12 h-12`}
                    >
                      <Sunrise className="group-hover:opacity-70" />
                    </button>
                  </LightTooltip>

                  <LightTooltip arrow title="Weekly">
                    <button
                      type="button"
                      onClick={() => {
                        DailyRecurrenceToggle(Recurrence.weekly);
                        setClientRecurrence(Recurrence.weekly);
                      }}
                      className={`group flex items-center justify-center hover:border-opacity-70 dark:hover:text-opacity-70  bg-main ${
                        recurrence === "WEEKLY"
                          ? "text-primary  dark:text-purple-400"
                          : ""
                      }  dark:bg-dd rounded-lg w-12 h-12`}
                    >
                      <div className="text-md group-hover:opacity-70 font-semibold">
                        +7
                      </div>
                    </button>
                  </LightTooltip>

                  <LightTooltip arrow title="Monthly">
                    <button
                      type="button"
                      onClick={() => {
                        DailyRecurrenceToggle(Recurrence.monthly);
                        setClientRecurrence(Recurrence.monthly);
                      }}
                      className={`group flex items-center justify-center hover:border-opacity-70 dark:hover:text-opacity-70  bg-main ${
                        recurrence === "MONTHLY"
                          ? "text-primary  dark:text-purple-400"
                          : ""
                      }  dark:bg-dd rounded-lg w-12 h-12`}
                    >
                      <Moon className="group-hover:opacity-70" />
                    </button>
                  </LightTooltip>
                </div>
              </div>
            </div>
          </div>

          {/*  */}
          <div className="py-10 flex items-center justify-center gap-10 w-full h-10">
            <button
              className="h-10 px-4  bg-gray-200 text-darko rounded-md"
              onClick={() => {
                resetAll();
                setOpenTaskCreate(false);
              }}
              type="button"
            >
              Clear
            </button>
            <button
              className={`opacity-40':'opacity-100'} h-10 px-4 bg-primary text-white rounded-md`}
              onClick={() => setOpenTaskCreate(false)}
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
