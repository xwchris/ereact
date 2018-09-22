## VNode
typedef VNode

properties
1. { string | function } nodeName
2. { Array(VNode | string) } children
3. { string | number | undefined } key
4. { object } attributes

## h, createElement
return
VNode

params
1. { string | function } nodeName
2. { object | null } attributes
3. { Array(VNode | string) }  children
