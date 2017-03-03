import '../main';
import './qg-gallery';
import ws from '../ws';
import route from '../router';
import {findDirectory, findMedia} from '../utils';

document.querySelector('main').innerHTML = `
    <qa-gallery></qa-gallery>
    <qa-player></qa-player>
`;

window.addEventListener('WebComponentsReady', () => {
    ws.getMedia(true).then(root => {

        route(/\/(.*)\/?/, (path, [directoryPath], params) => {
            const directory = findDirectory(root, directoryPath);
            document.querySelector('qa-gallery').show(root, directory);
            if (params.media) {
                const media = findMedia(root, directory, params.media);
                document.querySelector('qa-player').show(directory, media);
            }
        });

        route.start('/' + root.path)

    });
});
