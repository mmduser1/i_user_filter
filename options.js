function save_options() {
  console.log("yea");
  var autopager = document.getElementById("autopager");
  chrome.storage.local.set({
    autopager: autopager.checked
  });
  var data = {};
  "white black gray".split(/\s/).forEach(flag=>{
    data[flag] = document.getElementById(flag).value.trim();
  });

  chrome.storage.local.set(data, function() {
    var status = document.getElementById('status');
    status.textContent = 'セーブしました。';

    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  var default_data = {
    white: "",
    black: "",
    gray: ""
  };

  chrome.storage.local.get(default_data, function(data) {
    document.getElementById('white').value = data.white;
    document.getElementById('black').value = data.black;
    document.getElementById('gray').value = data.gray;
  });
  chrome.storage.local.get({
    autopager: false
  },(settings)=>{
    document.getElementById("autopager").checked = settings.autopager;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
