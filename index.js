const puppeteer = require('puppeteer');
const jsdom = require('jsdom');

const getPage = async (url) => {
    const browser = await puppeteer.launch();
    const response = await browser.newPage();
    const page = await response.goto(url);
    return new Promise(async (res, rej)=>{
        res(await page.text())
    })
};

(async()=>{

    try{

        const anclas = [];

        let{window : { document }} = new jsdom.JSDOM(await getPage("https://www.classcentral.com/"));

        document.querySelectorAll("a").forEach((e) => {
            // console.log("\n");
            if(e.href.startsWith("/") && e.href != '/' || e.href.startsWith("https://www.classcentral.com")){
                if(e.href.startsWith("/") && !anclas.includes(e.href) && !e.href.includes("cdn")){
                    anclas.push(e.href);
                }
                else if(e.href.startsWith("https://www.classcentral.com") && !anclas.includes(e.href.slice(28, e.href.length - 1)) && !e.href.includes("cdn")){
                    anclas.push(e.href.slice(28, e.href.length - 1));   
                }
            }
            // console.log("\n");
        });

        anclas.map(e => console.log(e));

        console.log(anclas.length);
        
        process.exit(1);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }

})();