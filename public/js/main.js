const deleteProduct = (element, productId, csrf) => {
    const productElement = element.closest('.column');
    fetch('/admin/product/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            if(result.ok) {
                productElement.parentNode.removeChild(productElement);
            }
            else {
                alert("Error: " + result.status + " - " + result.statusText);
            }
        })
        .catch(error => console.log(error))
}