from flask import Flask, request
import platform
app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def dump_headers(path):
  return '{}\n\nHEADERS:\n{}\nHOSTNAME:{}'.format(request.method + ' ' + request.url, str(request.headers), platform.node()), 200, {'Content-Type': 'text/plain; charset=utf-8'}