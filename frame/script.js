/* ===============================
   SCROLL FRAME ANIMATION
================================= */

const canvas = document.getElementById("animationCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 240;
const currentFrame = index =>
  `frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

const images = [];
let frameIndex = 0;

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
};

images[1].onload = render;

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / maxScroll;
  frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  requestAnimationFrame(render);
});

/* ===============================
   GEMINI CHATBOT (STRICT RESUME)
================================= */

const RESUME_CONTEXT = `
Name: Hari Ram
Location: Tirunelveli, Tamil Nadu, India
Phone: +91-8870831435
Email: hariselva350@gmail.com

Career Objective:
Motivated ECE student interested in drone communication, wireless systems, and embedded technology.

Education:
B.E. ECE, Government College of Engineering, Tirunelveli (2023–2027), CGPA 7.8
HSC 84.8%, SSLC 100%

Technical Skills:
Drone Communication, RF & Wireless, Arduino, MATLAB, Multisim, Proteus, MS Office

Projects:
Drone Communication Seminar (RF, Satellite, 5G)
Smart Bin (Arduino + Ultrasonic sensor)

Certifications:
Python – NPTEL/Coursera/Udemy
Embedded/IoT/Robotics Workshop

Interests:
UAV Communication, Wireless Networks, Satellite Communication, VLSI

Soft Skills:
Presentation, Quick learner, Team collaboration, Problem solving

Languages:
Tamil (Native), English (Intermediate)
`;

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
SYSTEM PROMPT:
You are a resume assistant.
Answer ONLY using the information provided below.
If the answer is not in the resume, reply:
"I don't have that information in the resume."

RESUME:
${RESUME_CONTEXT}

QUESTION:
${message}
`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Error getting response.";

  addMessage("Bot", reply);
}

function addMessage(sender, text) {
  const chatMessages = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
