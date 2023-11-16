let Listbox = document.querySelectorAll(".block-size");
let box1 = Listbox[0];
let box2 = Listbox[1];
let box3 = Listbox[2];
let box4 = Listbox[3];

let countTemp = document.querySelector(".count1").innerText
let countHum = document.querySelector(".count2").innerText
let countLight = document.querySelector(".count3").innerText
let countGas = document.querySelector(".count4").innerText
let count = 0;

function changeTemp() {
  if (countTemp <= 30) {
    box1.style.background = "linear-gradient(to right, #f8d90f, #f2ff00)";
  } else {
    box1.style.background = "linear-gradient(to right, #ff7f00, #ffcc00";
  }
}
function changeHum() {
  if (countHum <= 30) {
    box2.style.background = "linear-gradient(to right, #4ac2f2, #b3e6fc";
  }
  else {
    box2.style.background = "linear-gradient(to right, #4ac2f2, #1a6f7c)";
  }
}
function changeLight() {
  if (countLight < 100) {
    box3.style.background = "linear-gradient(to right, #f8d90f, #f2ff00)";
  } 
  else {
    box3.style.background = "linear-gradient(to right, #f2994a, #f2c94c)";
  }
}
function changeGas() {
  if (countGas < 100) {
    box4.style.background = "linear-gradient(to right, #5f6062, #44464a)";
  } 
  else {
    box3.style.background = "linear-gradient(to right, #363738, #1e1f20)";
  }
}
function warning() {
  if (countGas > 100) {  
    box1.classList.add('warning');
    box2.classList.add('warning');
    box3.classList.add('warning');
    box4.classList.add('warning');
  } else {
    box1.classList.remove('warning');
    box2.classList.remove('warning');
    box3.classList.remove('warning');
    box4.classList.remove('warning');
  }
}

function getData() {
  fetch("http://localhost:8080/all")
    .then(function (response) {
      return response.json();
    })
    .then(function (posts) {
      const temp = [];
      const hum = [];
      const light = [];
      const gas = [];
      const time =[];
      for(let key of posts){
        temp.push(key.temp)
        hum.push(key.hum)
        light.push(key.light)
        gas.push(key.gas)
        time.push(key.time)                          
        }
      // hiển thị nhiệt độ
      countTemp = document.querySelector(".count1").innerText =
        temp[temp.length - 1];
      countHum = document.querySelector(".count2").innerText =
        hum[hum.length - 1];
      countLight = document.querySelector(".count3").innerText =
        light[light.length - 1];
      countGas = document.querySelector(".count4").innerText =
        gas[gas.length - 1];
        changeTemp();
        changeHum();
        changeLight();
        changeGas();
        warning();
      //hiển thị đồ thị
        new Chart("myChart", {
          type: "line",
          data: {
            labels: time,
            datasets: [
              {
                label: "Temperature",
                data: temp,
                borderColor: "red",
                yAxisID: "temperature-y-axis",
                fill: false,
              },
              {
                label: "Humidity",
                data: hum,
                borderColor: "blue",
                yAxisID: "temperature-y-axis",
                fill: false,
              },
              {
                label: "Light",
                data: light,
                borderColor: "yellow",
                yAxisID: "light-y-axis",
                fill: false,
              },
            ],
          },
          options: {
            legend: { display: true },
            scales: {
              yAxes: [
                {
                  id: "temperature-y-axis", // Đặt ID cho trục tung nhiệt độ
                  position: "left",
                  ticks: {
                    min: 0, // Giá trị tối thiểu trên trục tung nhiệt độ
                    max: 100, // Giá trị tối đa trên trục tung nhiệt độ
                    stepSize: 10, // Bước giữa các giá trị
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Temperature (°C)",
                  },
                },
                {
                  id: "light-y-axis", // Đặt ID cho trục tung ánh sáng
                  position: "right",
                  ticks: {
                    min: 0, // Giá trị tối thiểu trên trục tung ánh sáng
                    max: 1200, // Giá trị tối đa trên trục tung ánh sáng
                    stepSize: 100, // Bước giữa các giá trị
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Light (lux)",
                  },
                },
              ],
            },
          },
        });
        new Chart("myChart2", {
          type: "line",
          data: {
            labels: time,
            datasets: [
              {
                label: 'Khí Gas',
                data: mua,
                yAxisID: 'left-y-axis',
                borderColor: 'red',
                backgroundColor: 'transparent',
            },
            ],
          },
          options: {
            legend: { display: true },
            scales: {
              yAxes: [
                {
                  id: 'left-y-axis',
                  position: 'left',
                  ticks: {
                      min: 0, // Giá trị tối thiểu trên trục tung
                       max: 100, // Giá trị tối đa trên trục tung
                        stepSize: 5, // Bước giữa các giá trị
                      
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Khí Gas",
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
setInterval(getData,5000)
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
  let img = document.querySelector('.img1');
  img.src = 'image/light_on.png';
}
function OffLight() {
  let img = document.querySelector('.img1');
  img.src = 'image/light_off.png';
}


function controlLed(ledCommand, onCallback, offCallback) {
  const postData = `Control/led,${ledCommand}`;
  
  const requestOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/text"
      },
      body: JSON.stringify(postData)
  };

  fetch("http://localhost:8080/led", requestOptions)
      .then(data => {
          if (ledCommand.startsWith("on")) {
              onCallback();
          } else {
              offCallback();
          }
      })
      .catch(error => {
          console.error("Lỗi: ", error);
      });
}

document.querySelector(".onLed1").addEventListener("click", function() {
  controlLed("onled1", OnFan, OffFan);
});

document.querySelector(".offLed1").addEventListener("click", function() {
  controlLed("offled1", OnFan, OffFan);
});

document.querySelector(".onLed2").addEventListener("click", function() {
  controlLed("onled2", OnLight, OffLight);
});

document.querySelector(".offLed2").addEventListener("click", function() {
  controlLed("offled2", OnLight, OffLight);
});



