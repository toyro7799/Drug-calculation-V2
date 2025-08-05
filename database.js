// database.js

// In a real application, this data would come from a database like MongoDB or PostgreSQL.
const allQuestions = [
    {
        id: 1,
        question: "The doctor orders an IV medication to be infused at 4 mcg/kg/min. The patient weighs 75 kg. You are supplied with a bag of the IV medication that reads 250 mg/250 mL. How many mL/hr will you administer?",
        options: ["9 mL/hr", "18 mL/hr", "36 mL/hr", "72 mL/hr"],
        answer: "18 mL/hr",
        explanation: "1. Calculate total mcg/min: $4 \\text{ mcg/kg/min} \\times 75 \\text{ kg} = 300 \\text{ mcg/min}$. <br>2. Convert mcg/min to mg/hr: $300 \\text{ mcg/min} \\times 60 \\text{ min/hr} = 18000 \\text{ mcg/hr} = 18 \\text{ mg/hr}$. <br>3. Calculate mL/hr. Concentration is $250 \\text{ mg} / 250 \\text{ mL} = 1 \\text{ mg/mL}$. <br>4. Final rate: $(18 \\text{ mg/hr}) / (1 \\text{ mg/mL}) = 18 \\text{ mL/hr}$."
    },
    {
        id: 2,
        question: "Dr orders Fentanyl 75 mcg IV pre-procedural. The vial is labeled 0.5 mg/mL. How many mL will you give per dose?",
        options: ["0.075 mL/dose", "0.15 mL/dose", "0.75 mL/dose", "1.5 mL/dose"],
        answer: "0.15 mL/dose",
        explanation: "1. Convert units to be the same. Have: $0.5 \\text{ mg} = 500 \\text{ mcg}$. <br>2. Use the formula (D/H) * Q: $(75 \\text{ mcg} / 500 \\text{ mcg}) \\times 1 \\text{ mL} = 0.15 \\text{ mL}$."
    },
    {
        id: 3,
        question: "Dr orders Insulin 8 units subcutaneous daily. The vial is labeled 100 units/mL. How many mL will you give per dose?",
        options: ["0.008 mL/dose", "0.04 mL/dose", "0.08 mL/dose", "0.8 mL/dose"],
        answer: "0.08 mL/dose",
        explanation: "Use the formula (D/H) * Q: $(8 \\text{ units} / 100 \\text{ units}) \\times 1 \\text{ mL} = 0.08 \\text{ mL}$."
    },
    {
        id: 4,
        question: "Dr orders Morphine 6 mg IV as needed for pain. The vial is labeled 10 mg/mL. How many mL will you give per dose?",
        options: ["0.06 mL/dose", "0.1 mL/dose", "0.6 mL/dose", "1.0 mL/dose"],
        answer: "0.6 mL/dose",
        explanation: "Use the formula (D/H) * Q: $(6 \\text{ mg} / 10 \\text{ mg}) \\times 1 \\text{ mL} = 0.6 \\text{ mL}$."
    },
    // ... Add all other questions here in the same format
    {
        id: 20,
        question: "Dr orders Ceftriaxone 1 g IV daily. The vial is labeled 2 g/10 mL. How many mL will you give per dose?",
        options: ["2 mL/dose", "2.5 mL/dose", "5 mL/dose", "10 mL/dose"],
        answer: "5 mL/dose",
        explanation: "Use the formula (D/H) * Q: $(1 \\text{ g} / 2 \\text{ g}) \\times 10 \\text{ mL} = 5 \\text{ mL}$."
    }
];

// Function to get questions. We can add logic to randomize or categorize them here.
function getQuestions() {
    // Basic shuffle
    return [...allQuestions].sort(() => Math.random() - 0.5);
}

module.exports = { getQuestions };
