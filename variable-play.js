var person = {
    name: 'Tom',
    age: 21
};

function updateAge (obj){
    obj.age = 24;
}

updateAge(person);
console.log(person);


var arr = [97.95];

function updateArray(obj) {
    obj.push(22);
    debugger;
}

updateArray(arr);
console.log(arr);