const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let playerX = canvas.width * 0.5,
	playerY = canvas.height * 0.5;

let playerSize = 30,
	sizePercent = 0.5;

let lastPlayerX = playerX,
	lastPlayerY = playerY;

const draws = [];

const randomColor = () => Math.floor(Math.random() * 255);

function randomRGBA(r = randomColor(), g = randomColor(), b = randomColor(), opacity = 1) {
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Usage
const image = new Image();
// const url = "https://diccionarioactual.com/wp-content/uploads/2017/04/waifu.png";
const url = "waifu.png";
image.src = url;

let color1 = randomRGBA(),
	color2 = randomRGBA();
let drawing = false;

function animate() {
	if (!drawing) ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	const percentCos = Math.abs(Math.cos(sizePercent));
	const percentSin = Math.abs(Math.sin(sizePercent));
	sizePercent += 0.0095;

	const opacity = 0.5;

	const [red1, green1, blue1, alpha1] = ctx.getImageData(playerX, playerY, 1, 1).data;
	const [red2, green2, blue2, alpha2] = ctx.getImageData(playerX + 1, playerY + 1, 1, 1).data;
	color1 = randomRGBA(red1, green1, blue1, opacity);
	color2 = randomRGBA(red2, green2, blue2, opacity);

	circle(playerX, playerY, playerSize * percentCos, color1);
	circle(playerX, playerY, playerSize * percentSin, color2);

	draws.forEach((draw) => circle(draw.x, draw.y, draw.size, draw.color));

	if (drawing && Math.abs(lastPlayerX - playerX) > 1 && Math.abs(lastPlayerY - playerY) > 1) {
		draws.push({ x: playerX, y: playerY, size: playerSize * percentCos, color: color1 });
		draws.push({ x: playerX, y: playerY, size: playerSize * percentSin, color: color2 });
	}

	requestAnimationFrame(animate);
}

function circle(x, y, radius, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fill();
}

window.addEventListener("mousemove", function (e) {
	playerX = e.clientX;
	playerY = e.clientY;
});

window.addEventListener("mousedown", (_) => (drawing = true));
window.addEventListener("mouseup", (_) => (drawing = false));

document.getElementById("reset").addEventListener("click", (_) => (draws.length = 0));
document.getElementById("size").addEventListener("input", (e) => (playerSize = e.target.value));

// hide the cursor
canvas.style.cursor = "none";

animate();
