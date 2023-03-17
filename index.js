const fs = require('fs/promises')
const puppeteer = require('puppeteer');
const jsdom = require('jsdom');


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
                    console.log(url);
                    const page = await response.goto(url);
                    let name = url.slice(28,url.length) === '' ? 'index' : url.slice(28,url.length);
                    console.log(name + "\n");
                    let name2 = "";

                    for(let i = 0; i < name.length; i++){
                        if(name.charAt(i) == "/"){
                            name2 += "";
                        }
                        name2 += name.charAt(i);
                    }

                    await fs.writeFile(`views/${name2}.html`, await page.text(), {
                        mode : 4
                    },(err)=>{ err ? console.log(err) : null});
                    console.log("\n");
                    res(await page.text());
                }catch(err){
                    rej(err);
                }
            });
        };


        const anclas = [];

        let{window : { document }} = new jsdom.JSDOM(await getPage("https://www.classcentral.com"));

        console.log(document.body);
        document.querySelectorAll("a").forEach((e) => {
            if(e.href.startsWith("/") && e.href != '/' || e.href.startsWith("https://www.classcentral.com")){
                if(e.href.startsWith("/") && !anclas.includes(e.href) && !e.href.includes("cdn")){
                    anclas.push(e.href);

                }
                else if(e.href.startsWith("https://www.classcentral.com") && !anclas.includes(e.href.slice(28, e.href.length - 1)) && !e.href.includes("cdn")){
                    anclas.push(e.href.slice(28, e.href.length - 1));   
                }
            }
        });

        for (const link of anclas) {
            await getPage(link);
        }

        console.log(anclas.length);
        
        // process.exit(1);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }

})();