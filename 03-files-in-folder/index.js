const fs = require('fs');
const path = require('path');

fs.readdir('03-files-in-folder\\secret-folder', 
  { withFileTypes: true },
  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (!file.isDirectory()){
          let f = path.parse(file.name);
          fs.stat('.\\03-files-in-folder\\secret-folder\\' + file.name, (err, stats) => {
            console.log( f.name + ' - ', f.ext.substring(1) + ' - ' + Math.round(stats.size*1000/1024)/1000 + 'kb');
          });
        }
      });
    }
  });