const API_KEY = "AIzaSyClx_k8oKSIV5wMiIXlhQkW9wVz8bo4Nzo";

async function checkModels() {
  try {
    // Check v1 models
    console.log("=== Checking v1 models ===");
    const v1Response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    const v1Data = await v1Response.json();
    console.log("v1 models:", v1Data.models.map(m => m.name));

    // Check v1beta models
    console.log("\n=== Checking v1beta models ===");
    const v1betaResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    const v1betaData = await v1betaResponse.json();
    console.log("v1beta models:", v1betaData.models.map(m => m.name));

  } catch (error) {
    console.error("Error checking models:", error);
  }
}

checkModels();
