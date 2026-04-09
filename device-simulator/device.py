import requests
import time
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

VERSION_FILE = 'version.txt'
current_version = "1.0.0"

def load_current_version():
    global current_version
    if os.path.exists(VERSION_FILE):
        try:
            with open(VERSION_FILE, 'r') as f:
                current_version = f.read().strip()
                logging.info("Loaded current version from file: %s", current_version)
        except Exception as e:
            logging.warning("Could not read version file: %s, using default: %s", e, current_version)
    else:
        logging.info("Version file not found, using default: %s", current_version)

def save_version(version):
    try:
        with open(VERSION_FILE, 'w') as f:
            f.write(version)
        logging.info("Saved version to file: %s", version)
    except Exception as e:
        logging.error("Could not save version file: %s", e)

def compare_versions(server_version):
    try:
        server_parts = [int(x) for x in server_version.split('.')]
        current_parts = [int(x) for x in current_version.split('.')]
        
        for i in range(max(len(server_parts), len(current_parts))):
            server = server_parts[i] if i < len(server_parts) else 0
            current = current_parts[i] if i < len(current_parts) else 0
            if server > current:
                return True
            if server < current:
                return False
        return False
    except Exception as e:
        logging.error("Error comparing versions: %s", e)
        return False

def check_ota_update():
    global current_version
    load_current_version()
    
    while True:
        try:
            response = requests.get('http://localhost:8081/ota')
            if response.status_code == 200:
                data = response.json()
                logging.info("OTA Response: %s", data)
                server_version = data.get('version', '')
                
                if data['status'] == 'update available' and compare_versions(server_version):
                    logging.info("Update found! Current: %s, Server: %s, URL: %s", 
                               current_version, server_version, data['downloadUrl'])
                    download_url = data['downloadUrl']
                    try:
                        logging.info("Downloading update...")
                        download_response = requests.get(download_url, stream=True)
                        download_response.raise_for_status()
                        with open('firmware_update.zip', 'wb') as f:
                            for chunk in download_response.iter_content(chunk_size=8192):
                                if chunk:
                                    f.write(chunk)
                        logging.info("Update downloaded successfully!")
                        current_version = server_version
                        save_version(server_version)
                        time.sleep(3)
                    except Exception as download_error:
                        logging.error("Download failed: %s", download_error)
                else:
                    logging.info("No update needed. Current: %s, Server: %s", current_version, server_version)
            else:
                logging.error("Failed to check OTA: %s", response.status_code)
        except Exception as e:
            logging.error("Error checking OTA: %s", e)
        time.sleep(10)

if __name__ == '__main__':
    check_ota_update()
