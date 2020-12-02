# Retrieve objects
Retrive pinned objects.

Objects are the result of evaluating expressions. As it is described in [/evaluations](../evaluations/post), a synchronous evaluation might pin the resulting object or not, while an asynchronous evaulation pins always the resulting object. In any case, the ID of the object is returned by the evaluation call.  

**URL**: `/objects`

**Method**: `GET`

## Success Responses

**Code** : `200 OK`

**Content**: `[object]` where `object` is defined as:
```json
{
    "id": "string",
    "class": "string",
    "indexable": "boolean",
    "size": "number",
    "printString": "string"
}

**Example:**:
```json
[
    {
        "name": "numerator",
        "class": "Fraction"
    },
    {
        "name": "denominator",
        "class": "Fraction"
    }
]
```