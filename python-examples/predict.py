import json
import logging
import os
import requests
import argparse

from dotenv import load_dotenv

# Parse command line args
argparse = argparse.ArgumentParser()
argparse.add_argument('--file', type=str, required=True)
argparse.add_argument('--doc-category', default=False, action='store_true')
argparse.add_argument('--page-category', default=False, action='store_true')
argparse.add_argument('--ocr-index', default=False, action='store_true')
args = argparse.parse_args()


def load_env_vars() -> (str, str):
    """
    Load environment variables from the .env file
    @return: client_id (str), client_secret (str)
    """
    load_dotenv()
    return os.getenv('CLIENT_ID', None), os.getenv('CLIENT_SECRET', None)


def obtain_access_token(client_id: str, client_secret: str) -> str:
    """
    Obtain an access token from the DocsQuality API
    @param client_id: client id (str)
    @param client_secret: client secret (str)
    :return: access token (str)
    """
    try:
        response = requests.post(
            url='https://auth.app.docsquality.com/realms/docsquality/protocol/openid-connect/token',
            data={
                'grant_type': 'client_credentials',
                'client_id': client_id,
                'client_secret': client_secret
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        response.raise_for_status()
        data = response.json()
        return data['access_token']
    except requests.RequestException as e:
        logging.error(
            ' Unable to obtain access token. Check your credentials in the .env file.'
        )
        raise e


def predict(file, access_token: str) -> dict:
    """
    Predict the quality of a document
    :param file: document file
    :param access_token: access token (str)
    :return: response data (dict)
    """
    data = None
    try:
        response = requests.post(
            url='https://app.docsquality.com/api/engine/quality',
            headers={'Authorization': f'Bearer {access_token}'},
            files={'file': file},
            params={
                'ocr_index': args.ocr_index,
                'doc_category': args.doc_category,
                'page_category': args.page_category,
            },
            timeout=180,
        )
        data = response.json()
        response.raise_for_status()
        return data
    except requests.RequestException as e:
        error_message = data.get('message', None)
        logging.error(
            f' An error occurred while predicting the quality of the document: {error_message}'
            if error_message else ' An error occurred while making a request to the API'
        )
        raise e


def main():
    """
    Main function
    """
    # Load environment variables
    client_id, client_secret = load_env_vars()
    # Obtain an access token
    access_token = obtain_access_token(client_id, client_secret)
    # Get the file path
    file_path = args.file

    # Predict the quality of the document
    with open(file_path, "rb") as file:
        response = predict(file, access_token)
        # Print API response
        print(json.dumps(response, indent=4))


if __name__ == '__main__':
    main()
