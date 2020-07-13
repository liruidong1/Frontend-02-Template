# 学习笔记

### JS表达式

1. **Member 表达式**

    * `a.b`， `a[b]`；
    * ``` foo`string` ```，方法名传入模板字符串，模板字符串的内容会被分开解析后传递；
    * `super.b`， `super['b']`，`super`关键字只能在class的`constructor`函数中使用；
    * `new.target`；
    * `new Foo()`；

2. **new 表达式**
    * `new Foo`，new的不带括号调用；
    * `new a()()`，括号1是跟着new一起运算；
    * `new new a()`，括号跟着第二个`new`运算
    

3. **call 表达式[^函数调用] **    

