let Listbox = document.querySelectorAll(".block-size"); // lấy tất cả các block dạng listbox
let box1 = Listbox[0];
let box2 = Listbox[1];
let box3 = Listbox[2];

let countTemp = document.querySelector(".count1").innerText // querySelector lấy phần tử đầu tiên có class là count1
let countHum = document.querySelector(".count2").innerText
let countLight = document.querySelector(".count3").innerText

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
  if (countLight < 800) {
    box3.style.background = "linear-gradient(to right, #f8d90f, #f2ff00)";
  } 
  else {
    box3.style.background = "linear-gradient(to right, #f2994a, #f2c94c)";
  }
}

function getData() {
  fetch("http://localhost:8080/all")
    .then(function (response) { 
      return response.json();
    })
    .then(function (posts) { // posts là mảng chứa các object
      const temp = [];
      const hum = [];
      const light = [];
      const time =[];
      for(let key of posts){ 
        temp.push(key.temp) // push các giá trị vào mảng
        hum.push(key.hum)
        light.push(key.light)
        time.push(key.time)                          
        }
      // hiển thị nhiệt độ
      countTemp = document.querySelector(".count1").innerText =
        temp[temp.length - 1]; 
      countHum = document.querySelector(".count2").innerText =
        hum[hum.length - 1];
      countLight = document.querySelector(".count3").innerText =
        light[light.length - 1];
      
        changeTemp();
        changeHum();
        changeLight();

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


let onLed1Count = 0;
let offLed1Count = 0;
let onLed2Count = 0;
let offLed2Count = 0;
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
                if (ledCommand === "onled1") {
                    
                    onLed1Count++;
                    fanCount.innerHTML= `${onLed1Count.toFixed(0)} lần`;
                } else if (ledCommand === "onled2") {
                    onLed2Count++;
                    lightCount.innerHTML= `${onLed2Count.toFixed(0)} lần`;
                }
            } else {
                offCallback();
                if (ledCommand === "offled1") {
                    offLed1Count++;
                    offfanCount.innerHTML= `${offLed1Count.toFixed(0)} lần`;
                } else if (ledCommand === "offled2") {
                    offLed2Count++;
                    offlightCount.innerHTML= `${offLed2Count.toFixed(0)} lần`;
                }
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







