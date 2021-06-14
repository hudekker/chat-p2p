let myDropdown = document.querySelector('#btn-dropdown');
let dropdownId;
let sendReceivers = [];


myDropdown.addEventListener('hide.bs.dropdown', function (evt) {
    debugger;

    if (evt.clickEvent && evt.clickEvent.target) {
        let dropdownId = evt.clickEvent.target.dataset.id;

        if (dropdownId == undefined) {
            return false;
        }

        document.querySelector('#btn-dropdown').innerText = dropdownId;

        sendReceivers = [];

        if (dropdownId == 'All') {
            let list = [...document.querySelector('#ul-dropdown').querySelectorAll('a')].map(el => el.dataset.id).filter(el => el != 'All')
            sendReceivers = [...list];
            debugger;

        } else {
            sendReceivers.push(dropdownId)
        }
    }
})