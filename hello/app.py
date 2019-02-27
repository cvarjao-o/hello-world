from http.server import BaseHTTPRequestHandler, HTTPServer

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write("Hello, world, I am changing!\n")
        return

httpd = HTTPServer(('0.0.0.0', 8080), RequestHandler)
httpd.serve_forever()