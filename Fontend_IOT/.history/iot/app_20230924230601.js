let Listbox = document.querySelectorAll(".block-size");
let box1 = Listbox[0];
let box2 = Listbox[1];
let box3 = Listbox[2];

let countTemp = document.querySelector(".count1").innerText
let countHum = document.querySelector(".count2").innerText
let countLight = document.querySelector(".count3").innerText
let count = 0;

function changeTemp() {
  if (countTemp <= 10) {
    box1.style.background = "#9fb4d0";
  } else if (countTemp <= 25) {
    box1.style.background = "#c8b83f";
  } else if (countTemp <= 35) {
    box1.style.background = "#f2c94c";
  } else {
    box1.style.background = "#f2c94c";
  }
  if (countTemp > 50) {
    box1.style.background = "#fd0606";
  }
}
function changeHum() {
  if (countHum <= 10) {
    box2.style.background = "#848590";
  } else if (countHum <= 25) {
    box2.style.background = "#5259a4";
  } else if (countHum <= 35) {
    box2.style.background = "#3846de";
  } else {
    box2.style.background = "#1a6f7c";
  }
  if (countHum > 50) {
    box2.style.background = "#4ac2f2";
  }
}
function changeLight() {
  if (countLight <= 10) {
    box3.style.background = "#9fb4d0";
  } else if (countLight <= 25) {
    box3.style.background = "#c8b83f";
  } else if (countLight <= 35) {
    box3.style.background = "#f2c94c";
  } else {
    box3.style.background = "#c83f3f";
  }
  if (countLight > 50) {
    box3.style.background = "#f2ff00";
  }
}
function getTempAllData() {
  fetch("http://localhost:8080/getAllData")
    .then(function (response) {
      return response.json();
    })
    .then(function (posts) {
      const temp = [];
      const hum = [];
      const light = [];
      // const mua =[];
      const time =[];
      for(let key of posts){
        temp.push(key.temperature)
        hum.push(key.humidity)
        light.push(key.light)
        // mua.push(key.mua)
         time.push(key.time)                          
        }
      // hiển thị nhiệt độ
      countTemp = document.querySelector(".count1").innerText =
        temp[temp.length - 1];
      countHum = document.querySelector(".count2").innerText =
        hum[hum.length - 1];
      countLight = document.querySelector(".count3").innerText =
        light[light.length - 1];
      // countMua = document.querySelector(".count4").innerText = 
      // mua[mua.length-1];
        changeTemp();
        changeHum();
        changeLight();
        //changeMua();
      
      //hiển thị đồ thị
      const xValues = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45];
      
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
                  id: "light-y-axis", // Đặt ID cho trục tung độ ẩm
                  position: "right",
                  ticks: {
                    min: 0, // Giá trị tối thiểu trên trục tung độ ẩm
                    max: 1000, // Giá trị tối đa trên trục tung độ ẩm
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
setInterval(getTempAllData,2000)
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


const OnLampRight = document.querySelector(".onLampRight").addEventListener("click",function(e){
  const postData = "room/lamp,onlampright";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/controlLamp", requestOptions)
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


function OffFan(){
  const blade1 = document.querySelector(".blade-1").style.removeProperty("animation");
  const blade2 = document.querySelector(".blade-2").style.removeProperty("animation");
  const blade3 = document.querySelector(".blade-3").style.removeProperty("animation");
 
}
const OffLampRight = document.querySelector(".offLampRight").addEventListener("click",function(e){
  const postData = "room/lamp,offlampright";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/controlLamp", requestOptions)
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


function OnLight(){
  const light = document.querySelector('.img1');
  light.src = 'image/light_on.png';
}
const OnLampLeft = document.querySelector(".onLampLeft").addEventListener("click",function(e){
  const postData = "room/lamp,onlampleft";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/controlLamp", requestOptions)
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



function OffLight(){
  const light = document.querySelector('.img1');
  light.src = 'image/light_off.png';
}
const OffLampLeft = document.querySelector(".offLampLeft").addEventListener("click",function(e){
  const postData = "room/lamp,offlampleft";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/controlLamp", requestOptions)
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

const OnLampTest = document.querySelector(".onLamptest").addEventListener("click",function(e){
  const postData = "room/lamp,onlamptest";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/controlLamp", requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Lỗi khi gọi API: ${response.status}`);
          }
          return response.text;  // Trả về dữ liệu JSON từ phản hồi
      })
      .then(data => {
          console.log(data)
          // Xử lý dữ liệu từ API tại đây
      })
      .catch(error => {
          console.error("Lỗi: ", error);
      });
})


const OffLampTest = document.querySelector(".offLamptest").addEventListener("click",function(e){
  const postData = "room/lamp,offlamptest";
  
  // Tùy chọn của yêu cầu Fetch
  const requestOptions = {
      method: "POST",                   // Phương thức POST
      headers: {
          "Content-Type": "application/text"  // Kiểu dữ liệu của nội dung là JSON
      },
      body: JSON.stringify(postData)     // Chuyển đổi đối tượng postData thành chuỗi JSON
  };
  
  // Gọi API sử dụng Fetch
  fetch("http://localhost:8080/controlLamp", requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Lỗi khi gọi API: ${response.status}`);
          }
          return response.text;  // Trả về dữ liệu JSON từ phản hồi
      })
      .then(data => {
          console.log(data)
          OffTest();
          // Xử lý dữ liệu từ API tại đây
      })
      .catch(error => {
          console.error("Lỗi: ", error);
      });
})
