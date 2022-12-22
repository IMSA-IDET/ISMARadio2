import fs from "fs"

export const GetPassword = password => {
    return new Promise(resolve => {
        fs.readFile("./server/db/auth.json", "utf8", (err, data) => {
            if (err) {
                throw err;
            }
    
            const passwords = JSON.parse(data);
    
            for (let i = 0; i < passwords.length; i++) {
                if (passwords[i].password == password) {
                    if (checkDate(passwords[i].time) === 0) {
                        resolve(true);
                    }
                }
            }
    
            resolve(false);
        });
    });
}

export const GetSchedule = () => {
    return new Promise(resolve => {
        fs.readFile("./server/db/shows.json", "utf8", (err, data) => {
            if (err) {
                throw err;
            }
    
            const shows = JSON.parse(data);

            let current = null;
            let next = [{rank: 999}];
            let timeout = 5000;
    
            shows.forEach(show => {
                show.schedule.forEach(time => {
                    if (checkDate(time) === 0) {
                        current = show;
                        const date = new Date();
                        const currentHour = (date.getHours() * 60 + date.getMinutes()) * 60 + date.getSeconds();
                        timeout = (time.end * 60 * 60 - currentHour) * 1000;
                    }
                });
            });

            if (current == null) {
                current = shows[shows.length - 1];
            }

            shows.forEach(show => {
                show.schedule.forEach(time => {
                    const showRank = checkDate(time);
                    if (showRank > 0) {
                        next.forEach((obj, i) => {
                            if (showRank < obj.rank) {
                                next.splice(i, 0, {
                                    rank: showRank,
                                    show: show
                                });

                                if (next.length > 3) {
                                    next.pop();
                                }
                            }
                        });
                    }
                });
            });

            resolve({
                current: current,
                next: next,
                timeout: timeout
            })
        });
    });
}

const checkDate = dateObj => {
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours() + (date.getMinutes() + date.getSeconds() / 60) / 60;

    // Check if exact date
    if (dateObj.day == day) {
        if (dateObj.start <= hour && hour < dateObj.end) {
            return 0;
        }
    }

    // Rank by how close it is to actual date
    let dateTime = dateObj.day * 24 + dateObj.start;
    let currentTime = day * 24 + hour;
    const difference = dateTime - currentTime;
    if (difference > 0) {
        return difference;
    } else {
        return (168 - currentTime) + dateTime;
    }
}