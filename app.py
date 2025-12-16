import google.generativeai as genai
from flask import Flask, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# -------------------- API CONFIG --------------------
API_KEY = ""
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

# -------------------- ROUTE --------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    user_message = data.get("message", "").strip()

    if not user_message:
        return Response(
            "Message required.",
            status=400,
            mimetype="text/plain"
        )

    system_instruction = (
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

    prompt = system_instruction + user_message

    try:
        response = model.generate_content(prompt)
        return Response(
            response.text,
            mimetype="text/plain"
        )
    except Exception as e:
        return Response(
            f"Error: {str(e)}",
            status=500,
            mimetype="text/plain"
        )

# -------------------- MAIN --------------------
if __name__ == "__main__":
    print("Synthera Lab Server running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
