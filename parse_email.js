const fs = require('fs');

function check(email) { 
    try {
        // read contents of the file
        var returnValue = 0;
        const cunyEmail = fs.readFileSync('./emails/cuny.txt', 'UTF-8');
        const sunyEmail = fs.readFileSync('./emails/suny.txt', 'UTF-8');

        // split the contents by new line
        const cunyLines = cunyEmail.split(/\r?\n/);
        const sunyLines = sunyEmail.split(/\r?\n/);

        cunyLines.forEach((line) => {
            if(email === line) { 
                //console.log("cuny.txt");
                returnValue = 1;
            }
        });
        
        //console.log('outside cuny');
        sunyLines.forEach((line) => {
            if(email === line) { 
                //console.log("suny.txt");
                returnValue = 2;
            }
        });
        //console.log('outside suny');

        return returnValue;
    } catch (err) {
        console.error(err);
    }
}

exports.check = check;
    