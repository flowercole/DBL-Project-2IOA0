//// All functions for Settings Sharing ////

// Validate different types of settings
validateSetting = (setting, type, p1, p2) => {
  sharedValue = searchParams.get(setting);
  console.log(`${setting} has a shared value of ${sharedValue}`)
  switch (type) {
    case 'int':
      if (parseInt(sharedValue) >= p1 && parseInt(sharedValue) <= p2) {
        return sharedValue;
      }
      break;
    case 'str':
      if (/^[a-zA-Z]+$/.test(sharedValue)) {
        return sharedValue
      }
      break;
    case 'hex':
      if (/^[0-9A-Fa-f]{6}$/.test(sharedValue)) {
        return '#'+sharedValue
      }
      break;
    case 'file':
      if (/^[a-zA-Z0-9_-]+(.csv)$/.test(sharedValue)) {
        return sharedValue
      }
      break;
    return null;
  }
}

// request a share url
getShareURL = () => {
  var url = 'http://localhost:3000/visualization'
  url += '?sharedSettings=true&'
  for (i = 0; i < allSettings.length; i++) {
    var setting = allSettings[i][0]
    if (allSettings[i][1]=='hex') { sub = 1 } else { sub = 0 }
    url += `${setting}=${localStorage.getItem(setting).substring(sub)}&`
  }
  console.log(url);
  document.getElementById('share-url').value = url;
}

// read a share url
readShareURL = () => {
  for (i = 0; i < allSettings.length; i++) {
    changeSettings(allSettings[i][0], validateSetting(allSettings[i][0], allSettings[i][1], allSettings[i][2], allSettings[i][3]))
  }
}

let searchParams = new URLSearchParams(location.search);
if (searchParams.get('sharedSettings') == 'true') {
  readShareURL();
  submitLayout(localStorage.getItem('layout'))
}

document.getElementById('share-btn').addEventListener('click', function() { getShareURL() } );
