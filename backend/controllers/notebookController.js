const { exec } = require('child_process');

// Function to run the Jupyter notebook using papermill
exports.runNotebook = (req, res) => {
  console.log("Received request to run Jupyter notebook...");

  // Execute the Jupyter notebook using papermill
  exec('papermill /path/to/scraper.ipynb /path/to/output.ipynb', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing notebook: ${error.message}`);
      return res.status(500).json({ error: 'Failed to run notebook' });
    }
    
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Notebook run encountered errors' });
    }

    console.log(`stdout: ${stdout}`);
    return res.status(200).json({ message: 'Notebook executed successfully' });
  });
};
