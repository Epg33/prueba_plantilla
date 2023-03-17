const fs = require('fs/promises')
const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');


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
                    console.log(`Url : ${url}`);
                    const page = await response.goto(url);
                    let name = url.slice(28,url.length) === '' ? 'index' : url.slice(28,url.length);
                    console.log( `Name: ${name} \n`);
                    let name2 = "";

                    for(let i = 0; i < name.length; i++){
                        if(name[i] == '/'){
                            console.log(`Char ${i+1} : ${name[i]}`);
                            name2 += "-";
                        }
                        else{
                            name2 += name[i];
                        }
                        console.log(`Name 2 en vuelta ${i}: ${name2}`);
                    }
                    if(name != 'index'){
                        await fs.writeFile(`views/${name2}.html`, await page.text(), {
                            mode : 4
                        },(err)=>{ err ? console.log(err) : null});
                    }
                    console.log("\n");
                    res(await page.text());
                }catch(err){
                    rej(err);
                }
            });
        };


        const anclas = [];

        let indexPage = await getPage("https://www.classcentral.com");
        let indexDOM = new JSDOM(indexPage);

        indexDOM.window.document.querySelectorAll("a").forEach((e) => {
            if(e.href.startsWith("/") && e.href != '/' || e.href.startsWith("https://www.classcentral.com")){
                if(e.href.startsWith("/") && !anclas.includes(e.href) && !e.href.includes("cdn")){
                    anclas.push(e.href);
                    let name2 = "";
                    for(let i = 0; i < e.href.length; i++){
                        if(e.href[i] == '/'){
                            console.log(`Char ${i+1} : ${e.href[i]}`);
                            name2 += "-";
                        }
                        else{
                            name2 += e.href[i];
                        }
                        console.log(`Name 2 en vuelta ${i}: ${name2}`);
                    }
                    e.href=name2+".html";
                }
                else if(e.href.startsWith("https://www.classcentral.com") && !anclas.includes(e.href.slice(28, e.href.length - 1)) && !e.href.includes("cdn")){
                    let url = e.href.slice(28, e.href.length - 1);
                    anclas.push(url);
                    let name2 = "";
                    for(let i = 0; i < url.length; i++){
                        if(url[i] == '/'){
                            console.log(`Char ${i+1} : ${url[i]}`);
                            name2 += "-";
                        }
                        else{
                            name2 += url[i];
                        }
                        console.log(`Name 2 en vuelta ${i}: ${name2}`);
                    }
                    e.href=name2+".html";
                }
            }
        });

        for (const link of anclas) {
            await getPage(link);
        }

        console.log(anclas.length);

        await fs.writeFile(`views/index.html`, indexDOM.serialize(), {
            mode : 4
        },(err)=>{ err ? console.log(err) : null});
        
        process.exit(1);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }

})();