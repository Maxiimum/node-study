const http = require('http');
const fs = require('fs').promises;

const users = {}; // 데이터 저장용

const server = http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);
        if (req.method === 'GET') {
            if (req.url === '/') {
                const data = await fs.readFile('./restFront.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(data);                                                      // res.end 앞에 return을 붙이는 이유는
            } else if (req.url === '/about') {                                             // return을 붙이지 않으면 함수가 종료되지 않기에 
                const data = await fs.readFile('./about.html');                            // res.end같은 메서드가 여러번 실행된다면 에러 발생.
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(data);
            } else if (req.url === '/users') {
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end(JSON.stringify(users));
            }
            // 주소가 /도 /about도 아닐시
            try {
                const data = await fs.readFile('.'+req.url);
                return res.end(data);
            } catch (err) {
                // 주소에 해당하는 라우트를 못 찾았다는 404 NOT FOUND 발생
            }
        } else if ( req.method === 'POST') {
            if (req.url === '/user') {
                let body = '';
                // 요청의 body를 stream 형식으로 받음
                req.on('data', (data) => {
                    body += data;
                });
                // 요청의 body를 다 받은 후 실행됨
                return req.on('end', () => {
                    console.log('POST 본문(Body):', body);
                    const { name } =JSON.parse(body);
                    const id = Date.now();
                    users[id] = name;
                    res.writeHead(201);
                    res.end('등록 성공');
                });
            }
        } else if ( req.method === 'PUT') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('PUT 본문(Body):', body);
                    users[key] = JSON.parse(body).name;
                    return res.end(JSON.stringify(users));
                });
            }
        } else if ( req.method === 'DELETE') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                delete users[key];
                return res.end(JSON.stringify(users));
            }
        }
        res.writeHead(404);
        return res.end('NOT FOUND');
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(err);
    }
});

server.listen(8080);
server.on('listening', () => {
    console.log('8080번 포트에서 서버 머기중');
});
server.on('error', () => {
    console.error(err);
})
