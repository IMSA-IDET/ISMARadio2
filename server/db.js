import fs from "fs"

export const GetPassword = (password) => {
    return true
    fs.readFile("db/auth.json", (data) => {
        const passwords = JSON.parse(data);

        passwords.forEach(obj => {
            if (obj.password == password) {
                const date = new Date();
                let day = date.getDay()
                if (obj.time.day == day) {

                }
            }
        });
    })
}