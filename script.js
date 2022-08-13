const formSearch = document.querySelector(".form-search"),
    inputCitiesFrom = formSearch.querySelector(".input__cities-from"),
    dropdownCitiesFrom = formSearch.querySelector(".dropdown__cities-from"),
    inputCitiesTo = formSearch.querySelector(".input__cities-to"),
    dropdownCitiesTo = formSearch.querySelector(".dropdown__cities-to"),
    inputDateDepart = formSearch.querySelector(".input__date-depart"),
    cheapestTicket = document.getElementById("cheapest-ticket"),
    otherCheapTickets = document.getElementById("other-cheap-tickets");

const citiesApi = "dataBase/cities.json";
// const citiesApi = "http://api.travelpayouts.com/data/ru/cities.json";
const proxy = "https://cors-anywhere.herokuapp.com/";

const API_KEY = "64419c0306fba50f4b589a9f96cfcc8a";

const calendar = new URL("http://api.travelpayouts.com/v2/prices/month-matrix");

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
            return item.name
                .toLowerCase()
                .startsWith(input.value.toLowerCase());
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

const getDate = (date) => {
    return new Date(date).toLocaleString("ru", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const createCart = (data) => {
    const ticket = document.createElement("article");
    ticket.classList.add("ticket");

    let deep = "";
    if (data) {
        deep = `
            <h3 class='agent'>${data.gate}</h3>
            <div class='ticket__wrapper'>
                <div class='left-side'>
                    <a href='' class='button button__buy'>Купить за ${
                        data.value
                    }p</a>
                </div>
                <div class='right-side'>
                    <div class='block-left'>
                        <div class='city__from'>Вылет из города
                            <span class='city__name'>${
                                inputCitiesFrom.value
                            }</span>
                        </div>
                        <div class='date'>${getDate(data.depart_date)}</div>
                    </div>

                    <div class='block-right'>
                        <div class='changes'>${
                            data.number_of_changes === 0
                                ? "Без пересадок"
                                : `${data.number_of_changes} пересадка(и)`
                        }</div>
                        <div class='city__to'>Город назначения:
                            <span class='city__name'>${
                                inputCitiesTo.value
                            }</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        deep = "<h3>К сожалению, на текущую дату билетов нет</h3>";
    }

    ticket.insertAdjacentHTML("afterbegin", deep);
    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = "block";
    cheapestTicket.innerHTML = "<h2>Самый дешевый билет на выбранную дату</h2>";

    const ticket = createCart(cheapTicket[0]);
    cheapestTicket.insertAdjacentElement("beforeend", ticket);
    console.log(cheapTicket);
};

const renderCheapMonth = (cheapTickets) => {
    otherCheapTickets.style.display = "block";
    otherCheapTickets.innerHTML =
        "<h2>Самые дешевые билеты в текущем месяце</h2>";

    cheapTickets.sort((a, b) => a.value - b.value);
    console.log(cheapTickets);
};

const renderCheap = (data, date) => {
    const cheapTicketMonth = JSON.parse(data).data;
    const cheapTicketDay = cheapTicketMonth.filter((ticket) => {
        return ticket.depart_date === date;
    });
    renderCheapMonth(cheapTicketMonth);
    renderCheapDay(cheapTicketDay);
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
        from: city.find((item) => inputCitiesFrom.value === item.name),
        to: city.find((item) => inputCitiesTo.value === item.name),
        when: inputDateDepart.value,
    };

    if (formData.from && formData.to) {
        // const requestData = `?origin=${formData.from.code}&destination=${formData.to.code}&departure_at=${formData.when}&token=${API_KEY}`;
        calendar.searchParams.set("origin", `${formData.from.code}`);
        calendar.searchParams.set("destination", `${formData.to.code}`);
        calendar.searchParams.set("month", `${formData.when}`);
        calendar.searchParams.set("token", API_KEY);

        getData(proxy + calendar, (response) => {
            renderCheap(response, formData.when);
        });
    } else {
        alert("Введите корректное название города");
    }
});

getData(citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => item.name);
    city.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
});
