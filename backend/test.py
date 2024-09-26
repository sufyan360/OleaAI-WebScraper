import requests

url = "https://ephtracking.cdc.gov/apigateway/api/v1/infectiousDiseases?disease=mpox&year=2023&format=json"
response = requests.get(url)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Failed: {response.status_code}")