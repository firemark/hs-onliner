from flask import Flask
from converters import DateConverter
from db import get_db

db = None
pwsd = None

app = Flask(__name__)
app.url_map.converters['date'] = DateConverter


@app.route("/<date:day>", methods=['GET'])
def day_view(day):
    pass


@app.route("/<date:past>/<date:pre>}", methods=['GET'])
def range_view(past, pre):
    pass

if __name__ == "__main__":
    with open('pwsd') as f:
        pwsd = f.read()
    db = get_db('/tmp/firemark')
    app.run()
