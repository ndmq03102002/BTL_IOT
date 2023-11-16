let Listbox = document.querySelectorAll(".block-size");
let box1 = Listbox[0];
let box2 = Listbox[1];
let box3 = Listbox[2];

let countTemp = document.querySelector(".count1").innerText
let countHum = document.querySelector(".count2").innerText
let countLight = document.querySelector(".count3").innerText
let count = 0;

function changeTemp() {
  if (countTemp <= 30) {
    box1.style.background = "#4ac2f2";
  } 
  if (countTemp > 30) {
    box1.style.background = "#e6923e";
  }
}
function changeHum() {
  if (countHum <= 30) {
    box2.style.background = "#4ac2f2";
  }
  if (countHum > 30) {
    box2.style.background = "#4c62f2";
  }
}
function changeLight() {
  if (countLight < 100) {
    box3.style.background = "#9fb4d0";
  } 
  if (countLight >= 100) {
    box3.style.background = "#f2ff00";
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
      const time =[];
      for(let key of posts){
        temp.push(key.temperature)
        hum.push(key.humidity)
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


const OnLampRight = document.querySelector(".onLed1").addEventListener("click",function(e){
  const postData = "Control/led,onled1";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/led", requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Lỗi khi gọi API: ${response.status}`);
          }
          return response.text;  // Trả về dữ liệu JSON từ phản hồi
      })
      .then(data => {
        
          OnFan();
          // Xử lý dữ liệu từ API tại đây
      })
      .catch(error => {
          console.error("Lỗi: ", error);
      });
})

const OffLampRight = document.querySelector(".offLed1").addEventListener("click",function(e){
  const postData = "Control/led,offled1";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/led", requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Lỗi khi gọi API: ${response.status}`);
          }
          return response.text;  // Trả về dữ liệu JSON từ phản hồi
      })
      .then(data => {
          console.log(data)
          OffFan()
          // Xử lý dữ liệu từ API tại đây
      })
      .catch(error => {
          console.error("Lỗi: ", error);
      });
})


const OnLampLeft = document.querySelector(".onLed2").addEventListener("click",function(e){
  const postData = "Control/led,onled2";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/led", requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Lỗi khi gọi API: ${response.status}`);
          }
          return response.text;  // Trả về dữ liệu JSON từ phản hồi
      })
      .then(data => {
          console.log(data)
          OnLight();
          // Xử lý dữ liệu từ API tại đây
      })
      .catch(error => {
          console.error("Lỗi: ", error);
      });
})

const OffLampLeft = document.querySelector(".offLed2").addEventListener("click",function(e){
  const postData = "Control/led,offled2";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/led", requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Lỗi khi gọi API: ${response.status}`);
          }
          return response.text;  // Trả về dữ liệu JSON từ phản hồi
      })
      .then(data => {
          console.log(data)
          OffLight();
          // Xử lý dữ liệu từ API tại đây
      })
      .catch(error => {
          console.error("Lỗi: ", error);
      });
})


