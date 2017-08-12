from flask import Flask, request

from natty import DateParser
app = Flask(__name__)


@app.route('/', methods=['GET','POST'])
def hello_world():
    if request.method == "POST":
        print("hello")
    return ('Hello, World!')


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)