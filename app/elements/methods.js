import { errorMessage, confirmPopup } from "./popups.js";

import {
    coordsToCell,
    createPillButton,
    createElement,
    removeLastChar,
    cellToCoords
} from "../fn.js";

export const getFilesFromServer = async (files, options) => {
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


export const removeAllFilesFromServer = async (files, options) => {
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

export const calculateNumberOfFiles = (currentCoord) => {
    // startTime of function 
    console.time('calculateNumberOfFiles');
    let total = 0;
    // console.log("Calculating number of files...");

    // calculate total number of files

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
                total++;
            }
        }

    });


    // endTime of function
    console.timeEnd('calculateNumberOfFiles');

    return total;
}
export function genarateMapFileNamesForAllCells(currentCoord, start = "chunk_", end = ".bin") {
    // startTime of function
    console.time('genarateFileNamesForAllCells');
    console.log("Genarating file names...");
    let fileNames = [];

    currentCoord.forEach((coord, index) => {
        let {
            startX,
            startY,
            endX,
            endY
        } = coord;

        // get cell
        let startCell = coordsToCell(startX, startY);
        let endCell = coordsToCell(endX, endY);

        // genarate file names for all coords between start and end

        for (let x = startCell.x; x <= endCell.x; x++) {
            for (let y = startCell.y; y <= endCell.y; y++) {
                let fileName = start + x + "_" + y + end;
                fileNames.push(fileName);
            }
        }

    });
    // function uniq(a) {
    //     var seen = {};
    //     return a.filter(function (item) {
    //         return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    //     });
    // }
    // fileNames = uniq(fileNames);
    // remvoe duplicates

    // fileNames = [...new Set(fileNames)];

    // endTime of function
    console.timeEnd('genarateFileNamesForAllCells');
    return fileNames;

}

export function genarateMapFileNamesForAllCoords(currentCoord, start="map_", end=".bin") {
    // startTime of function
    console.time('genarateFileNamesForAllCoords');
    console.log("Genarating file names...");
  let fileNames = [];

  currentCoord.forEach((coord, index) => {
    let { startX, startY, endX, endY } = coord;
    let currFiles = [];
    let ff = [fileNames]

    // devide and round down start and end coords
    startX = Math.floor(startX / 10);
    startY = Math.floor(startY / 10);
    endX = Math.floor(endX / 10);
    endY = Math.floor(endY / 10);

    // genarate file names for all coords between start and end
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        let fileName = `${start}${x}_${y}${end}`;

        fileNames.push(fileName);


      }
    }
  });
    // function uniq(a) {
    //     var seen = {};
    //     return a.filter(function (item) {
    //         return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    //     });
    // }
    // fileNames = uniq(fileNames);
  // remvoe duplicates

    // fileNames = [...new Set(fileNames)];

    // endTime of function
    console.timeEnd('genarateFileNamesForAllCoords');
  return fileNames;

}

export function getOptions() {
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

export function clearCoords() {
    const currentCoord = JSON.parse(localStorage.getItem('coord'));
    // add confirm before clearing
    let confirmed = confirmPopup(`Are you sure you want to clear all (${currentCoord.length}) coordinate sections?`, (confirmed) => {
        if (!confirmed) return;

        localStorage.clear();
        displayCoords();
    });
}

export function addPZCellCoord(x, y, name) {
    let coords = cellToCoords(x, y);
    addCoord(coords.x, coords.y, coords.endx, coords.endy, name);

    // clear input fields
    // document.getElementById('cellX').value = '';
    // document.getElementById('cellY').value = '';
    // document.getElementById('cellName').value = '';
}

export function toggleMapFrame() {
    const mapiframe = document.querySelector('#mapframe-over');
    mapiframe.classList.toggle('closed');
}

export function addCoord(startX, startY, endX, endY, name) {
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

    currentCoord.push({
        startX,
        startY,
        endX,
        endY,
        name
    });

    console.log(`Section added: ${startX}, ${startY}, ${endX}, ${endY}, ${name}`);

    localStorage.setItem('coord', JSON.stringify(currentCoord));

    displayCoords();
}

export function removeAllMapFiles(fileNames) {
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
}

export function downloadAllMapFiles(fileNames) {
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
}


export function displayCoords() {
    const currentCoord = JSON.parse(localStorage.getItem('coord'));
    const coordList = document.querySelector('#coords');

    // clear list
    coordList.innerHTML = '';

    // return li with delete button and text inside a div
    function createCoordLi(startX, startY, endX, endY, name) {
        let pzcell = coordsToCell(startX, startY);
        let pzendCell = coordsToCell(endX, endY);
        const li = document.createElement('li');
        // const div = document.createElement('div');
        

        // add button container
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btnContainer');

        const btnDbContainer = document.createElement('div');
        btnDbContainer.classList.add('btnContainer');

        let coordList = { startX, startY, endX, endY, name};
        // map files pill buttons

        let mapFilespill = createPillButton("Map files", () => removeAllMapFiles(genarateMapFileNamesForAllCoords([coordList])), () => downloadAllMapFiles(genarateMapFileNamesForAllCoords([coordList])));
        let chunkFilesPill = createPillButton("Chunk files", () => removeAllMapFiles(genarateMapFileNamesForAllCells([coordList], "chunkdata_")), () => downloadAllMapFiles(genarateMapFileNamesForAllCells([coordList], "chunkdata_")));
        let zpopFilesPill = createPillButton("Zpop files", () => removeAllMapFiles(genarateMapFileNamesForAllCells([coordList], "zpop_")), () => downloadAllMapFiles(genarateMapFileNamesForAllCells([coordList], "zpop_")));
        let vehicalsDbPill = createPillButton("Vehicals DB", () => removeAllMapFiles(["vehicals.db"]), () => downloadAllMapFiles(["vehicals.db"]));
        let playersDbPill = createPillButton("Players DB", () => removeAllMapFiles(["players.db"]), () => downloadAllMapFiles(["players.db"]));
        // let saveDbPill = createPillButton("Save DB", () => console.info("not yet implemented"), () => console.info("not yet implemented"));
        // let globalModDataPill = createPillButton("Mod data", () => removeAllMapFiles(["global_mod_data.bin"]), () => downloadAllMapFiles(["global_mod_data.bin"]));


        let numberOfFiles = calculateNumberOfFiles([{
            startX,
            startY,
            endX,
            endY,
            name
        }]);

        const spanText = document.createElement('span');
        spanText.textContent = `${name} [${pzcell.x}:${pzcell.y}] [${pzendCell.x}:${pzendCell.y}]`;

        const spanFiles = document.createElement('small');
        spanFiles.textContent = `(${numberOfFiles} files)`;

        li.appendChild(spanText);

        li.appendChild(spanFiles);

        const startA = document.createElement('button');
        startA.target = '_blank';
        startA.textContent = `${startX}:${startY}`;
        startA.addEventListener('click', () => {
            os.openUrl(`https://map.projectzomboid.com/#${startX}x${startY}`);
        });

        li.appendChild(startA);

        const endA = document.createElement('button');
        endA.target = '_blank';
        endA.textContent = `${endX}:${endY}`;
        endA.addEventListener('click', () => {
            os.openUrl(`https://map.projectzomboid.com/#${endX}x${endY}`);
        });

        li.appendChild(endA);

        let deleteBtn = createElement('button', "", {
            title: "Delete Section",
            class: "deleteBtn"
        }, {
            click: () => {
                deleteCoord(startX, startY, endX, endY);
            }
        });    
            
        let deleteIcon = createElement('i', "delete", {
            class: "material-icons",
            style: "font-size: 1.2rem;",
        }, {});
        
        deleteBtn.appendChild(deleteIcon);

        // add all buttons to the container
        // btnContainer.appendChild(ftpRemoveBtn);
        // btnContainer.appendChild(ftpDownloadBtn);
        btnContainer.appendChild(mapFilespill);
        btnContainer.appendChild(chunkFilesPill);
        btnContainer.appendChild(zpopFilesPill);
        // btnContainer.appendChild(globalModDataPill);
        
        btnDbContainer.appendChild(vehicalsDbPill);
        btnDbContainer.appendChild(playersDbPill);
        // btnDbContainer.appendChild(saveDbPill);

        // add the container to the li

        // li.appendChild(div);
        // li.appendChild(ftpRemoveBtn);
        // li.appendChild(ftpDownloadBtn);
        li.appendChild(deleteBtn);

        li.appendChild(btnContainer);
        li.appendChild(btnDbContainer);

        return li;
    }

    if (currentCoord) {
        const searchText = document.querySelector('#coordSearch').value;
        let newCoords = currentCoord;
        if (searchText !== "") {
            newCoords = newCoords.filter((coord) => {
                return coord.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    coord.startX.toString().includes(searchText) ||
                    coord.startY.toString().includes(searchText) ||
                    coord.endX.toString().includes(searchText) ||
                    coord.endY.toString().includes(searchText) ||
                    (
                        (parseInt(searchText) >= coord.startX && parseInt(searchText) <= coord.endX) ||
                        (parseInt(searchText) >= coord.startY && parseInt(searchText) <= coord.endY)
                    )
            });
        }
         newCoords.forEach((coord) => {
            const {
                startX,
                startY,
                endX,
                endY,
                name
            } = coord;
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

export function deleteCoord(startX, startY, endX, endY) {
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