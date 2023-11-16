let dataFromSpringBoot = []
   function getTempAllData(){
       return fetch(`http://localhost:8080/status`)
        .then(function(response){
            return response.json();
        })
        .then(function(posts){
            dataFromSpringBoot=posts;
        })
        .catch(function(err){
            console.log(err);
        });
    }  
    const itemsPerPage = 10;

   // Hàm để lấy dữ liệu cho trang cụ thể
   function getDataForPage(page,ArrayData) {
       const startIndex = (page - 1) * itemsPerPage;
       const endIndex = startIndex + itemsPerPage;
       return ArrayData.slice(startIndex, endIndex);
   }
   // Hiển thị dữ liệu lên bảng
function displayData(data) {
    const tbodyElement = document.querySelector("tbody")
    tbodyElement.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(rowData => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${rowData.id}</td><td>${rowData.status}</td><td>${rowData.led}</td><td>${rowData.time}</td>`;
        tbodyElement.appendChild(row);
    });
}
function displayPage(page,ArrayData) {
    const data = getDataForPage(page,ArrayData);
    displayData(data);
}

function createPageSelect(totalPages, currentPage, ArrayData) {
    const pageSelect = document.getElementById("pageBtns");
  
    pageSelect.innerHTML = ""; // Xóa các option trang cũ
    for (let i = 1; i <= totalPages; i++) {
      const option = document.createElement("option"); // tạo 1 phần tử <option>
      option.value = i; // gán giá trị cho phần tử <option>
      option.textContent = i; // text hiển thị cho phần tử <option>
      pageSelect.appendChild(option); // thêm phần tử <option> vào phần tử <select>
    }
  
    pageSelect.value = currentPage;
  
    pageSelect.addEventListener("change", (event) => { // Sự kiện khi chọn trang
      const selectedPage = parseInt(event.target.value, 10);  
      goToPage(totalPages, selectedPage, ArrayData);
    });
  }
  
  let currentPage = 1; // Đặt trang hiện tại là trang đầu tiên
  function goToPage(totalPages, pageNumber, ArrayData) { // hàm này dùng để chuyển đến trang cụ thể
    currentPage = pageNumber; 
    displayPage(pageNumber, ArrayData); // Hiển thị dữ liệu cho trang cụ thể
    createPageSelect(totalPages, currentPage, ArrayData)
  }
getTempAllData().then(()=>{
    // Hiển thị dữ liệu đã phân trang
    const pageBtns = document.getElementById("pageBtns");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    let totalPages = Math.ceil(dataFromSpringBoot.length/10); // Đặt số trang dựa vào dữ liệu từ backend
     let currentPage = 1;
     displayPage(currentPage,dataFromSpringBoot)
     createPageSelect(totalPages,currentPage,dataFromSpringBoot);
          
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

     //-----------------------------------------------------Search------------------------------------------------------------------
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchColumn = document.getElementById("searchColumn");


function search() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedColumn = searchColumn.value;

  let dataSearch = dataFromSpringBoot.filter((item) => {
    if (selectedColumn === "time") {
      return item[selectedColumn].includes(searchText);
    }
    if(searchText == "") return true; // Nếu không nhập gì thì trả về tất cả dữ liệu
    return item[selectedColumn] == searchText;
  });

  const totalPages = Math.ceil(dataSearch.length / itemsPerPage);
  let currentPage = 1;

  displayPage(currentPage, dataSearch);
  createPageSelect(totalPages, currentPage, dataSearch);
   // Sự kiện nút Previous
   prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      goToPage(totalPages, currentPage, dataSearch);
    }
  });

  // Sự kiện nút Next
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++; 
      goToPage(totalPages, currentPage, dataSearch);
    }
  });

}

searchButton.addEventListener("click", search);

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
  createPageSelect(totalPages, currentPage, dataFromSpringBoot);
}

document.getElementById("sort-by-time-incre").addEventListener("click", () => {
  Sort("time", true);
});

document.getElementById("sort-by-time-decre").addEventListener("click", () => {
  Sort("time", false);
});
})