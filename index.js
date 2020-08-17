
var startYear = 1990;
var endYear = 2040;
var sortedDay = {};
var dayName = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
}

dropdownGenerator = () => {
    const selectFilter = document.getElementById('column-year-dropdown');
    for (var i = startYear; i < endYear; i++) {
        var el = document.createElement("option");
        el.className = 'dropdown-item';
        el.selected = false;
        el.textContent = i;
        el.value = i;
        let currentYear = (new Date()).getFullYear();
        if (i === currentYear) { el.selected = true }
        selectFilter.appendChild(el);
    }
}

validateJSON = (text) => {

    document.getElementById("incorrect-message").style.display = 'none';
    try {
        let minifyJson = JSON.parse(text); //valid json check

        minifyJson.forEach(element => {
            element["intDate"] = Date.parse(element.birthday);
            let personName = element.name.split(" ");
            element["displayName"] = personName[0].charAt(0) + personName[1].charAt(0)
        })

        minifyJson = sortByAge(minifyJson);


        minifyJson.forEach(element => {
            if (!element.name || !element.birthday) { //name and birdthday are present check
                return false;
            }
            let dateCheck = new Date(element.birthday);
            if (dateCheck instanceof Date) { //birthday is a valid date check
                sortByWeekDay(element, dateCheck);
            } else {
                return false
            }
        });
        return minifyJson;
    } catch (e) {
        console.log('error');
        document.getElementById("incorrect-message").style.display = 'block';
        return false;
    }
}

sortByAge = (weekArray) => {
    weekArray.sort((a, b) => {
        return b.intDate - a.intDate;
    })

    return weekArray;
}

sortByWeekDay = (person, dateCheck) => {
    let date = dateCheck.getDate();
    let month = dateCheck.getMonth() + 1;
    let currentYear = document.getElementById('column-year-dropdown').value;

    let currentDate = new Date(month + "/" + date + "/" + currentYear);
    let day = currentDate.getDay();

    if (sortedDay[dayName[day]]) {
        sortedDay[dayName[day]].push(person);

    } else {
        sortedDay[dayName[day]] = [];
        sortedDay[dayName[day]].push(person);
    }
}

getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

generateCalender = () => {
    let requiedJson = document.getElementById('bdayTextarea').value;

    if (validateJSON(requiedJson)) {
        placeInCalender();
    }

    return false;
}

placeInCalender = () => {

    for (var day in sortedDay) {
        let dayId = "card-body-" + day;
        let row = "";
        let currentDay = document.getElementById(dayId);
        currentDay.innerHTML = '';
        sortedDay[day].forEach(el => {
            let person = document.createElement('div');
            person.className = "person-row";
            person.innerHTML = el.displayName;
            person.style.backgroundColor = getRandomColor();
            currentDay.appendChild(person);
        })

    }
}

resetCalender = () => {

    let allCards = document.getElementsByClassName("card-body-week");
    for (var i = 0; i < allCards.length; i++) {
        allCards[i].innerHTML = '';
    }
}

document.getElementById("incorrect-message").style.display = 'none';
dropdownGenerator();
