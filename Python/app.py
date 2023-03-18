from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from googletrans import Translator

app = Flask(__name__)

translate = Translator()

@app.route('/translate',methods=['POST'])
def translateHtml():
    pageIn = request.json["page"]
    Page = BeautifulSoup(pageIn, "html.parser")
    for element in Page.contents:
        for i in range(len(element.contents)):
            translated = translate.translate(element.contents[i],src='es',dest='en')
            print(translated.text)
            element.contents[i] = translated.text
    return jsonify({"HTML" : Page.prettify()})

if __name__ == "__main__":
    app.run(debug=True, port=5000)