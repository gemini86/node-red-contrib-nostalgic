# node-red-contrib-nostalgic
A node to tell you how long ago it received a message. Useful for determining when your data may be stale!

- Remember the last time we got a message?
- Node-Red-Contrib-Nostalgic Does.

## Details

Any message on input will be passed though to the output. If 'Attach nostalgic property to new messages received' is checked, every new message the node receives will have an added property, which is configured in the 'Output to property' field, attached to it.

Eg. `msg: {payload: "hello", nostalgic: "just now"}`

The new message property is a string representing the humanized amount of time the last message was received. On the configured interval, a message is sent which can be either a message with just the configured output property (default) or a full clone of the original message with the added output property. If the node configuration is modified or the flow is stopped/restarted, interval output messages will stop until a new message arrives on input.

If the incoming message has property <code>timestamp</code> set to a unix timestamp (milliseconds since epoch), it will be used to calculate how long ago a message was received. This is useful if you want the node to continue outputting messages on interval after a flow restart, using a context variable or persistent context variable. See example flow in the examples folder.

[![alt text](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png "Buy me a coffee!")](https://www.buymeacoffee.com/NxcwUpD)

## Bug reports
[Please report issues!](http://github.com/gemini86/node-red-contrib-nostalgic/issues)
