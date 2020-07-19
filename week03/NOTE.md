# 学习笔记

### JS表达式，优先级依次降低 ↓

1. **Member 表达式**

    * `a.b`， `a[b]`；
    * ``` foo`string` ```，方法名传入模板字符串，模板字符串的内容会被分开解析后传递；
    * `super.b`， `super['b']`，`super`关键字只能在class的`constructor`函数中使用；
    * `new.target`；
    * `new Foo()`。

2. **New 表达式**
    * `new Foo`，new的不带括号调用；
    * `new a()()`，**括号1**是跟着**new**一起运算；
    * `new new a()`，**括号**跟着第二个**new**运算。
    

3. **Call 表达式**

    * `foo()`，`super()`；
    * `foo()['b']`，`foo().b`，``` foo()`abc` ```，会将`member表达式`降级为`call表达式`。

4. **Left Handside & Right handside**
    
    * `a.b = c`，~~a + b = c~~，`a.b`是左表达式，`a + b`是右表达式不能放在等号左侧。
    
5. **Update**
    
    * `a++`，`a--`，`--a`，`++a`。
    
6. **Unary（单目运算符）**
    
    * `delete a.b`，delete操作的必须是引用类型；
    * `void foo()`；
    * `typeof a`；
    * `+a`，`-a`，正负号；
    * `~a`，按位取反；
    * `!a`，可以用两个 **!!** 将任意类型转为Boolean类型；
    * `await a`。

7. **Exponential(指数运算**)**
    
    * 唯一的右结合运算，`3 ** 2 ** 3`等价于`3 ** (2 ** 3)`。
    
8. **Multiplicative、Additive、Shift、RelationShip**
    
    * `*、/、%`，乘除运算符；
    * `+、-`，加减运算符；
    * `<<、>>、>>>`，移位运算符；
    * `<、>、<=、>=、instanceof、in`，关系运算符。

9. **Equality、Bitwise**
    
    * `==，!=，===，!==`，等于运算符；
    * `&、^、|、`，位运算符，与、异或、或。
    
10. **Logical、Conditional**

    * `&&、||`，短路原则，`&&`前一个条件为false不会继续执行下一个判断语句，`||`前一个条件为true不会继续执行下一个判断语句
    * `conditional ? action1 : action2`，`? :`三目运算符

### 类型转换

### JS语句

1. **Completion Record**
    * JS运行时产生的类型，使用JS无法获取
    * [[type]]: normal、break、continue、return、throw
    * [[value]]: 基本类型
    * [[target]]: label

2. **简单语句**
    
    * ExpressionStatement，表达式语句
    * EmptyStatement，空语句：`;`
    * DebuggerStatement，debugger语句：`debugger;`
    * ThrowStatement，抛出异常
    * ContinueStatement，结束本次循环
    * BreakStatement，结束整个循环
    * ReturnStatement，需要在函数内部使用

3. **复合语句**    
    
    * BlockStatement，
    ```
        {
            ...doSomething
        }
    ```
    * IfStatement
    * SwitchStatement，JS中建议使用IfStatement代替，使用时要注意在每个`case`中添加`break`
    * IterationStatement，循环语句
    ```
        while (...condition) {}
        do {} while (...condition);
        for(;;) {}
        for(key in object) {}
        for(item of arr) {}
    ```
    * WithStatement，尽量不使用，打开一个对象，创建一个该对象的作用域
    * LabelledStatement，在循环开始处声明一个label，`break label1;`可以直接跳出最外层循环
    ```
        label1: for(...){
            for(...){
                break label1;
            }
        }
    ```
    * TryStatement
    ```
        try {
            ...doSomething  
        } catch (e) {
            ...handleException
        } finally {
            ...doSomething
        }     
    ```
4. **声明**

    * FunctionDeclaration，函数声明，`function`
    * GeneratorDeclaration，产生器声明，`function *`
    * AsyncFunctionDeclaration，异步函数声明，`async function`
    * AsyncGeneratorDeclaration，异步产生器声明，`async function *`
    * VariableStatement，变量声明，`var let const`
    * ClassDeclaration，类声明，`class`
    * LexicalDeclaration，
    * 预处理是指在一段代码执行之前，JS引擎会对代码进行预处理
    * `let class const`语言也进行了预处理，但是语言上会要求变量(或类)在声明后才能使用；
    以下两端代码控制台打印的都是2，不过代码2在代码编写阶段就会报错，const变量未声明不能使用
    ``` 
        var a = 2;
        void function (){
            a = 1;
            return;
            var a;
        }();
        console.log(a);
    ```
    ``` 
        var a = 2;
        void function (){
           a = 1;
           return;
           const a;
        }();
        console.log(a);
   ```

5. **作用域**
    * `var`的作用域是在函数体中
    ``` 
        var a = 2;
        void function (){
            a = 1;
            {
                var a;
            }
        }();
        console.log(a);
    ```
    * `const`的作用域是在其紧邻的block中，不过以下代码是无法执行的
    ``` 
        var a = 2;
        void function (){
            a = 1;
            {
                const a;
            }
        }();
        console.log(a);
    ```

### JS结构化
   
   * JS执行粒度（运行时）:
   宏任务 >> 微任务(在JS中Promise产生) >> 函数调用 >> 语句/声明 >> 表达式 >> 直接量/变量/this...
   
   * 宏任务是指外部宿主传递到JS引擎去执行的任务，微任务是JS引擎内部产生的任务
   
   