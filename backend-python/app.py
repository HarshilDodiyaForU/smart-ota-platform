from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})

@app.route('/api/ota', methods=['GET'])
def ota():
    return jsonify({
        "status": "update available",
        "version": "1.0.1",
        "downloadUrl": "http://localhost:8081/update.zip"
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
