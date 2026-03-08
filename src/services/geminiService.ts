import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getChatResponse = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `Você é o assistente virtual da Royal Odontologia, uma clínica odontológica de excelência em Aparecida de Goiânia. 
        Informações da Clínica:
        - Nome: Royal Odontologia
        - CRO: 12843
        - Abordagem: Odontologia Sistêmica (tratamento da dor e saúde integral).
        - Diferenciais: Laboratório Próprio (CAD/CAM), Tecnologia Laser, Fluxo Digital (Scanners 3D).
        - Contato/WhatsApp: 62 98168-5668
        - Endereço: Av. Independência Qd. 26 LT. 10 Sala 02 - Jardim Ipiranga, Aparecida de Goiânia - GO.
        - Ponto de Referência: Em frente ao Colégio Irmã Angélica.
        - Horário: Segunda a Sexta, 08:30 às 12:00 e 13:30 às 18:00.
        
        Serviços Oferecidos:
        - Facetas (Porcelana e Resina)
        - Implantes e Protocolo
        - Clareamento Dental
        - Ortodontia (Aparelhos)
        - Odontologia Estética e Preventiva
        - Limpeza, Restauração, Canal, Extração e Prótese.
        
        Seu tom deve ser profissional, acolhedor, confiável e seguro. 
        Responda em Português do Brasil. Se perguntarem sobre preços, explique que é necessária uma avaliação clínica para um orçamento preciso.
        Se o usuário quiser agendar, peça o nome e telefone e diga que a equipe entrará em contato via WhatsApp (62 98168-5668).`,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error in getChatResponse:", error);
    return "Desculpe, estou com dificuldades técnicas no momento. Por favor, entre em contato diretamente pelo WhatsApp: 62 98168-5668.";
  }
};

export const getSearchInfo = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error in getSearchInfo:", error);
    return null;
  }
};
