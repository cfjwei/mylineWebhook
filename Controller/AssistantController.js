(function () {

    // 取得設定資料
    const configs = require('../config.js');

    // 引用寫好的API
    const assistantAPI = require('../services/AssistantAPIV2');
    assistantAPI.init(configs.assistant)

    // 存放 sdk 產生之 session
    let userSessions = {};

    class AssistantController {
        constructor() {
        }
        // 取得 user session 
        async sendMessage(userId, text) {

            // 取出API所需暫存Session
            let userSession = userSessions[userId];

            // 若沒有對應session
            if (!userSession) {
                // create new session
                let newSession = await assistantAPI.createSession();
                userSession = newSession.session_id;
                userSessions[userId] = userSession;
            }


            console.log(text, userSession)
            // 對話
            return assistantAPI.message(text, userSession)
                .then((result) => {
                    // 整理過Assistant後，僅需要作
                    // return JSON.parse(result.output.generic[0].text);

                    // 未整理使用這一區
                    return {
                        type: 'text',
                        text: result.output.generic[0].text
                    };
                }).catch(() => {
                    return 'fail to call assistant';
                });
        }
    }

    module.exports = new AssistantController();
}());