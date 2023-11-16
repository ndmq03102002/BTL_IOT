let dataFromSpringBoot = [];
function getTempAllData() {
  return fetch(`http://localhost:8080/all`)
    .then(function (response) {
      return response.json();
    })
    .then(function (posts) {
      dataFromSpringBoot = posts;
    })
    .catch(function (err) {
      console.log(err);
    });
}

// Gọi hàm để lấy dữ liệu từ API
getTempAllData()
  .then(function () {
    // Lấy thẻ tbody để thêm dữ liệu
    const tbody = document.querySelector("table tbody");

    // Lặp qua dữ liệu và thêm vào bảng
    dataFromSpringBoot.forEach(function (data) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.temp}</td>
        <td>${data.hum}</td>
        <td>${data.light}</td>
        <td>${data.time}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(function (err) {
    console.log(err);
  });
