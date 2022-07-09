module.exports = {
    browserOptions: {
        headless: true,
        defaultViewport: null,
        args: [
            "--no-sandbox",
            "--single-process",
            "--disable-setuid-sandbox",
            "--no-zygote"
        ]
    },
    timeoutToRequest:1000
}