const formSearch = document.querySelector(".form-search"),
    inputCitiesFrom = formSearch.querySelector(".input__cities-from"),
    dropdownCitiesFrom = formSearch.querySelector(".dropdown__cities-from"),
    inputCitiesTo = formSearch.querySelector(".input__cities-to"),
    dropdownCitiesTo = formSearch.querySelector(".dropdown__cities-to"),
    inputDateDepart = formSearch.querySelector(".input__date-depart");

const citiesApi = "dataBase/cities.json";
// const citiesApi = "http://api.travelpayouts.com/data/ru/cities.json";
const proxy = "https://cors-anywhere.herokuapp.com/";

const API_KEY = "64419c0306fba50f4b589a9f96cfcc8a";

const calendar = new URL(
    "https://api.travelpayouts.com/aviasales/v3/prices_for_dates"
);

let city = [];

const getData = (url, callBack) => {
    const request = new XMLHttpRequest();
    request.open("GET", url);

    request.addEventListener("readystatechange", () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callBack(request.response);
        } else {
            console.error(request.status);
        }
    });
    request.send();
};

const showCity = (input, list) => {
    list.textContent = "";

    if (input.value !== "") {
        const filterCity = city.filter((item) => {
            return item.name.toLowerCase().includes(input.value.toLowerCase());
        });
        filterCity.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("dropdown__city");
            li.textContent = item.name;
            list.append(li);
        });
    }
};

const selectCity = (input, list, event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === "li") {
        input.value = target.textContent;
        list.textContent = "";
    }
};

inputCitiesFrom.addEventListener("input", () =>
    showCity(inputCitiesFrom, dropdownCitiesFrom)
);

inputCitiesTo.addEventListener("input", () =>
    showCity(inputCitiesTo, dropdownCitiesTo)
);

dropdownCitiesFrom.addEventListener("click", () =>
    selectCity(inputCitiesFrom, dropdownCitiesFrom, event)
);

dropdownCitiesTo.addEventListener("click", () =>
    selectCity(inputCitiesTo, dropdownCitiesTo, event)
);

formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name).code,
        to: city.find((item) => inputCitiesTo.value === item.name).code,
        when: inputDateDepart.value,
    };

    // const requestData = `?origin=${formData.from}&destination=${formData.to}&departure_at=${formData.when}&token=${API_KEY}`;

    calendar.searchParams.set("origin", `${formData.from}`);
    calendar.searchParams.set("destination", `${formData.to}`);
    calendar.searchParams.set("departure_at", `${formData.when}`);
    calendar.searchParams.set("token", API_KEY);

    getData(proxy + calendar, (response) => {
        console.log(response);
    });
});

getData(citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => item.name);
});

// getData(proxy + calendar, (response) => {
//     console.log(response);
// });
