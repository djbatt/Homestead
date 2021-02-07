const fs = require("fs");
const sharp = require("sharp");

//Get all images in src

(async () => {
  const resize = (size) => {
    var fileName = size.file.replace(/\.[^.]*$/, "");
    var extension = size.file.match(/\.[0-9a-z]+$/i);
    sharp(`${__dirname}/assets/images/src/${size.file}`)
      .resize({ 
        width: size.width,
        height: null,
        withoutEnlargement: true,
      })
      .toFile(
        `${__dirname}/assets/images/public/${fileName}-${size.size}${extension}`,
        (err, info) => {
          if (err) {
            console.log(files[i], err);
          } else if (info) {
            console.log(info);
          }
        }
      );
  };

  var files = fs.readdirSync(`${__dirname}/assets/images/src/`);
  
  files = files.filter(e => e !== ".gitignore");

  for (var i = 0; i < files.length; i++) {
    var sizes = {
      xs: {
        size: "xs",
        width: 480,
        file: files[i],
      },
      sm: {
        size: "sm",
        width: 720,
        file: files[i],
      },
      md: {
        size: "md",
        width: 1440,
        file: files[i],
      },
      lg: {
        size: "lg",
        width: 1920,
        file: files[i],
      },
    };

    Promise.all([sizes.lg, sizes.md, sizes.sm, sizes.xs].map(resize));
  }
})();
