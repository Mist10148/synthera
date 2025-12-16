from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# --- CONFIGURATION ---
# Paste your API key here
GENAI_API_KEY = ""

genai.configure(api_key=GENAI_API_KEY)

# --- SYSTEM PARAMETERS ---
# This defines the AI's strict behavior rules
synthera_instructions = (
    "You are Synthera Lab Assistant.\n"
    "You ONLY answer questions related to Chemistry, Biology, or Physics.\n"
    "If the question is outside those subjects, reply exactly:\n"
    "I can only answer Chemistry, Biology, or Physics questions.\n\n"
    "Rules:\n"
    "- Plain text only\n"
    "- No markdown\n"
    "- No formatting\n"
    "- Simple explanations\n\n"
)

# Initialize the model with the system instructions
model = genai.GenerativeModel(
    'gemini-2.5-flash',
    system_instruction=synthera_instructions
)

# Start the chat session (empty history, as system_instruction handles the persona)
chat = model.start_chat(history=[])

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.json
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({"error": "Empty message"}), 400

        # Send message to Gemini
        response = chat.send_message(user_message)
        
        # Return the plain text response
        return jsonify({
            "reply": response.text
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"reply": "System Error: Neural Link Offline."}), 500

if __name__ == '__main__':
    print("Synthera Lab Assistant Active (Port 5000)...")
    app.run(debug=True, port=5000)