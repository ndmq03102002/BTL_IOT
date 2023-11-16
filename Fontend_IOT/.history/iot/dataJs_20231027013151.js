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

// Hàm để hiển thị dữ liệu trên một trang cụ thể
function displayDataOnPage(pageNumber) {
  const tableBody = document.querySelector('table tbody');
  tableBody.innerHTML = ''; // Xóa nội dung cũ

  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  for (let i = startIndex; i < endIndex && i < dataFromSpringBoot.length; i++) {
      const rowData = dataFromSpringBoot[i];
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${rowData.temp}</td>
          <td>${rowData.hum}</td>
          <td>${rowData.light}</td>
          <td>${rowData.time}</td>
      `;
      tableBody.appendChild(row);
  }
}

// Hàm để tạo tùy chọn cho thẻ select
function createPageSelectOptions(totalPages) {
  const pageSelect = document.getElementById('pageSelect');
  pageSelect.innerHTML = ''; // Xóa tùy chọn cũ

  for (let i = 1; i <= totalPages; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.text = `Trang ${i}`;
      pageSelect.appendChild(option);
  }
}

// Hàm cập nhật trang khi người dùng thay đổi thẻ select
function updatePageSelect() {
  const pageSelect = document.getElementById('pageSelect');
  const selectedPage = parseInt(pageSelect.value, 10); // Lấy giá trị trang đã chọn
  displayDataOnPage(selectedPage);
}

// Hàm chia dữ liệu thành các trang và tạo thẻ select phân trang
function setupPagination() {
  const totalPages = Math.ceil(dataFromSpringBoot.length / itemsPerPage);
  createPageSelectOptions(totalPages);
  
  // Bắt sự kiện khi người dùng thay đổi trang trong thẻ select
  const pageSelect = document.getElementById('pageSelect');
  pageSelect.addEventListener('change', updatePageSelect);
  
  displayDataOnPage(1); // Hiển thị trang đầu tiên
}

// Khi trang web được tải, gọi hàm lấy dữ liệu và thiết lập phân trang
getTempAllData().then(() => {
  setupPagination();
});

// Hàm để thực hiện tìm kiếm
function search() {
  const searchColumn = document.getElementById('searchColumn').value;
  const searchInput = document.getElementById('searchInput').value.toLowerCase();

  const filteredData = dataFromSpringBoot.filter((rowData) => {
    if (searchColumn === 'temp') {
      return rowData.temp.toString().toLowerCase().includes(searchInput);
    } else if (searchColumn === 'hum') {
      return rowData.hum.toString().toLowerCase().includes(searchInput);
    } else if (searchColumn === 'light') {
      return rowData.light.toString().toLowerCase().includes(searchInput);
    } else if (searchColumn === 'date') {
      return rowData.time.toString().toLowerCase().includes(searchInput);
    }
  });

  // Hiển thị kết quả tìm kiếm
  const tableBody = document.querySelector('table tbody');
  tableBody.innerHTML = '';
  for (let i = 0; i < filteredData.length; i++) {
    const rowData = filteredData[i];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${rowData.temp}</td>
      <td>${rowData.hum}</td>
      <td>${rowData.light}</td>
      <td>${rowData.time}</td>
    `;
    tableBody.appendChild(row);
  }
}

// Bắt sự kiện click nút "Tìm kiếm"
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', search);

// Hàm để thiết lập lại dữ liệu ban đầu sau khi tìm kiếm
function resetData() {
  displayDataOnPage(1);
}

// Bắt sự kiện click nút "Quay lại" để reset dữ liệu
const backButton = document.querySelector('button');
backButton.addEventListener('click', resetData);




//   //-----------------------------------------------------Search-------------------------------------------------------------------
//   const searchInput = document.getElementById("searchInput");
//   const searchButton = document.getElementById("searchButton");
//   const searchColumn = document.getElementById("searchColumn");
//   const selectedColumn = searchColumn.value;

//   function Search() {
//     const searchText = searchInput.value;
//     const selectedColumn = searchColumn.value;
//     dataSearch = dataFromSpringBoot.filter((a) => {
//       if (selectedColumn == "temp") {
//         if (a.temp == searchText) {
//           return true;
//         }
//       } else if (selectedColumn == "hum") {
//         if (a.hum == searchText) {
//           return true;
//         }
//       } else if (selectedColumn == "light") {
//         if (a.light == searchText) {
//           return true;
//         }
//       } else if (selectedColumn == "date") {
//         if (a.time.includes(searchText)) {
//           return true;
//         }
//       }
//     });
//     let totalPages = Math.ceil(dataSearch.length / 10); // Đặt số trang dựa vào dữ liệu từ backend
//     let currentPage = 1;
//     // console.log(totalPages)
//     displayPage(currentPage, dataSearch);
//     updatePaginationUI(totalPages, currentPage, dataSearch);
//     prevBtn.addEventListener("click", () => {
//       if (currentPage > 1) {
//         currentPage -= 1;
//         goToPage(totalPages, currentPage, dataSearch);
//       }
//     });

//     // Sự kiện nút Next
//     nextBtn.addEventListener("click", () => {
//       console.log(currentPage);
//       console.log(totalPages);
//       if (currentPage < totalPages) {
//         currentPage += 1;
//         goToPage(totalPages, currentPage, dataSearch);
//       }
//     });
//   }
//   searchButton.addEventListener("click", Search);

//   ///--------------------------------------Sort-----------------------------------------------------------------------------------
//   function SortIncrease(columnSelect) {
//     return dataFromSpringBoot.sort((a, b) => {
//       if (a[columnSelect] > b[columnSelect]) {
//         return 1;
//       } else if (a[columnSelect] < b[columnSelect]) {
//         return -1;
//       } else {
//         return 0;
//       }
//     });
//   }
//   function SortDecrease(columnSelect) {
//     return dataFromSpringBoot.sort((a, b) => {
//       if (a[columnSelect] < b[columnSelect]) {
//         return 1;
//       } else if (a[columnSelect] > b[columnSelect]) {
//         return -1;
//       } else {
//         return 0;
//       }
//     });
//   }
//   //-------------------------------increase--------------------------------------------------------------
//   button_sort_temp_incre = document
//     .querySelector("#sort-by-temperature-incre")
//     .addEventListener("click", () => {
//       DataSort = SortIncrease("temp");
//       let totalPages = Math.ceil(DataSort.length / 10);
//       let currentPage = 1;
//       displayPage(currentPage, DataSort);
//       updatePaginationUI(totalPages, currentPage, DataSort);
//     });
//   button_sort_hum_incre = document
//     .querySelector("#sort-by-humidity-incre")
//     .addEventListener("click", () => {
//       DataSort = SortIncrease("hum");
//       let totalPages = Math.ceil(DataSort.length / 10);
//       let currentPage = 1;
//       displayPage(currentPage, DataSort);
//       updatePaginationUI(totalPages, currentPage, DataSort);
//     });
//   button_sort_light_incre = document
//     .querySelector("#sort-by-light-incre")
//     .addEventListener("click", () => {
//       DataSort = SortIncrease("light");
//       let totalPages = Math.ceil(DataSort.length / 10);
//       let currentPage = 1;
//       displayPage(currentPage, DataSort);
//       updatePaginationUI(totalPages, currentPage, DataSort);
//     });

//   button_sort_time_incre = document
//     .querySelector("#sort-by-time-incre")
//     .addEventListener("click", () => {
//       DataSort = SortIncrease("time");
//       let totalPages = Math.ceil(DataSort.length / 10);
//       let currentPage = 1;
//       displayPage(currentPage, DataSort);
//       updatePaginationUI(totalPages, currentPage, DataSort);
//     });
//   //---------------------------------decrease------------------------------------------------------------
//   button_sort_temp_incre = document
//     .querySelector("#sort-by-temperature-decre")
//     .addEventListener("click", () => {
//       DataSort = SortDecrease("temp");
//       let totalPages = Math.ceil(DataSort.length / 10);
//       let currentPage = 1;
//       displayPage(currentPage, DataSort);
//       updatePaginationUI(totalPages, currentPage, DataSort);
//     });
//   button_sort_hum_incre = document
//     .querySelector("#sort-by-humidity-decre")
//     .addEventListener("click", () => {
//       DataSort = SortDecrease("hum");
//       let totalPages = Math.ceil(DataSort.length / 10);
//       let currentPage = 1;
//       displayPage(currentPage, DataSort);
//       updatePaginationUI(totalPages, currentPage, DataSort);
//     });
//   button_sort_light_incre = document
//     .querySelector("#sort-by-light-decre")
//     .addEventListener("click", () => {
//       DataSort = SortDecrease("light");
//       let totalPages = Math.ceil(DataSort.length / 10);
//       let currentPage = 1;
//       displayPage(currentPage, DataSort);
//       updatePaginationUI(totalPages, currentPage, DataSort);
//     });
//   button_sort_time_incre = document
//     .querySelector("#sort-by-time-decre")
//     .addEventListener("click", () => {
//       DataSort = SortDecrease("time");
//       let totalPages = Math.ceil(DataSort.length / 10);
//       let currentPage = 1;
//       displayPage(currentPage, DataSort);
//       updatePaginationUI(totalPages, currentPage, DataSort);
//     });
// });
