# quick-gallery

[![Dependency Status](https://david-dm.org/tmorin/quick-gallery.png)](https://david-dm.org/tmorin/quick-gallery)
[![devDependency Status](https://david-dm.org/tmorin/quick-gallery/dev-status.png)](https://david-dm.org/tmorin/quick-gallery#info=devDependencies)

quick-gallery is an easy way to browse galleries of pictures organized from the file system.

It aggressively uses a cache based on the file system. The cache will store thumbnails and resized pictures.
Both can be generated on the fly, from a command line utility or from the webapp.

quick-gallery has been built to works on Raspberry Pi.

quick-gallery is available from npm, by this way the installation and configuration is easier.

# Dependencies

quick-gallery uses imagemagick for pictures resizing.

# Install
```shell
npm -g install quick-gallery
```

# Configuration

## From npm config
```shell
npm -g config set quick_gallery_port 80
npm -g config set quick_gallery_adapted_max_width 800
npm -g config set quick_gallery_adapted_max_height 600
npm -g config set quick_gallery_thumbnail_max_width 150
npm -g config set quick_gallery_thumbnail_max_height 150
npm -g config set quick_gallery_pics_dir /media/usbdisk/Pictures
npm -g config set quick_gallery_cache_dir /media/usbdisk/gq_cache
npm -g config set quick_gallery_imagemagick_path /usr/bin
```

## From environment variables
```shell
EXPORT QUICK_GALLERY_PORT=80
EXPORT QUICK_GALLERY_ADAPTED_MAX_WIDTH=800
EXPORT QUICK_GALLERY_ADAPTED_MAX_HEIGHT=600
EXPORT QUICK_GALLERY_THUMBNAIL_MAX_WIDTH=150
EXPORT QUICK_GALLERY_THUMBNAIL_MAX_HEIGHT=150
EXPORT QUICK_GALLERY_PICS_DIR=/media/usbdisk/pictures
EXPORT QUICK_GALLERY_CACHE_DIR=/media/usbdisk/gq_cache
EXPORT QUICK_GALLERY_IMAGEMAGICK_PATH=/usr/bin
```

## From command line variables
```shell
qg-server --port 80 --adapted_max_width 800 --adapted_max_height 600 --thumbnail_max_width 150 --thumbnail_max_height 150 --pics_dir /media/usbdisk/pictures --cache_dir /media/usbdisk/gq_cache --imagemagick_path /usr/bin
```

```shell
qg-cache-builder --port 80 --adapted_max_width 800 --adapted_max_height 600 --thumbnail_max_width 150 --thumbnail_max_height 150 --pics_dir /media/usbdisk/pictures --cache_dir /media/usbdisk/gq_cache --imagemagick_path /usr/bin
```

# Server

```shell
npm -g start quick-gallery
```
or
```shell
qg-server
```

# Cache builder

```shell
qg-cache-builder
```
