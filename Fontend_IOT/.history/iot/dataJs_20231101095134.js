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

  function Search() {
    const searchText = searchInput.value;
    const selectedColumn = searchColumn.value;
    dataSearch = dataFromSpringBoot.filter((a) => {
      if (selectedColumn == "temp") {
        if (a.temp == searchText) {
          return true;
        }
      } else if (selectedColumn == "hum") {
        if (a.hum == searchText) {
          return true;
        }
      } else if (selectedColumn == "light") {
        if (a.light == searchText) {
          return true;
        }
      } else if (selectedColumn == "gas") {
        if (a.gas == searchText) {
          return true;
        }
      } else if (selectedColumn == "date") {
        if (a.time.includes(searchText)) {
          return true;
        }
      }
    });
    let totalPages = Math.ceil(dataSearch.length / 10); // Đặt số trang dựa vào dữ liệu từ backend
    let currentPage = 1;
    displayPage(currentPage, dataSearch);
    updatePaginationUI(totalPages, currentPage, dataSearch);
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage -= 1;
        goToPage(totalPages, currentPage, dataSearch);
      }
    });

    // Sự kiện nút Next
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        goToPage(totalPages, currentPage, dataSearch);
      }
    });
  }

  searchButton.addEventListener("click", Search);

  ///--------------------------------------Sort-----------------------------------------------------------------------------------
  function SortIncrease(columnSelect) {
    return dataFromSpringBoot.sort((a, b) => {
      if (a[columnSelect] > b[columnSelect]) {
        return 1;
      } else if (a[columnSelect] < b[columnSelect]) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  function SortDecrease(columnSelect) {
    return dataFromSpringBoot.sort((a, b) => {
      if (a[columnSelect] < b[columnSelect]) {
        return 1;
      } else if (a[columnSelect] > b[columnSelect]) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  function addSortListeners(id, order) {
    const element = document.querySelector(id);
    element.addEventListener("click", () => {
      if (order === "incre") {
        SortIncrease(order);
      } else if (order == "decre") {
        SortDecrease(order);
      }
      let totalPages = Math.ceil(dataFromSpringBoot.length / 10);
      let currentPage = 1;
      displayPage(currentPage, dataFromSpringBoot);
      updatePaginationUI(totalPages, currentPage, dataFromSpringBoot);
    });
  }

  addSortListeners("#sort-by-temperature-incre", "temp");
  addSortListeners("#sort-by-humidity-incre", "hum");
  addSortListeners("#sort-by-light-incre", "light");
  addSortListeners("#sort-by-gas-incre", "gas");
  addSortListeners("#sort-by-time-incre", "time");
  addSortListeners("#sort-by-temperature-decre", "temp");
  addSortListeners("#sort-by-humidity-decre", "hum");
  addSortListeners("#sort-by-light-decre", "light");
  addSortListeners("#sort-by-gas-decre", "gas");
  addSortListeners("#sort-by-time-decre", "time");
});
