import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.geeksforgeeks.org/python-web-scraping-tutorial/')
soup = BeautifulSoup(r.content, 'html.parser')
# print(soup.prettify())

with open('page.txt', 'w') as file :
    file.write(soup.prettify())