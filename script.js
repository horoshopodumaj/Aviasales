const formSearch = document.querySelector(".form-search"),
    inputCitiesFrom = formSearch.querySelector(".input__cities-from"),
    dropdownCitiesFrom = formSearch.querySelector(".dropdown__cities-from"),
    inputCitiesTo = formSearch.querySelector(".input__cities-to"),
    dropdownCitiesTo = formSearch.querySelector(".dropdown__cities-to"),
    inputDateDepart = formSearch.querySelector(".input__date-depart");

const city = [
    "Москва",
    "Санкт-Петербург",
    "Минск",
    "Караганда",
    "Челябинск",
    "Керчь",
    "Волгоград",
    "Самара",
    "Днепропетровск",
    "Екатеринбург",
    "Ухань",
    "Шымкен",
    "Калининград",
    "Нижний Новгород",
    "Вроцлав",
    "Ростов-на-Дону",
];

const showCity = () => {
    dropdownCitiesFrom.textContent = "";

    if (inputCitiesFrom.value !== "") {
        const filterCity = city.filter((item) => {
            return item
                .toLowerCase()
                .includes(inputCitiesFrom.value.toLowerCase());
        });
        filterCity.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("dropdown__city");
            li.textContent = item;
            dropdownCitiesFrom.append(li);
        });
    }
};

inputCitiesFrom.addEventListener("input", showCity);
