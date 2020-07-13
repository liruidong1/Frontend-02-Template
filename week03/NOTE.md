# 学习笔记

### JS表达式

1. *** Member表达式 ***优先级最高：

    * `a.b`， `a[b]`；
    * ``` foo`string` ```，方法名传入模板字符串，模板字符串的内容会被分开解析后传递；
    * `super.b`， `super['b']`，`super`关键字只能在class的`constructor`函数中使用；
    * `new.target`；
    * `new Foo()`；
    

