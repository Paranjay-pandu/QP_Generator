import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAoObRWOz586pwfOvjXY1ZUx3hm9R6DURg");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "generate me a 10 questions based on the topic cyber security and each is being separated by a & symbol anod nothing more";

const result = await model.generateContent(prompt);
const questions = result.response.text().split("&")
questions.forEach((question, index)=>{
    console.log(index+1, question.trim())
})