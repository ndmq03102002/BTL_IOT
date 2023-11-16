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

const itemsPerPage = 10;

// Hàm để lấy dữ liệu cho trang cụ thể
function getDataForPage(page, ArrayData) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return ArrayData.slice(startIndex, endIndex);
}

// Hiển thị dữ liệu lên bảng
function displayData(data) {
  const tbodyElement = document.querySelector("tbody");
  tbodyElement.innerHTML = ""; // Xóa dữ liệu cũ

  data.forEach((rowData) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${rowData.id}</td><td>${rowData.temp}</td><td>${rowData.hum}</td><td>${rowData.light}</td><td>${rowData.gas}</td><td>${rowData.time}</td></td>`;
    tbodyElement.appendChild(row);
  });
}

function displayPage(page, ArrayData) {
  const data = getDataForPage(page, ArrayData);
  displayData(data);
}

function updatePaginationUI(totalPages, currentPage, ArrayData) {
  createPageButtons(totalPages, currentPage, ArrayData);
  if (currentPage === 1) {
    prevBtn.classList.add("hidden");
  } else {
    prevBtn.classList.remove("hidden");
  }

  if (currentPage === totalPages) {
    nextBtn.classList.add("hidden");
  } else {
    nextBtn.classList.remove("hidden");
  }
}

function createPageButtons(totalPages, currentPage, ArrayData) {
  pageBtns.innerHTML = "";
  if (totalPages <= 8) {
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => goToPage(totalPages, i, ArrayData));
      pageBtns.appendChild(pageButton);
    }
  } else {
    for (let i = 1; i <= 7; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => goToPage(totalPages, i, ArrayData));
      pageBtns.appendChild(pageButton);
    }
    const ellipsis = document.createElement("span");
    ellipsis.textContent = ". . . . . . .";
    pageBtns.appendChild(ellipsis);
    const lastPageButton = document.createElement("button");
    lastPageButton.textContent = totalPages;
    lastPageButton.addEventListener("click", () => goToPage(totalPages, totalPages, ArrayData));
    pageBtns.appendChild(lastPageButton);
  }
}

function goToPage(totalPages, pageNumber, ArrayData) {
  currentPage = pageNumber;
  displayPage(pageNumber, ArrayData);
  updatePaginationUI(totalPages, pageNumber, ArrayData);
}

getTempAllData().then(() => {
  // Hiển thị dữ liệu đã phân trang
  const pageBtns = document.getElementById("pageBtns");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let totalPages = Math.ceil(dataFromSpringBoot.length / 10); // Đặt số trang dựa vào dữ liệu từ backend
  let currentPage = 1;
  displayPage(currentPage, dataFromSpringBoot);
  updatePaginationUI(totalPages, currentPage, dataFromSpringBoot);

  if (totalPages == Math.ceil(dataFromSpringBoot.length / 10)) {
    // Sự kiện nút Previous
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        goToPage(totalPages, currentPage - 1, dataFromSpringBoot);
      }
    });

    // Sự kiện nút Next
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        goToPage(totalPages, currentPage + 1, dataFromSpringBoot);
      }
    });
  }

  //-----------------------------------------------------Search-------------------------------------------------------------------

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchColumn = document.getElementById("searchColumn");
  
  const columnMapping = {
    temp: "Nhiệt độ",
    hum: "Độ ẩm",
    light: "Ánh sáng",
    gas: "Khí gas",
    date: "Ngày",
  };
  
  function search() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedColumn = searchColumn.value;
  
    let dataSearch = [];
  
    if (selectedColumn === "date") {
      // Tìm kiếm theo cột "date"
      dataSearch = dataFromSpringBoot.filter((item) => {
        const dateValue = item[selectedColumn].toLowerCase();
        return dateValue.includes(searchText);
      });
    } else {
      // Tìm kiếm theo các cột khác
      dataSearch = dataFromSpringBoot.filter((item) => {
        const columnValue = item[selectedColumn].toString().toLowerCase();
        return columnValue.includes(searchText);
      });
    }
  
    const totalPages = Math.ceil(dataSearch.length / itemsPerPage);
    let currentPage = 1;
  
    displayPage(currentPage, dataSearch);
    updatePaginationUI(totalPages, currentPage, dataSearch);
  
  }
  
  searchButton.addEventListener("click", search);
  


  ///--------------------------------------Sort-----------------------------------------------------------------------------------
  function SortData(columnSelect, order) {
    return dataFromSpringBoot.sort((a, b) => {
      if (order === "incre") {
        if (a[columnSelect] > b[columnSelect]) {
          return 1;
        } else if (a[columnSelect] < b[columnSelect]) {
          return -1;
        } else {
          return 0;
        }
      } else if (order === "decre") {
        if (a[columnSelect] < b[columnSelect]) {
          return 1;
        } else if (a[columnSelect] > b[columnSelect]) {
          return -1;
        } else {
          return 0;
        }
      }
    });
  }
  
  // Sử dụng hàm SortData để sắp xếp dữ liệu
  function sortAndDisplay(columnSelect, order) {
    SortData(columnSelect, order);
    let totalPages = Math.ceil(dataFromSpringBoot.length / 10);
    let currentPage = 1;
    displayPage(currentPage, dataFromSpringBoot);
    updatePaginationUI(totalPages, currentPage, dataFromSpringBoot);
  }
  
  // Thêm sự kiện click cho các nút sắp xếp
  function addSortListeners(id, columnSelect, order) {
    const element = document.querySelector(id);
    element.addEventListener("click", () => {
      sortAndDisplay(columnSelect, order);
    });
  }
  
  addSortListeners("#sort-by-temperature-incre", "temp", "incre");
  addSortListeners("#sort-by-humidity-incre", "hum", "incre");
  addSortListeners("#sort-by-light-incre", "light", "incre");
  addSortListeners("#sort-by-gas-incre", "gas", "incre");
  addSortListeners("#sort-by-time-incre", "time", "incre");
  addSortListeners("#sort-by-temperature-decre", "temp", "decre");
  addSortListeners("#sort-by-humidity-decre", "hum", "decre");
  addSortListeners("#sort-by-light-decre", "light", "decre");
  addSortListeners("#sort-by-gas-decre", "gas", "decre");
  addSortListeners("#sort-by-time-decre", "time", "decre");
  
});
