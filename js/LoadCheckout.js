var totalG = 0;
var cartProductsG = [];

const apiBase = 'https://backkajita-efrenislas.b4a.run'

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
                    <td>${currency} ${formatNumber(subtotal)}</td>
                    </tr>`
    totalG = 0 + total;
    })
    if(totalG>0){
      var merchantKey = credentials();
      var idForm = getIdForm();

      var kushki = new KushkiCheckout({
          kformId: idForm,
          form: "my-form",
          publicMerchantId: merchantKey,
          inTestEnvironment: true,
          amount: {
           subtotalIva: totalG * 0.81,
           iva: totalG * 0.19,
           subtotalIva0:0,
           }
          });
    }

    var html = `${prodsHtml}
            <tr class="summary-subtotal">
                <td>Subtotal:</td>
                <td>${currency} ${formatNumber((total * 0.81))}</td>
            </tr><!-- End .summary-subtotal -->
            <tr>
                <td>IVA:</td>
                <td>${currency} ${formatNumber((total * 0.19))}</td>
            </tr>
            <tr>
                <td>Shipping:</td>
                <td>Free shipping</td>
            </tr>
            <tr class="summary-total">
                <td>Total:</td>
                <td>${currency} ${formatNumber((total))}</td>
            </tr><!-- End .summary-total -->`

    $('#products-list').html(html);
}

function loadConfirm(){

    var cartProducts = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    const currency = localStorage.getItem('currency') ?? 'CLP';
    var listProducts = [];
    var total = 0;
     cartProducts.forEach(product => {
        let prodFilter = products().filter((ele)=> ele.reference == product.reference)[0]
        total += product.quantity * prodFilter[currency]

        listProducts.push({
            id: product.reference,
            title: product.name,
            sku: product.reference,
            price: prodFilter[currency],
            quantity: product.quantity
        })
        totalG = 0 + total;
    })

    cartProductsG = [... listProducts]
    console.log(cartProductsG);
    
}

function payCard(token){
    const currency = localStorage.getItem('currency') ?? 'CLP';
    const publicKey = credentials();
    var payload = {
        "token": token,
        "amount": {
          "currency": currency,
          "subtotalIva": 0,
          "subtotalIva0": (totalG * 0.81),
          "iva": (totalG * 0.19),
          "ice": 0
        },
        "fullResponse": "v2",
        "ignoreWarnings": true,
        "contactDetails": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "user@example.com",
          "documentType": "CURP",
          "documentNumber": "ABCD123456EF",
          "phoneNumber": "+523988734644"
        },
        "orderDetails": {
          "siteDomain": "kushkistore.com",
          "shippingDetails": {
            "name": "John Doe",
            "phone": "+523988734644",
            "addres": "Centro 123",
            "city": "Monterrey",
            "region": "Nuevo Leon",
            "country": "Mexico"
          },
          "billingDetails": {
            "name": "John Doe",
            "phone": "+523988734644",
            "addres": "Centro 123",
            "city": "Monterrey",
            "region": "Nuevo Leon",
            "country": "Mexico"
          }
        },
        "productDetails": {
          "product": cartProductsG
        }
      }

      $.ajax({
        url: apiBase + "/api/v1/kushki/card",
        type: "POST",
        headers: {
          "Public-Merchant-Id": publicKey,
          "Content-Type": 'application/json'
        },
        data: JSON.stringify(payload),
        success: function(response) {
            $('#message').html('Tu pago ha sido exitoso')
            $('#checkoutBtn').hide()
            swal.hideLoading()
            swal.close();
          console.log(response);
          localStorage.removeItem('cart')
        },
        error: function(xhr, status, error) {
            $('#message').html('Tu pago no pudo ser procesado')
            swal.hideLoading()
            swal.close();
          console.log(error);
        }
      });
}

function payTransfer(token){
    const publicKey = credentials();
    const currency = localStorage.getItem('currency') ?? 'CLP';
    var payload = {
        "token": token,
        "amount": {
          "subtotalIva": 0,
          "subtotalIva0": (totalG * 0.81),
          "iva": (totalG * 0.19)
        }
      }
      console.log(payload);

      $.ajax({
        url: apiBase + "/api/v1/kushki/transfer",
        type: "POST",
        headers: {
          "Public-Merchant-Id": publicKey,
          "Content-Type": 'application/json'
        },
        data: JSON.stringify(payload),
        success: function(response) {
          $('#message').html('Tu pago está en proceso')
          swal.hideLoading()
          swal.close();
          console.log(response);
          if(response !=null && response.redirectUrl !=null){
            window.location.assign(response.redirectUrl)
          } else if(currency == 'MXN' && response){
            var html = `<span><strong>Banco:</strong> ${response.bank} </span>
            <span><strong>Número de Referencia:</strong> ${response.referenceNumber} </span>
            <span><strong>Ticket:</strong> ${response.ticketNumber} </span>
            <span><strong>Procesador:</strong> ${response.referenceProcessor} </span>
            <span><strong>Transacción:</strong> ${response.transactionReference} </span>`

            $('#detail').html(html)
            $('#checkoutBtn').hide()
          }
          localStorage.removeItem('cart')
        },
        error: function(xhr, status, error) {
            $('#message').html('Tu pago no pudo ser procesado')
            swal.hideLoading()
            swal.close();
            
          console.log(error);
        }
      });
}
// Opcional: Agregar un controlador de evento click usando jQuery
$("#downloadButton").on("click", function(event) {
  event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
  var url = $(this).attr("href");
  window.open(url, "_blank");
});

function payCash(token){
  const publicKey = credentials();
    var payload = {
        "token": token,
        "amount": {
          "subtotalIva": 0,
          "subtotalIva0": (totalG * 0.81),
          "iva": (totalG * 0.19)
        }
      }
      console.log(payload);
      $.ajax({
        url: apiBase + "/api/v1/kushki/cash",
        type: "POST",
        headers: {
          "Public-Merchant-Id": publicKey,
          "Content-Type": 'application/json'
        },
        data: JSON.stringify(payload),
        success: function(response) {
          $('#message').html('Tu pago está en proceso')
          swal.hideLoading()
          swal.close();
          if(response != null && response.pdfUrl !=null){
            $('#downloadButton').attr('href', response.pdfUrl);
            $('#downloadButton').show()
          }
          $('#checkoutBtn').hide()
          console.log(response);
          localStorage.removeItem('cart')
        },
        error: function(xhr, status, error) {
            $('#message').html('Tu pago no pudo ser procesado')
            swal.hideLoading()
            swal.close();
          console.log(error);
        }
      });
}