document.getElementById('scheduleForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
    
    const studyHours = parseInt(document.getElementById('studyHours').value);
    const subjects = document.getElementById('subjects').value.split(',').map(sub => sub.trim());
    const assignmentsCount = parseInt(document.getElementById('assignments').value);
    const difficultyLevels = document.getElementById('difficultyLevels').value.split(',').map(level => level.trim());
    const examDates = document.getElementById('examDates').value.split(',').map(date => date.trim());
    const assignmentDates = document.getElementById('assignmentDates').value.split(',').map(date => date.trim());

    const scheduleOutput = document.getElementById('scheduleOutput');
    scheduleOutput.innerHTML = '';

    if (subjects.length !== difficultyLevels.length) {
        scheduleOutput.innerHTML = '<p style="color: red;">Error: Each subject must have a corresponding difficulty level!</p>';
        return;
    }

    if (assignmentsCount !== assignmentDates.length) {
        scheduleOutput.innerHTML = '<p style="color: red;">Error: The number of assignments must match the number of assignment dates!</p>';
        return;
    }

    const assignments = generateAssignments(assignmentsCount, difficultyLevels, assignmentDates);
    const studyPlan = createStudySchedule(studyHours, subjects, assignments, examDates);
    
    scheduleOutput.innerHTML = `<pre>${studyPlan}</pre>`;
});

function generateAssignments(count, difficultyLevels, assignmentDates) {
    const assignments = [];
    for (let i = 0; i < count; i++) {
        const difficulty = difficultyLevels[i % difficultyLevels.length];
        const dueDate = assignmentDates[i] || 'No date specified';
        assignments.push(`Assignment ${i + 1}: Difficulty - ${difficulty}, Due Date - ${dueDate}`);
    }
    return assignments;
}

function createStudySchedule(studyHours, subjects, assignments, examDates) {
    let schedule = '';
    const hoursPerSubject = Math.floor(studyHours / subjects.length);
    const extraHours = studyHours % subjects.length;

    subjects.forEach((subject, index) => {
        const assignedHours = hoursPerSubject + (index < extraHours ? 1 : 0);
        schedule += `Subject: ${subject} - Study Hours: ${assignedHours}\n`;

        assignments.forEach(assignment => {
            schedule += `  ${assignment}\n`;
        });
    });

    if (examDates.length) {
        schedule += `\nExam Dates:\n`;
        examDates.forEach((date, index) => {
            schedule += `  Exam ${index + 1}: ${date}\n`;
        });
    }

    return schedule;
}
