let dataFromSpringBoot = []; // lưu trữ dữ liệu từ API 

function getAllData() { // lấy dữ liệu từ phản hồi, chuyển đổi nó thành JSON, và lưu trữ trong biến dataFromSpringBoot
  return fetch(`http://localhost:8080/all`)
    .then(function (response) { // Phản hồi từ API
      return response.json();
    })
    .then(function (posts) { 
      dataFromSpringBoot = posts; // Lưu trữ dữ liệu từ phản hồi
    })
    .catch(function (err) {
      console.log(err);
    });
}

const itemsPerPage = 10; // Số lượng dòng dữ liệu trên mỗi trang

// Hàm để lấy dữ liệu cho trang cụ thể
function getDataForPage(page, ArrayData) { // page: trang hiện tại, ArrayData: dữ liệu từ API
  const startIndex = (page - 1) * itemsPerPage; 
  const endIndex = startIndex + itemsPerPage;
  return ArrayData.slice(startIndex, endIndex); // trả về mảng dữ liệu cho trang cụ thể
}

// Hiển thị dữ liệu lên bảng
function displayData(data) {
  const tbodyElement = document.querySelector("tbody"); // lấy phần tử <tbody>
  tbodyElement.innerHTML = ""; // Xóa dữ liệu cũ

  data.forEach((rowData) => {
    const row = document.createElement("tr"); // tạo 1 phần tử <tr> , Phần tử này sẽ được sử dụng để chứa các cột dữ liệu.
    row.innerHTML = `<td>${rowData.id}</td><td>${rowData.temp}</td><td>${rowData.hum}</td><td>${rowData.light}</td><td>${rowData.time}</td>`;
    tbodyElement.appendChild(row);
  });
}

function displayPage(page, ArrayData) { // hàm hiển thị dữ liệu cho trang cụ thể
  const data = getDataForPage(page, ArrayData); 
  displayData(data); 
}

// ẩn hoặc hiển thị nút "Previous" (Trang trước) và "Next" (Trang tiếp theo)
function updatePaginationUI(totalPages, currentPage, ArrayData) {//totalPages:tổng số trang, currentPage: trang hiện tại, ArrayData: dữ liệu từ api
  createPageButtons(totalPages, currentPage, ArrayData); // tạo các nút trang dựa trên tổng số trang
  if (currentPage === 1) { // Nếu trang hiện tại là trang đầu tiên thì ẩn nút Previous
    prevBtn.classList.add("hidden");
  } else { 
    prevBtn.classList.remove("hidden");
  }

  if (currentPage === totalPages) { // Nếu trang hiện tại là trang cuối cùng thì ẩn nút Next
    nextBtn.classList.add("hidden");
  } else {
    nextBtn.classList.remove("hidden");
  }
}

// tạo các nút trang dựa trên tổng số trang
function createPageButtons(totalPages, currentPage, ArrayData) { //totalPages:tổng số trang, currentPage: trang hiện tại, ArrayData: dữ liệu từ api
  pageBtns.innerHTML = ""; // pageBtns: phần tử <div> có id="pageBtns"

  function createPageButton(pageNumber) { // tạo nút trang
    const pageButton = document.createElement("button");
    pageButton.textContent = pageNumber;
    pageButton.addEventListener("click", () => goToPage(totalPages, pageNumber, ArrayData)); // sự kiện click vào nút trang
    pageBtns.appendChild(pageButton);
  }

  if (totalPages <= 10) { // Nếu tổng số trang nhỏ hơn hoặc bằng 8 thì hiển thị tất cả các nút trang
    for (let i = 1; i <= totalPages; i++) {
      createPageButton(i);
    }
  } else {
    for (let i = 1; i <= 9; i++) {
      createPageButton(i);
    }
    const ellipsis = document.createElement("span"); // tạo dấu chấm 3 chấm
    ellipsis.textContent = " . . . ";
    pageBtns.appendChild(ellipsis); // thêm dấu chấm 3 chấm vào pageBtns
    createPageButton(totalPages); // thêm nút trang cuối cùng vào pageBtns
  }
}

let currentPage = 1; // Đặt trang hiện tại là trang đầu tiên
function goToPage(totalPages, pageNumber, ArrayData) { // hàm này dùng để chuyển đến trang cụ thể
  currentPage = pageNumber; 
  displayPage(pageNumber, ArrayData); // Hiển thị dữ liệu cho trang cụ thể
  updatePaginationUI(totalPages, pageNumber, ArrayData); 
}

getAllData().then(() => { // Lấy dữ liệu từ API và hiển thị nó lên bảng
  // Hiển thị dữ liệu đã phân trang
  const pageBtns = document.getElementById("pageBtns"); // lấy phần từ <div> có id="pageBtns"
  const prevBtn = document.getElementById("prevBtn"); // lấy phần tử <button> có id="prevBtn"
  const nextBtn = document.getElementById("nextBtn"); // lấy phần tử <button> có id="nextBtn"
  let totalPages = Math.ceil(dataFromSpringBoot.length / 10); // Đặt số trang dựa vào dữ liệu từ backend
  
  displayPage(currentPage, dataFromSpringBoot); // Hiển thị dữ liệu cho trang đầu tiên
  updatePaginationUI(totalPages, currentPage, dataFromSpringBoot);

  if (totalPages == Math.ceil(dataFromSpringBoot.length / 10)) { 
    // Sự kiện nút Previous
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        goToPage(totalPages, currentPage, dataFromSpringBoot);
      }
    });

    // Sự kiện nút Next
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++; 
        goToPage(totalPages, currentPage, dataFromSpringBoot);
      }
    });
           
  }

  //-----------------------------------------------------Search-------------------------------------------------------------------

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchColumn = document.getElementById("searchColumn");
  

  function search() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedColumn = searchColumn.value;
  
    let dataSearch = dataFromSpringBoot.filter((item) => {
      if (selectedColumn === "time") {
        return item[selectedColumn].toLowerCase().includes(searchText);
      }
      return item[selectedColumn] == searchText;
    });
  
    const totalPages = Math.ceil(dataSearch.length / itemsPerPage);
    let currentPage = 1;
  
    displayPage(currentPage, dataSearch);
    updatePaginationUI(totalPages, currentPage, dataSearch);
  
  }
  
  searchButton.addEventListener("click", search);
//-----------------------------------------------------Sort-----------------------------------------------------------------------------  
  function Sort(columnSelect, isIncreasing) {
    dataFromSpringBoot.sort((a, b) => {
      const valA = a[columnSelect];
      const valB = b[columnSelect];
      if (columnSelect === "time") {
        return isIncreasing ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return isIncreasing ? valA - valB : valB - valA;
    });
  
    let totalPages = Math.ceil(dataFromSpringBoot.length / itemsPerPage);
    let currentPage = 1;
    displayPage(currentPage, dataFromSpringBoot);
    updatePaginationUI(totalPages, currentPage, dataFromSpringBoot);
  }
  
  document.getElementById("sort-by-temperature-incre").addEventListener("click", () => {
    Sort("temp", true);
  });
  
  document.getElementById("sort-by-temperature-decre").addEventListener("click", () => {
    Sort("temp", false);
  });
  
  document.getElementById("sort-by-humidity-incre").addEventListener("click", () => {
    Sort("hum", true);
  });
  
  document.getElementById("sort-by-humidity-decre").addEventListener("click", () => {
    Sort("hum", false);
  });
  
  document.getElementById("sort-by-light-incre").addEventListener("click", () => {
    Sort("light", true);
  });
  
  document.getElementById("sort-by-light-decre").addEventListener("click", () => {
    Sort("light", false);
  });
  
  document.getElementById("sort-by-gas-incre").addEventListener("click", () => {
    Sort("gas", true);
  });
  
  document.getElementById("sort-by-gas-decre").addEventListener("click", () => {
    Sort("gas", false);
  });
  
  document.getElementById("sort-by-time-incre").addEventListener("click", () => {
    Sort("time", true);
  });
  
  document.getElementById("sort-by-time-decre").addEventListener("click", () => {
    Sort("time", false);
  });
  
});
