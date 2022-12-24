import { createElement, cellToCoords, coordsToCell, removeLastChar } from "./fn.js";
import { confirmPopup, errorMessage } from "./elements/popups.js";

import {
  displayCoords,
  addCoord,
  deleteCoord,
  removeAllMapFiles,
  clearCoords,
  addPZCellCoord,
  genarateMapFileNamesForAllCoords,
  getOptions,
  downloadAllMapFiles
} from './elements/methods.js';

window.console = os.setWindowConsole(window.console);

const addCoordBtn = document.querySelector('#addCoord');
const startXInput = document.querySelector('#startX');
const startYInput = document.querySelector('#startY');
const endXInput = document.querySelector('#endX');
const endYInput = document.querySelector('#endY');
const nameInput = document.querySelector('#coordName');

const addPZCellCoordBtn = document.querySelector('#addCell');
const cellNameInput = document.querySelector('#cellName');
const cellXInput = document.querySelector('#cellX');
const cellYInput = document.querySelector('#cellY');

const clearCoordBtn = document.querySelector('#clearCoords');

addCoordBtn.addEventListener('click', () => {
  const startX = startXInput.value;
  const startY = startYInput.value;
  const endX = endXInput.value;
  const endY = endYInput.value;
  const name = nameInput.value;
  
  addCoord(startX, startY, endX, endY, name);
  document.querySelector('.add-popup').classList.remove('show');

  //clear inputs
  // startXInput.value = '';
  // startYInput.value = '';
  // endXInput.value = '';
  // endYInput.value = '';
  // nameInput.value = '';

});

addPZCellCoordBtn.addEventListener('click', () => {
  const cellX = cellXInput.value;
  const cellY = cellYInput.value;

  const name = cellNameInput.value;

  addPZCellCoord(cellX, cellY, name);
  document.querySelector('.add-popup').classList.remove('show');
});

clearCoordBtn.addEventListener('click', () => {
  clearCoords();
});

displayCoords();

const getfilenamesbtn = document.querySelector('#file-names');

getfilenamesbtn.addEventListener('click', () => {

  let options = getOptions();

  // console.log(options);

  // check if options are not undefined
  if (options.FTP_HOST === '' || options.FTP_USER === '' || options.FTP_PASS === '' || options.FTP_LOCALPATH === '' || options.FTP_EXTPATH === '') {
    errorMessage('Please fill in all FTP options');
    return;
  }

  const currentCoord = JSON.parse(localStorage.getItem('coord'));
  let fileNames = genarateMapFileNamesForAllCoords(currentCoord);

  // const filesContainer = document.querySelector('#all-files');
  // filesContainer.innerHTML = '';

  // fileNames.forEach((fileName) => {
  //   let div = document.createElement('div');
  //   div.textContent = fileName;
  //   filesContainer.appendChild(div);
  // });

  confirmPopup(`Are you sure you want to delete ${fileNames.length} files?`, (confirmed) => {
    if (!confirmed) return;
    // removeAllFilesFromServer(fileNames);
    let opts = getOptions();
    ftp.removeAllFiles(fileNames, opts)
      .catch((err) => {
        errorMessage(err);
      });
  });

});

const getFileNamesEle = document.querySelector('#get-file-names');

getFileNamesEle.addEventListener('click', () => {
  let options = {
    FTP_HOST: document.getElementById('ftp-opt-host').value,
    FTP_USER: document.getElementById('ftp-opt-user').value,
    FTP_PASS: document.getElementById('ftp-opt-pass').value,
    FTP_SECURE: document.getElementById('ftp-opt-secure-checkbox').value === 'on' ? true : false,
    FTP_LOCALPATH: document.getElementById('ftp-opt-localpath').value,
    FTP_EXTPATH: document.getElementById('ftp-opt-ftpextpath').value,
    FTP_PORT: document.getElementById('ftp-opt-port').value,
  } 

  // console.log(options);

  // check if options are not undefined
  if (options.FTP_HOST === '' || options.FTP_USER === '' || options.FTP_PASS === '' || options.FTP_LOCALPATH === '' || options.FTP_EXTPATH === '') {
    errorMessage('Please fill in all FTP options');
    return;
  }
  const currentCoord = JSON.parse(localStorage.getItem('coord'));
  let fileNames = genarateMapFileNamesForAllCoords(currentCoord);

    // const filesContainer = document.querySelector('#all-files');
    // filesContainer.innerHTML = '';

    // fileNames.forEach((fileName) => {
    //   let div = document.createElement('div');
    //   div.textContent = fileName;
    //   filesContainer.appendChild(div);
    // });

  confirmPopup(`Are you sure you want to download ${fileNames.length} files?`, (confirmed) => {
    if (!confirmed) return;
    // getFilesFromServer(fileNames, options);
    let opts = getOptions();
    ftp.getAllFiles(fileNames, opts)
      .catch((err) => {
        errorMessage(err);
      });
  });

});

// Hide #ftp-input-details when #hide-ftp-details is clicked
const hideFtpDetails = document.querySelector('#hide-ftp-details');
hideFtpDetails.addEventListener('click', () => {
  const ftpInputDetails = document.querySelector('#ftp-input-details');
  ftpInputDetails.classList.toggle('hidden');

  if (ftpInputDetails.classList.contains('hidden')) {
    hideFtpDetails.textContent = 'expand_more';
  } else {
    hideFtpDetails.textContent = 'expand_less';
  }

  // save state
  localStorage.setItem('ftpInputDetailsHidden', ftpInputDetails.classList.contains('hidden'));

});

// load ftpInputDetailsHidden state on load

document.addEventListener('DOMContentLoaded', () => {
  const ftpInputDetails = document.querySelector('#ftp-input-details');
  const ftpInputDetailsHidden = localStorage.getItem('ftpInputDetailsHidden');
  if (ftpInputDetailsHidden === 'true') {
    ftpInputDetails.classList.add('hidden');
    hideFtpDetails.textContent = 'expand_more';
  } else {
    ftpInputDetails.classList.remove('hidden');
    hideFtpDetails.textContent = 'expand_less';
  }
});



function saveFtpDetailsToStorage() {
  const options = getOptions();

  // check name is defined and not empty
  if (options.FTP_NAME === '') {
    errorMessage('Please enter a name for the FTP options');
    return;
  }
    
    localStorage.setItem("currentFtpOptions", options.FTP_NAME);

    let alloptions = JSON.parse(localStorage.getItem('ftpOptions'));

    localStorage.setItem('ftpOptions', JSON.stringify({
      ...alloptions,
      [options.FTP_NAME]: {
        ...options,
        FTP_SECURE: document.getElementById('ftp-opt-secure-checkbox').checked,
      }
    }));


    setFtpOptions();

}

// save details
// const saveFtpDetails = document.querySelector('#ftp-opt-save-checkbox');
// saveFtpDetails.addEventListener('click', () => {
//   const options = getOptions();
//   if (saveFtpDetails.checked) {
//     saveFtpDetailsToStorage();
//   } else {
//     localStorage.removeItem('ftpOptions');
//   }
  
// });

// load details

// loadFtpOptions

function loadFtpOptions() {
  let alloptions = JSON.parse(localStorage.getItem('ftpOptions'));
  let currentFtpOptions = localStorage.getItem('currentFtpOptions');

  let options = alloptions[currentFtpOptions];

  if (options) {
    document.getElementById('ftp-opt-name').value = options.FTP_NAME;
    document.getElementById('ftp-opt-host').value = options.FTP_HOST;
    document.getElementById('ftp-opt-user').value = options.FTP_USER;
    document.getElementById('ftp-opt-pass').value = options.FTP_PASS;
    document.getElementById('ftp-opt-secure-checkbox').checked = options.FTP_SECURE;
    document.getElementById('ftp-opt-localpath').value = options.FTP_LOCALPATH;
    document.getElementById('ftp-opt-ftpextpath').value = options.FTP_EXTPATH;
    document.getElementById('ftp-opt-port').value = options.FTP_PORT;
  }
}


// document on load

document.addEventListener('DOMContentLoaded', () => {

loadFtpOptions();
setFtpOptions();

});

// on ftp options change save details

const ftpOptionsEles = [
 document.getElementById('ftp-opt-host'),
 document.getElementById('ftp-opt-user'),
 document.getElementById('ftp-opt-pass'),
 document.getElementById('ftp-opt-secure-checkbox'),
 document.getElementById('ftp-opt-localpath'),
 document.getElementById('ftp-opt-ftpextpath'),
 document.getElementById('ftp-opt-port'),
//  document.getElementById('ftp-opt-save-checkbox')
];

// ftpOptionsEles.forEach((ele) => {
//   ele.addEventListener('change', () => {
//     saveFtpDetailsToStorage();
//   });
// });

// on search input change #coordSearch

const coordSearch = document.querySelector('#coordSearch');

coordSearch.addEventListener('input', () => {
  displayCoords();
});


// on #clear-ftp-details-btn click

function clearFtpDetails() {
    document.getElementById('ftp-opt-name').value = '';
    document.getElementById('ftp-opt-host').value = '';
    document.getElementById('ftp-opt-user').value = '';
    document.getElementById('ftp-opt-pass').value = '';
    document.getElementById('ftp-opt-secure-checkbox').checked = false;
    document.getElementById('ftp-opt-localpath').value = '';
    document.getElementById('ftp-opt-ftpextpath').value = '';
    document.getElementById('ftp-opt-port').value = '';
}

const clearFtpDetailsBtn = document.querySelector('#clear-ftp-details-btn');
clearFtpDetailsBtn.addEventListener('click', () => {
  clearFtpDetails();
  // document.getElementById('ftp-opt-save-checkbox').checked = false;
  // // localStorage.removeItem('ftpOptions');

  // remove ftp options by name

});

function deleteFtpOptions() {
    let alloptions = JSON.parse(localStorage.getItem('ftpOptions'));
    let currentFtpOptions = localStorage.getItem('currentFtpOptions');

    delete alloptions[currentFtpOptions];

    localStorage.setItem('ftpOptions', JSON.stringify(alloptions));
    setFtpOptions();
}

const closePopup = document.querySelector('.pop-up-title .close');

closePopup.addEventListener('click', () => {
  document.querySelector('.add-popup').classList.remove('show');
});

// #addSection click

const addSection = document.querySelector('#addSection');

addSection.addEventListener('click', () => {
  document.querySelector('.add-popup').classList.add('show');
});

// save buton click

const saveBtn = document.querySelector('#save-ftp-details-btn');

saveBtn.addEventListener('click', () => {
  saveFtpDetailsToStorage();
});

// set #ftp-options select

const ftpOptionsSelect = document.querySelector('#ftp-options');

ftpOptionsSelect.addEventListener('change', () => {
  const options = getOptions();
  localStorage.setItem("currentFtpOptions", options.FTP_NAME);

  loadFtpOptions();

});


// set all ftp name options

function setFtpOptions() {
  
  let ftpOptions = JSON.parse(localStorage.getItem('ftpOptions'));
  let currentFtpOptions = localStorage.getItem('currentFtpOptions');

  if (ftpOptions) {
    let options = Object.keys(ftpOptions);
    let optionsHtml = '';
    options.forEach((option) => {
      optionsHtml += `<option value="${option}">${option}</option>`;
    });
    ftpOptionsSelect.innerHTML = optionsHtml;
    ftpOptionsSelect.value = currentFtpOptions;
  }
}

// #ftp-options on change

const ftpOptions = document.querySelector('#ftp-options');

ftpOptions.addEventListener('change', (e) => {
  console.log('ftp-options change');
  let val = e.target.value;
  localStorage.setItem("currentFtpOptions", val);
  loadFtpOptions();
});


function removeDetails() {
  let ftpOptions = JSON.parse(localStorage.getItem('ftpOptions'));
  let currentFtpOptions = localStorage.getItem('currentFtpOptions');

  delete ftpOptions[currentFtpOptions];
  localStorage.setItem('ftpOptions', JSON.stringify(ftpOptions));
  setFtpOptions();
}

const deleteFtpDetailsBtn = document.querySelector('#delete-ftp-details-btn');

deleteFtpDetailsBtn.addEventListener('click', () => {
  removeDetails();
  clearFtpDetails();
});

const downloadModData = document.querySelector('#download-mod-data');

downloadModData.addEventListener('click', () => {
  downloadAllMapFiles(["global_mod_data.bin"])
});

const deleteModData = document.querySelector('#delete-mod-data');

deleteModData.addEventListener('click', () => {
  console.log('delete-mod-data click')
  removeAllMapFiles(["global_mod_data.bin"]);
});