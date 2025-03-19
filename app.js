import { Calendar } from "vanilla-calendar-pro";
import "vanilla-calendar-pro/styles/index.css";
import "vanilla-calendar-pro/styles/layout.css"; // Только скелет
import "vanilla-calendar-pro/styles/themes/light.css"; // Светлая тема
import "vanilla-calendar-pro/styles/themes/dark.css"; // Темная тема

const switchElement = document.querySelector("input");
const submitBtn = document.querySelector("#submitBtn");

let isClicked = false;

switchElement.addEventListener("click", () => {
  isClicked = !isClicked;
  console.log(isClicked);
  calendar.init();
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
  onChangeTime(self) {
    finalTime = self.context.selectedTime;
    console.log(finalTime);
  },
  onClickDate(self) {
    finalDate = self.context.selectedDates[0];
    console.log(finalDate);
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

// Основная функция для инициализации календаря
const initializeCalendar = async () => {
  // Получаем список дат с сервера
  const events = await fetchEvents();

  // Инициализируем календарь
  const calendar = new Calendar("#calendar", options);

  // Устанавливаем даты с событиями
  calendar.set({
    dates: events.map((e) => e.date), // Передаем массив дат
  });

  // Инициализируем календарь
  calendar.init();

  // Возвращаем календарь для дальнейшего использования
  return calendar;
};

// Инициализация календаря при загрузке страницы
let calendar;
initializeCalendar().then((cal) => {
  calendar = cal;
});

// Обработчик для кнопки отправки
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