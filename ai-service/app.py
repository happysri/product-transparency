from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dummy AI logic: generates simple follow-up questions
@app.route("/generate-questions", methods=["POST"])
def generate_questions():
    data = request.get_json()
    product_name = data.get("product_name", "the product")
    questions = [
        f"What are the main ingredients in {product_name}?",
        f"Does {product_name} have any allergens?",
        f"Where is {product_name} manufactured?",
        f"Is {product_name} eco-friendly or recyclable?"
    ]
    return jsonify({"questions": questions})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
