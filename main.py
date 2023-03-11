from importlib.resources import contents
from googletrans import Translator
import requests
from bs4 import BeautifulSoup

URL = "https://schema.org"

content = requests.get(URL).content
soup = BeautifulSoup(content, 'html.parser')
translator = Translator()

for text in soup.find_all(string=True):
    if text.parent.name in ['script', 'style']:
        continue
    if text:
        traduccion = translator.translate(text, dest='es')
        text.replace_with(traduccion.text)


