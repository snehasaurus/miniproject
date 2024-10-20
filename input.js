// Function to dynamically generate input fields for subjects, test dates, and assignments
function generateSubjectFields() {
    const numSubjects = document.getElementById('numSubjects').value;
    const subjectFieldsDiv = document.getElementById('subjectFields');
    subjectFieldsDiv.innerHTML = ''; // Clear previous fields

    for (let i = 1; i <= numSubjects; i++) {
        subjectFieldsDiv.innerHTML += `
            <div>
                <label for="subject${i}">Subject ${i}:</label>
                <input type="text" id="subject${i}" placeholder="Enter subject name">
                <label for="testDate${i}">Test Date for ${i}:</label>
                <input type="date" id="testDate${i}">
                <label for="difficulty${i}">Study Difficulty (E, M, D):</label>
                <input type="text" id="difficulty${i}" maxlength="1" placeholder="E/M/D">
                <label for="assignments${i}">Number of Assignments:</label>
                <input type="number" id="assignments${i}" placeholder="Enter number of assignments">
                <label for="assignmentDifficulty${i}">Assignment Difficulty (E, M, D):</label>
                <input type="text" id="assignmentDifficulty${i}" maxlength="1" placeholder="E/M/D">
            </div>`;
    }
}

// Function to capture user input from the dynamically generated fields
function inputStudyPlan() {
    const numSubjects = document.getElementById('numSubjects').value;
    let subjects = [];
    let testDates = [];
    let difficulty = [];
    let assignments = [];
    let assignmentDifficulty = [];

    for (let i = 1; i <= numSubjects; i++) {
        subjects.push(document.getElementById(`subject${i}`).value);
        testDates.push(document.getElementById(`testDate${i}`).value);
        difficulty.push(document.getElementById(`difficulty${i}`).value.toUpperCase());
        assignments.push(document.getElementById(`assignments${i}`).value);
        assignmentDifficulty.push(document.getElementById(`assignmentDifficulty${i}`).value.toUpperCase());
    }

    return { NUM: numSubjects, SUBJECTS: subjects, TEST_DATES: testDates, DIFFICULTY: difficulty, ASSIGNMENTS: assignments, ASSIGN_DIFFICULTY: assignmentDifficulty };
}

// Function to generate and display the study plan
function displayStudyPlan(studyPlan) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    for (let i = 0; i < studyPlan.length; i++) {
        let sessionClass = ''; // Default session class
        if (studyPlan[i].some(s => s.includes('18:00') || s.includes('19:00'))) {
            sessionClass = ' evening-session';
        } else if (studyPlan[i].some(s => s.includes('14:00') || s.includes('15:00'))) {
            sessionClass = ' afternoon-session';
        }
        
        let dayHTML = `<div class="study-day${studyPlan[i].some(s => s.includes('Test')) ? ' test-day' : ''}${sessionClass}">
                        <strong>Day ${i + 1}:</strong> ${studyPlan[i].join(', ')}
                       </div>`;
        outputDiv.innerHTML += dayHTML;
    }
}

// Generate study plan when form is submitted
document.getElementById('studyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let userInput = inputStudyPlan();
    let studyPlan = genStudyPlan(userInput);
    displayStudyPlan(studyPlan);
});

// Example study plan generation function (using actual test dates)
function genStudyPlan(input) {
    let { NUM, SUBJECTS, TEST_DATES, DIFFICULTY, ASSIGNMENTS, ASSIGN_DIFFICULTY } = input;
    let studyPlan = Array.from({ length: 30 }, () => new Array(3).fill("Subject of choice"));

    // Simple logic to populate study plan based on inputs
    for (let i = 0; i < NUM; i++) {
        for (let j = 0; j < studyPlan.length; j++) {
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + j); // Simulate each day
            let testDate = new Date(TEST_DATES[i]);

            // Highlight test day based on actual test date
            if (currentDate.toISOString().slice(0, 10) === testDate.toISOString().slice(0, 10)) {
                studyPlan[j][0] = `Study for ${SUBJECTS[i]} (Test) from 18:00 to 19:00`;
            } else if (ASSIGNMENTS[i] > 0 && j % 5 === 0) { // Work on assignments every 5th day
                studyPlan[j][0] = `Work on ${SUBJECTS[i]} assignments (${ASSIGNMENTS[i]} assignments, Difficulty: ${ASSIGN_DIFFICULTY[i]}) from 14:00 to 15:00`;
            } else {
                studyPlan[j][0] = `Study ${SUBJECTS[i]} from 14:00 to 15:00`;
            }
        }
    }
    
    return studyPlan;
}



