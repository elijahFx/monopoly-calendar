import { Calendar } from "vanilla-calendar-pro";
import "vanilla-calendar-pro/styles/index.css";
import "vanilla-calendar-pro/styles/layout.css";
import "vanilla-calendar-pro/styles/themes/light.css";
import "vanilla-calendar-pro/styles/themes/dark.css";

const switchElement = document.querySelector("input");
const submitBtn = document.querySelector("#submitBtn");

let isClicked = false;

switchElement.addEventListener("click", () => {
  isClicked = !isClicked;
});

let finalTime = undefined;
let finalDate = undefined;

const options = {
  locale: "ru",
  selectionTimeMode: 24,
  timeMinHour: 9,
  timeMaxHour: 23,
  timeStepMinute: 5,
  selectedTheme: "light",
  timeControls: "range",
  displayDateMin: getTomorrowDate(),
  dateMax: getDateMax(),
  onChangeTime(self) {
    finalTime = self.context.selectedTime;
  },
  onClickDate(self) {
    finalDate = self.context.selectedDates[0];
  },
  onCreateDateEls(self, dateEl) {
    console.log(dateEl);
    
    const randomBoolean = Math.random() < 0.1;
    if (!randomBoolean) return;
    const randomPrice = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    const btnEl = dateEl.querySelector('[data-vc-date-btn]');
    const day = btnEl.innerText;
    btnEl.style.flexDirection = 'column';
    btnEl.innerHTML = `
      <span>${day}</span>
      <span style="font-size: 8px;color: #8BC34A;">$${randomPrice}</span>
    `;
  },
};

// Функция для получения списка дат с сервера
const fetchEvents = async () => {
  try {
    const response = await fetch("https://ваш-сервер.com/api/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const data = await response.json();
    return data; // Предполагаем, что сервер возвращает массив дат в формате [{ date: "2025-03-15", event: "Событие 1" }, ...]
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

const initializeCalendar = async () => {
  const events = await fetchEvents();

  const calendar = new Calendar("#calendar", options);

  calendar.set({
    dates: events.map((e) => e.date),
  });

  calendar.init();

  return calendar;
};

// Инициализация календаря при загрузке страницы
let calendar;
initializeCalendar().then((cal) => {
  calendar = cal;
});

submitBtn.addEventListener("click", async () => {
  if (!finalDate || !finalTime) {
    console.log("Пожалуйста, выберите дату и время.");
    return;
  }

  try {
    const response = await fetch("https://ваш-сервер.com/api/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time: finalTime,
        date: finalDate,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const data = await response.json();
    console.log("Ответ сервера:", data);
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
  }
});

// utilities

function getDateMax() {
  const currentDate = new Date();
  const maxDate = new Date(currentDate);

  maxDate.setMonth(currentDate.getMonth() + 3);

  const year = maxDate.getFullYear();
  const month = String(maxDate.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const day = String(maxDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTomorrowDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Добавляем 1 день

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
