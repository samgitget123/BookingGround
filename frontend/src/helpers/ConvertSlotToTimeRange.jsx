import React from 'react'

const convertSlotToTimeRange = (slot) => {
    console.log("Received slot:", slot); // Debugging
    // Convert slot if it's a string like "6.0" or "7.5"
    if (typeof slot === "string") {
      const parsedSlot = slot.split(".").map(Number);
      if (parsedSlot.length === 2) {
        slot = parsedSlot;  // Convert "6.0" → [6, 0], "6.5" → [6, 1]
      } else {
        console.error("Invalid slot format:", slot);
        return "Invalid Slot";
      }
    }

    // Ensure slot is an array with two numeric elements
    if (!Array.isArray(slot) || slot.length !== 2 || isNaN(slot[0]) || isNaN(slot[1])) {
      console.error("Invalid slot format:", slot);
      return "Invalid Slot";
    }

    const [hours, half] = slot;

    let startHour, startMinutes, endHour, endMinutes, period, endPeriod;

    // Determine the start time
    if (hours === 0 || hours === 24) {
      startHour = 12;
      startMinutes = half === 0 ? "00" : "30";
      period = "AM";
    } else if (hours > 0 && hours < 12) {
      startHour = hours;
      startMinutes = half === 0 ? "00" : "30";
      period = "AM";
    } else if (hours === 12) {
      startHour = 12;
      startMinutes = half === 0 ? "00" : "30";
      period = "PM";
    } else {
      startHour = hours - 12;
      startMinutes = half === 0 ? "00" : "30";
      period = "PM";
    }

    // Determine the end time
    if (half === 0) {
      endHour = hours;
      endMinutes = "30";
    } else {
      endHour = hours + 1;
      endMinutes = "00";
    }

    // Determine the end period
    if (endHour === 24) {
      endHour = 12;
      endPeriod = "AM";
    } else if (endHour === 12) {
      endPeriod = "PM";
    } else if (endHour > 12) {
      endHour -= 12;
      endPeriod = "PM";
    } else {
      endPeriod = "AM";
    }

    console.log(`Converted Time: ${startHour}:${startMinutes} ${period} - ${endHour}:${endMinutes} ${endPeriod}`);

    return `${startHour}:${startMinutes} ${period} - ${endHour}:${endMinutes} ${endPeriod}`;
  };

export default convertSlotToTimeRange