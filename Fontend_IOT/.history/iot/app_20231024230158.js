let Listbox = document.querySelectorAll(".block-size");
let box1 = Listbox[0];
let box2 = Listbox[1];
let box3 = Listbox[2];

let countTemp = document.querySelector(".count1");
let countHum = document.querySelector(".count2");
let countLight = document.querySelector(".count3");
let count = 0;

function changeColor(element, value, thresholds, colors) {
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) {
      element.style.background = colors[i];
      return;
    }
  }
  element.style.background = colors[colors.length - 1];
}

function getTempAllData() {
  fetch("http://localhost:8080/all")
    .then(function (response) {
      return response.json();
    })
    .then(function (posts) {
      const temp = [];
      const hum = [];
      const light = [];
      const time = [];
      for (let key of posts) {
        temp.push(key.temperature);
        hum.push(key.humidity);
        light.push(key.light);
        time.push(key.time);
      }

      countTemp.innerText = temp[temp.length - 1];
      countHum.innerText = hum[hum.length - 1];
      countLight.innerText = light[light.length - 1];

      changeColor(box1, countTemp, [10, 25, 35, 50], ["#9fb4d0", "#c8b83f", "#f2c94c", "#fd0606"]);
      changeColor(box2, countHum, [10, 25, 35, 50], ["#848590", "#5259a4", "#3846de", "#4ac2f2"]);
      changeColor(box3, countLight, [100], ["#9fb4d0"]);
      changeColor(box3, countLight, [100], ["#f2ff00"]);

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
                id: "temperature-y-axis",
                position: "left",
                ticks: {
                  min: 0,
                  max: 100,
                  stepSize: 10,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Temperature (°C)",
                },
              },
              {
                id: "light-y-axis",
                position: "right",
                ticks: {
                  min: 0,
                  max: 1200,
                  stepSize: 100,
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

setInterval(getTempAllData, 5000);

function toggleFan(animationName) {
  const blades = document.querySelectorAll(".blade");
  blades.forEach((blade) => {
    blade.style.animation = animationName;
  });
}

function OnFan() {
  toggleFan("rotateFan 1s linear infinite");
}

function OffFan() {
  toggleFan("none");
}

function toggleLight(imagePath) {
  let img = document.querySelector('.img1');
  img.src = imagePath;
}

function OnLight() {
  toggleLight('image/light_on.png');
}

function OffLight() {
  toggleLight('image/light_off.png');
}

const controlLamp = (postData, callback) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/text",
    },
    body: JSON.stringify(postData),
  };

  fetch("http://localhost:8080/led", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API: ${response.status}`);
      }
      return response.text;
    })
    .then(data => {
      callback(data);
    })
    .catch(error => {
      console.error("Lỗi: ", error);
    });
};

document.querySelector(".onLed1").addEventListener("click", function () {
  const postData = "Control/led,onled1";
  controlLamp(postData, (data) => {
    OnFan();
    console.log(data);
  });
});

document.querySelector(".offLed1").addEventListener("click", function () {
  const postData = "Control/led,offled1";
  controlLamp(postData, (data) => {
    OffFan();
    console.log(data);
  });
});

document.querySelector(".onLed2").addEventListener("click", function () {
  const postData = "Control/led,onled2";
  controlLamp(postData, (data) => {
    OnLight();
    console.log(data);
  });
});

document.querySelector(".offLed2").addEventListener("click", function () {
  const postData = "Control/led,offled2";
  controlLamp(postData, (data) => {
    OffLight();
    console.log(data);
  });
});


