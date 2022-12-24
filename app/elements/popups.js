// confirm popup

export function confirmPopup(message, callback) {
    const confirmDiv = document.createElement('div');
    const transparentDiv = document.createElement('div');
    confirmDiv.classList.add('confirm');
    const confirmText = document.createElement('p');
    confirmText.textContent = message;
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Yes';

    // button container
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('popup-btn-container');

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
    transparentDiv.style.backgroundColor = 'rgba(144, 144, 144, 0.8)';
    transparentDiv.style.zIndex = '999';

    document.body.appendChild(transparentDiv);

    // add confirmDiv dark mode Styles and in the middle of the screen

    confirmDiv.style.position = 'absolute';
    confirmDiv.style.top = '50%';
    confirmDiv.style.left = '50%';
    confirmDiv.style.transform = 'translate(-50%, -50%)';
    confirmDiv.style.backgroundColor = 'rgba(6, 6, 6, 0.8)';
    confirmDiv.style.color = 'white';
    confirmDiv.style.padding = '15px 10px';
    confirmDiv.style.borderRadius = '5px';
    confirmDiv.style.display = 'flex';
    confirmDiv.style.flexDirection = 'column';
    confirmDiv.style.alignItems = 'center';
    confirmDiv.style.justifyContent = 'center';
    confirmDiv.style.zIndex = '9999';
    //width 40vw
    confirmDiv.style.width = '40vw';
    // height 20vh
    confirmDiv.style.height = '20vh';



    // add confirmText Styles

    confirmText.style.margin = '0';
    confirmText.style.textAlign = 'center';
    // width 100%
    confirmText.style.width = '100%';

    // add confirmBtn Styles

    // confirmBtn.style.border = 'none';
    // confirmBtn.style.backgroundColor = 'green';
    // confirmBtn.style.color = 'white';
    // confirmBtn.style.padding = '5px';
    // confirmBtn.style.cursor = 'pointer';
    confirmBtn.classList.add("confirmBtn");

    // add cancelBtn Styles

    // cancelBtn.style.border = 'none';
    // cancelBtn.style.backgroundColor = 'red';
    // cancelBtn.style.color = 'white';
    // cancelBtn.style.padding = '5px';
    // cancelBtn.style.cursor = 'pointer';
    cancelBtn.classList.add("cancelBtn");

    btnContainer.appendChild(confirmBtn);
    btnContainer.appendChild(cancelBtn);

    confirmDiv.appendChild(confirmText);
    confirmDiv.appendChild(btnContainer);
    document.body.appendChild(confirmDiv);

}


// display error message, function should display error message and have all styles in one place and create the elements. and have delete button to remove the error. all errors should stack at bottom left of the screen.
export function errorMessage(message) {
    console.error(message);
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    const errorText = document.createElement('p');
    errorText.textContent = message;
    const errorBtn = document.createElement('button');
    errorBtn.textContent = 'close';
    errorBtn.addEventListener('click', () => {
        errorDiv.remove();
    });

    // add errorDiv Styles
    errorDiv.style.position = 'absolute';
    errorDiv.style.bottom = '0';
    errorDiv.style.left = '0';
    errorDiv.style.backgroundColor = '#560d0d';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px 10px 10px 20px';
    errorDiv.style.display = 'flex';
    errorDiv.style.justifyContent = 'space-between';
    errorDiv.style.alignItems = 'center';
    errorDiv.style.width = '100%';

    // add errorText Styles
    errorText.style.margin = '0';

    // add errorBtn Styles
    errorBtn.style.border = 'none';
    errorBtn.style.backgroundColor = '#560d0d';
    errorBtn.style.color = 'white';
    errorBtn.style.padding = '5px';
    errorBtn.style.cursor = 'pointer';
    errorBtn.classList.add("material-icons");

    errorDiv.appendChild(errorText);
    errorDiv.appendChild(errorBtn);
    document.body.appendChild(errorDiv);
}