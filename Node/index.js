const fs = require('fs/promises');
const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const axios = require('axios').default;
const { METHODS } = require('http');


(async()=>{ 
    try{
            
        const browser = await puppeteer.launch();
        const response = await browser.newPage();

        const getPage = async (url) => {
            return new Promise(async (res, rej)=>{
                try{
                    console.log("\n");
                    if(!url.startsWith("https://www.classcentral.com")){
                        url = "https://www.classcentral.com" + url;
                    }
                    const page = await response.goto(url);
                    let name = url.slice(28,url.length) === '' ? 'index' : url.slice(28,url.length);
                    let name2 = "";

                    for(let i = 0; i < name.length; i++){
                        if(name[i] == '/'){
                            name2 += "-";
                        }
                        else{
                            name2 += name[i];
                        }
                    }

                    let pageText = await page.text();
                    pageText = await axios.post('http://127.0.0.1:5000/translate',{page : pageText}).then(response=>response.json()).then(data=>data).catch(error=>rej(error));
                    if(name != 'index'){
                        await fs.writeFile(`../views/${name2}.html`,pageText, {
                            mode : fs.constants.S_IWOTH
                        },(err)=>{ err ? console.log(err) : null});
                    }
                    console.log(`Url : ${url} \n Name : ${name} \n`);
                    res(pageText);
                }catch(err){
                    rej(err);
                }
            });
        };


        const anclas = [];

        let indexPage = await getPage("https://www.classcentral.com");
        let indexDOM = new JSDOM(indexPage);

        indexDOM.window.document.querySelectorAll("a").forEach((e) => {
            if(e.href.startsWith("/") && e.href != '/' && !e.href.includes("cdn")){
                !anclas.includes(e.href) ? anclas.push(e.href) : null;
                let name2 = e.href.replace(/[/]/g,"-");
                e.href=name2+".html";
            }
            else if(e.href.startsWith("https://www.classcentral.com") && !e.href.includes("cdn")){
                let url = e.href.slice(28, e.href.length - 1);
                !anclas.includes(url) ? anclas.push(url) : null;
                let name2 = url.replace(/[/]/g,"-");
                e.href=name2+".html";
            }
        });

        await fs.writeFile(`../views/index.html`, indexDOM.serialize(), {
            mode : fs.constants.S_IWOTH
        },(err)=>{ err ? console.log(err) : null});

        for (const link of anclas) {
            await getPage(link);
        }

        

        console.log(anclas.length);

        
        
        process.exit(1);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }

})();