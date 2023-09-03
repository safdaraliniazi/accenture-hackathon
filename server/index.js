const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const openai = require('openai');

const app = express();
const port = 3000;

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

//test
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
