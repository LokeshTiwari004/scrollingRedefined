let scrollerInnerBox = document.getElementById('scroller-inner-box');
let pseudoBody = document.getElementById('pseudo-body');
let ball = document.getElementById('ball');


const maxScroll = scrollerInnerBox.scrollTopMax;
let currentScrollState;
let progress;

function ballMotionDefinition() {
    currentScrollState = scrollerInnerBox.scrollTop;
    progress = currentScrollState/maxScroll;
    requestAnimationFrame(function(){
        ball.style.transform = `translateX(${progress * (visualViewport.width - 100)}px) rotateZ(${progress * 360}deg)`;
    })
}

scrollerInnerBox.addEventListener('scroll', ballMotionDefinition);

