# Retrieve classes
Retrieve all subclasses of a given root class (if no root is provided, the uppermost class in the system is used).
It is also possible get a tree-like structure as well as to limit the depth in the classes hierarchy.

**URL**: `/classes`

**Method**: `GET`

**Query Options**
| Option | Type | Description |
| ------------- | ------------- | ------------- |
| root | string | the name of the root class |
| names | boolean | true to get only project names |
| tree | boolean | true to get a tree-like structure |
| depth | number | to limit the hierarchy depth (only when tree=true) |

## Success Responses

**Code** : `200 OK`

**Content**: `[class]` where `class` is defined as:
```json
{
    "name": "string",
    "definition": "string",
    "superclass": "string",
    "comment": "string",
    "variable": "boolean",
    "project": "string"
}
```

**Example:**: `Integer` subclasses `GET /classes?root=Integer`.
```json
[
    {
        "name": "LargeInteger",
        "definition": "Integer variableByteSubclass: #LargeInteger\r\tinstanceVariableNames: ''\r\tclassVariableNames: ''\r\tpoolDictionaries: ''\r\tcategory: 'Kernel-Numbers'",
        "superclass": "Integer",
        "comment": "I represent integers of more than 30 bits.  These values are beyond the range of SmallInteger, and are encoded here as an array of 8-bit digits. "
    },
    {
        "name": "SmallInteger",
        "definition": "Integer immediateSubclass: #SmallInteger\r\tinstanceVariableNames: ''\r\tclassVariableNames: ''\r\tpoolDictionaries: ''\r\tcategory: 'Kernel-Numbers'",
        "superclass": "Integer",
        "comment": "My instances are 31-bit numbers or 63-bit numbers depending on the image architecture, stored in twos complement form. The allowable range is approximately +- 1 billion (31 bits), 1 quintillion (63 bits)  (see SmallInteger minVal, maxVal)."
    },
    {
        "name": "LargeNegativeInteger",
        "definition": "LargeInteger variableByteSubclass: #LargeNegativeInteger\r\tinstanceVariableNames: ''\r\tclassVariableNames: ''\r\tpoolDictionaries: ''\r\tcategory: 'Kernel-Numbers'",
        "superclass": "LargeInteger",
        "comment": "Just like LargePositiveInteger, but represents a negative number."
    },
    {
        "name": "LargePositiveInteger",
        "definition": "LargeInteger variableByteSubclass: #LargePositiveInteger\r\tinstanceVariableNames: ''\r\tclassVariableNames: ''\r\tpoolDictionaries: ''\r\tcategory: 'Kernel-Numbers'",
        "superclass": "LargeInteger",
        "comment": "I represent positive integers of more than 30 bits (ie, >= 1073741824).  These values are beyond the range of SmallInteger, and are encoded here as an array of 8-bit digits.  Care must be taken, when new values are computed, that any result that COULD BE a SmallInteger IS a SmallInteger (see normalize).\r\rNote that the bit manipulation primitives, bitAnd:, bitShift:, etc., = and ~= run without failure (and therefore fast) if the value fits in 32 bits.  This is a great help to the simulator."
    },
    {
        "name": "Integer",
        "definition": "Number subclass: #Integer\r\tinstanceVariableNames: ''\r\tclassVariableNames: ''\r\tpoolDictionaries: ''\r\tcategory: 'Kernel-Numbers'",
        "superclass": "Number",
        "comment": "I am a common abstract superclass for all Integer implementations. My implementation subclasses are SmallInteger, LargePositiveInteger, and LargeNegativeInteger.\r\t\rInteger division consists of:\r\t/\texact division, answers a fraction if result is not a whole integer\r\t//\tanswers an Integer, rounded towards negative infinity\r\t\\\\\tis modulo rounded towards negative infinity\r\tquo: truncated division, rounded towards zero"
    }
]
```