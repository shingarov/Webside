# Evaluate an expression
Evaluate an expression, either synchronously or asynchronously.

Pay special attention to the way compilation errors should be handled by the API so Webside can react properly.

**URL**: `/evaluations`

**Method**: `POST`

**Body**: an `expression`:

```json
{
    "expression": "string",
    "context": "context",
    "sync": "boolean",
    "pin": "boolean",
    "debug": "boolean",
    "profile": "boolean"
}
```
Where `sync` indicates whether the call should be blocked until the evaluation finishes or will return immediately, with the ID of the just created evaluation to follow its state.  
The asynchronous evaluation allows Webside to have control over the evaluation, being able to offer the user the chance to cancel the evaluation or interrupt it and debug it (a feature that is not implemented at the moment of writing this documentation).  
Once Webside has the evaluation ID, it can make a synchronous call to [`/objects/{id}`](../objects/id/get.md) (with the ID of the evaluation) to avoid polling the state of the evaluation before getting the object.

`pin` makes the resulting object to be pinned (with the same ID of the evaluation that generated it) or be discarded. Of course, an asyncrhonic evaluation will keep (pin) the object once the evaluation finishes so the client is able to get it.

`debug` inserts a breakpoint right before the expression and triggers a synchronous evaluation (as it has a breakpoint it should return immediately), returing the ID of a debugger created on the active evaluation (process).

`profile` creates a profiler and forces a synchronous profiling of the expression at hand and then returns the ID of the created profiler to fetch their results.

`context` can be one of the following:

```json
{
    "class": "string"
}
```
Where `class` is the name of a class.

```json
{
    "object": "string"
}
```
Where `object` is the ID of a pinned object.

```json
{
    "workspace": "string"
}
```
Here `workspace` is the ID of an existing workspace.

```json
{
    "debugger": "string",
    "frame": "number"
}
```
Here `debugger` is the ID of an existing debugger and `frame` is the index of the frame within debugger current frames. 

## Success Responses

**Code** : `200 OK`

**Content**: in case of an asynchronous evaluation the API should return:
```json
{
    "id": "string",
    "expression": "string",
    "state": "string"
}
```
Where `state` is either `pending` or `finished`.

In case of a synchronous evaluation the result is the same as the one of [`/objects/{id}`](../objects/id/get.md).

### Error Codes Details
In case of an evaluation error, be it as the response of a synchronous evaluation or as the result of trying the get the resulting object after an asynchronous evaluation, the server should respond with code `500` and a payload with the following aspect:
```json
{
	"description": "string",
	"evaluation": "string",
	"stack": "string"
}
```
Here, `description` is the error text describing what went wrong.  
`evaluation` is the ID of the evaluation created and it serves as the parameter to create a debugger on the evaluation process.  
`stack` is a string contaning the stack trace (only frame headers or labels) as separated lines (this is meant to be used as a snapshot for the user before entering in an actual debugger).

For example, the following error is returned after trying to evaluate `1 + `:

```json
500
{
	"description": "primary missing",
	"evaluation": "{1F60400E-40F3-4934-A8B6-555D048DC9FF}",
	"stack": "SmalltalkCompiler>>error:stretch:\rSmalltalkCompiler>>error: 'primary missing' at: 3 \rSmalltalkParser>>error: 'primary missing' at: 3 \rSmalltalkParser>>error: 'primary missing' \rSmalltalkParser>>binaryMessage:\rSmalltalkParser>>binarySequence:\rSmalltalkParser>>expression\rSmalltalkParser>>statement\rSmalltalkParser>>statements\rSmalltalkParser>>addStatementsTo:\rSmalltalkParser>>addBodyTo:\rSmalltalkParser>>headlessMethod\rSmalltalkCompiler>>parseExpression\r[] in SmalltalkCompiler>>compileExpression:\rObject(BlockClosure)>>setUnwind:\rBlockClosure>>ensure:\rProcess>>useExceptionHandler:while:\rBlockClosure>>on:do:\rCompiler>>protect:\rSmalltalkCompiler>>compileExpression: '1 +' \rCompiler>>evaluate: '1 +' for: nil \r[] in Compiler>>evaluate:for:ifFail:\rObject(BlockClosure)>>setUnwind:\rBlockClosure>>ensure:\rProcess>>useExceptionHandler:while:\rBlockClosure>>on:do:\rCompiler>>evaluate: '1 +' for: nil ifFail: nil \r[] in WebsideEvaluation>>evaluate\r[] in WebsideEvaluation>>evaluateBlock:\rMessageSend(Message)>>performOn:\rMessageSend>>perform\rMessageSend>>evaluate\rProcess>>privatePerform:\rProcess>>basicEvaluate:\rMessageSend>>newProcess\r"
}
```

**Example:**: evaluate `3 + 4` synchronously, without pinning the resulting object, with no context:
`POST /evaluations`
```json
{
    "expression": "2 + 4",
    "sync": true,
    "pin":false
}
```

And this is the result:
```json
{
    "class": "SmallInteger",
    "indexable": false,
    "size": 0,
    "printString": "6"
}
```