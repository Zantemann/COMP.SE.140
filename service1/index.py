import os
import subprocess
import requests
from flask import Flask, jsonify

app = Flask(__name__)

def getSystemData():
    data = {}
    data['ip_address'] = os.popen('hostname -I').read().strip()
    data['processes'] = subprocess.getoutput('ps -ax').split('\n')
    data['disk_space'] = subprocess.getoutput('df -h /')
    data['uptime'] = subprocess.getoutput('uptime -p').strip()
    return data

# Route to get data from Service2
@app.route('/')
def get_service_data():
    service1_data = getSystemData()
    
    # Request data from Service2
    try:
        service2_data = requests.get('http://service2:8200').json()
    except Exception as e:
        service2_data = {'error': str(e)}

    response = {
        'Service1': {
            'IP address information': service1_data['ip_address'],
            'list of running processes': service1_data['processes'],
            'available disk space': service1_data['disk_space'],
            'time since last boot': service1_data['uptime']
        },
        'Service2': {
            'IP address information': service2_data['ip_address'],
            'list of running processes': service2_data['processes'],
            'available disk space': service2_data['disk_space'],
            'time since last boot': service2_data['uptime']
        }
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8199)