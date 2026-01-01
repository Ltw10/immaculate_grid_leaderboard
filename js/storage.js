// Supabase storage utility
// ⚠️ REPLACE THESE WITH YOUR SUPABASE PROJECT CREDENTIALS
const SUPABASE_URL = "https://jvfcsemgypiexqeiuqax.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Led1z5rXySTKSamM5QHnFA_DOVxdT3x";

// Helper function to make Supabase API requests
const supabaseRequest = async (endpoint, options = {}) => {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Prefer: "return=representation",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${response.status} - ${error}`);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

window.storage = {
  get: async () => {
    try {
      console.log("Fetching data from Supabase...");
      const data = await supabaseRequest(
        "scores?select=*&order=grid_date.desc"
      );
      console.log("Data received:", data);
      // Map database schema (player_name, grid_date) to app format (name, date)
      if (Array.isArray(data)) {
        return data.map((row) => ({
          name: row.player_name,
          date: row.grid_date,
          score: row.score,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  },
  add: async (name, date, score) => {
    try {
      console.log("Adding score:", { name, date, score });
      // Map app format (name, date) to database schema (player_name, grid_date)
      const data = await supabaseRequest("scores", {
        method: "POST",
        body: JSON.stringify({
          player_name: name,
          grid_date: date,
          score: score,
        }),
      });
      console.log("Add result:", data);
      return { success: true, message: "Score added" };
    } catch (error) {
      console.error("Error adding score:", error);
      return { success: false, message: error.toString() };
    }
  },
  update: async (name, date, score) => {
    try {
      console.log("Updating score:", { name, date, score });
      // First try to update existing score using database column names
      const existing = await supabaseRequest(
        `scores?player_name=eq.${encodeURIComponent(
          name
        )}&grid_date=eq.${encodeURIComponent(date)}&select=id`
      );

      if (existing && existing.length > 0) {
        // Update existing score
        await supabaseRequest(`scores?id=eq.${existing[0].id}`, {
          method: "PATCH",
          body: JSON.stringify({ score }),
        });
        console.log("Update result: Score updated");
        return { success: true, message: "Score updated" };
      } else {
        // Insert new score if it doesn't exist
        await supabaseRequest("scores", {
          method: "POST",
          body: JSON.stringify({
            player_name: name,
            grid_date: date,
            score: score,
          }),
        });
        console.log("Update result: Score added");
        return { success: true, message: "Score added" };
      }
    } catch (error) {
      console.error("Error updating score:", error);
      return { success: false, message: error.toString() };
    }
  },
  delete: async (name, date) => {
    try {
      console.log("Deleting score:", { name, date });
      // Find the score first using database column names
      const existing = await supabaseRequest(
        `scores?player_name=eq.${encodeURIComponent(
          name
        )}&grid_date=eq.${encodeURIComponent(date)}&select=id`
      );

      if (!existing || existing.length === 0) {
        return { success: false, message: "Score not found" };
      }

      // Delete the score
      await supabaseRequest(`scores?id=eq.${existing[0].id}`, {
        method: "DELETE",
      });
      console.log("Delete result: success");
      return { success: true, message: "Score deleted" };
    } catch (error) {
      console.error("Error deleting score:", error);
      return { success: false, message: error.toString() };
    }
  },
};

console.log("Supabase storage utility loaded");
