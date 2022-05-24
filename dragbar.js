var handler = document.querySelector('.handler');
var wrapper = handler.closest('.wrapper');
var boxA = wrapper.querySelector('.frame');
var isHandlerDragging = false;

function bindIFrameMousemove(iframe){
    iframe.contentWindow.addEventListener('mousemove', function(event) {
        var clRect = iframe.getBoundingClientRect();
        var evt = new CustomEvent('mousemove', {bubbles: true, cancelable: false});

        evt.clientX = event.clientX + clRect.left;
        evt.clientY = event.clientY + clRect.top;

        iframe.dispatchEvent(evt);
    });
    iframe.contentWindow.addEventListener('mouseup', function(event) {
      var clRect = iframe.getBoundingClientRect();
      var evt = new CustomEvent('mouseup', {bubbles: true, cancelable: false});

      evt.clientX = event.clientX + clRect.left;
      evt.clientY = event.clientY + clRect.top;

      iframe.dispatchEvent(evt);
  });
};

bindIFrameMousemove(iframe);

var handlerDraggingEvent = new CustomEvent("handlerdragging", {
  detail: {},
  bubbles: true,
  cancelable: true,
  composed: false,
});

document.addEventListener('mousedown', function(e) {
    e.preventDefault();
  // If mousedown event is fired from .handler, toggle flag to true
  if (e.target === handler) {
    isHandlerDragging = true;
  }
});

document.addEventListener('mousemove', function(e) {
    e.preventDefault();
  // Don't do anything if dragging flag is false
  if (!isHandlerDragging) {
    return false;
  }

  // Get offset
  var containerOffsetLeft = wrapper.offsetLeft;

  // Get x-coordinate of pointer relative to container
  var pointerRelativeXpos = e.clientX - containerOffsetLeft;
  
  // Arbitrary minimum width set on box A, otherwise its inner content will collapse to width of 0
  var boxAminWidth = 150;

  // Resize box A
  // * 8px is the left/right spacing between .handler and its inner pseudo-element
  // * Set flex-grow to 0 to prevent it from growing
  boxA.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + 'px';
  boxA.style.flexGrow = 0;


  document.dispatchEvent(handlerDraggingEvent);
});

document.addEventListener('mouseup', function(e) {
    e.preventDefault();
  // Turn off dragging flag when user mouse is up
  isHandlerDragging = false;
});