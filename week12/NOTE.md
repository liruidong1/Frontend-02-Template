# 学习笔记

## 1 attribute vs property

几种特俗情况： class、href、value

`attribute[class] -> property[className]`，

```javascript
// <a href="//m.taobao.com" >
<script> 
    var a = document.getElementByTagName('a'); 
    a.href // “http://m.taobao.com”，这个URL是resolve过的结果 
    a.getAttribute('href') // “//m.taobao.com”，跟HTML代码中完全一致 
</script>
```

```javascript
//<input value = "cute" /> 
<script> 
    var input = document.getElementByTagName('input'); //若property没有设置， 则结果是attribute 
    
    input.value // cute 
    input.getAttribute('value'); // cute 
    input.value = 'hello'; //若value属性已经设置，则attribute不变，property变化， 元素上实际的效果是property优先 
    input.value // hello 
    input.getAttribute('value'); // cute 
</script>
```  
     

## 2 组件生命周期的定义
