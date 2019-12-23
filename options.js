function save_options() {
  console.log("yea");
  var autopager = document.getElementById("autopager");
  let likeSettingElements = document.getElementById("like_settings").getElementsByClassName("like_setting_wrapper")
  let likeSettingsArr = []
  for(var i=0; i<likeSettingElements.length; i++){
    likeSettingsArr.push({
      like:document.getElementById("like"+i).value,
      color:document.getElementById("like_color"+i).value
    })
  }
  chrome.storage.local.set({
    autopager: autopager.checked,
    likeSettings: likeSettingsArr
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

  setColorPicker()
  chrome.storage.local.get({
    autopager: false,
    likeSettings: [
      {like:50, color:"yellow"},
      {like:100, color:"red"},
      {like:200, color:"deeppink"},
    ]
  },(settings)=>{
    document.getElementById("autopager").checked = settings.autopager;
    let likeSettingElements = document.getElementById("like_settings").getElementsByClassName("like_setting_wrapper")
    for(var i=0; i<likeSettingElements.length; i++){
      document.getElementById("like"+i).value = settings.likeSettings[i].like
      document.getElementById("like_color"+i).value = settings.likeSettings[i].color
      document.getElementById("like_color_preview"+i).style.background = settings.likeSettings[i].color
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

function setColorPicker () {
  let likeSettingElements = document.getElementById("like_settings").getElementsByClassName("like_setting_wrapper")
  
  for(var i=0; i<likeSettingElements.length; i++){
    let element = document.getElementById("like_color"+i)
    let previewElement = document.getElementById("like_color_preview"+i)
    let pickr = Pickr.create({
      el: element,
      theme: 'nano',
      useAsButton: true,
      swatches: [
      ],
      components: {
          preview: true,
          opacity: true,
          hue: true,
          interaction: {
              hex: true,
              rgba: true,
              hsla: false,
              hsva: false,
              cmyk: false,
              input: true,
              clear: true,
              save: true
          }
      },
      strings: {
          save: '保存',
          clear: 'クリア',
          cancel: 'キャンセル'
      }
    }).on('init', pickr => {
    }).on('save', color => {
      element.value = color.toHEXA().toString(0)
      previewElement.style.background = color.toHEXA().toString(0)
      pickr.hide()
    })
  }
}