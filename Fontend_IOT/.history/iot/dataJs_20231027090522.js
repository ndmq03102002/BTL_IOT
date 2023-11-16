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
    row.innerHTML = `<td>${rowData.id}</td><td>${rowData.temp}</td><td>${rowData.hum}</td><td>${rowData.light}</td><td>${rowData.time}</td></td>`;
    tbodyElement.appendChild(row);
  });
}
function displayPage(page, ArrayData) {
  const data = getDataForPage(page, ArrayData);
  displayData(data);
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

  function createPageButtons(totalPages, ArrayData) {
    // console.log(totalPages)
    pageBtns.innerHTML = "";
    if (totalPages <= 8) {
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.addEventListener("click", () =>
          goToPage(totalPages, i, ArrayData)
        );
        pageBtns.appendChild(pageButton);
      }
    } else {
      // Hiển thị 7 nút trang đầu, nút "..." và nút cuối cùng
      for (let i = 1; i <= 7; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.addEventListener("click", () =>
          goToPage(totalPages, i, ArrayData)
        );
        pageBtns.appendChild(pageButton);
      }
      const ellipsis = document.createElement("span");
      ellipsis.textContent = ". . . . . . .";
      pageBtns.appendChild(ellipsis);
      const lastPageButton = document.createElement("button");
      lastPageButton.textContent = totalPages;
      lastPageButton.addEventListener("click", () =>
        goToPage(totalPages, totalPages, ArrayData)
      );
      pageBtns.appendChild(lastPageButton);
    }
  }

  // Hàm cập nhật giao diện phân trang
  function updatePaginationUI(totalPages, currentPage, ArrayData) {
    createPageButtons(totalPages, ArrayData);
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

  // Hàm chuyển đến trang được chọn
  function goToPage(totalPages, pageNumber, ArrayData) {
    currentPage = pageNumber;
    displayPage(pageNumber, ArrayData);
    updatePaginationUI(totalPages, pageNumber, ArrayData);
  }
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
  const selectedColumn = searchColumn.value;

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
      } else if (selectedColumn == "date") {
        if (a.time.includes(searchText)) {
          return true;
        }
      }
    });
    let totalPages = Math.ceil(dataSearch.length / 10); // Đặt số trang dựa vào dữ liệu từ backend
    let currentPage = 1;
    // console.log(totalPages)
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
      console.log(currentPage);
      console.log(totalPages);
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
  //-------------------------------increase--------------------------------------------------------------
  button_sort_temp_incre = document
    .querySelector("#sort-by-temperature-incre")
    .addEventListener("click", () => {
      DataSort = SortIncrease("temp");
      let totalPages = Math.ceil(DataSort.length / 10);
      let currentPage = 1;
      displayPage(currentPage, DataSort);
      updatePaginationUI(totalPages, currentPage, DataSort);
    });
  button_sort_hum_incre = document
    .querySelector("#sort-by-humidity-incre")
    .addEventListener("click", () => {
      DataSort = SortIncrease("hum");
      let totalPages = Math.ceil(DataSort.length / 10);
      let currentPage = 1;
      displayPage(currentPage, DataSort);
      updatePaginationUI(totalPages, currentPage, DataSort);
    });
  button_sort_light_incre = document
    .querySelector("#sort-by-light-incre")
    .addEventListener("click", () => {
      DataSort = SortIncrease("light");
      let totalPages = Math.ceil(DataSort.length / 10);
      let currentPage = 1;
      displayPage(currentPage, DataSort);
      updatePaginationUI(totalPages, currentPage, DataSort);
    });

  button_sort_time_incre = document
    .querySelector("#sort-by-time-incre")
    .addEventListener("click", () => {
      DataSort = SortIncrease("time");
      let totalPages = Math.ceil(DataSort.length / 10);
      let currentPage = 1;
      displayPage(currentPage, DataSort);
      updatePaginationUI(totalPages, currentPage, DataSort);
    });
  //---------------------------------decrease------------------------------------------------------------
  button_sort_temp_incre = document
    .querySelector("#sort-by-temperature-decre")
    .addEventListener("click", () => {
      DataSort = SortDecrease("temp");
      let totalPages = Math.ceil(DataSort.length / 10);
      let currentPage = 1;
      displayPage(currentPage, DataSort);
      updatePaginationUI(totalPages, currentPage, DataSort);
    });
  button_sort_hum_incre = document
    .querySelector("#sort-by-humidity-decre")
    .addEventListener("click", () => {
      DataSort = SortDecrease("hum");
      let totalPages = Math.ceil(DataSort.length / 10);
      let currentPage = 1;
      displayPage(currentPage, DataSort);
      updatePaginationUI(totalPages, currentPage, DataSort);
    });
  button_sort_light_incre = document
    .querySelector("#sort-by-light-decre")
    .addEventListener("click", () => {
      DataSort = SortDecrease("light");
      let totalPages = Math.ceil(DataSort.length / 10);
      let currentPage = 1;
      displayPage(currentPage, DataSort);
      updatePaginationUI(totalPages, currentPage, DataSort);
    });
  button_sort_time_incre = document
    .querySelector("#sort-by-time-decre")
    .addEventListener("click", () => {
      DataSort = SortDecrease("time");
      let totalPages = Math.ceil(DataSort.length / 10);
      let currentPage = 1;
      displayPage(currentPage, DataSort);
      updatePaginationUI(totalPages, currentPage, DataSort);
    });
});
