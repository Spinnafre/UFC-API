module.exports = {
    browserOptions: {
        headless: true,
        defaultViewport: null,
        args: [
            '--disable-web-security',
            "--no-sandbox",
            "--single-process",
            "--disable-setuid-sandbox",
            "--no-zygote",
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    },
    timeoutToRequest:10000
}