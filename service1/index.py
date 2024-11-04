import os
import subprocess
import requests
from flask import Flask, jsonify
import threading

app = Flask(__name__)

def getSystemData():
    data = {}
    data['ip_address'] = os.popen('hostname -I').read().strip()
    data['processes'] = subprocess.getoutput('ps -ax').split('\n')
    data['disk_space'] = subprocess.getoutput('df -h /')
    data['uptime'] = subprocess.getoutput('uptime -p').strip()
    return data

# Route to get data from Service2
@app.route('/api', methods=['GET'])
def get_service_data():    
    try:
        # Data from Service1
        service1_data = getSystemData()

        # Request data from Service2
        service2_data = requests.get('http://service2:8200').json()

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
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to stop the services
@app.route('/stop', methods=['POST'])
def stop_services():
    try:
        # Return a response before stopping the container
        response = jsonify({'message': 'Stopping services...'})
        response.status_code = 200

        # Run the subprocess in a separate thread to stop the container after returning the response
        threading.Thread(target=lambda: subprocess.run(['bash', './stop-call.sh'], check=True)).start()

        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8199)