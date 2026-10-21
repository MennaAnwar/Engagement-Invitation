
"use strict";

const EVENT = {
    dateTime: "2026-11-06T19:00:00+02:00",
    timeZone: "Africa/Cairo",
    timeLabel: "الساعة ٧ مساءً",
    venueName: "قاعة ديفا",
    venueAddress: "نادي المهندسين – سابا باشا، على البحر",
    mapQuery: "Diva Hall, Engineers Club, Saba Pasha, Alexandria, Egypt"
};

const arabicNumber = new Intl.NumberFormat("en-GB", {
    useGrouping: false
});

function toArabicNumber(value) {
    return arabicNumber.format(value);
}

function getEventDate() {
    return new Date(EVENT.dateTime);
}

function formatArabicEventDate(date) {
    return new Intl.DateTimeFormat("ar-EG", {
        timeZone: EVENT.timeZone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function updateEventDetails() {
    const eventDate = getEventDate();

    const weekdayElement = document.getElementById("event-weekday");
    const dayElement = document.getElementById("event-day");
    const monthElement = document.getElementById("event-month");
    const yearElement = document.getElementById("event-year");
    const arabicDateElement = document.getElementById("event-date-arabic");
    const timeElement = document.getElementById("event-time");
    const venueNameElement = document.getElementById("venue-name");
    const venueDateTimeElement = document.getElementById("venue-date-time");

    if (Number.isNaN(eventDate.getTime())) {
        console.error("Invalid engagement date in EVENT.dateTime.");
        return;
    }

    const dateParts = new Intl.DateTimeFormat("en-GB", {
        timeZone: EVENT.timeZone,
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).formatToParts(eventDate);

    const parts = Object.fromEntries(
        dateParts.map(part => [part.type, part.value])
    );

    if (weekdayElement) {
        weekdayElement.textContent = formatArabicEventDate(eventDate)
            .split("،")[0];
    }

    if (dayElement) {
        dayElement.textContent = parts.day;
    }

    if (monthElement) {
        monthElement.textContent = parts.month.toUpperCase();
    }

    if (yearElement) {
        yearElement.textContent = parts.year;
    }

    if (arabicDateElement) {
        arabicDateElement.textContent = formatArabicEventDate(eventDate);
    }

    if (timeElement) {
        timeElement.textContent = EVENT.timeLabel;
    }

    if (venueNameElement) {
        venueNameElement.textContent = EVENT.venueName;
    }

    if (venueDateTimeElement) {
        venueDateTimeElement.textContent =
            `${formatArabicEventDate(eventDate)} · ${EVENT.timeLabel}`;
    }
}

/* =========================================
   CALENDAR
   Sunday-first calendar with the event day
   explicitly marked with a heart.
   ========================================= */

function buildCalendar() {
    const calendarGrid = document.getElementById("calendar-grid");
    const monthHeading = document.getElementById("calendar-month-year");

    if (!calendarGrid || !monthHeading) {
        return;
    }

    const eventDate = getEventDate();

    if (Number.isNaN(eventDate.getTime())) {
        return;
    }

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: EVENT.timeZone,
        year: "numeric",
        month: "numeric",
        day: "numeric"
    }).formatToParts(eventDate);

    const values = Object.fromEntries(
        parts.map(part => [part.type, Number(part.value)])
    );

    const year = values.year;
    const monthIndex = values.month - 1;
    const eventDay = values.day;

    // The calendar is deliberately generated using the event's
    // actual year and month, not the visitor's current month.
    const firstDay = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
    const daysInMonth = new Date(
        Date.UTC(year, monthIndex + 1, 0)
    ).getUTCDate();

    monthHeading.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        month: "long",
        year: "numeric"
    }).format(new Date(Date.UTC(year, monthIndex, 1)));

    calendarGrid.replaceChildren();

    const weekdays = [
        "أحد",
        "اثنين",
        "ثلاثاء",
        "أربعاء",
        "خميس",
        "جمعة",
        "سبت"
    ];

    weekdays.forEach((weekday) => {
        const heading = document.createElement("div");
        heading.className = "calendar-weekday";
        heading.textContent = weekday;
        calendarGrid.appendChild(heading);
    });

    // Empty cells before the first day of the month.
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-day empty";
        emptyCell.setAttribute("aria-hidden", "true");
        calendarGrid.appendChild(emptyCell);
    }

    // Actual dates.
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";

        const number = document.createElement("span");
        number.textContent = toArabicNumber(day);
        cell.appendChild(number);

        if (day === eventDay) {
            cell.classList.add("is-event-day");
            cell.setAttribute(
                "aria-label",
                `يوم الخطوبة ${formatArabicEventDate(eventDate)}`
            );
            cell.setAttribute("aria-current", "date");
        } else {
            cell.setAttribute("aria-label", toArabicNumber(day));
        }

        calendarGrid.appendChild(cell);
    }
}

/* =========================================
   COUNTDOWN
   ========================================= */

function updateCountdown() {
    const targetTime = getEventDate().getTime();
    const now = Date.now();
    const remaining = targetTime - now;

    const daysElement = document.getElementById("count-days");
    const hoursElement = document.getElementById("count-hours");
    const minutesElement = document.getElementById("count-minutes");
    const secondsElement = document.getElementById("count-seconds");
    const messageElement = document.getElementById("countdown-message");

    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement ||
        Number.isNaN(targetTime)
    ) {
        return;
    }

    if (remaining <= 0) {
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        if (messageElement) {
            messageElement.textContent =
                "بدأت حكايتنا الجميلة، شكرًا لأنكم جزء منها ♡";
        }

        return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

    if (messageElement) {
        messageElement.textContent = "مستنيينكم تشاركونا أجمل يوم ♡";
    }
}

/* =========================================
   GOOGLE MAPS
   ========================================= */

function updateMap() {
    const map = document.getElementById("venue-map");
    const directions = document.getElementById("map-directions");

    const query = encodeURIComponent(EVENT.mapQuery);

    if (map) {
        map.src =
            `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
    }

    if (directions) {
        directions.href =
            `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
}

/* INITIALIZE */

function initializeInvitation() {
    updateEventDetails();
    buildCalendar();
    updateCountdown();
    updateMap();

    // Update the countdown every second.
    window.setInterval(updateCountdown, 1000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeInvitation);
} else {
    initializeInvitation();
}

