# Sample `function_call` responses

## GPT-3.5-turbo-16k

### Example 1
The messages array sent to GPT-3.5-turbo-16k:
```ts
// ...
[
  {
  role: 'system',
  content: 'Your are ChatGPT, a large language model creatd by OpenAI. Do not make assumptions about which functions to call,. Always verifiy with the user first calling any functions. Respond using markdown'
},
  {
  role: 'user',
  content: 'Write a python program that prints the word "hi"'
},
  {
  role: 'assistant',
  content: 'Sure! Here\'s a simple Python program that prints the word "hi":\n\n```python\nprint("hi")\n```\n\nYou can execute this program by running it in a Python environment.'
},
  { role: 'user', content: 'Run it' }
]
// ...

```

Response:

```bash
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"role":"assistant","content":null,"function_call":{"s":"repl","arguments":""}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"{\n"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" "}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" \""}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"code"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\":"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" \""}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"print"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"(\\\""}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"hi"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\\\")"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\",\n"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" "}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" \""}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"language"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\":"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" \""}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"python"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\"\n"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"}"}},"finish_reason":null}]}
{"id":"chatcmpl-7Vm0I8bkjxguldeyTN5RJ3K6kJky1","object":"chat.completion.chunk","created":1687807050,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{},"finish_reason":"function_call"}]}
[DONE]
```
{"id":"chatcmpl-7VuRzVUdmX2OUOW55rDqKB5wkERvh","object":"chat.completion.chunk","created":1687839519,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}
{"id":"chatcmpl-7VuRzVUdmX2OUOW55rDqKB5wkERvh","object":"chat.completion.chunk","created":1687839519,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"content":"?"},"finish_reason":null}]}
{"id":"chatcmpl-7VuRzVUdmX2OUOW55rDqKB5wkERvh","object":"chat.completion.chunk","created":1687839519,"model":"gpt-3.5-turbo-0613", "choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}



```bash
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"role":"assistant","content":null,"function_call":{"name":"repl","arguments":""}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"{\n"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" "}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" \""}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"code"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\":"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" \""}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"print"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"(\\\""}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"hi"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\\\")"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\",\n"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" "}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" \""}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"language"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\":"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":" \""}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"python"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"\"\n"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"function_call":{"arguments":"}"}},"finish_reason":null}]}
{"id":"chatcmpl-7WDJd9KHUR8nbbawGGEuLF3uoYGRh","object":"chat.completion.chunk","created":1687912037,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{},"finish_reason":"function_call"}]}
[DONE]

```