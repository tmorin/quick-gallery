import '../main';
import qs from 'qs';
import Navigo from 'navigo';
import './qg-gallery';
import ws from '../ws';

function getQueryParams() {
    const hash = location.hash;
    const index = hash.indexOf('?');
    return index >= 0 ? qs.parse(hash.substring(index + 1)) : {};
}

const router = new Navigo(null, true);
router.on(/\/(.*)\/?\??/, (arg) => {
    const path = arg.lastIndexOf('/') === arg.length - 1 ? arg : arg + '/';
    const params = getQueryParams();
    document.querySelector('qa-gallery').show(path);
    if (params.media) {
        document.querySelector('qa-player').show(path, params.media);
    } else {
        document.querySelector('qa-player').hide();
    }
});
router.notFound(() => router.navigate('/./'));

document.querySelector('main').innerHTML = `
    <qa-gallery></qa-gallery>
    <qa-player></qa-player>
`;

window.addEventListener('WebComponentsReady', () => {
    ws.getMedia(true)
        .then(root => {
            document.querySelector('qa-gallery').root = root;
            document.querySelector('qa-player').root = root;
        })
        .then(() => router.resolve())
        .catch(error => console.log(error))
});
