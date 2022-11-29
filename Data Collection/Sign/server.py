
from test import predictHandGestures
from flask import Flask, request
from flask_cors import CORS




app = Flask(__name__)

CORS(app)
 

@app.route('/', methods=['POST', 'GET'])
def hello_world():
    if request.method=='POST':
        data = request.get_json()
        predictHandGestures(data['image'])
        return "Message received!!"

if __name__ == '__main__':
    app.run()