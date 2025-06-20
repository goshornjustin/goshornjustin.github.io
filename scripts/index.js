

function winSize() {
    console.log(`
Inner Width: ${this.innerWidth}
Inner Height: ${this.innerHeight}
Outer Width: ${this.outerWidth}
Outer Height: ${this.outerHeight}
`);}

winSize();


const iconButtons = document.getElementsByClassName("sci");



console.log(iconButtons.length);
console.log(iconButtons.item);

for (let index = 0; index < iconButtons.length; index++) {
    const element = iconButtons[index];
    console.log(`element ${element}`)
    
}

function toggleMenu() {
    
}