document.addEventListener("DOMContentLoaded", function () {
    const resultDiv = document.getElementById("resultados");
    const form = document.getElementById("questions-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let totalScore = 0;
        let counts = {
            nunca: 0,
            aVeces: 0,
            aMenudo: 0,
            muyAMenudo: 0,
            siempre: 0,
        };

        // Paso 1: Calculamos el puntaje base y contamos las respuestas
        for (let i = 1; i <= 18; i++) {
            const answerValue = parseInt(document.getElementById(`q${i}`).value);

            // Almacena la cantidad de respuestas por tipo
            switch (answerValue) {
                case 1: // Nunca
                    counts.nunca++;
                    break;
                case 2: // A veces
                    counts.aVeces++;
                    break;
                case 3: // A menudo
                    counts.aMenudo++;
                    break;
                case 4: // Muy a menudo
                    counts.muyAMenudo++;
                    break;
                case 5: // Siempre
                    counts.siempre++;
                    break;
                default:
                    break;
            }

            // Sumar puntaje base
            totalScore += calculateBaseScore(answerValue);
        }

        // Paso 2: Ajuste de puntaje basado en las relaciones entre respuestas
        totalScore = adjustScoreBasedOnResponses(totalScore, counts);

        // Asegurar que el puntaje total esté entre 0 y 100
        totalScore = Math.max(0, Math.min(totalScore, 100));

        // Muestra los resultados
        let message = generateMessage(totalScore);
        resultDiv.innerHTML = `<h2>Resultados</h2><p>Tu puntuación total es: <strong>${totalScore}</strong></p><p>${message}</p>`;
        resultDiv.style.display = "block";

        // Desplazar hacia el contenedor de resultados
        scrollToResults();
    });

    // Función para desplazar hacia los resultados
    function scrollToResults() {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Función para calcular el puntaje base
    function calculateBaseScore(answerValue) {
        switch (answerValue) {
            case 1: // Nunca
                return 0; // No suma puntos por "Nunca"
            case 2: // A veces
                return -2; // Resta 2 puntos por "A veces"
            case 3: // A menudo
                return 3; // Suma 3 puntos
            case 4: // Muy a menudo
                return 5; // Suma 5 puntos
            case 5: // Siempre
                return 7; // Suma 7 puntos
            default:
                return 0;
        }
    }

    // Función para ajustar el puntaje en base a las relaciones entre respuestas
    function adjustScoreBasedOnResponses(totalScore, counts) {
        // Penalización por respuestas "Nunca"
        if (counts.nunca > 0) {
            // Si hay más "Nunca" que "Siempre", se restará proporcionalmente
            totalScore -= counts.nunca * 7; // Resta proporcionalmente a las respuestas "Nunca"
        }

        // Penalización de "A veces" si hay más "Nunca"
        if (counts.nunca > counts.aVeces) {
            totalScore -= counts.aVeces; // Resta 1 punto por cada "A veces"
        }

        // Bonificación por respuestas "A menudo" y "Siempre"
        if (counts.siempre > 0 || counts.muyAMenudo > 0) {
            if (counts.aMenudo > 0) {
                totalScore += (counts.aMenudo * 2); // Suma 2 puntos por cada "A menudo"
            }
        }

        return totalScore;
    }

    // Función para generar el mensaje final
    function generateMessage(totalScore) {
        if (totalScore <= 18) {
            return "Es poco probable que presentes síntomas significativos de TDAH. Esto puede significar que tus patrones de atención y comportamiento están dentro de los rangos considerados típicos. Sin embargo, todos somos diferentes, y si en algún momento sientes que necesitas apoyo, no dudes en buscar ayuda profesional. Recuerda que tu bienestar es importante.";
        } else if (totalScore <= 36) {
            return "Podrías estar mostrando algunos signos de TDAH, pero no necesariamente significa que lo tengas. Las experiencias de cada persona son únicas. Si notas que estas dificultades impactan en tu vida diaria, considera hablar con un especialista para explorar tus inquietudes. Buscar apoyo es un paso valioso hacia el autoconocimiento y la comprensión de ti mismo.";
        } else if (totalScore <= 54) {
            return "Es posible que estés experimentando síntomas que pueden ser indicativos de TDAH. Esto podría afectar tu atención, organización y la manera en que te relacionas con el entorno. Es recomendable que consultes con un profesional de la salud mental que pueda ofrecerte una evaluación adecuada y orientación. Recuerda, tener TDAH no define quién eres; es solo una parte de tu neurodiversidad, y hay recursos y estrategias que pueden ayudarte a vivir plenamente.";
        } else if (totalScore <= 72) {
            return "Es probable que estés enfrentando síntomas marcados de TDAH. Esto puede hacer que tareas cotidianas, como la organización y la atención, sean desafiantes. Te recomendamos consultar a un especialista en salud mental que pueda brindarte una evaluación y apoyo. Es importante reconocer que ser neurodivergente implica diversidad en el funcionamiento cognitivo, y hay caminos para encontrar estrategias que se adapten a ti.";
        } else {
            return "Es muy probable que estés experimentando síntomas severos de TDAH. Esto puede afectar significativamente tu vida diaria y tu bienestar emocional. Es fundamental que busques una evaluación profesional lo antes posible. Ten en cuenta que el TDAH es una forma de neurodiversidad, y hay apoyo y tratamientos disponibles que pueden ayudarte a manejar los síntomas y a potenciar tus habilidades. No estás solo en este camino, y buscar ayuda es un paso valioso.";
        }
    }
});
