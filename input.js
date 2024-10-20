function inputStudyPlan() {
    let NUM = prompt("Enter number of exams");
    NUM = parseInt(NUM);

    let DATES = new Array(NUM);
    let SUBJECTS = new Array(NUM);
    let DIFFICULTY = new Array(NUM);

    for (let i = 0; i < NUM; i++) {
        let DATE = prompt("Enter exam date (day number)");
        DATES[i] = parseInt(DATE);

        let SUBJECT = prompt("Enter exam topic");
        SUBJECTS[i] = SUBJECT.toString();

        let DIFF = prompt("Enter difficulty level - E for EASY, M for MEDIUM, D for DIFFICULT");
        DIFFICULTY[i] = DIFF.toUpperCase();
    }

    let STUDYTIME = prompt("Enter preferred study time -> M for MORNING, A for AFTERNOON, E for EVENING").toUpperCase();
    let TOTALHRS = parseInt(prompt("Enter number of hours you want to devote per day"));
    let PREFLEN = parseFloat(prompt("Enter preferred length of each study session in hours (between 0.5 hrs to 2 hours)"));

    return {
        NUM,
        DATES,
        SUBJECTS,
        DIFFICULTY,
        STUDYTIME,
        TOTALHRS,
        PREFLEN
    };
}

function genStudyPlan(input) {
    let { NUM, DATES, SUBJECTS, DIFFICULTY, STUDYTIME, TOTALHRS, PREFLEN } = input;
    
    let STUDYPLAN = Array.from({ length: 30 }, () => new Array(3).fill("Subject of choice"));
    let breaklen = 0;

    if (PREFLEN === 1.5 || PREFLEN === 2) {
        breaklen = 0.5;
    } else if (PREFLEN === 1) {
        breaklen = 0.25;
    } else {
        breaklen = 0.083; 
    }

    let DAYS_BEFORE_EXAM = new Array(NUM);
    let START_DATE = new Array(NUM);

    for (let i = 0; i < NUM; i++) {
        if (DIFFICULTY[i] === 'D') {
            DAYS_BEFORE_EXAM[i] = 4;
        } else if (DIFFICULTY[i] === 'M') {
            DAYS_BEFORE_EXAM[i] = 3;
        } else {
            DAYS_BEFORE_EXAM[i] = 2;
        }
        START_DATE[i] = DATES[i] - DAYS_BEFORE_EXAM[i];
    }

    for (let i = 0; i < NUM; i++) {
        for (let k = START_DATE[i]; k < DATES[i]; k++) {
            let hours_left = TOTALHRS;
            let session_start_time = 0;
            let slot_index = 0;

            if (STUDYTIME === 'M') {
                session_start_time = 8;
                slot_index = 0;
            } else if (STUDYTIME === 'A') {
                session_start_time = 16;
                slot_index = 1;
            } else {
                session_start_time = 18;
                slot_index = 2;
            }

            while (hours_left > 0 && slot_index < 3) {
                let session_end_time = session_start_time + PREFLEN;
                STUDYPLAN[k][slot_index] = `Study ${SUBJECTS[i]} from ${session_start_time} to ${session_end_time}`;
                hours_left -= PREFLEN;

                session_start_time = session_end_time + breaklen;

                if (session_start_time >= 12 && STUDYTIME === 'M') {
                    slot_index = 1;
                    session_start_time = 16;
                } else if (session_start_time >= 19 && STUDYTIME === 'A') {
                    slot_index = 2;
                    session_start_time = 18;
                } else if (session_start_time >= 22 && STUDYTIME === 'E') {
                    break;
                }
            }
        }
    }
    
    return STUDYPLAN;
}

let userInput = inputStudyPlan();
let studyPlan = genStudyPlan(userInput);
console.log(studyPlan);
