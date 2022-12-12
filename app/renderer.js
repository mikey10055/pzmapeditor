window.console = os.setWindowConsole(window.console);


// project zomboid coords to cell
function coordsToCell(x, y) {
  let nx = Math.floor(x / 300);
  let ny = Math.floor(y / 300);
  return {
    x: nx,
    y: ny,
    str: `${nx}_${ny}`
  }
}

function removeLastChar(num) {
  return Math.floor(num / 10);
}

//project zomboid cell to coords
function cellToCoords(x, y) {
  let nx = x * 300;
  let ny = y * 300;
  let sx = removeLastChar(nx);
  let sy = removeLastChar(ny);

  let endx = nx + 300;
  let endy = ny + 300;

  let endsx = removeLastChar(endx);
  let endsy = removeLastChar(endy);

  return {
    x: nx,
    y: ny,
    sx: sx,
    sy: sy,
    endx: endx,
    endy: endy,
    endsx: endsx,
    endsy: endsy,
    str: `${nx}_${ny}`,
    sstr: `${sx}_${sy}`,
    endstr: `${endx}_${endy}`,
    sendstr: `${endsx}_${endsy}`
  }
}

// confirm popup

function confirmPopup(message, callback) {
  const confirmDiv = document.createElement('div');
  const transparentDiv = document.createElement('div');
  confirmDiv.classList.add('confirm');
  const confirmText = document.createElement('p');
  confirmText.textContent = message;
  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Yes';

  // button container
  const btnContainer = document.createElement('div');
  btnContainer.classList.add('btn-container');

  confirmBtn.addEventListener('click', () => {
    callback(true);
    transparentDiv.remove();
    confirmDiv.remove();
  });
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'No';
  cancelBtn.addEventListener('click', () => {
    callback(false);
    transparentDiv.remove();
    confirmDiv.remove();
  });

  // add transparent div to disable interactions with the rest of the page



  // transparentDiv Styles

  transparentDiv.style.position = 'fixed';
  transparentDiv.style.top = '28px';
  transparentDiv.style.left = '0';
  transparentDiv.style.width = '100%';
  transparentDiv.style.height = '100%';
  transparentDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  transparentDiv.style.zIndex = '999';

  document.body.appendChild(transparentDiv);

  // add confirmDiv dark mode Styles and in the middle of the screen

  confirmDiv.style.position = 'absolute';
  confirmDiv.style.top = '50%';
  confirmDiv.style.left = '50%';
  confirmDiv.style.transform = 'translate(-50%, -50%)';
  confirmDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  confirmDiv.style.color = 'white';
  confirmDiv.style.padding = '10px';
  confirmDiv.style.borderRadius = '5px';
  confirmDiv.style.display = 'flex';
  confirmDiv.style.flexDirection = 'column';
  confirmDiv.style.alignItems = 'center';
  confirmDiv.style.justifyContent = 'center';
  confirmDiv.style.zIndex = '9999';


  // add confirmText Styles

  confirmText.style.margin = '0';

  // add confirmBtn Styles

  confirmBtn.style.border = 'none';
  confirmBtn.style.backgroundColor = 'green';
  confirmBtn.style.color = 'white';
  confirmBtn.style.padding = '5px';
  confirmBtn.style.cursor = 'pointer';
  confirmBtn.classList.add("confirmBtn");

  // add cancelBtn Styles

  cancelBtn.style.border = 'none';
  cancelBtn.style.backgroundColor = 'red';
  cancelBtn.style.color = 'white';
  cancelBtn.style.padding = '5px';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.classList.add("cancelBtn");

    btnContainer.appendChild(confirmBtn);
    btnContainer.appendChild(cancelBtn);

  confirmDiv.appendChild(confirmText);
  confirmDiv.appendChild(btnContainer);
  document.body.appendChild(confirmDiv);

}

// display error message, function should display error message and have all styles in one place and create the elements. and have delete button to remove the error. all errors should stack at bottom left of the screen.
function errorMessage(message) {
    console.error(message);
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    const errorText = document.createElement('p');
    errorText.textContent = message;
    const errorBtn = document.createElement('button');
    errorBtn.textContent = 'X';
    errorBtn.addEventListener('click', () => {
        errorDiv.remove();
    });

    // add errorDiv Styles
    errorDiv.style.position = 'absolute';
    errorDiv.style.bottom = '0';
    errorDiv.style.left = '0';
    errorDiv.style.backgroundColor = 'red';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.display = 'flex';
    errorDiv.style.justifyContent = 'space-between';
    errorDiv.style.alignItems = 'center';
    errorDiv.style.width = '100%';

    // add errorText Styles
    errorText.style.margin = '0';

    // add errorBtn Styles
    errorBtn.style.border = 'none';
    errorBtn.style.backgroundColor = 'red';
    errorBtn.style.color = 'white';
    errorBtn.style.padding = '5px';
    errorBtn.style.cursor = 'pointer';

    errorDiv.appendChild(errorText);
    errorDiv.appendChild(errorBtn);
    document.body.appendChild(errorDiv);
}

// add coord

function addCoord(startX, startY, endX, endY, name) {
    const currentCoord = JSON.parse(localStorage.getItem('coord'));
    // console.log(startX, startY, endX, endY, name)

    // convert all values to numbers
    startX = Number(startX);
    startY = Number(startY);
    endX = Number(endX);
    endY = Number(endY);

    // console.log(startX, startY, endX, endY)

    // check that all values are numbers
    if (isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY)) {
        errorMessage('Please enter numbers only');
        return;
    }

    // check that all fields are filled
    if (!startX || !startY || !endX || !endY) {
        errorMessage('Please fill in all fields');
        return;
    }

    // check that startx is greater than endx
    if (startX > endX) {
        errorMessage('Start X must be less than End X');
        return;
    }

    // check that starty is greater than endy
    if (startY > endY) {
        errorMessage('Start Y must be less than End Y');
        return;
    }

    // check that there are no duplicate coords
    if (currentCoord) {
        const duplicate = currentCoord.find((coord) => {
            return coord.startX === startX && coord.startY === startY && coord.endX === endX && coord.endY === endY;
        });

        if (duplicate) {
            errorMessage('Duplicate coordinates');
            return;
        }
    }
    
    currentCoord.push({startX, startY, endX, endY, name});

    console.log(`Section added: ${startX}, ${startY}, ${endX}, ${endY}, ${name}`);

    localStorage.setItem('coord', JSON.stringify(currentCoord));

    displayCoords();
}

function toggleMapFrame() {
  const mapiframe = document.querySelector('#mapframe-over');
  mapiframe.classList.toggle('closed');
}

function displayCoords() {
    const currentCoord = JSON.parse(localStorage.getItem('coord'));
    const coordList = document.querySelector('#coords');

    const mapiframe = document.querySelector('#mapiframe');

    // clear list
    coordList.innerHTML = '';

    // return li with delete button and text inside a div
    function createCoordLi(startX, startY, endX, endY, name) {
        let pzcell = coordsToCell(startX, startY);
        let pzendCell = coordsToCell(endX, endY);
        const li = document.createElement('li');
        const div = document.createElement('div');
        const deleteBtn = document.createElement('button');

        const ftpRemoveBtn = document.createElement('button');
        ftpRemoveBtn.textContent = 'Remove from FTP';
        ftpRemoveBtn.addEventListener('click', () => {
            const fileNames = genarateFileNamesForAllCoords([{startX, startY, endX, endY, name}]);
            let options = getOptions();

                if (options.FTP_HOST === '' || options.FTP_USER === '' || options.FTP_PASS === '' || options.FTP_LOCALPATH === '' || options.FTP_EXTPATH === '') {
                  errorMessage('Please fill in all FTP options');
                  return;
                }

              confirmPopup(`Are you sure you want to delete ${fileNames.length} files?`, (confirmed) => {
                if (!confirmed) return;
                let opts = getOptions();
                ftp.removeAllFiles(fileNames, opts)
                .catch((err) => {
                  errorMessage(err);
                });
              });
        });

        const ftpDownloadBtn = document.createElement('button');
        ftpDownloadBtn.textContent = 'Download from FTP';
        ftpDownloadBtn.addEventListener('click', () => {
            const fileNames = genarateFileNamesForAllCoords([{startX, startY, endX, endY, name}]);
            let options = getOptions();

                if (options.FTP_HOST === '' || options.FTP_USER === '' || options.FTP_PASS === '' || options.FTP_LOCALPATH === '' || options.FTP_EXTPATH === '') {
                  errorMessage('Please fill in all FTP options');
                  return;
                }

              confirmPopup(`Are you sure you want to download ${fileNames.length} files?`, (confirmed) => {
                if (!confirmed) return;
                let opts = getOptions();
                ftp.getAllFiles(fileNames, opts)
                .catch((err) => {
                  errorMessage(err);
                });
              });
        });
        
        let files = genarateFileNamesForAllCoords([{startX, startY, endX, endY, name}]);

        const spanText = document.createElement('span');
        spanText.textContent = `${name} [${pzcell.x}:${pzcell.y}] [${pzendCell.x}:${pzendCell.y}]`;

        const spanFiles = document.createElement('small');
        spanFiles.textContent = `(${files.length} files)`;

        li.appendChild(spanText);
        
        li.appendChild(spanFiles);

        // add an anchor to the li that links to the https://map.projectzomboid.com/#10918x9767x3180
        const startA = document.createElement('button');
        // startA.dataset.url = `https://map.projectzomboid.com/#${startX}x${startY}`;
        startA.target = '_blank';
        startA.textContent = `${startX}:${startY}`;
        startA.addEventListener('click', () => {
          os.openUrl(`https://map.projectzomboid.com/#${startX}x${startY}`);
            // mapiframe.src = "";
            // setTimeout(() => {
            //   mapiframe.src = `https://map.projectzomboid.com/#${startX}x${startY}`;
            // }, 1000)
        });

        li.appendChild(startA);

        const endA = document.createElement('button');
        // endA.dataset.url = `https://map.projectzomboid.com/#${endX}x${endY}`;
        endA.target = '_blank';
        endA.textContent = `${endX}:${endY}`;
        endA.addEventListener('click', () => {
          os.openUrl(`https://map.projectzomboid.com/#${endX}x${endY}`);
            // mapiframe.src = "";
            // setTimeout(() => {
            //   mapiframe.src = `https://map.projectzomboid.com/#${endX}x${endY}`;
            // }, 1000)
        });

        li.appendChild(endA);

        // deletebtn trash icon .material-icons
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('material-icons');
        deleteIcon.textContent = 'delete';
        deleteIcon.style.color = '#560505';
        deleteIcon.style.fontSize = '1.2rem';
        deleteBtn.title = 'Delete Section';
        deleteBtn.appendChild(deleteIcon);
        
        
        
        // deleteBtn.textContent = 'Delete Section';
        deleteBtn.addEventListener('click', () => {
          deleteCoord(startX, startY, endX, endY);
        });
        
        li.appendChild(div);
        li.appendChild(ftpRemoveBtn);
        li.appendChild(ftpDownloadBtn);
        li.appendChild(deleteBtn);
        
        return li;
    }

    if (currentCoord) {
        currentCoord.forEach((coord) => {
            const { startX, startY, endX, endY, name } = coord;
            const li = createCoordLi(startX, startY, endX, endY, name);
            coordList.appendChild(li);
        });
    }

    localStorage.setItem('coord', JSON.stringify(currentCoord || []));

    // hide clear button if no coords
    if (currentCoord && currentCoord.length > 0) {
        document.querySelector('#clearCoords').style.display = 'initial';
    } else {
        document.querySelector('#clearCoords').style.display = 'none';
    }

}

function deleteCoord(startX, startY, endX, endY) {
    const currentCoord = JSON.parse(localStorage.getItem('coord'));
    // console.log(currentCoord, startX, startY, endX, endY);
    const newCoord = currentCoord.filter((coord) => {
        // return coord.startX !== startX && coord.startY !== startY && coord.endX !== endX && coord.endY !== endY;
        return !(coord.startX === startX && coord.startY === startY && coord.endX === endX && coord.endY === endY);
    });

    let pzcell = coordsToCell(startX, startY);

    // add confirm before deleting
    let confirmed = confirmPopup(`Are you sure you want to delete this coordinate section? ${startX}:${startY} ${endX}:${endY} [${pzcell.x}:${pzcell.y}]`, (confirmed) => {
      if (!confirmed) return;
      
      console.log(`Section Removed ${startX}:${startY} ${endX}:${endY} [${pzcell.x}:${pzcell.y}]`);
      localStorage.setItem('coord', JSON.stringify(newCoord));
      displayCoords(); 
    });
}

function clearCoords() {
    const currentCoord = JSON.parse(localStorage.getItem('coord'));
    // add confirm before clearing
    let confirmed = confirmPopup(`Are you sure you want to clear all (${currentCoord.length}) coordinate sections?`, (confirmed) => {
      if (!confirmed) return;
  
      localStorage.clear();
      displayCoords();
    });
}

function addPZCellCoord(x, y, name) {
    let coords = cellToCoords(x, y);
    addCoord(coords.x, coords.y, coords.endx, coords.endy, name);
}

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

// const mapframeOpenClosed = document.querySelector('#mapframe-open-close');
// mapframeOpenClosed.addEventListener('click', () => {
//   toggleMapFrame();
//   const mapframeOver = document.querySelector('#mapframe-over');

//   if (mapframeOver.classList.contains("closed")) {
//     mapframeOpenClosed.textContent = "Open Map";
//   } else {
//     mapframeOpenClosed.textContent = "Close Map";
//   }
// });

const clearCoordBtn = document.querySelector('#clearCoords');

addCoordBtn.addEventListener('click', () => {
  const startX = startXInput.value;
  const startY = startYInput.value;
  const endX = endXInput.value;
  const endY = endYInput.value;
  const name = nameInput.value;
  
  addCoord(startX, startY, endX, endY, name);
});

addPZCellCoordBtn.addEventListener('click', () => {
  const cellX = cellXInput.value;
  const cellY = cellYInput.value;

  const name = cellNameInput.value;

  addPZCellCoord(cellX, cellY, name);
});

clearCoordBtn.addEventListener('click', () => {
  clearCoords();
});

displayCoords();

function genarateFileNamesForAllCoords(currentCoord) {

  let fileNames = [];

  currentCoord.forEach((coord) => {
    let { startX, startY, endX, endY } = coord;

    // devide and round down start and end coords
    startX = Math.floor(startX / 10);
    startY = Math.floor(startY / 10);
    endX = Math.floor(endX / 10);
    endY = Math.floor(endY / 10);

    // genarate file names for all coords between start and end
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        let fileName = `map_${x}_${y}.bin`;
        fileNames.push(fileName);
      }
    }

  });

  return fileNames;

}

function getOptions() {
    return {
      FTP_HOST: document.getElementById('ftp-opt-host').value,
      FTP_USER: document.getElementById('ftp-opt-user').value,
      FTP_PASS: document.getElementById('ftp-opt-pass').value,
      FTP_SECURE: document.getElementById('ftp-opt-secure-checkbox').value === 'on' ? true : false,
      FTP_LOCALPATH: document.getElementById('ftp-opt-localpath').value,
      FTP_EXTPATH: document.getElementById('ftp-opt-ftpextpath').value,
      FTP_PORT: document.getElementById('ftp-opt-port').value,
    }
}

const getfilenamesbtn = document.querySelector('#file-names');

getfilenamesbtn.addEventListener('click', () => {
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
  let fileNames = genarateFileNamesForAllCoords(currentCoord);

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
  let fileNames = genarateFileNamesForAllCoords(currentCoord);

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


const getFilesFromServer = async (files, options) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      console.log(`downloading file ${file}...`);
      try {
        await ftp.get(file, options);
        console.log(`file ${file} downloaded!`);
      } catch (error) {
        console.warn(error)
      }

    }

    console.log('done');
};


const removeAllFilesFromServer = async (files, options) => {
  for (let index = 0; index < files.length; index++) {
    const file = files[index];

    console.log(`removing file ${file}...`);
    try {
      await ftp.removeFile(file, options);
      console.log(`file ${file} removed!`);
    } catch (error) {
      console.warn(error)
    }
    
  }

  console.log('done');
}

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

});


function saveFtpDetailsToStorage() {
  const options = getOptions();

    localStorage.setItem('ftpOptions', JSON.stringify({
      ...options,
      savecheckbox: saveFtpDetails.checked,
      FTP_SECURE: document.getElementById('ftp-opt-secure-checkbox').checked,
    }));

}

// save details
const saveFtpDetails = document.querySelector('#ftp-opt-save-checkbox');
saveFtpDetails.addEventListener('click', () => {
  const options = getOptions();
  if (saveFtpDetails.checked) {
    saveFtpDetailsToStorage();
  } else {
    localStorage.removeItem('ftpOptions');
  }
  
});

// load details

// document on load

document.addEventListener('DOMContentLoaded', () => {

  const options = JSON.parse(localStorage.getItem('ftpOptions'));
  if (options) {
    document.getElementById('ftp-opt-host').value = options.FTP_HOST;
    document.getElementById('ftp-opt-user').value = options.FTP_USER;
    document.getElementById('ftp-opt-pass').value = options.FTP_PASS;
    document.getElementById('ftp-opt-secure-checkbox').checked = options.FTP_SECURE;
    document.getElementById('ftp-opt-localpath').value = options.FTP_LOCALPATH;
    document.getElementById('ftp-opt-ftpextpath').value = options.FTP_EXTPATH;
    document.getElementById('ftp-opt-port').value = options.FTP_PORT;
    document.getElementById('ftp-opt-save-checkbox').checked = options.savecheckbox;
    
  } else {
    // errorMessage('No FTP details saved!');
  }

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
 document.getElementById('ftp-opt-save-checkbox')
];

ftpOptionsEles.forEach((ele) => {
  ele.addEventListener('change', () => {
    saveFtpDetailsToStorage();
  });
});