

document.getElementById("chat-gpt-input").focus();
async function fetchChatGPTResponse(inputText) {
  const api_key = ""
  // const api_url = "https://api.openai.com/v1/completions";
  const api_url = "https://api.openai.com/v1/chat/completions";
  const prompt = `请回答以下问题：\n问题：${inputText}\n回答：`;

  const response = await fetch(api_url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${api_key}`
      },
      body: JSON.stringify({
          // prompt: prompt,
          messages: [{role: "user", content: prompt}],
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 1,
          model: "gpt-3.5-turbo",
          // model: "davinci",
      }),
  });

  const data = await response.json();
  console.log(data)
  console.log(data.choices[0].message.content)
  // return data.choices[0].text.trim();
  return data.choices[0].message.content.trim()
}
// fetchChatGPTResponse("你是谁")

async function callCHATGPT(){
  console.log('调用')
  const obj = document.getElementById("chat-gpt-input");
      // 必须把输入框类型转化为 text，否则无法选取。（ERROR：selectionStart/selectionEnd on input type=“number” no longer allowed in Chrome）
      const input_type = obj.type;
      obj.type = 'text';
      obj.selectionStart = 0; // 选中开始位置
      obj.selectionEnd = obj.value.length;// 获取输入框里的长度。
      obj.type = input_type;// 获得焦点后，改回number类型
//   const d = document.getElementById("chat-gpt-input")
// d.value='换行即回答'
  const input = document.getElementById("chat-gpt-input");
//   const inputText = document.getElementById("chat-gpt-input").value;
  inputText = input.value
  console.log('input:',inputText)
//   input.value = '你好'
  const outputText = document.getElementById("chatgpt-response");
  outputText.innerHTML="等待反应中"
  if (inputText) {
      const response = await fetchChatGPTResponse(inputText);
      outputText.innerHTML = response;
  } else {
      outputText.innerHTML = "请输入问题。";
  }
}
