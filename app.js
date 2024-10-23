const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render('sample', { questions: [] });
});

app.post("/generate", async (req, res) => {
    const { topic } = req.body;
    const genAI = new GoogleGenerativeAI("AIzaSyAoObRWOz586pwfOvjXY1ZUx3hm9R6DURg");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate 8 questions based on the topic ${topic}. Format the output as follows:
    Section 1:
    1. [Question 1]
    2. [Question 2]
    Section 2:
    3. [Question 3]
    4. [Question 4]
    Section 3:
    5. [Question 5]
    6. [Question 6]
    Section 4:
    7. [Question 7]
    8. [Question 8]
    Each question should be on a new line, preceded by its number.`;

    try {
        const result = await model.generateContent(prompt);
        const rawText = result.response.text();
        const sections = rawText.split(/Section \d+:/g).filter(Boolean).map(section => section.trim());
        const formattedQuestions = sections.map(section => {
            return section.split('\n').filter(line => line.trim() !== '').map(question => question.replace(/^\d+\.\s*/, '').trim());
        });
        res.json({ questions: formattedQuestions });
    } catch (error) {
        console.error("Error generating questions:", error);
        res.status(500).json({ error: "Error generating questions" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
