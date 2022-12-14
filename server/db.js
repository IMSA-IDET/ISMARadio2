import fs from "fs"

export const GetPassword = (password) => {
    return new Promise((resolve, reject) => {
        fs.readFile("./server/db/auth.json", "utf8", (err, data) => {
            if (err) {
                throw err;
            }
    
            const passwords = JSON.parse(data);
    
            for (let i = 0; i < passwords.length; i++) {
                if (passwords[i].password == password) {
                    if (checkDate(passwords[i].time)) {
                        resolve(true);
                    }
                }
            }
    
            resolve(false);
        });
    });
}

const checkDate = (dateObj) => {
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours() + (date.getMinutes() + date.getSeconds() / 60) / 60;

    if (date.getDay() == day) {
        return true;
    }

    if (dateObj.start <= hour && hour <= dateObj.end) {
        return true;
    }

    return false;
}