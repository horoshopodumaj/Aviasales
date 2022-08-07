const formSearch = document.querySelector(".form-search"),
    inputCitiesFrom = formSearch.querySelector(".input__cities-from"),
    dropdownCitiesFrom = formSearch.querySelector(".dropdown__cities-from"),
    inputCitiesTo = formSearch.querySelector(".input__cities-to"),
    dropdownCitiesTo = formSearch.querySelector(".dropdown__cities-to"),
    inputDateDepart = formSearch.querySelector(".input__date-depart");

const city = ["Москва", "Санкт-Петербург", "Минск", "Караганда", "Челябинск"];

inputCitiesFrom.addEventListener("input", () => {
    console.log(inputCitiesFrom);
});
