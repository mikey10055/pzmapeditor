export function createElement(type, content, attributes = {}, events = {}) {
    const ele = document.createElement(type);

    ele.textContent = content;

    for (const key in attributes) {
        ele.setAttribute(key, attributes[key]);
    }
    for (const key in events) {
        ele.addEventListener(key, events[key]);
    }

    return ele;
}


// project zomboid coords to cell
export function coordsToCell(x, y) {
    let nx = Math.floor(x / 300);
    let ny = Math.floor(y / 300);
    return {
        x: nx,
        y: ny,
        str: `${nx}_${ny}`
    }
}

export function removeLastChar(num) {
    return Math.floor(num / 10);
}

//project zomboid cell to coords
export function cellToCoords(x, y) {
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

// buttons either side of some text, one to remove and one to download
export function createPillButton(text, removeCallback, downloadCallback) {
    const pill = createElement('div', '', { class: 'pill' });
    const remove = createElement('button', 'delete', { class: 'pill-remove material-icon' });
    const download = createElement('button', 'download', { class: 'pill-download material-icon' });
    const textSpan = createElement('span', text, { class: 'pill-text' });

    remove.addEventListener('click', removeCallback);
    download.addEventListener('click', downloadCallback);

    pill.appendChild(remove);
    pill.appendChild(textSpan);
    pill.appendChild(download);

    return pill;
}