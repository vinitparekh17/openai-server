'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const handlebars_1 = __importDefault(require('handlebars'));
const source = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="{{#if themeColor}}{{themeColor}}{{else}}light{{/if}}">
    <title>Chat</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: justify;
            width: 100%;
            height: 100vh;
        }

        .title {
            background-color: #333;
            color: #fff;
            padding: 1rem;
            display: flex;
            align-items: center;
        }

        .title-brand {
            display: flex;
            align-items: center;
        }

        .title-brand img {
            border-radius: 50%;
            margin-right: 1rem;
        }

        .title h1 {
            font-size: 1.5rem;
            font-weight: 500;
            margin: 0;
            padding: 0;
        }

        .title time {
            font-size: 12px;
            color: #fff;
            margin: 0;
            padding: 0;
            margin-left: auto;
        }

        .container {
            display: flex;
            justify-content: center;
        }

        .chat {
            border-radius: 5px;
            margin: 2rem 0 0 0;
            width: calc(100% - 60%);
            display: flex;
            flex-direction: column;
        }

        .chat .message {
            background-color: #fff;
            border-radius: 5px;
            padding: 5px 10px;
            margin-bottom: 5px;
            display: block;
            max-width: calc(100% - 10rem);
            word-wrap: break-word;
        }

        .username {
            color: #c7c7c7;
            font-size: 12px;
            margin: 0;
            padding: 0;

        }

        .user-content {
            margin: 0;
            padding: 0;
        }

        .chat .message .msg-time {
            font-size: 12px;
            color: #c7c7c7;
            margin: 0;
            padding: 3px 0 0 0;
            text-align: right;
        }

        .chat .message.sent {
            background-color: #dcf8c6;
            float: right;
            margin: 10px 0 10px 0;
            align-self: flex-end;
        }

        .chat .message.received {
            background-color: #fff;
            float: left;
            margin: 10px 0 10px 0;
            align-self: flex-start;
        }

        @media screen and (max-width: 768px) {
            .title {
                flex-direction: column;
                align-items: flex-start;
            }

            .title-brand {
                margin-bottom: 0;
            }

            .title-brand img {
                margin-right: 1rem;
            }

            .title h1 {
                font-size: 1.2rem;
                font-weight: 500;
                margin: 0;
                padding: 0;
            }

            .title time {
                font-size: 12px;
                margin: 0;
                padding: 0;
                margin-left: auto;
            }

            .chat {
                width: calc(100% - 1rem);
                margin: 0 .5rem 0 .5rem;
            }

            .chat .message {
                max-width: calc(100% - 6rem);
            }
        }
    </style>
</head>

<body>
    <div class="title">
        <div class="title-brand">
            <img class="user-avatar" src="{{userAvatarUrl}}"
                alt="user avatar" width="50px" height="50px">
            <h1>{{username}}'s transcript</h1>
        </div>
        <time>{{formattedTime}}</time>
    </div>
    <div class="container">
        <div class="chat">
            {{#each messages}}
                {{#if answer}}
                    <div class="message received">
                        <p class="username">Chat-bot</p>
                        <p class="user-content">{{answer.content}}</p>
                        <p class="msg-time">{{answer.formattedTime}}</p>
                    </div>
                {{/if}}
                {{#if prompt}}
                    <div class="message sent">
                        <p class="username">{{prompt.username}}</p>
                        <p class="user-content">{{prompt.content}}</p>
                        <p class="msg-time">{{prompt.formattedTime}}</p>
                    </div>
                {{/if}}
            {{/each}}
        </div>
    </div>    
        <script>
            const themeColor = document.querySelector('meta[name="theme-color"]').getAttribute('content');
            const body = document.querySelector('body').style;
            const received = document.querySelectorAll('.received');
            const sent = document.querySelectorAll('.sent');
            switch (themeColor) {
                case 'dark':
                    body.backgroundColor = 'rgb(30, 30, 30)';
                    received.forEach(message => {
                        message.style.backgroundColor = 'rgb(80, 80, 80)';
                        message.style.color = 'rgb(200, 200, 200)';
                    });
                    sent.forEach(message => {
                        message.style.backgroundColor = '#007460';
                        message.style.color = '#fff';
                    });
                    break;
                case 'light':
                    body.backgroundColor = '#f5f5f5';
                    received.forEach(message => {
                        message.style.backgroundColor = '#fff';
                        message.style.color = '#333';
                    });
                    sent.forEach(message => {
                        message.style.backgroundColor = '#d3f9c6';
                        message.style.color = '#333';
                    });
                    break;
                default:
                    body.backgroundColor = themeColor;
                    break;
            }
        </script>
</body>

</html>`;
exports.default = handlebars_1.default.compile(source);
// let demoData = {
//     username: 'John Doe',
//     themeColor: 'dark',
//     userAvatarUrl: 'https://plus.unsplash.com/premium_photo-1669951581968-73b5b71face3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
//     formattedTime: '12:00 PM',
//     messages: [
//         {
//             answer: {
//                 content: "Yes, im here",
//                 formattedTime: Date.now().toLocaleString()
//             },
//             prompt: {
//                 username: "Julie",
//                 content: "Hey, testing",
//                 formattedTime: Date.now().toLocaleString()
//             }
//         }
//     ]
// }
//# sourceMappingURL=Handlebars.js.map
