const { GoogleGenerativeAI } = require("@google/generative-ai");
// Inicialización de la API de Google Gemini
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey && apiKey !== "tu_clave_gratuita_de_google_ai_studio_aqui") {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn("⚠️ ADVERTENCIA: GEMINI_API_KEY no configurada o es el marcador de posición por defecto.");
}
/**
 * Helper para obtener el cliente de Gemini y validar su existencia
 */
const getGeminiClient = (res) => {
  if (!genAI) {
    res.status(500).json({
      error: "Error de configuración de la IA",
      message: "La clave GEMINI_API_KEY no está configurada o no es válida. Por favor, agrega tu clave en el archivo .env y reinicia el servidor."
    });
    return null;
  }
  return genAI;
};
/**
 * Módulo de Matemáticas: Genera un ejercicio acorde al año escolar del alumno en formato LaTeX.
 */
exports.generateMathProblem = async (req, res) => {
  const ai = getGeminiClient(res);
  if (!ai) return;
  const { grade } = req.body;
  if (!grade) {
    return res.status(400).json({ error: "El año escolar (grade) es requerido." });
  }
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const prompt = `
      Eres un profesor de matemáticas de secundaria altamente didáctico y experto.
      Genera un problema de matemáticas único y desafiante adaptado para un estudiante de ${grade} de secundaria en Latinoamérica (rango de 12 a 17 años).
      El problema y su explicación deben utilizar LaTeX/KaTeX para todas las ecuaciones y símbolos matemáticos.
      
      DEBES responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
      {
        "problem": "El enunciado del problema con fórmulas matemáticas delimitadas por \\\\( y \\\\) o \\\\[ y \\\\] (por ejemplo: 'Resuelve la ecuación cuadrática: \\\\(x^2 - 5x + 6 = 0\\\\)')",
        "correct_answer": "La respuesta exacta y simplificada con LaTeX si es necesario",
        "difficulty": "Fácil, Medio o Difícil",
        "explanation": "La resolución paso a paso detallando el procedimiento y las fórmulas aplicadas, utilizando LaTeX/KaTeX."
      }
    `;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedJSON = JSON.parse(responseText);
    return res.json(parsedJSON);
  } catch (error) {
    console.error("Error en generateMathProblem:", error);
    return res.status(500).json({
      error: "Error al generar el problema de matemáticas",
      message: error.message
    });
  }
};
/**
 * Módulo de Física: Genera un problema didáctico en base al esquema estructurado de 4 pasos.
 */
exports.generatePhysicsProblem = async (req, res) => {
  const ai = getGeminiClient(res);
  if (!ai) return;
  const { grade } = req.body;
  if (!grade) {
    return res.status(400).json({ error: "El año escolar (grade) es requerido." });
  }
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const prompt = `
      Eres un profesor de física experto y didáctico.
      Genera un problema de física adaptado para un estudiante de ${grade} de secundaria en Latinoamérica.
      El problema debe estar enfocado en temas comunes de ese año escolar (ej. Cinemática, Dinámica, Energía, Termodinámica).
      Debes estructurar obligatoriamente la solución bajo el esquema formal de 4 pasos de física: Datos, Fórmula, Sustitución y Resultado.
      Usa LaTeX/KaTeX para escribir las fórmulas y unidades físicas (ej. \\\\(m/s^2\\\\), \\\\(F = m \\\\cdot a\\\\)).
      DEBES responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
      {
        "problem": "El enunciado detallado del problema físico.",
        "datos": "Listado de las variables conocidas y desconocidas identificadas en el enunciado (por ejemplo: 'v = 15 \\\\text{ m/s}\\\\nt = 5 \\\\text{ s}\\\\nd = ?')",
        "formula": "La ecuación física o ecuaciones matemáticas que se deben emplear (por ejemplo: 'd = v \\\\cdot t')",
        "sustitucion": "El reemplazo numérico de los valores en la ecuación paso a paso (por ejemplo: 'd = 15 \\\\text{ m/s} \\\\cdot 5 \\\\text{ s}')",
        "resultado": "El valor final numérico expresado claramente junto con sus unidades físicas correspondientes (por ejemplo: 'd = 75 \\\\text{ metros}')",
        "explanation": "Una breve explicación conceptual de por qué se resolvió así y la ley física que fundamenta el problema."
      }
    `;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedJSON = JSON.parse(responseText);
    return res.json(parsedJSON);
  } catch (error) {
    console.error("Error en generatePhysicsProblem:", error);
    return res.status(500).json({
      error: "Error al generar el problema de física",
      message: error.message
    });
  }
};
/**
 * Módulo de Estudios Sociales: Genera un resumen e hitos en línea de tiempo sobre un tema específico.
 */
exports.generateSocialTimeline = async (req, res) => {
  const ai = getGeminiClient(res);
  if (!ai) return;
  const { topic, grade } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "El tema (topic) es requerido." });
  }
  const studentGrade = grade || "secundaria";
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const prompt = `
      Eres un historiador y profesor de ciencias sociales de secundaria.
      Genera una síntesis educativa y una línea de tiempo estructurada para el tema: "${topic}", adaptado para un nivel de escolaridad de ${studentGrade}.
      La línea de tiempo debe componerse de al menos 4 a 6 hitos cronológicos clave (eventos) ordenados cronológicamente.
      DEBES responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
      {
        "topic": "Título formal del tema histórico",
        "summary": "Un resumen introductorio fluido, conciso y de alto impacto sobre el evento histórico.",
        "events": [
          {
            "date": "Año o rango de fechas (ej. '1789' o 'Julio 1789')",
            "title": "Nombre del acontecimiento histórico",
            "description": "Una breve descripción didáctica de lo que ocurrió en esa fecha y por qué fue relevante."
          }
        ]
      }
    `;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedJSON = JSON.parse(responseText);
    return res.json(parsedJSON);
  } catch (error) {
    console.error("Error en generateSocialTimeline:", error);
    return res.status(500).json({
      error: "Error al generar la línea de tiempo de sociales",
      message: error.message
    });
  }
};
/**
 * Tutor IA Socrático: Conversación académica socrática y paciente.
 * No le da la respuesta directa al estudiante, sino que le guía con preguntas de razonamiento.
 */
exports.chatWithTutor = async (req, res) => {
  const ai = getGeminiClient(res);
  if (!ai) return;
  const { message, history, grade } = req.body;
  if (!message) {
    return res.status(400).json({ error: "El mensaje del usuario (message) es requerido." });
  }
  const studentGrade = grade || "secundaria";
  try {
    // Configurar instrucciones del sistema para forzar el comportamiento socrático
    const systemInstruction = `
      Eres el tutor académico personal e inteligente de la plataforma GLOMA AI SCHOOL.
      Tu principal objetivo es guiar a los estudiantes en sus dudas académicas utilizando estrictamente el MÉTODO SOCRÁTICO.
      
      Reglas fundamentales de conducta:
      1. NUNCA, bajo ninguna circunstancia, entregues la respuesta directa o final a una pregunta, ejercicio o problema escolar.
      2. Si el estudiante te da un ejercicio (ej. 'cuánto es 5x - 3 = 12' o 'balancea H2 + O2 = H2O'), no lo resuelvas por él. Explícale el concepto básico y hazle una pregunta guía para que dé el primer paso.
      3. Eres sumamente paciente, motivador, empático y hablas en un lenguaje claro y amigable adaptado para un nivel de ${studentGrade} de secundaria.
      4. Si el estudiante insiste en que le des la respuesta, explícale con amabilidad que tu trabajo es enseñarle a pensar y razonar para que sea un gran estudiante, no hacer su tarea.
      5. Utiliza LaTeX/KaTeX (delimitado por \\\\( y \\\\)) para fórmulas matemáticas o químicas que menciones en tus respuestas para que se vean profesionales.
      6. Mantén tus respuestas relativamente concisas (máximo 2 a 3 párrafos cortos) para evitar abrumar al alumno.
    `;
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemInstruction
    });
    // Formatear el historial de chat para adaptarlo al formato del SDK de Gemini
    // El SDK espera: history: [ { role: "user", parts: [{ text: "..." }] }, { role: "model", parts: [{ text: "..." }] } ]
    const formattedHistory = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        if (msg.role && msg.content) {
          formattedHistory.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
          });
        }
      });
    }
    // Inicializar chat con historial anterior
    const chat = model.startChat({
      history: formattedHistory
    });
    // Enviar el mensaje del usuario y obtener respuesta
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    return res.json({ reply: responseText });
  } catch (error) {
    console.error("Error en chatWithTutor:", error);
    return res.status(500).json({
      error: "Error en el tutor interactivo",
      message: error.message
    });
  }
};
/**
 * Módulo de Inglés: Genera un cuestionario de opción múltiple estructurado en JSON.
 */
exports.generateEnglishQuiz = async (req, res) => {
  const ai = getGeminiClient(res);
  if (!ai) return;
  const { grade, difficulty } = req.body;
  if (!grade || !difficulty) {
    return res.status(400).json({ error: "El año escolar (grade) y la dificultad (difficulty) son requeridos." });
  }
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const prompt = `
      Eres un profesor de inglés nativo y experto en pedagogía para secundaria en Latinoamérica.
      Genera un cuestionario interactivo de opción múltiple con exactamente 5 preguntas únicas de inglés, adaptadas para un estudiante de ${grade} de secundaria.
      El nivel de dificultad seleccionado para este quiz es: "${difficulty}" (puedes variar entre gramática, vocabulario, lectura o comprensión).
      Cada pregunta debe tener exactamente 4 opciones de respuesta.
      DEBES responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
      {
        "difficulty": "${difficulty}",
        "questions": [
          {
            "question": "Enunciado o pregunta en inglés con o sin espacios en blanco (ej. 'We usually ______ soccer on weekends.')",
            "options": [
              "play",
              "plays",
              "playing",
              "played"
            ],
            "correct_index": 0,
            "translation": "Traducción completa al español del enunciado o pregunta.",
            "explanation": "Breve explicación didáctica en español de por qué la opción seleccionada es la correcta gramaticalmente."
          }
        ]
      }
    `;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedJSON = JSON.parse(responseText);
    return res.json(parsedJSON);
  } catch (error) {
    console.error("Error en generateEnglishQuiz:", error);
    return res.status(500).json({
      error: "Error al generar el cuestionario de inglés",
      message: error.message
    });
  }
};
/**
 * Módulo de Química: Resuelve y explica didácticamente el balanceo de una ecuación por tanteo.
 */
exports.balanceChemistryEquation = async (req, res) => {
  const ai = getGeminiClient(res);
  if (!ai) return;
  const { equation } = req.body;
  if (!equation) {
    return res.status(400).json({ error: "La ecuación química (equation) es requerida." });
  }
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const prompt = `
      Eres un profesor de química didáctico y experto.
      El estudiante te ha dado una ecuación química desbalanceada: "${equation}".
      Tu objetivo es balancear la ecuación utilizando el método de balanceo por tanteo (ensayo y error).
      Debes desglosar el procedimiento en una secuencia lógica de pasos comprensibles para secundaria, explicando la ley de conservación de la masa.
      Usa LaTeX/KaTeX delimitado por \\\\( y \\\\) en las explicaciones químicas (por ejemplo, para denotar compuestos como \\\\(H_2O\\\\) o la ecuación final).
      DEBES responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
      {
        "original_equation": "La ecuación original proporcionada",
        "balanced_equation": "La ecuación balanceada final formateada en LaTeX (ej. '2\\\\text{H}_2 + \\\\text{O}_2 \\\\rightarrow 2\\\\text{H}_2\\\\text{O}')",
        "steps": [
          {
            "step_number": 1,
            "description": "Explicación detallada de lo que se hace en este paso de balanceo por tanteo, nombrando reactivos y productos."
          }
        ],
        "explanation": "Una conclusión pedagógica sobre cómo el balanceo cumple con la Ley de Conservación de la Materia de Lavoisier."
      }
    `;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedJSON = JSON.parse(responseText);
    return res.json(parsedJSON);
  } catch (error) {
    console.error("Error en balanceChemistryEquation:", error);
    return res.status(500).json({
      error: "Error al resolver el balanceo de la ecuación química",
      message: error.message
    });
  }
};
