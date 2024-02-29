const fs = require('fs');
const os = require('os');
const path = '/etc/hosts';
const hostnameToAdd = '127.0.0.1 localhost.binary.sx';

fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  if (data.includes(hostnameToAdd)) {
    console.log('Hostname already exists in /etc/hosts');
  } else {
    fs.appendFile(path, os.EOL + hostnameToAdd, (err) => {
      if (err) throw err;
      console.log('Hostname appended to /etc/hosts');
    });
  }
});