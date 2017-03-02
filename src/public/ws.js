import 'whatwg-fetch';

// GET /api/media?refresh=true|false
function getMedia(refresh = false) {
    return window.fetch(`api/media?refresh=${refresh}`).then(response => response.json());
}

// GET /api/directory/(*)
function getDirectory(path = '') {
    return window.fetch(`api/pictures/${path}`).then(response => response.json());
}

// GET /api/cache
function getCacheStatus() {
    return window.fetch(`api/cache`).then(response => response.json());
}

// POST /api/cache
function buildCache(clean = false, thumbnails = false, adapted = false) {
    return window.fetch(`api/cache`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({clean, thumbnails, adapted})
    }).then(response => response.json());

}

// DELETE /api/cache
function clearCache() {
    return window.fetch(`api/cache`, {method: 'DELETE'}).then(response => response.json());
}

const ws = {getMedia, getDirectory, getCacheStatus, buildCache, clearCache};

export default ws;

// GET /api/logs
// GET /api/basket?flatten=true|false&name=<string>&pictures=[<string>]

// GET /raw/pictures/(*)
// GET /raw/thumbnails/(*)
// GET /raw/adapted/(*)
