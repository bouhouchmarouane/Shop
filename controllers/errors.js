exports.get404 = (req, res) => {
    res.status(404).render('errors/404', {
        pageTitle: '404 - Page not found',
        path: ''
    });
}

exports.get500 = (req, res) => {
    res.status(500).render('errors/500', {
        pageTitle: '500 - Error occured',
        path: ''
    });
}