// Google Sheets storage utility
// ⚠️ REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyErJPFavUbZitPNwx3jmwsacl1cjRIwGk2Z5LT03S7HBbrZ7hozMx2b8YEMvmaOrnw/exec";

window.storage = {
  get: async () => {
    try {
      console.log("Fetching data from Google Sheets...");
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      console.log("Data received:", data);
      return data.scores || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  },
  add: async (name, date, score) => {
    try {
      console.log("Adding score:", { name, date, score });
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", name, date, score }),
      });
      const result = await response.json();
      console.log("Add result:", result);
      return result;
    } catch (error) {
      console.error("Error adding score:", error);
      return { success: false, message: error.toString() };
    }
  },
  update: async (name, date, score) => {
    try {
      console.log("Updating score:", { name, date, score });
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", name, date, score }),
      });
      const result = await response.json();
      console.log("Update result:", result);
      return result;
    } catch (error) {
      console.error("Error updating score:", error);
      return { success: false, message: error.toString() };
    }
  },
  delete: async (name, date) => {
    try {
      console.log("Deleting score:", { name, date });
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", name, date }),
      });
      const result = await response.json();
      console.log("Delete result:", result);
      return result;
    } catch (error) {
      console.error("Error deleting score:", error);
      return { success: false, message: error.toString() };
    }
  },
};

console.log("Google Sheets storage utility loaded");
