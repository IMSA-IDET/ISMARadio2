import fs from "fs"

export const GetPassword = (password) => {
    return true
    fs.readFile("db/auth.json", (data) => {
        const passwords = JSON.parse(data);

        passwords.forEach(obj => {
            if (obj.password != password) {
                return false;
            }

            const date = new Date();
            if (obj.time.day != date.getDay()) {
                return false;
            }

            if (obj.time.day != date.getDay()) {
                return false;
            }

            return true;
        });
    })
}