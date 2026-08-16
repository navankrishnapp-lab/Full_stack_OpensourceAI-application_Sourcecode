import os
import ollama
import pypdf

class GemmaEngine:
    def __init__(self, model_file_path: str = ""):
        print("Loading Ultra-Fast Gemma Engine...")
        self.model_name = "gemma2:2b"
        self.current_pdf_text = ""
        self.current_pdf_name = ""

    def load_pdf_into_memory(self, file_path: str):
        """Instantly reads the PDF text directly into RAM memory."""
        self.current_pdf_name = os.path.basename(file_path)
        try:
            text_content = []
            with open(file_path, "rb") as f:
                reader = pypdf.PdfReader(f)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        text_content.append(text)
            
            # Combine all pages into one text block
            self.current_pdf_text = "\n".join(text_content)
            return f"Successfully loaded {self.current_pdf_name} into fast cache memory."
        except Exception as e:
            return f"Error loading PDF: {str(e)}"

    def clear_pdf_memory(self):
        """Wipes out the cached text completely to prevent memory leaks across sessions."""
        self.current_pdf_text = ""
        self.current_pdf_name = ""
        print("System memory cache has been completely reset.")

    def ask_gemma(self, prompt: str):
        """Direct prompt injector. Super lightweight and low-spec friendly."""
        if self.current_pdf_text:
            full_prompt = (
                f"You are Gemma, a helpful AI assistant. Analyze the document text provided below and answer the user's question accurately.\n\n"
                f"--- Document Content ({self.current_pdf_name}) ---\n"
                f"{self.current_pdf_text}\n"
                f"--------------------------------------------------\n\n"
                f"User Question: {prompt}\n"
                f"Answer:"
            )
        else:
            full_prompt = prompt

        try:
            response = ollama.generate(
                model=self.model_name,
                prompt=full_prompt,
                options={
                    "temperature": 0.3, 
                    "num_predict": 300
                }
            )
            return response['response'].strip()
        except Exception as e:
            return f"Error connecting to local Ollama engine: {str(e)}"