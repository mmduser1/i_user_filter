var FLAGS = ["white", "black", "gray"];

function judge(user_name, list){
  return FLAGS.find(function(flag){
    return list[flag].some(function(pattern){
      return pattern && user_name.match(pattern);
    });
  });
}

function add_flag_data(cells, list){
  Array.from(cells).forEach(function(cell){
    var user = cell.querySelector(".username").textContent;
    cell.dataset.user = user;

    var flag = judge(user, list);
    if (flag)  cell.dataset.flag = flag;
  });
}

function add_likes_data(cells){
  Array.from(cells).forEach(function(cell){
    var icon = cell.querySelector(".right-icon");
    var likes = icon ? parseInt(icon.textContent) : 0;
    cell.dataset.likes = likes;

    if (likes >= 200){
      cell.classList.add("likes-over200");
    } else if (likes >= 100){
      cell.classList.add("likes-over100");
    } else if (likes >= 50){
      cell.classList.add("likes-over50");
    }
  });
}

function rebuild_cells(cells, rows){
  Array.from(rows).forEach(function(row){
    row.remove();
  })

  var row_count = 0, col_count = 0;
  var row;

  Array.from(cells).forEach(function(cell){
    if (col_count % 4 == 0) {
      row_count++;

      row = document.createElement("div");
      row.className = `views-row row views-row-${row_count}`;
      if(row_count == 1) row.classList.add("views-row-first");
      root.appendChild(row);
    }

    cell.remove();

    if (cell.dataset.flag != "black"){
      col_count++;

      var col = (col_count - 1) % 4;

      cell.className = `views-column col-sm-3 col-xs-6 views-column-${col + 1}`;
      if (cell.dataset.flag) cell.classList.add(cell.dataset.flag);

      if(col == 0) {
        cell.classList.add("views-row-first");
      } else if(col == 3) {
        cell.classList.add("views-row-last");
      }
      row.appendChild(cell);
    }
  })

  rows[rows.length - 1].classList.add("views-row-last");
  cells[cells.length - 1].classList.add("views-column-last");
}

var cells = document.querySelectorAll(".views-column");
var rows = document.querySelectorAll(".views-row");
var root = document.querySelector(".view-content");

var default_data = {
  white: "",
  black: "",
  gray: ""
};

chrome.storage.local.get(default_data, function(saved){
  var list = {};

  FLAGS.forEach(function(flag){
    var text = saved[flag].trim();
    list[flag] = text.split(/\r*\n+/);
  });

  add_flag_data(cells, list);
  rebuild_cells(cells, rows);
  add_likes_data(cells); //rebuild_cellsで一旦クラスを全て消すからこれは下にする必要がある

  chrome.storage.local.get({
    autopager: false
  },(settings)=>{
    if(settings.autopager){
      new MutationObserver((mutations,observer) => {
        if(root.querySelector("hr.autopagerize_page_separator")){
          Array.from(root.querySelectorAll(":scope > .views-row")).forEach(function(row){
            document.querySelector("#block-system-main > div > div > div.view-content > div:nth-child(1)").appendChild(row.cloneNode(true));
            row.remove();
          })
          observer.disconnect();
        }
      }).observe(root, {
        childList: true
      });
    }
  });
});
