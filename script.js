document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    let startAngle = 0;
    const arc = Math.PI / (employees.length / 2);
    let spinTimeout = null;

    let spinAngleStart = 10;
    let spinTime = 0;
    let spinTimeTotal = 0;

    function drawRouletteWheel() {
        const outsideRadius = 350;
        const textRadius = 300;
        const insideRadius = 125;

        ctx.clearRect(0, 0, 800, 800);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.font = 'bold 18px Helvetica, Arial';

        for (let i = 0; i < employees.length; i++) {
            const angle = startAngle + i * arc;
            ctx.fillStyle = employees[i].Color;

            ctx.beginPath();
            ctx.arc(400, 400, outsideRadius, angle, angle + arc, false);
            ctx.arc(400, 400, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "black";
            ctx.translate(400 + Math.cos(angle + arc / 2) * textRadius,
                          400 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            const text = employees[i].Name;
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        // Arrow
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(400 - 4, 400 - (outsideRadius + 5));
        ctx.lineTo(400 + 4, 400 - (outsideRadius + 5));
        ctx.lineTo(400 + 4, 400 - (outsideRadius - 5));
        ctx.lineTo(400 + 9, 400 - (outsideRadius - 5));
        ctx.lineTo(400 + 0, 400 - (outsideRadius - 13));
        ctx.lineTo(400 - 9, 400 - (outsideRadius - 5));
        ctx.lineTo(400 - 4, 400 - (outsideRadius - 5));
        ctx.lineTo(400 - 4, 400 - (outsideRadius + 5));
        ctx.fill();
    }

    function spin(button) {
        lockoutSubmit(button);
        spinAngleStart = Math.random() * 10 + 10;
        spinTime = 0;
        spinTimeTotal = Math.random() * 3 + 8 * 1000;
        rotateWheel();
    }

    function lockoutSubmit(button) {
        const oldValue = button.innerText;

        button.setAttribute('disabled', true);
        button.innerText = 'Spinning...';

        setTimeout(function () {
            button.innerText = oldValue;
            button.removeAttribute('disabled');
        }, 4000);
    }

    function rotateWheel() {
        spinTime += 30;
        if (spinTime >= spinTimeTotal) {
            stopRotateWheel();
            return;
        }
        const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
        startAngle += (spinAngle * Math.PI / 180);
        drawRouletteWheel();
        spinTimeout = setTimeout(rotateWheel, 30);
    }

    function stopRotateWheel() {
        clearTimeout(spinTimeout);
        const degrees = startAngle * 180 / Math.PI + 90;
        const arcd = arc * 180 / Math.PI;
        const index = Math.floor((360 - degrees % 360) / arcd);
        ctx.save();
        ctx.font = 'bold 30px Helvetica, Arial';
        const winner = employees[index];
        document.getElementById('winnerMessage').innerText = winner.Name;
        const winnerImage = document.getElementById('winnerImage');
        winnerImage.src = winner.ImagePath;

        // Set the modal background color to the winner's color
        const winnerModalBody = document.getElementById('winnerModalBody');
        winnerModalBody.style.backgroundColor = winner.Color;

        // Increment the WheelCount for the winner
                incrementScoreForWinner(winner.Id);
                updateLeaderboard();


        // Show the modal
        $('#winnerModal').modal('show');
        ctx.restore();
    }
    function incrementScoreForWinner(winnderId){
        const index = employees.findIndex(employee => employee.Id === winnderId);
        employees[index].WheelCount += 1;
        saveEmployees();
    }
    function updateLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = ''; // Clear existing leaderboard

        // Sort employees by WheelCount descending
        employees.sort((a, b) => b.WheelCount - a.WheelCount);

        employees.forEach(employee => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                <span>
                    <img src="${employee.ImagePath}" alt="${employee.Name}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                    ${employee.Name}: ${employee.WheelCount}
                </span>
            `;
            leaderboard.appendChild(li);
        });
    }

    function easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    document.getElementById("spinButton").addEventListener("click", function () {
        spin(this);
    });

    drawRouletteWheel();
    updateLeaderboard();
});
