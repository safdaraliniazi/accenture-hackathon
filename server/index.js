const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const openai = require('openai');
const puppeteer = require('puppeteer');


const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const apiKey = 'your-openai-api-key';
openai.apiKey = apiKey;

app.get('/', (req, res) => {
    res.send('Project Links');
});

app.post('/sustain', async (req, res) => {
    const { productTitle, productDescription } = req.body;

    if (!productTitle || !productDescription) {
        return res.status(400).json({ status: false, data: 'Missing required query parameters' });
    }

    const sustainAttributes = [
        'organic',
        'fair trade',
        'recyclable',
        'reusable',
        'renewable energy',
        'energy efficient',
        'sustainable packaging',
        'biodegradable/compostable',
        'low carbon footprint',
        'carbon neutral',
        'ethically sourced',
        'water conservation',
        'non-toxic',
        'cruelty-free',
        'upcycled',
        'locally produced',
        'social impact',
        'low/zero VOC'
    ];

    const sustainableAttributesToString = sustainAttributes.join(',');

    const prompt = `I have a product titled '${productTitle}' and product description '${productDescription}'. Match the product with sustainable attributes and explain why. Sustainable attributes: ${sustainableAttributesToString}. If the product can't match any of the sustainable attributes, return False.\nReturn a dictionary like this: {'attribute': 'Explanation'}`;

    try {
        const response = await openai.Completion.create({
            engine: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 1000,
            n: 13,
            stop: null,
            temperature: 0.5,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        const choices = response.choices;
        const attributes = {};

        for (const choice of choices) {
            const result = choice.text.trim().replace(/'/g, '"');
            try {
                const { attribute, explanation } = JSON.parse(result);
                attributes[attribute.toLowerCase()] = explanation;
            } catch (error) {
                continue;
            }
        }

        if (Object.keys(attributes).length === 0) {
            res.status(200).json({ status: false, data: 'Not sustainable.' });
        } else {
            res.status(200).json({ status: true, data: attributes });
        }
    } catch (error) {
        res.status(500).json({ status: false, data: 'An error occurred' });
    }
});


async function start(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);


    const photos = await page.$$eval("#landingImage" , (imgs) => {
        return imgs.map((img) => img.src);
    })
    const title = await page.$eval("#productTitle" , (title) => {
        return title.innerText;
    })
    const description = await page.$eval("#productDescription" , (description) => {
        return description.innerText;
    })

    const product_details = {
        "photos" : photos[0],
        "title" : title,
        "description" : description
    }

    console.log(product_details);


    await browser.close();
}

start('https://www.amazon.in/iQOO-Stellar-Snapdragon-Segment-Included/dp/B07WHSR1NR/?_encoding=UTF8&pd_rd_w=ki2jG&content-id=amzn1.sym.b5a625fa-e3eb-4301-a9e2-f9c8b3e7badf%3Aamzn1.symc.36bd837a-d66d-47d1-8457-ffe9a9f3ddab&pf_rd_p=b5a625fa-e3eb-4301-a9e2-f9c8b3e7badf&pf_rd_r=79ZXSFG5XYJXZ073S65P&pd_rd_wg=HphIF&pd_rd_r=46f9ff55-90c2-4629-9cb4-300ec1000410&ref_=pd_gw_ci_mcx_mr_hp_atf_m&th=1')



//test
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
