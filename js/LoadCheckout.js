var totalG = 0;
function loadCheckout(){

    var cartProducts = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    const currency = localStorage.getItem('currency') ?? 'CLP';
    var prodsHtml = '';
    var total = 0;
     cartProducts.forEach(product => {
        let prodFilter = products().filter((ele)=> ele.reference == product.reference)[0]
        let subtotal = product.quantity * prodFilter[currency] * 0.81;
        total += product.quantity * prodFilter[currency]

        prodsHtml += `<tr>
                    <td><a href="product.html?reference=${product.reference}">${prodFilter.name}</a></td>
                    <td>${currency} ${formatNumber(subtotal.toFixed(2))}</td>
                    </tr>`
    totalG = 0 + total;
    })
    var kushki = new KushkiCheckout({
        kformId: "yz79Tfrqt",
        form: "my-form",
        publicMerchantId: "9fbf716eff3343ebbd77390132d0bf5e",
        inTestEnvironment: true,
        amount: {
         subtotalIva: totalG * 0.81,
         iva: totalG * 0.19,
         subtotalIva0:0,
         }
        });
        (response) => {
                          swal.close();
                          if(response.token){
          var jsonHtml = `          `}}

    var html = `${prodsHtml}
            <tr class="summary-subtotal">
                <td>Subtotal:</td>
                <td>${currency} ${formatNumber((total * 0.81).toFixed(2))}</td>
            </tr><!-- End .summary-subtotal -->
            <tr>
                <td>IVA:</td>
                <td>${currency} ${formatNumber((total * 0.19).toFixed(2))}</td>
            </tr>
            <tr>
                <td>Shipping:</td>
                <td>Free shipping</td>
            </tr>
            <tr class="summary-total">
                <td>Total:</td>
                <td>${currency} ${formatNumber((total).toFixed(2))}</td>
            </tr><!-- End .summary-total -->`

    $('#products-list').html(html);
}

