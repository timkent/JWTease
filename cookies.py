#!/usr/bin/env python3

from flask import Flask, make_response

def main():
    app = Flask(__name__)
    @app.route('/')
    def index():
        result = 'Enjoy your cookies!\n'
        resp = make_response(result)
        resp.set_cookie('cookie_a', value='1234', httponly=False)
        resp.set_cookie('cookie_b', value='5678', httponly=True)
        return resp, 200

    app.run(host='0.0.0.0', port=5000, threaded=True)

if __name__ == '__main__':
    main()
