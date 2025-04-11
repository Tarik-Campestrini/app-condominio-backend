import axios from "axios";

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

/* FUnção não utilizada no momento, mas pode ser utilizada para enviar mensagens de aviso
export const sendTemplateMessageAviso = async (phoneNumber, nome, mensagem) => {
    try {
        // Remover caracteres não numéricos do telefone
        phoneNumber = phoneNumber.replace(/\D/g, "");

        // Garantir que o telefone começa com 55 (código do Brasil)
        if (!phoneNumber.startsWith("55")) {
            phoneNumber = `55${phoneNumber}`;
        }

        const payload = {
            "messaging_product": "whatsapp",
            "to": phoneNumber,
            "type": "template",
            "template": {
                "name": "avisos",
                "language": {
                    "code": "pt_BR"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            { "type": "text", "parameter_name" : "nome", "text": nome },
                            { "type": "text", "parameter_name" : "menssagem", "text": mensagem }
                        ]
                    }
                ]
            }
        };

        console.log("📤 Payload enviado:", JSON.stringify(payload, null, 2));

        // Enviar requisição
        const response = await axios.post(WHATSAPP_API_URL, payload, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Mensagem enviada com sucesso!", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
        throw error;
    }
};
*/

export const sendTemplateMessageEntrega = async (phoneNumber, nome, entrega, data) => {
    try {
        // Remover caracteres não numéricos do telefone
        phoneNumber = phoneNumber.replace(/\D/g, "");

        // Garantir que o telefone começa com 55 (código do Brasil)
        if (!phoneNumber.startsWith("55")) {
            phoneNumber = `55${phoneNumber}`;
        }

        const payload = {
            "messaging_product": "whatsapp",
            "to": phoneNumber,
            "type": "template",
            "template": {
                "name": "entregas",
                "language": {
                    "code": "pt_BR"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            { "type": "text", "parameter_name" : "nome", "text": nome },
                            { "type": "text", "parameter_name" : "entrega", "text": entrega },
                            { "type": "text", "parameter_name" : "data", "text": data }
                        ]
                    }
                ]
            }
        };

        console.log("📤 Payload enviado:", JSON.stringify(payload, null, 2));

        // Enviar requisição
        const response = await axios.post(WHATSAPP_API_URL, payload, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Mensagem de entrega enviada com sucesso!", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem de entrega:", error.response?.data || error.message);
        throw error;
    }
};



// Essa função envia uma mensagem de template "cadastro" pelo WhatsApp Cloud API

export const sendTemplateMessageCadastrar = async (phoneNumber, nome, email, senha) => {
    try {
        // Remover caracteres não numéricos do telefone
        phoneNumber = phoneNumber.replace(/\D/g, "");

        // Garantir que o telefone começa com 55 (código do Brasil)
        if (!phoneNumber.startsWith("55")) {
            phoneNumber = `55${phoneNumber}`;
        }

        const payload = {
            "messaging_product": "whatsapp",
            "to": phoneNumber,
            "type": "template",
            "template": {
                "name": "cadastro",
                "language": {
                    "code": "pt_BR"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            { "type": "text", "parameter_name" : "nome", "text": nome },
                            { "type": "text", "parameter_name" : "usuario", "text": email },
                            { "type": "text", "parameter_name" : "senha", "text": senha },
                        ]
                    }
                ]
            }
        };

        console.log("📤 Payload enviado:", JSON.stringify(payload, null, 2));

        // Enviar requisição
        const response = await axios.post(WHATSAPP_API_URL, payload, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Mensagem enviada com sucesso!", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
        throw error;
    }
};

export const sendTemplateMessageAviso = async (phoneNumber, nome, mensagem) => {
    try {
      // Sanitizar número de telefone
      phoneNumber = phoneNumber.replace(/\D/g, "");
      if (!phoneNumber.startsWith("55")) {
        phoneNumber = `55${phoneNumber}`;
      }
  
      // Sanitizar nome e mensagem para evitar erros da API do WhatsApp
      const sanitizeText = (text) =>
        text
          .replace(/\n/g, ' ')         // remove quebras de linha
          .replace(/\t/g, ' ')         // remove tabulações
          .replace(/ {5,}/g, '    ')   // limita espaços consecutivos a 4
  
      nome = sanitizeText(nome);
      mensagem = sanitizeText(mensagem);
  
      const payload = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: {
          name: "aviso",
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: nome },
                { type: "text", text: mensagem }
              ]
            }
          ]
        }
      };
  
      const response = await axios.post(WHATSAPP_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
  
      console.log("✅ Aviso enviado via WhatsApp:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao enviar aviso:", error.response?.data || error.message);
      throw error;
    }
  };