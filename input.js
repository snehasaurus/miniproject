document.getElementById('scheduleForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const studyHours = parseInt(document.getElementById('studyHours').value);
    const subjects = document.getElementById('subjects').value.split(',').map(sub => sub.trim());
    const assignmentsCount = parseInt(document.getElementById('assignments').value);
    const difficultyLevels = document.getElementById('difficultyLevels').value.split(',').map(level => level.trim());
    
    const scheduleOutput = document.getElementById('scheduleOutput');
    scheduleOutput.innerHTML = '';

    if (subjects.length !== difficultyLevels.length) {
        scheduleOutput.innerHTML = '<p style="color: red;">Error: Each subject must have a corresponding difficulty level!</p>';
        return;
    }

    const assignments = generateAssignments(assignmentsCount, difficultyLevels);
    const studyPlan = createStudySchedule(studyHours, subjects, assignments);
    
    scheduleOutput.innerHTML = `<pre>${studyPlan}</pre>`;
});

function generateAssignments(count, difficultyLevels) {
    const assignments = [];
    for (let i = 0; i < count; i++) {
        const difficulty = difficultyLevels[i % difficultyLevels.length];
        assignments.push(`Assignment ${i + 1}: Difficulty - ${difficulty}`);
    }
    return assignments;
}

function createStudySchedule(studyHours, subjects, assignments) {
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

    return schedule;
}
