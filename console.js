function logMessage(message, type="#a6a7ad", oldCons) {
    const log = document.querySelector('.log');
    const line = document.createElement('div');

    // if message contains [object Object]
    if ((" " + message + " ").includes("[object Object]")) {
        message = JSON.stringify(message, null, 2);
        line.style.backgroundColor = "#1e1e1e";
    }

    line.textContent = ">: " + message;
    
    line.style.color = type;

    log.appendChild(line);

    log.scrollTop = log.scrollHeight;
}

const setWindowConsole = (win) => {

   return (function (oldCons) {
        return {
            ...oldCons,
            log: function (text) {
                oldCons.log(...arguments);
                logMessage(text, "#a6a7ad", oldCons);
            },
            info: function (text) {
                oldCons.info(...arguments);
                logMessage(text, "#4699c1", oldCons);
            },
            warn: function (text) {
                oldCons.warn(...arguments);
                logMessage(text, "orange", oldCons);
            },
            error: function (text) {
                oldCons.error(...arguments);
                logMessage(text, "red", oldCons);
            }
        };
    }(win));
    
}

module.exports = {
    setWindowConsole
}