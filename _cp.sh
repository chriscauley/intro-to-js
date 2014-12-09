cp step$1.js step$2.js
sed s/$1.js/$2.js/ <step$1.html > step$2.html
