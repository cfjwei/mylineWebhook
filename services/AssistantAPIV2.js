(function () {

    // 溝通 Assistant 用 package
    const AssistantV2 = require('ibm-watson/assistant/v2');
    const { IamAuthenticator } = require('ibm-watson/auth');

    class AssistantAPIV2 {
        constructor() {
            this.init = this.init.bind(this);
            this.createSession = this.createSession.bind(this);
            this.deleteSession = this.deleteSession.bind(this);
            this.message = this.message.bind(this);
        }

        init(configs) {
            this.configs = configs;
            this.service = new AssistantV2({
                version: configs.version,
                authenticator: new IamAuthenticator({
                    apikey: configs.apikey,
                }),
                url: configs.url,
            });
        }

        // 原生方法
        createSession() {
            return this.service.createSession({
                assistantId: this.configs.assistantId
            }).then(res => {
                return res.result;
            }).catch(err => {
                console.log('createSession', err);
                return err.body;
            });
        };

        deleteSession(session_id) {
            return this.service.deleteSession({
                assistantId: this.configs.assistantId,
                sessionId: session_id,
            }).then(res => {
                return res.result;
            }).catch(err => {
                console.log('deleteSession', err);
                return err.body;
            });
        };

        message(text, session_id) {
            return this.service.message({
                assistantId: this.configs.assistantId,
                sessionId: session_id,
                input: {
                    'message_type': 'text',
                    'text': text
                }
            })
                .then(res => {
                    return res.result;
                }).catch(err => {
                    console.log('message', err);
                    return err.body;
                });
        }
    }

    module.exports = new AssistantAPIV2();
}());