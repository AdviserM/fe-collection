### body添加outline 方便查看布局
```html
<!--添加书签 url中填入下列代码-->
javascript: (function() {
	var elements = document.body.getElementsByTagName('*');
	var items = [];
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].innerHTML.indexOf('html * { outline: 1px solid red }') != -1) {
			items.push(elements[i]);
		}
	}
	if (items.length > 0) {
		for (var i = 0; i < items.length; i++) {
			items[i].innerHTML = '';
		}
	} else {
		document.body.innerHTML +=
			'<style>html * { outline: 1px solid red }</style>';
	}
})();
```
