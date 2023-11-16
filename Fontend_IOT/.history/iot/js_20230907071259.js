let Listbox = document.querySelectorAll(".khoi-size");
let box1 = Listbox[0];
let box2 = Listbox[1];
let box3 = Listbox[2];
// let arrayP = box.getElementsByTagName("p");
// console.log(arrayP[1].innerText);

let countTemp = document.getElementsByClassName(".count1").innerText;
let countHum = document.getElementsByClassName(".count2").innerText;
let countLight = document.getElementsByClassName(".count3").innerText;

let count = 0;

function changeTemp() {
  if (countTemp <= 10) {
    box1.style.backgroundColor = "#9fb4d0";
  } else if (countTemp <= 25) {
    box1.style.backgroundColor = "#3fc848";
  } else if (countTemp <= 35) {
    box1.style.backgroundColor = "#c8b83f";
  } else {
    box1.style.backgroundColor = "#c83f3f";
  }
  if (countTemp > 50) {
    box1.style.backgroundColor = "#fd0606";
  }
}
function changeHum() {
  if (countHum <= 10) {
    box2.style.backgroundColor = "#9fb4d0";
  } else if (countHum <= 25) {
    box2.style.backgroundColor = "#3fc848";
  } else if (countHum <= 35) {
    box2.style.backgroundColor = "#c8b83f";
  } else {
    box2.style.backgroundColor = "#c83f3f";
  }
  if (countHum > 50) {
    box2.style.backgroundColor = "#fd0606";
  }
}
function changeLight() {
  if (countLight <= 10) {
    box3.style.backgroundColor = "#9fb4d0";
  } else if (countLight <= 25) {
    box3.style.backgroundColor = "#3fc848";
  } else if (countLight <= 35) {
    box3.style.backgroundColor = "#c8b83f";
  } else {
    box3.style.backgroundColor = "#c83f3f";
  }
  if (countLight > 50) {
    box3.style.backgroundColor = "#fd0606";
  }
}
function getTempAllData() {
  fetch("http://localhost:8080/Iot/getAllData")
    .then(function (response) {
      return response.json();
    })
    .then(function (posts) {
      const temp = [];
      const hum = [];
      const light = [];
      for (let key of posts) {
        temp.push(key.temperature);
        hum.push(key.humidity);
        light.push(key.light);
      }
      // hiển thị nhiệt độ
      countTemp = document.querySelector(".count1").innerText =
        temp[temp.length - 1];
      countHum = document.querySelector(".count2").innerText =
        hum[hum.length - 1];
      countLight = document.querySelector(".count3").innerText =
        light[light.length - 1];
      console.log("hello");
      changeTemp();
      changeHum();
      changeLight();
      //hiển thị đồ thị
      const xValues = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45];
      type: "line",
        new Chart("myChart", {
          type: "line",
          data: {
            labels: xValues,
            datasets: [
              {
                data: temp,
                borderColor: "red",
                fill: false,
              },
              {
                data: hum,
                borderColor: "green",
                fill: false,
              },
              {
                data: light,
                borderColor: "blue",
                fill: false,
              },
            ],
          },
          options: {
            legend: { display: false },
            scales: {
              yAxes: [
                {
                  ticks: {
                    min: 1, // Giá trị tối thiểu trên trục tung
                    max: 100, // Giá trị tối đa trên trục tung
                    stepSize: 5, // Bước giữa các giá trị
                  },
                },
              ],
            },
          },
        });
    })
    .catch(function (err) {
      console.log(err);
    });
}
function OnFan() {
  const blade1 = (document.querySelector(".blade-1").style.animation =
    "rotateFan1 1s linear infinite");
  const blade2 = (document.querySelector(".blade-2").style.animation =
    "rotateFan2 1s linear infinite");
  const blade3 = (document.querySelector(".blade-3").style.animation =
    "rotateFan3 1s linear infinite");
}
function OffFan() {
  const blade1 = document
    .querySelector(".blade-1")
    .style.removeProperty("animation");
  const blade2 = document
    .querySelector(".blade-2")
    .style.removeProperty("animation");
  const blade3 = document
    .querySelector(".blade-3")
    .style.removeProperty("animation");
}
function OnLight() {
  const light = (document.querySelector(".light-bulb").style.animation =
    "bulbLight 1s linear forwards");
}
function OffLight() {
  const light = document
    .querySelector(".light-bulb")
    .style.removeProperty("animation");
}
