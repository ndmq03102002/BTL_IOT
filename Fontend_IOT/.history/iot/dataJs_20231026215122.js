let dataFromSpringBoot = []
   function getTempAllData(){

        return fetch(`http://localhost:8080/all`)
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
   let currentPage = 1; // Trang hiện tại
   let totalItems = dataFromSpringBoot.length; // Tổng số dòng dữ liệu
   const totalPages = Math.ceil(totalItems / itemsPerPage); // Tổng số trang
   const maxPageButtons = 5; // Số lượng nút trang hiển thị
   
   // Hàm hiển thị dữ liệu trên trang
   function displayDataOnPage(page) {
     const startIndex = (page - 1) * itemsPerPage;
     const endIndex = startIndex + itemsPerPage;
     const dataToShow = dataFromSpringBoot.slice(startIndex, endIndex);
   
     const tableBody = document.querySelector('tbody');
     tableBody.innerHTML = '';
   
     dataToShow.forEach(function(data) {
       const row = document.createElement('tr');
       row.innerHTML = `
         <td>${data.lanDo}</td>
         <td>${data.nhietDo}</td>
         <td>${data.doAm}</td>
         <td>${data.anhSang}</td>
         <td>${data.thoiGian}</td>
       `;
       tableBody.appendChild(row);
     });
   }
   
   // Hàm hiển thị các nút trang
   function displayPageButtons() {
     const pageButtonsContainer = document.getElementById('pageBtns');
     pageButtonsContainer.innerHTML = '';
   
     let startPage, endPage;
     if (totalPages <= maxPageButtons) {
       // Hiển thị tất cả các trang nếu tổng số trang nhỏ hơn hoặc bằng số lượng nút trang hiển thị
       startPage = 1;
       endPage = totalPages;
     } else {
       // Xác định trang bắt đầu và trang kết thúc để hiển thị các nút trang
       if (currentPage <= Math.floor(maxPageButtons / 2)) {
         startPage = 1;
         endPage = maxPageButtons;
       } else if (currentPage + Math.floor(maxPageButtons / 2) >= totalPages) {
         startPage = totalPages - maxPageButtons + 1;
         endPage = totalPages;
       } else {
         startPage = currentPage - Math.floor(maxPageButtons / 2);
         endPage = currentPage + Math.floor(maxPageButtons / 2);
       }
     }
   
     // Tạo các nút trang
     for (let i = startPage; i <= endPage; i++) {
       const pageButton = document.createElement('button');
       pageButton.textContent = i;
       pageButton.classList.add('pageButton');
       if (i === currentPage) {
         pageButton.classList.add('active');
       } else {
         pageButton.addEventListener('click', function() {
           currentPage = i;
           displayDataOnPage(currentPage);
           displayPageButtons();
         });
       }
       pageButtonsContainer.appendChild(pageButton);
     }
   
     // Tạo nút "..."
     if (endPage < totalPages) {
       const ellipsisButton = document.createElement('button');
       ellipsisButton.textContent = '...';
       ellipsisButton.disabled = true;
       ellipsisButton.classList.add('pageButton');
       pageButtonsContainer.appendChild(ellipsisButton);
     }
   }
   
   // Xử lý sự kiện nút "Previous"
   const prevButton = document.getElementById('prevBtn');
   prevButton.addEventListener('click', function() {
     if (currentPage > 1) {
       currentPage--;
       displayDataOnPage(currentPage);
       displayPageButtons();
     }
   });
   
   // Xử lý sự kiện nút "Next"
   const nextButton = document.getElementById('nextBtn');
   nextButton.addEventListener('click', function() {
     if (currentPage < totalPages) {
       currentPage++;
       displayDataOnPage(currentPage);
       displayPageButtons();
     }
   });
   
   // Gọi hàm hiển thị dữ liệu và nút trang ban đầu
   displayDataOnPage(currentPage);
   displayPageButtons();



//    // Hàm để lấy dữ liệu cho trang cụ thể
//    function getDataForPage(page,ArrayData) {
//        const startIndex = (page - 1) * itemsPerPage;
//        const endIndex = startIndex + itemsPerPage;
//        return ArrayData.slice(startIndex, endIndex);
//    }
//    // Hiển thị dữ liệu lên bảng
// function displayData(data) {
//     const tbodyElement = document.querySelector("tbody")
//     tbodyElement.innerHTML = ""; // Xóa dữ liệu cũ

//     data.forEach(rowData => {
//         const row = document.createElement("tr");
//         row.innerHTML = `<td>${rowData.id}</td><td>${rowData.temp}</td><td>${rowData.hum}</td><td>${rowData.light}</td><td>${rowData.time}</td></td>`;
//         tbodyElement.appendChild(row);
//     });
// }
// function displayPage(page,ArrayData) {
//     const data = getDataForPage(page,ArrayData);
//     displayData(data);
// }
// getTempAllData().then(()=>{
//     // Hiển thị dữ liệu đã phân trang
//     const pageBtns = document.getElementById("pageBtns");
//     const prevBtn = document.getElementById("prevBtn");
//     const nextBtn = document.getElementById("nextBtn");
    
//     let totalPages = Math.ceil(dataFromSpringBoot.length/10); // Đặt số trang dựa vào dữ liệu từ backend
//      let currentPage = 1;
//      displayPage(currentPage,dataFromSpringBoot)
//      updatePaginationUI(totalPages,currentPage,dataFromSpringBoot);
    
//      function createPageButtons(totalPages,ArrayData) {
//         // console.log(totalPages)
//         pageBtns.innerHTML = "";  
//         if (totalPages <= 8) {
//             for (let i = 1; i <= totalPages; i++) {
//                 const pageButton = document.createElement("button");
//                 pageButton.textContent = i;
//                 pageButton.addEventListener("click", () => goToPage(totalPages,i,ArrayData));
//                 pageBtns.appendChild(pageButton);
//             }
//         } else {
//             // Hiển thị 7 nút trang đầu, nút "..." và nút cuối cùng
//             for (let i = 1; i <= 7; i++) {
//                 const pageButton = document.createElement("button");
//                 pageButton.textContent = i;
//                 pageButton.addEventListener("click", () => goToPage(totalPages,i,ArrayData));
//                 pageBtns.appendChild(pageButton);
//             }
//             const ellipsis = document.createElement("span");
//             ellipsis.textContent = ". . . . . . .";
//             pageBtns.appendChild(ellipsis);
//             const lastPageButton = document.createElement("button");
//             lastPageButton.textContent = totalPages;
//             lastPageButton.addEventListener("click", () => goToPage(totalPages,totalPages,ArrayData));
//             pageBtns.appendChild(lastPageButton);
//         }
        
//     }
    
//     // Hàm cập nhật giao diện phân trang
//     function updatePaginationUI(totalPages,currentPage,ArrayData) {
//         createPageButtons(totalPages,ArrayData);
//         if(currentPage === 1){
//             prevBtn.classList.add("hidden");
//         }
//         else{
//             prevBtn.classList.remove("hidden");
//         }

//         if(currentPage === totalPages){
//             nextBtn.classList.add("hidden");
//         }
//         else{
//             nextBtn.classList.remove("hidden");
//         }
       
//     }
    
//     // Hàm chuyển đến trang được chọn
//     function goToPage(totalPages,pageNumber,ArrayData) {
//         currentPage = pageNumber;
//         displayPage(pageNumber,ArrayData)
//         updatePaginationUI(totalPages,pageNumber,ArrayData);
//         // Thực hiện các tác vụ khác khi chuyển trang, ví dụ: lấy dữ liệu từ backend
//     }
//     if(totalPages==Math.ceil(dataFromSpringBoot.length/10)){
          
//     // Sự kiện nút Previous
//         prevBtn.addEventListener("click", () => {
//             if (currentPage > 1) {              
//                 goToPage(totalPages,currentPage - 1,dataFromSpringBoot);
//             }
//         });
        
//         // Sự kiện nút Next
//         nextBtn.addEventListener("click", () => {
//             if (currentPage < totalPages) {
//                 goToPage(totalPages,currentPage + 1,dataFromSpringBoot);
//             }
//         });
//     }
//     //-----------------------------------------------------Search-------------------------------------------------------------------
//     const searchInput = document.getElementById("searchInput");
//     const searchButton = document.getElementById("searchButton");
//     const searchColumn = document.getElementById("searchColumn");
//     const selectedColumn = searchColumn.value;

   
//      function Search(){
//         const searchText = searchInput.value;
//         const selectedColumn = searchColumn.value;
//         dataSearch= dataFromSpringBoot.filter(a =>{
//             if(selectedColumn=="temp"){
//                 if(a.temp==searchText){
//                     return true;
//                 }
//             }
//             else if(selectedColumn=="hum"){
//                 if(a.hum==searchText){
//                     return true;
//                 }
//             }
//             else if(selectedColumn=="light"){
//                 if(a.light==searchText){
//                     return true;
//                 }
//             }
//             else if(selectedColumn=="date"){
//                 if(a.time.includes(searchText)){
//                     return true;
//                 }
//             }
//         })
//         let totalPages = Math.ceil(dataSearch.length/10); // Đặt số trang dựa vào dữ liệu từ backend
//         let currentPage = 1;
//         // console.log(totalPages)
//         displayPage(currentPage,dataSearch)
//         updatePaginationUI(totalPages,currentPage,dataSearch);
//         prevBtn.addEventListener("click", () => {
//             if (currentPage > 1) {
//                 currentPage-=1
//                 goToPage(totalPages,currentPage,dataSearch);
//             }
//         });
        
//         // Sự kiện nút Next
//         nextBtn.addEventListener("click", () => {
//             console.log(currentPage)
//             console.log(totalPages)
//             if (currentPage < totalPages) {
//                 currentPage+=1
//                 goToPage(totalPages,currentPage ,dataSearch);
//             }
//         });
//         }
//         searchButton.addEventListener('click',Search)
     
    
// ///--------------------------------------Sort-----------------------------------------------------------------------------------
//         function SortIncrease(columnSelect){
//             return  dataFromSpringBoot.sort((a,b)=>{            
//                 if (a[columnSelect] > b[columnSelect]) {
//                     return 1;
//                 } else if (a[columnSelect] < b[columnSelect]) {
//                     return -1;
//                 } else {
//                     return 0;
//                 }
//             })
//            }
//            function SortDecrease(columnSelect){
//             return  dataFromSpringBoot.sort((a,b)=>{            
//                 if (a[columnSelect] < b[columnSelect]) {
//                     return 1;
//                 } else if (a[columnSelect] > b[columnSelect]) {
//                     return -1;
//                 } else {
//                     return 0;
//                 }
//             })
//            }
//         //-------------------------------increase--------------------------------------------------------------
//         button_sort_temp_incre = document.querySelector("#sort-by-temperature-incre").addEventListener('click',()=>{
//             DataSort = SortIncrease("temp")
//             let totalPages = Math.ceil(DataSort.length/10); 
//             let currentPage = 1;
//             displayPage(currentPage,DataSort)
//             updatePaginationUI(totalPages,currentPage,DataSort);
//         })
//         button_sort_hum_incre = document.querySelector("#sort-by-humidity-incre").addEventListener('click',()=>{
//             DataSort = SortIncrease("hum")
//             let totalPages = Math.ceil(DataSort.length/10); 
//             let currentPage = 1;
//             displayPage(currentPage,DataSort)
//             updatePaginationUI(totalPages,currentPage,DataSort);
//         })
//         button_sort_light_incre = document.querySelector("#sort-by-light-incre").addEventListener('click',()=>{
//             DataSort = SortIncrease("light")
//             let totalPages = Math.ceil(DataSort.length/10); 
//             let currentPage = 1;
//             displayPage(currentPage,DataSort)
//             updatePaginationUI(totalPages,currentPage,DataSort);
//         })
        
//         button_sort_time_incre = document.querySelector("#sort-by-time-incre").addEventListener('click',()=>{
//             DataSort = SortIncrease("time")
//             let totalPages = Math.ceil(DataSort.length/10); 
//             let currentPage = 1;
//             displayPage(currentPage,DataSort)
//             updatePaginationUI(totalPages,currentPage,DataSort);
//         })    
//         //---------------------------------decrease------------------------------------------------------------
//         button_sort_temp_incre = document.querySelector("#sort-by-temperature-decre").addEventListener('click',()=>{
//             DataSort = SortDecrease("temp")
//             let totalPages = Math.ceil(DataSort.length/10); 
//             let currentPage = 1;
//             displayPage(currentPage,DataSort)
//             updatePaginationUI(totalPages,currentPage,DataSort);
//         })
//         button_sort_hum_incre = document.querySelector("#sort-by-humidity-decre").addEventListener('click',()=>{
//             DataSort = SortDecrease("hum")
//             let totalPages = Math.ceil(DataSort.length/10); 
//             let currentPage = 1;
//             displayPage(currentPage,DataSort)
//             updatePaginationUI(totalPages,currentPage,DataSort);
//         })
//         button_sort_light_incre = document.querySelector("#sort-by-light-decre").addEventListener('click',()=>{
//             DataSort = SortDecrease("light")
//             let totalPages = Math.ceil(DataSort.length/10); 
//             let currentPage = 1;
//             displayPage(currentPage,DataSort)
//             updatePaginationUI(totalPages,currentPage,DataSort);
//         })
//         button_sort_time_incre = document.querySelector("#sort-by-time-decre").addEventListener('click',()=>{
//             DataSort = SortDecrease("time")
//             let totalPages = Math.ceil(DataSort.length/10); 
//             let currentPage = 1;
//             displayPage(currentPage,DataSort)
//             updatePaginationUI(totalPages,currentPage,DataSort);
//         })    
    
//    })

// Chức năm tìm kiếm 
   
    // searchButton.addEventListener("click", function () {
    //     const searchText = document.getElementById("searchInput").value;
    //     const selectedColumn = document.getElementById("columnSelect").value;
    
    //     // Sử dụng fetch để gửi yêu cầu tìm kiếm tới Spring Boot
    //     fetch(`http://localhost:9000/searchFromColumn/${selectedColumn}/${searchText}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             // Xử lý dữ liệu từ Spring Boot và hiển thị nó trong bảng
    //             displayData(data);
    //         })
    //         .catch(error => {
    //             console.error("Lỗi: ", error);
    //         });
    // });

