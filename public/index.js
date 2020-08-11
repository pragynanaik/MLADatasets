("use strict");

var startFiltering = document.getElementById("startButton");
var genderInput = document.getElementById("genderDrop");
var roundInput = document.getElementById("roundDrop");
var matchInput = document.getElementById("matchDrop");
var playerInput = document.getElementById("dropCheck");
var submitData = document.getElementById("submitData");

var dataEnter = document.getElementById("EnterData");
var matchTotal = document.getElementById("matchTotal");
var download = document.getElementById("download");
const playerNames = [];

// Date Range Picker  ---- https://www.daterangepicker.com/#example2
$(function () {
  $('input[name="datefilter"]').daterangepicker({
    autoUpdateInput: false,
    locale: {
      cancelLabel: "Clear",
    },
  });

  $('input[name="datefilter"]').on("apply.daterangepicker", function (
    ev,
    picker
  ) {
    $(this).val(
      picker.startDate.format("MM/DD/YYYY") +
        " - " +
        picker.endDate.format("MM/DD/YYYY")
    );

    const dateArray = [];

    if (dateInput.value != "") {
      const dates = dateInput.value.split("-");

      var start = new Date(dates[0]);
      var end = new Date(dates[1]);

      var loop = new Date(start);

      while (loop <= end) {
        var month = "";
        var day = "";
        if (loop.getMonth() < 10) {
          month = "0" + loop.getMonth();
        } else {
          month = loop.getMonth();
        }
        if (loop.getDate() < 10) {
          day = "0" + loop.getDate();
        } else {
          day = loop.getDate();
        }
        dateArray.push(loop.getFullYear() + "-" + month + "-" + day);
        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
      }

      filterInputs.Date = dateArray;

      fetch("/clickedDate", {
        method: "POST",
        body: JSON.stringify(filterInputs),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((filterInputs) => {
          // get the response from the server POST request

          var matches = document.getElementById("matchesNumber");
          matches.textContent = filterInputs["Date"] + " matches";
        });
    }
  });

  $('input[name="datefilter"]').on("cancel.daterangepicker", function (
    ev,
    picker
  ) {
    $(this).val("");
    filterInputs.Date = [];

    fetch("/clickedDate", {
      method: "POST",
      body: JSON.stringify(filterInputs),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((filterInputs) => {
        // get the response from the server POST request

        var matches = document.getElementById("matchesNumber");
        matches.textContent = filterInputs["Date"] + " matches";
      });
  });
});
// ----

var select = document.getElementById("selectNumber");

var dateInput = document.getElementById("dateInput");

startFiltering.addEventListener("click", function () {
  dataEnter.classList.remove("d-none");
  startFiltering.classList.add("d-none");
  matchTotal.classList.remove("d-none");
  download.classList.remove("d-none");
  submitData.classList.remove("d-none");
});

const filterInputs = {};
const dateRanges = {};

genderInput.addEventListener("change", function () {
  filterInputs.Gender = genderInput.value;

  fetch("/clickedGender", {
    method: "POST",
    body: JSON.stringify(filterInputs),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((filterInputs) => {
      // get the response from the server POST request

      var matches = document.getElementById("matchesNumber");
      matches.textContent = filterInputs["Gender"] + " matches";
    });
});

roundInput.addEventListener("change", function () {
  filterInputs["Round Number"] = roundInput.value;

  fetch("/clickedRound", {
    method: "POST",
    body: JSON.stringify(filterInputs),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((filterInputs) => {
      // get the response from the server POST request

      var matches = document.getElementById("matchesNumber");
      matches.textContent = filterInputs["Round Number"] + " matches";
    });
});

matchInput.addEventListener("change", function () {
  filterInputs["Match Type"] = matchInput.value;

  fetch("/clickedMatch", {
    method: "POST",
    body: JSON.stringify(filterInputs),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((filterInputs) => {
      // get the response from the server POST request

      var matches = document.getElementById("matchesNumber");
      matches.textContent = filterInputs["Match Type"] + " matches";
    });
});

playerInput.addEventListener("click", function () {
  var elements = playerInput.children;
  var dropdownMenu = document.getElementById("dropdownMenuButton");
  dropdownMenu.innerHTML = "";

  for (var i = 0; i < elements.length; i++) {
    var input = elements[i].children;
    if (input["0"].checked) {
      if (!playerNames.includes(input["0"].value)) {
        playerNames.push(input["0"].value);
      }
    } else {
      if (playerNames.includes(input["0"].value)) {
        var index = playerNames.indexOf(input["0"].value);
        playerNames.splice(index, 1);
      }
    }
  }

  if (playerNames.length == 0) {
    dropdownMenu.innerHTML = "Select Players from Database: ";
  } else {
    for (var j = 0; j < playerNames.length; j++) {
      if (j <= 3) {
        if (j == 0) {
          var name = playerNames[j];
        } else {
          var name = ",  " + playerNames[j];
        }
        dropdownMenu.innerHTML += name;
      }
    }
  }

  filterInputs.Player = playerNames;

  fetch("/clickedPlayer", {
    method: "POST",
    body: JSON.stringify(filterInputs),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((filterInputs) => {
      // get the response from the server POST request

      var matches = document.getElementById("matchesNumber");
      matches.textContent = filterInputs["Player"] + " matches";
    });
});

download.addEventListener("click", function () {
  fetch("/clickedDownload", {
    method: "POST",
    body: JSON.stringify(filterInputs),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((filterInputs) => {
      // get the response from the server POST request

      var downloadLink = document.createElement("a");
      var blob = new Blob(["\ufeff", filterInputs["Download"]]);
      var url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "Matches.csv"; //Name the file here
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
});

submitData.addEventListener("click", function () {
  fetch("/clickedSubmit", {
    method: "POST",
    body: JSON.stringify(filterInputs),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((filterInputs) => {
      // get the response from the server POST request

      var matches = document.getElementById("matchesNumber");
      matches.textContent = filterInputs["Submit"] + " matches";
    });
});
