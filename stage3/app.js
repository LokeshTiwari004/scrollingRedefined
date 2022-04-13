let scrollerInnerBox = document.getElementById('scroller-inner-box');
let pseudoBody = document.getElementById('pseudo-body');
let children = Array.from(pseudoBody.children);
let childrenCount = children.length;


const maxScroll = scrollerInnerBox.scrollTopMax;
let currentScrollState = scrollerInnerBox.scrollTop;
let progress = currentScrollState/maxScroll;


const totalStaticStateDurationFraction = .4;
// staticStateDurationFractionPerChild : ssdfPerChild
const ssdfPerChild = totalStaticStateDurationFraction / childrenCount;

const totalNonStaticStateDurationFraction = ( 1 - totalStaticStateDurationFraction ); 
// nonStaticStateDurationFractionPerTransition : nssdfPerTransition
const nssdfPerTransition = totalNonStaticStateDurationFraction / (childrenCount - 1);

const maxWidth = 60; // value from 1 to 100 both inclusive
const maxHeight = 90; // value from 1 to 100 both inclusive


let stateFunctions = [];

function defineStateFunctionFor(i) {
    if (i === 0) {
        return function func(progress){
            targetElement = children[0]
            if ( progress <= ssdfPerChild){
                targetElement.style.display = 'block';
                targetElement.style.width = `${maxWidth}%`;
                targetElement.style.height = `${maxHeight}%`;
                targetElement.style.opacity = `${1}`;
            } else if ( progress <= (ssdfPerChild + nssdfPerTransition) ) {
                let p1 = 1 - ((progress - ssdfPerChild) * ( 1 / nssdfPerTransition))
                targetElement.style.display = 'block';
                targetElement.style.width = `${p1 * maxWidth}%`;
                targetElement.style.height = `${p1 * maxHeight}%`;
                targetElement.style.opacity = `${p1}`;
            } else {
                targetElement.style.display = 'none';
                targetElement.style.width = `${0}%`;
                targetElement.style.height = `${0}%`;
                targetElement.style.opacity = `${0}`;
            }
        }
    } else if (i === (childrenCount - 1)) {
        return function func(progress){
            targetElement = children[childrenCount - 1]
            if ( progress <= (i * ssdfPerChild + (i - 1) * nssdfPerTransition) ){
                targetElement.style.display = 'none';
                targetElement.style.width = '0%';
                targetElement.style.height = '0%';
                targetElement.style.opacity = `${0}`;
            } else if ( progress <=  (i * ssdfPerChild + i * nssdfPerTransition) ) {
                let p1 = ((progress - (i * ssdfPerChild + (i - 1) * nssdfPerTransition)) * ( 1 / nssdfPerTransition))
                targetElement.style.display = 'block';
                targetElement.style.width = `${p1 * maxWidth}%`;
                targetElement.style.height = `${p1 * maxHeight}%`;
                targetElement.style.opacity = `${p1}`;
            } else {
                targetElement.style.display = 'block';
                targetElement.style.width = `${maxWidth}%`;
                targetElement.style.height = `${maxHeight}%`;
                targetElement.style.opacity = `${1}`;
            }
        }
    } else {
        return function func(progress){
            targetElement = children[i];
            if ( progress <= (i * ssdfPerChild + (i - 1) * nssdfPerTransition) ){
                targetElement.style.display = 'none';
                targetElement.style.width = `${0}%`;
                targetElement.style.height = `${0}%`;
                targetElement.style.opacity = `${0}`;
            } else if ( progress <=  (i * ssdfPerChild + i * nssdfPerTransition) ){
                let p1 = ((progress - (i * ssdfPerChild + (i - 1) * nssdfPerTransition)) * ( 1 / nssdfPerTransition))
                targetElement.style.display = 'block';
                targetElement.style.width = `${p1 * maxWidth}%`;
                targetElement.style.height = `${p1 * maxHeight}%`;
                targetElement.style.opacity = `${p1}`;
            } else if ( progress <=  ((i + 1) * ssdfPerChild + i * nssdfPerTransition) ) {
                targetElement.style.display = 'block';
                targetElement.style.width = `${maxWidth}%`;
                targetElement.style.height = `${maxHeight}%`;
                targetElement.style.opacity = `${1}`;
            } else if ( progress <=  ((i + 1) * ssdfPerChild + (i + 1) * nssdfPerTransition) ) {
                let p1 = 1 - ((progress - ((i + 1) * ssdfPerChild + i * nssdfPerTransition)) * ( 1 / nssdfPerTransition))
                targetElement.style.display = 'block';
                targetElement.style.width = `${p1 * maxWidth}%`;
                targetElement.style.height = `${p1 * maxHeight}%`;
                targetElement.style.opacity = `${p1}`;
            } else {
                targetElement.style.display = 'none';
                targetElement.style.width = `${0}%`;
                targetElement.style.height = `${0}%`;
                targetElement.style.opacity = `${0}`;
            }
        }
    }
}

function defineStateFunctions() {
    for (let i = 0; i < childrenCount; i++) {
        stateFunctions.push(
            defineStateFunctionFor(i)
        );
    }
}

function changeState(progress) {
    for (let i = 0; i < childrenCount; i++){
        stateFunctions[i](progress);
    }
}

function pageScroll() {
    currentScrollState = scrollerInnerBox.scrollTop;
    progress = currentScrollState/maxScroll;
    changeState(progress);
}

defineStateFunctions();
scrollerInnerBox.addEventListener('scroll', pageScroll);

