const { OpenAI } = require('openai');
const ApiKey = process.env.OPENAI_API_KEY
require('dotenv').config()


const openai = new OpenAI({
    apiKey: ApiKey
});


module.exports = class OpenAIController {

    static async ConsultarGpt(prompt) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [{ role: 'user', content: prompt }],
            });

            const content = completion.choices[0].message.content;
            return content;

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro ao consultar GTP' });
        }
    }

}