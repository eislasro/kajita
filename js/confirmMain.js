// Main Js File
$(document).ready(function () {
    swal.showLoading()
    loadConfirm()
    var params = new URLSearchParams(location.search);
    var token = params.get('kushkiToken');
    var method = params.get('kushkiPaymentMethod');
    console.log(token);
    console.log(method);

    switch (method) {
        case 'card':
            payCard(token);
            break;
        case 'transfer':
            payTransfer(token);
            break;
        case 'cash':
            payCash(token);
            break;
    
        default:
            swal.hideLoading()
            swal.close();
            break;
    }
});