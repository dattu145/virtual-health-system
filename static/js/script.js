let userData = {};
    let backgrounds = [
        "https://images.squarespace-cdn.com/content/v1/559ed917e4b0811bfe9ad3b8/1527627221257-CU0NMNQ1LQ0L4EZ7W2Q8/iStock-654167354.jpg?format=1500w",
        "https://img.freepik.com/free-photo/health-still-life-with-copy-space_23-2148854031.jpg?semt=ais_hybrid", 
        "https://lead-genie.co.uk/wp-content/uploads/2024/09/Mis-Sold-Investments-18-1024x682.jpg"  
    ];

    let latitude, longitude;

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;

                    userData.location = latitude + "," + longitude;
                    console.log(userData.location);
                    document.querySelectorAll("#location").forEach(el => el.value = userData.location);
                    document.querySelectorAll("#locationStatus").forEach(el => el.innerHTML = "Suggestions baked! <i class='fa-solid fa-location-dot'></i>");
                },
                function (error) {
                    userData.location = "Not Provided";
                    document.querySelectorAll("#locationStatus").forEach(el => el.innerText = "Location access denied.");
                }
            );
        }
    }

    getLocation();

async function getNearbyHospitals(lat, lon) {
    const apiKey = "AIzaSyBXEgUi5dc2pwmZl2B4U8PT4HDnPfIVa8w";  
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: `List the top nearby hospitals for a person located at Latitude: ${lat}, Longitude: ${lon}.
                Provide the hospital name, address in this exact format:

                   Hospital Name bolded,
                   Address: Full Address.

                Do not add extra text, disclaimers, or subtopics. Just return the hospitals in this structured format.`
            }]
        }]
    };

    document.getElementById("hospitalResponse").innerText = "Fetching nearby hospitals...";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log(data);

        if (data.candidates && data.candidates.length > 0) {
            let hospitalText = data.candidates[0].content.parts[0].text;

            // Format response properly
            hospitalText = hospitalText
                .replace(/\*\*\s*/g, "")  // Remove bold (**)
                .replace(/\*\s*/g, "")    // Remove bullets (*)
                .replace(/\n+/g, "\n")
                .replace(/•\s*/g, "");   // Remove bullet points (•)

                document.getElementById("hospitalResponse").innerText = hospitalText;
            } else {
            document.getElementById("hospitalResponse").innerText = "No hospitals found.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("hospitalResponse").innerText = "Error fetching hospitals.";
    }
}


    function toggleHeightInput() {
        let heightUnit = document.getElementById("heightUnit").value;
        document.getElementById("heightCm").style.display = (heightUnit === "cm") ? "block" : "none";
        document.getElementById("heightFeetInches").style.display = (heightUnit === "feet") ? "flex" : "none";
    }

    function toggleWeightInput() {
        let weightUnit = document.getElementById("weightUnit").value;
        document.getElementById("weightKg").style.display = (weightUnit === "kg") ? "block" : "none";
        document.getElementById("weightLbs").style.display = (weightUnit === "lbs") ? "block" : "none";
    }
    
function calculateBMI() {
    let heightUnit = document.getElementById("heightUnit").value;
    let weightUnit = document.getElementById("weightUnit").value;
    let height, weight;

    if (heightUnit === "cm") {
        height = parseFloat(document.getElementById("heightCm").value) / 100; // Convert cm to meters
    } else {
        let feet = parseFloat(document.getElementById("heightFeet").value);
        let inches = parseFloat(document.getElementById("heightInches").value);
        height = ((feet * 12) + inches) * 0.0254; // Convert feet & inches to meters
    }

    if (weightUnit === "kg") {
        weight = parseFloat(document.getElementById("weightKg").value);
    } else {
        weight = parseFloat(document.getElementById("weightLbs").value) * 0.453592; // Convert lbs to kg
    }

    if (!height || !weight) {
        alert("Please enter valid height and weight.");
        return;
    }

    let bmi = (weight / (height * height)).toFixed(1);
    let category, healthyMin, healthyMax, advice;

    if (bmi < 18.5) {
        category = "Underweight";
        healthyMin = (18.5 * height * height).toFixed(1);
        healthyMax = (24.9 * height * height).toFixed(1);
        advice = `You should gain at least ${(healthyMin - weight).toFixed(1)} kg to be in the healthy range.`;
    } else if (bmi < 24.9) {
        category = "Normal Weight";
        healthyMin = healthyMax = "You're already in the healthy range!";
        advice = "Great job! Maintain your current weight.";
    } else if (bmi < 29.9) {
        category = "Overweight";
        healthyMin = (18.5 * height * height).toFixed(1);
        healthyMax = (24.9 * height * height).toFixed(1);
        advice = `You should lose at least ${(weight - healthyMax).toFixed(1)} kg to be in the healthy range.`;
    } else {
        category = "Obese";
        healthyMin = (18.5 * height * height).toFixed(1);
        healthyMax = (24.9 * height * height).toFixed(1);
        advice = `You should lose at least ${(weight - healthyMax).toFixed(1)} kg to be in the healthy range.`;
    }

    document.getElementById("bmiValue").innerText = bmi;
    document.getElementById("bmiCategory").innerText = category;
    document.getElementById("healthyRange").innerText = healthyMin !== healthyMax ? `${healthyMin} - ${healthyMax} kg` : healthyMin;
    document.getElementById("weightAdvice").innerText = advice;
}

function goToStep(step) {
    if (step === 2) {
        let name = document.getElementById("name").value.trim();
        let age = document.getElementById("age").value.trim();
        let gender = document.querySelector('input[name="gender"]:checked');

        if (!name || !age || !gender) {
            alert("Please fill in all required fields before proceeding.");
            return;
        }

        userData.name = name;
        userData.age = age;
        userData.gender = gender.value;
    }

    if (step === 3) {
        let heightUnit = document.getElementById("heightUnit").value;
        let height = heightUnit === "cm" 
            ? document.getElementById("heightCm").value.trim()
            : document.getElementById("heightFeet").value.trim() + " feet " + document.getElementById("heightInches").value.trim() + " inches";

        let weightUnit = document.getElementById("weightUnit").value;
        let weight = weightUnit === "kg"
            ? document.getElementById("weightKg").value.trim()
            : document.getElementById("weightLbs").value.trim();

        if (!height || !weight) {
            alert("Please enter your height and weight before proceeding.");
            return;
        }

        userData.height = height;
        userData.weight = weight;

        calculateBMI();
    }

    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    document.getElementById("background").style.backgroundImage = `url('${backgrounds[step - 1]}')`;
}

    
async function sendToAI() {
    const responseCard = document.getElementById('response').style.display = 'initial';
    const userInput = document.getElementById("healthProblem").value.trim();

    if (!userInput) {
        alert("Please enter your symptoms.");
        return;
    }

    console.log("Calling sendToAI with:", userInput); // Debugging log

    const apiKey = "AIzaSyBXEgUi5dc2pwmZl2B4U8PT4HDnPfIVa8w"; // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{ parts: [{ text: `
            Provide a **brief** health recommendation for ${userData.name}, aged ${userData.age}, gender ${userData.gender}, based on this symptom: ${userInput}.  
            Keep it under 3-4 sentences. Avoid disclaimers, subtopics, or questions.
        ` }] }]
    };

    document.getElementById("aiResponse").innerText = "Fetching response...";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("AI Response Data:", data); // Debugging log

        if (data.candidates && data.candidates.length > 0) {
            let responseText = data.candidates[0].content.parts[0].text;

            // Formatting response text
            responseText = responseText
                .replace(/\*\*\s*/g, "")  // Remove bold (**)
                .replace(/\*\s*/g, "")    // Remove bullets (*)
                .replace(/\n+/g, "\n")    // Remove extra newlines
                .replace(/•\s*/g, "");    // Remove bullet points (•)

            typeText(responseText, "aiResponse");

            // Display medicine card & fetch medicine suggestions
            document.getElementById('medicineCard').style.display = 'initial';
            getMedicineSuggestions(responseText);
        } else {
            document.getElementById("aiResponse").innerText = "No response received from AI.";
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        document.getElementById("aiResponse").innerText = "Error fetching response.";
    }
}

async function getMedicineSuggestions(userInput) {
    if (!userInput) {
        alert("Please enter your symptoms.");
        return;
    }

    const apiKey = "AIzaSyBXEgUi5dc2pwmZl2B4U8PT4HDnPfIVa8w"; // Replace with your actual API key
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;
    
    const requestBody = {
        contents: [{ parts: [{ text: `
            Suggest tablets and medicines (brand names only, like Dolo 650, Crocin, etc.) suitable for a person aged ${userData.age} for the condition: ${userInput}.  
            Ensure the response is in this exact format, without any introductory text and give no examples:  
                    
            Medicine Name: Dosage Instructions.  
            Medicine Name: Dosage Instructions.
                    
            Medicine Name : Dosage & when to take it.  
            Keep it simple and to the point. Avoid disclaimers, subtopics, or questions.
            ` 
        }] }]
    };

    document.getElementById("medicineResponse").innerText = "Fetching suggestions...";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log(data);

        if (data.candidates && data.candidates.length > 0) {
            let medicineText = data.candidates[0].content.parts[0].text;

            medicineText = medicineText
                .replace(/\*\*\s*/g, "")  // Remove bold (**)
                .replace(/\*\s*/g, "")    // Remove bullets (*)
                .replace(/\n+/g, "\n")    // Remove extra newlines
                .replace(/•\s*/g, "");    // Remove bullet points (•)

                typeText(medicineText, "medicineResponse");
                const organicCard= document.getElementById('organicCard').style.display='initial';
                getOrganicSuggestions(userInput);

        } else {
            document.getElementById("medicineResponse").innerText = "No medicine suggestions received.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("medicineResponse").innerText = "Error fetching suggestions.";
    }
}

async function getOrganicSuggestions(userInput) {
    if (!userInput) {
        alert("Please enter your symptoms.");
        return;
    }

    const apiKey = "AIzaSyBXEgUi5dc2pwmZl2B4U8PT4HDnPfIVa8w"; // Replace with your actual API key
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;
    
    const requestBody = {
        contents: [{ parts: [{ text: `
            Suggest natural home remedies for a person aged ${userData.age} with the condition: ${userInput}.  
            List remedies in this exact format without any introduction and don't mention 'Remedy Name' or 'Description' in answer:  

            Remedy Name: Description.  
            Remedy Name: Description.  

            Keep it simple and to the point. Avoid disclaimers, subtopics, or questions.
            ` 
        }] }]
    };

    document.getElementById("organicResponse").innerText = "Fetching remedies...";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log(data);

        if (data.candidates && data.candidates.length > 0) {
            let organicText = data.candidates[0].content.parts[0].text;

            organicText = organicText
                .replace(/\*\*\s*/g, "")  // Remove bold (**)
                .replace(/\*\s*/g, "")    // Remove bullets (*)
                .replace(/\n+/g, "\n")    // Remove extra newlines
                .replace(/•\s*/g, "");    // Remove bullet points (•)

            typeText(organicText, "organicResponse");
            document.getElementById('hospitalCard').style.display = 'initial';
            getNearbyHospitals(latitude, longitude); 

        } else {
            document.getElementById("organicResponse").innerText = "No organic remedies received.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("organicResponse").innerText = "Error fetching remedies.";
    }
}

function typeText(text, elementId) {
    const element = document.getElementById(elementId);
    element.innerText = "";
    let index = 0;

    function type() {
        if (index < text.length) {
            element.innerHTML += text[index] === '.' ? '.<br><br>' : text[index] === '\n' ? '<br>' : text[index];
            element.scrollTop = element.scrollHeight; // Auto-scroll down if needed
            index++;
            setTimeout(type, 20); // Adjust typing speed here (lower = faster)
        }
    }

    type();
}