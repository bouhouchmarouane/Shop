const deleteProduct = (productId, csrf) => {
    console.log(productId);
    console.log(csrf);
    fetch('/admin/product/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => console.log(result))
        .catch(error => console.log(error))
}