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
          imageUrl: row.image_url || null,
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
  
  // Upload image to Supabase Storage
  uploadImage: async (name, date, file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${encodeURIComponent(name)}_${date}_${Date.now()}.${fileExt}`;
      const filePath = fileName;
      
      // Upload file to Supabase Storage
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/grid-images/${filePath}`;
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': file.type || 'image/jpeg',
        },
        body: file,
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        throw new Error(`Upload failed: ${error}`);
      }
      
      // Get public URL
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/grid-images/${filePath}`;
      
      // Update score record with image URL
      const existing = await supabaseRequest(
        `scores?player_name=eq.${encodeURIComponent(name)}&grid_date=eq.${encodeURIComponent(date)}&select=id,image_url`
      );
      
      if (existing && existing.length > 0) {
        // Delete old image if it exists
        if (existing[0].image_url) {
          const oldUrl = existing[0].image_url;
          const oldPath = oldUrl.split('/grid-images/').pop();
          if (oldPath) {
            try {
              await fetch(`${SUPABASE_URL}/storage/v1/object/grid-images/${oldPath}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                  'apikey': SUPABASE_ANON_KEY,
                },
              });
            } catch (e) {
              console.warn('Failed to delete old image:', e);
            }
          }
        }
        
        // Update with new image URL
        await supabaseRequest(`scores?id=eq.${existing[0].id}`, {
          method: 'PATCH',
          body: JSON.stringify({ image_url: publicUrl }),
        });
      }
      
      return { success: true, imageUrl: publicUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, message: error.toString() };
    }
  },
  
  // Delete image from Supabase Storage
  deleteImage: async (name, date) => {
    try {
      const existing = await supabaseRequest(
        `scores?player_name=eq.${encodeURIComponent(name)}&grid_date=eq.${encodeURIComponent(date)}&select=id,image_url`
      );
      
      if (existing && existing.length > 0 && existing[0].image_url) {
        const imageUrl = existing[0].image_url;
        const filePath = imageUrl.split('/grid-images/').pop();
        
        if (filePath) {
          // Delete from storage
          const deleteResponse = await fetch(
            `${SUPABASE_URL}/storage/v1/object/grid-images/${filePath}`,
            {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY,
              },
            }
          );
          
          if (!deleteResponse.ok && deleteResponse.status !== 404) {
            console.warn('Failed to delete image from storage');
          }
        }
        
        // Remove image_url from score record
        await supabaseRequest(`scores?id=eq.${existing[0].id}`, {
          method: 'PATCH',
          body: JSON.stringify({ image_url: null }),
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting image:', error);
      return { success: false, message: error.toString() };
    }
  },
  
  // Get scores with images for a player (for top 9 logic)
  getScoresWithImages: async (name) => {
    try {
      const data = await supabaseRequest(
        `scores?player_name=eq.${encodeURIComponent(name)}&image_url=not.is.null&select=*&order=score.asc`
      );
      return Array.isArray(data) ? data.map(row => ({
        name: row.player_name,
        date: row.grid_date,
        score: row.score,
        imageUrl: row.image_url,
      })) : [];
    } catch (error) {
      console.error('Error fetching scores with images:', error);
      return [];
    }
  },
  
  // Manage top 9 + current day images
  manageImageStorage: async (name, date, score, isCurrentDay = false) => {
    try {
      const scoresWithImages = await window.storage.getScoresWithImages(name);
      const today = new Date().toISOString().split('T')[0];
      
      // Filter out current day from the list (it's always kept)
      const nonTodayScores = scoresWithImages.filter(s => s.date !== today);
      
      // If this is the current day, always allow
      if (isCurrentDay || date === today) {
        // If we already have 10 images (9 non-today + 1 today), remove the worst non-today
        if (nonTodayScores.length >= 9) {
          // Find the worst (highest score) non-today image to delete
          const worstScore = nonTodayScores[nonTodayScores.length - 1];
          await window.storage.deleteImage(worstScore.name, worstScore.date);
        }
        return { success: true, canUpload: true };
      }
      
      // For non-current day, check if it's in top 9
      if (nonTodayScores.length < 9) {
        return { success: true, canUpload: true };
      }
      
      // Check if this score is better (lower) than the worst in top 9
      const worstScore = nonTodayScores[nonTodayScores.length - 1];
      if (score < worstScore.score) {
        // Delete the worst score's image
        await window.storage.deleteImage(worstScore.name, worstScore.date);
        return { success: true, canUpload: true };
      }
      
      // Score is not in top 9, don't allow upload
      return { success: false, canUpload: false, message: 'This score is not in your top 9. Only your 9 best scores plus today\'s score can have images.' };
    } catch (error) {
      console.error('Error managing image storage:', error);
      return { success: false, canUpload: false, message: error.toString() };
    }
  },
};

console.log("Supabase storage utility loaded");
