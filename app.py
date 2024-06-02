from flask import Flask, render_template,request, session, jsonify, send_file, make_response
import requests
import json
import socket

import mimetypes
mimetypes.add_type('application/javascript', '.mjs')

app = Flask(__name__)
app.secret_key = "ahtye33rk@#!7798s"
host_address = socket.gethostbyname(socket.gethostname())
# host_address = "127.0.0.1"

django = host_address
django_port = 8800


def send(method,address, data={}, vid="0", blob="0"):
    url = f'https://{django}:{django_port}/' + address


    if method == "POST":
        if blob == "1":
            # headers = {'Content-Type':'video/webm'}
            response = requests.post(url, files=data, verify=False, cookies=session.get('session', ''))
        else:
            headers = {'Content-Type':'application/json'}
            response = requests.post(url, json=data, headers=headers, verify=False, cookies=session.get('session', ''))

    elif method == "GET":
        if blob == "1":
            headers = {'Content-Type':'video/webm'}
            response = requests.get(url, data=data, headers=headers, verify=False, cookies=session.get('session', ''))
        else:
            headers = {'Content-Type':'application/json'}
            response = requests.get(url, json=data, headers=headers, verify=False, cookies=session.get('session', ''))

    if response.cookies:
        session['session'] = response.cookies.get_dict()
    

    if vid == "1":

        content_type = response.headers.get('Content-Type')

        if 'application/json' in content_type:
            return [response.text, True]
            

        return [response.content, False]
    else:
        return response.text







@app.route('/requester/', methods=['POST'])
def requester():

    data = json.loads(request.data)

    response = send(data['method'],data['address'],data['data'],data['vid'],data['blob'])

    if data['vid'] == "1":

        if response[1]:
            new_response = make_response(response[0])
            new_response.headers['Content-Type'] = 'application/json'

            return new_response
        
        return response[0]

    
    
    return response

    
        





@app.route('/home/')
def home():
    return render_template('home.html')




@app.route('/refresh/')
def refresh():
    # return render_template('camstart.html')
    pass




@app.route('/stream/<uid>')
def stream(uid):
    return render_template('stream.html',uid=uid)




@app.route('/stream/streaming_worker.js/')
def worker():

    return send_file("./static/js/streaming_worker.js")


























if __name__ == "__main__":
    app.run(host=host_address ,port=5800,ssl_context=('cert.pem', 'key.pem'),debug=True)