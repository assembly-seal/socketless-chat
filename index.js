const message_history = [];
const users = {};

const server = Bun.serve({
	async fetch(req) {	
		const address = server.requestIP(req).address;
		const path = new URL(req.url).pathname;
		
		if (path === "/") return new Response(Bun.file('./chat.html'));

		if (path === "/css") { console.log("><w>M"); return new Response(Bun.file('./css_chat.html')) };

		if (path === "/style.css") return new Response(Bun.file('./style.css'));

		if (req.method === "POST" && path === "/poll-messages") {
			const id = address + await req.text();
			const return_val = new Response(JSON.stringify({ "messages": message_history.slice(users[id]) }));
			users[id] = message_history.length;
			return return_val;
		}

		if (req.method === "POST" && path === "/message") {
			const message = await req.json();
			message_history.push(message);
			console.log(message.text);
			return new Response('message received!');
		}

		if (req.method === "POST" && path === "/request-id") {
			const id = address + await req.text();
    			if (users[id] === undefined) {
				users[id] = 0;
				console.log(users);
				return new Response('true');
			}
			return new Response('false');
		}

		return new Response("Page not found", { status: 404 });
	}
});
