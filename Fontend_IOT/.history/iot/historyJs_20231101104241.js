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
        row.innerHTML = `<td>${rowData.id}</td><td>${rowData.status}</td><td>${rowData.time}</td>`;
        tbodyElement.appendChild(row);
    });
}
function displayPage(page,ArrayData) {
    const data = getDataForPage(page,ArrayData);
    displayData(data);
}
getTempAllData().then(()=>{
    // Hiển thị dữ liệu đã phân trang
    const pageBtns = document.getElementById("pageBtns");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    let totalPages = Math.ceil(dataFromSpringBoot.length/10); // Đặt số trang dựa vào dữ liệu từ backend
     let currentPage = 1;
     displayPage(currentPage,dataFromSpringBoot)
     updatePaginationUI(totalPages,currentPage,dataFromSpringBoot);
    
     function createPageButtons(totalPages,ArrayData) {
        // console.log(totalPages)
        pageBtns.innerHTML = "";  
        if (totalPages <= 8) {
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement("button");
                pageButton.textContent = i;
                pageButton.addEventListener("click", () => goToPage(totalPages,i,ArrayData));
                pageBtns.appendChild(pageButton);
            }
        } else {
            // Hiển thị 7 nút trang đầu, nút "..." và nút cuối cùng
            for (let i = 1; i <= 7; i++) {
                const pageButton = document.createElement("button");
                pageButton.textContent = i;
                pageButton.addEventListener("click", () => goToPage(totalPages,i,ArrayData));
                pageBtns.appendChild(pageButton);
            }
            const ellipsis = document.createElement("span");
            ellipsis.textContent = ". . . . . . .";
            pageBtns.appendChild(ellipsis);
            const lastPageButton = document.createElement("button");
            lastPageButton.textContent = totalPages;
            lastPageButton.addEventListener("click", () => goToPage(totalPages,totalPages,ArrayData));
            pageBtns.appendChild(lastPageButton);
        }
        
    }
    
    // Hàm cập nhật giao diện phân trang
    function updatePaginationUI(totalPages,currentPage,ArrayData) {
        createPageButtons(totalPages,ArrayData);
        if(currentPage === 1){
            prevBtn.classList.add("hidden");
        }
        else{
            prevBtn.classList.remove("hidden");
        }

        if(currentPage === totalPages){
            nextBtn.classList.add("hidden");
        }
        else{
            nextBtn.classList.remove("hidden");
        }
       
    }
    
    // Hàm chuyển đến trang được chọn
    function goToPage(totalPages,pageNumber,ArrayData) {
        currentPage = pageNumber;
        displayPage(pageNumber,ArrayData)
        updatePaginationUI(totalPages,pageNumber,ArrayData);
        // Thực hiện các tác vụ khác khi chuyển trang, ví dụ: lấy dữ liệu từ backend
    }
    if(totalPages==Math.ceil(dataFromSpringBoot.length/10)){
          
    // Sự kiện nút Previous
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {              
                goToPage(totalPages,currentPage - 1,dataFromSpringBoot);
            }
        });
        
        // Sự kiện nút Next
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                goToPage(totalPages,currentPage + 1,dataFromSpringBoot);
            }
        });
    }

     //-----------------------------------------------------Search-------------------------------------------------------------------
     const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchColumn = document.getElementById("searchColumn");

   
     function Search(){
        const searchText = searchInput.value;
        const selectedColumn = searchColumn.value;
        dataSearch= dataFromSpringBoot.filter(a =>{
            if(selectedColumn=="status"){
                if(a.status==searchText){
                    return true;
                }
            }
            else if(selectedColumn=="Time"){
                if(a.time.includes(searchText)){
                    return true;
                }
            }           
        })
        
        console.log(searchText)
        console.log(selectedColumn)
        console.log(dataSearch)
        let totalPages = Math.ceil(dataSearch.length/10); // Đặt số trang dựa vào dữ liệu từ backend
        let currentPage = 1;
        // console.log(totalPages)
        displayPage(currentPage,dataSearch)
        updatePaginationUI(totalPages,currentPage,dataSearch);
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage-=1
                goToPage(totalPages,currentPage,dataSearch);
            }
        });
        
        // Sự kiện nút Next
        nextBtn.addEventListener("click", () => {
            console.log(currentPage)
            console.log(totalPages)
            if (currentPage < totalPages) {
                currentPage+=1
                goToPage(totalPages,currentPage ,dataSearch);
            }
        });
        }
        searchButton.addEventListener('click',Search)


        ///--------------------------------------Sort-----------------------------------------------------------------------------------
        function SortIncrease(columnSelect){
            return  dataFromSpringBoot.sort((a,b)=>{            
                if (a[columnSelect] > b[columnSelect]) {
                    return 1;
                } else if (a[columnSelect] < b[columnSelect]) {
                    return -1;
                } else {
                    return 0;
                }
            })
           }
           function SortDecrease(columnSelect){
            return  dataFromSpringBoot.sort((a,b)=>{            
                if (a[columnSelect] < b[columnSelect]) {
                    return 1;
                } else if (a[columnSelect] > b[columnSelect]) {
                    return -1;
                } else {
                    return 0;
                }
            })
           }
            //-------------------------------increase--------------------------------------------------------------
           button_sort_time_incre = document.querySelector("#sort-by-time-incre").addEventListener('click',()=>{
            DataSort = SortIncrease("time")
            let totalPages = Math.ceil(DataSort.length/10); 
            let currentPage = 1;
            displayPage(currentPage,DataSort)
            updatePaginationUI(totalPages,currentPage,DataSort);
        })  
         //---------------------------------decrease------------------------------------------------------------
        button_sort_time_incre = document.querySelector("#sort-by-time-decre").addEventListener('click',()=>{
            DataSort = SortDecrease("time")
            let totalPages = Math.ceil(DataSort.length/10); 
            let currentPage = 1;
            displayPage(currentPage,DataSort)
            updatePaginationUI(totalPages,currentPage,DataSort);
        })    
})


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

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      goToPage(totalPages, currentPage, dataSearch);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage += 1;
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