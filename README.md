# node-red-contrib-nostalgic
A node to tell you how long ago it received a message. Useful for determining when your data may be stale!

- Remember the last time we got a message?
- Node-Red-Contrib-Nostalgic Does.

## Details
Any message on input will be passed though to the output with a `nostalgic` property, which is a string representing the humanized amount of time the last message was received. A message, which can be either a message with just a `nostalgic` property (default) or a full clone of the original message, is sent every configured interval until the node configuration is modified or the flow is stopped/restarted. The node will then wait for a new input before again sending messages at regular intervals.

If the message has property `timestamp` set to a unix timestamp (milliseconds since epoch), it will be used to calculate how long ago a message was received. This is useful if you want the node to output the last message received before a flow restart, using a context variable or persistent context variable. See example flow in the examples folder.

[![alt text](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png "Buy me a coffee!")](https://www.buymeacoffee.com/NxcwUpD)

## Bug reports
[Please report issues!](http://github.com/gemini86/node-red-contrib-nostalgic/issues)
