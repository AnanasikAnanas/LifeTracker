const token = process.env.BOT_TOKEN;
const miniAppUrl = process.env.MINI_APP_URL;
const menuButtonText = process.env.MENU_BUTTON_TEXT || "Трекер Жизни";

if (!token || !miniAppUrl) {
  console.error("Set BOT_TOKEN and MINI_APP_URL before running this script.");
  console.error("PowerShell example:");
  console.error("$env:BOT_TOKEN='123:abc'; $env:MINI_APP_URL='https://your-domain.com'; npm run telegram:setup");
  process.exit(1);
}

if (!miniAppUrl.startsWith("https://")) {
  console.error("MINI_APP_URL must be an HTTPS URL for Telegram Mini Apps.");
  process.exit(1);
}

async function callTelegram(method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json();

  if (!result.ok) {
    throw new Error(`${method} failed: ${result.description || JSON.stringify(result)}`);
  }

  return result.result;
}

await callTelegram("setChatMenuButton", {
  menu_button: {
    type: "web_app",
    text: menuButtonText,
    web_app: {
      url: miniAppUrl
    }
  }
});

await callTelegram("setMyCommands", {
  commands: [
    {
      command: "start",
      description: "Открыть Трекер Жизни"
    }
  ]
});

console.log("Telegram menu button configured.");
console.log(`Mini App URL: ${miniAppUrl}`);
