eXplontialBridge Focus
eXplontialBridge Focus is a privacy-first, fully local open-source AI web application engineered specifically for screen reader accessibility, keyboard-first navigation, and local document interaction.
The Problem and Mission
Mainstream and open-source AI web interfaces are often difficult for blind and visually impaired individuals to access. Unlabeled interactive elements, unexpected focus shifting, and lack of screen reader announcements create barriers.
eXplontialBridge Focus solves this:
Completely Local and Private: Runs on your own machine using Ollama and the lightweight Gemma 2 (2B) model. No chat logs or files leave your computer.
Screen Reader Optimized: Structured with clean semantic HTML, direct live assertive announcements, and predictable keyboard tab loops.
Built-in Text-to-Speech: Reads responses out loud with markdown scrubbing so symbols like asterisks or hashtags are not read aloud.
Local PDF Document Q&A: Analyzes attached PDF files directly in system RAM without writing document text to external storage.
Key Features
Built-in Speech Synthesis: Listen to responses instantly with clean voice output using Alt + R.
Predictable Keyboard Focus: The Tab key cycles strictly through essential controls so focus is never lost.
Dedicated Keyboard Shortcuts:
Alt + I: Focus message input box
Enter: Send message
Alt + F: Attach a document in PDF format
Alt + O: Start a new chat and reset memory
Alt + R: Read aloud the latest AI response
Alt + C: Copy the latest response text
Temporary Document Ingestion: Extracts text into memory cache during your session and wipes clean on reset.
High-Contrast Interface: High-contrast layout designed for low-vision and light-sensitive users.
Tech Stack
Frontend: HTML5, CSS3, JavaScript using the Web Speech API
Backend: Python 3, Flask, Flask-CORS
Local AI Engine: Ollama running gemma2:2b
PDF Processing: pypdf
Requirements
Before setting up the project, make sure you have:
1. Windows 10 or 11, 64-bit
2. Ollama installed and running
Download and install Ollama from https://ollama.com/download/windows
Verify it is installed by running this command in Command Prompt:
ollama --version
3. Python 3.10 or newer if running manually.
How to Install and Run
Option 1: Download from Website
1. Make sure Ollama is installed on your computer.
2. Visit the official project download page:
https://navankrishnapp-lab.github.io/eXponentialBridge-Focus/
3. Click the Get Zip for Windows button to download the project.
4. Extract the downloaded ZIP file to a folder on your computer.
5. Double-click setup.bat.
It will install the required Python packages.
It will pull the gemma2:2b model via Ollama.
It will create a Local-AI shortcut on your desktop and launch the application.
Option 2: Manual Setup via Git
1. Clone the repository:
git clone https://github.com/navankrishnapp-lab/eXponentialBridge-Focus.git
cd eXponentialBridge-Focus
2. Pull the Gemma 2B model:
ollama pull gemma2:2b
3. Install Python dependencies:
pip install flask flask-cors pypdf ollama
4. Start the backend:
python app.py
5. Open index.html in your web browser.
Keyboard Shortcuts
Alt + I: Jump directly to input box
Enter: Send message
Alt + F: Attach file in PDF format
Alt + O: Start a new chat and clear memory
Alt + R: Read AI response out loud
Alt + C: Copy AI response to clipboard
Tab and Shift + Tab: Move forward and backward between controls
Project Structure
ai.py: Gemma 2B model integration and PDF text handling
app.py: Local Flask server endpoints for chat, upload, and reset
index.html: Accessible user interface
script.js: Shortcut bindings, focus management, and speech synthesis
style.css: High-contrast sci-fi styling
setup.bat: Windows automated setup script
start_hidden.vbs: Script to start the backend silently in the background
License
This project is licensed under the MIT License.
